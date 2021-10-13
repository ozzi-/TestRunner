package service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.JSONObject;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.AuthenticationFilter;
import helpers.Log;
import helpers.PathFinder;
import helpers.Settings;
import jakarta.inject.Singleton;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;
import persistence.Persistence;


@Singleton
//@Api("/script")
@Path("/script")
public class ScriptService {
	
	@LogRequest
	@Authenticate("READ")
	@GET
	//@ApiOperation(value = "[READ] Returns all scripts")
	public Response getScripts(@Context HttpHeaders headers) throws Exception {
		String scriptsPathStrng = PathFinder.getScriptsFolder();
		int scriptsPathLength = scriptsPathStrng.length();
		List<String> result;
		try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(scriptsPathStrng))) {
			result = walk.filter(Files::isRegularFile).map(x -> x.toString()).collect(Collectors.toList());
		} catch (IOException e) {
			throw new Exception("Exception encountered reading script path - " + e.getMessage());
		}

		JsonArray ja = new JsonArray();
		for (String filePath : result) {
			ja.add(new JsonPrimitive(filePath.substring(scriptsPathLength)));

		}
		return Response.status(200).entity(ja.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@GET
	@Path("/download")
	//@ApiOperation(value = "[READWRITEEXECUTE] Serves a specific script as TEXT_PLAIN or APPLICATION_OCTET_STREAM")
	// we are using a query param as it contains / and or \
	public Response getScript(@Context HttpHeaders headers, @QueryParam("name") String path) throws Exception {
		String scriptsPathStrng = PathFinder.getScriptsFolder() + path;
		if (!PathFinder.isPathSafe(scriptsPathStrng, PathFinder.getScriptsFolder())) {
			Log.log(Level.WARNING, "Get script failed due to unsafe path '" + path + "'");
			return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
		}
		if (isTextFile(path)) {
			String scriptContent="";
			try {
				scriptContent = new String(Files.readAllBytes(Paths.get(scriptsPathStrng)), StandardCharsets.UTF_8);				
			} catch (Exception e) {
				return Response.status(404).entity("File not found").type(MediaType.TEXT_PLAIN).build();
			}
			ResponseBuilder rb = Response.ok(scriptContent, MediaType.TEXT_PLAIN + "; charset=utf-8");
			return rb.build();
		} else {
			try {
				File file = new File(scriptsPathStrng);
				if(file.exists()) {
					ResponseBuilder rb = Response.ok(file, MediaType.APPLICATION_OCTET_STREAM);
					rb.header("Content-Disposition", "attachment;");
					return rb.build();					
				}
			} catch (Exception e) {}
			return Response.status(404).entity("File not found").type(MediaType.TEXT_PLAIN).build();
		}
	}

	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Path("/mpfd")
	//@ApiOperation(value = "[READWRITEEXECUTE] Uploads a multipart form document script")
    //@ApiImplicitParam(name = "X-File-Path", value = "path/to/binary", paramType = "header")
	public Response uploadScriptMPFD(@Context HttpHeaders headers, @FormDataParam("file") InputStream fileInputStream) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		byte[] buf;
		String filePath;
		String fileName;
		String relativePath;
		try {
			buf = IOUtils.toByteArray(fileInputStream);
			fileName = headers.getRequestHeader(Settings.getSingleton().getFileNameHeader()).get(0);
			String filePathHeaderValue = headers.getRequestHeader(Settings.getSingleton().getFilePathHeader()).get(0);
			relativePath = fileName;
			if(!filePathHeaderValue.equals("/") && !filePathHeaderValue.equals("")){
				relativePath = filePathHeaderValue+File.separator+fileName;				
			}
			filePath = PathFinder.getScriptsFolder() + relativePath;
			
		}catch (Exception e) {
			e.printStackTrace();
			return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
		}
		Persistence.validateFileNameSafe(fileName,true);
		if (PathFinder.isPathSafe(filePath, PathFinder.getScriptsFolder())) {
			Persistence.writeByteArrToFile(filePath, buf, "Uploaded binary script '"+fileName+"'",userName);
			new File(filePath).setExecutable(true);
			return Response.status(201).entity(relativePath).type(MediaType.TEXT_PLAIN).build();
		}
		Log.log(Level.WARNING, "Upload Script failed due to unsafe path '" + filePath + "'");
		return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
	}
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/folder")
	//@ApiOperation( value = "[READ] Return the script folder contents")
	public Response getFolders(@Context HttpHeaders headers) throws Exception {
		File scriptsFolder = new File(PathFinder.getScriptsFolder());
		File[] scriptFolderFiles = scriptsFolder.listFiles();
		
		JsonArray folderHierarchy = listDirectories(scriptFolderFiles);
		
		return Response.status(200).entity(folderHierarchy.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	
	
	// TODO move to Helper class
	public static JsonArray listDirectories(File[] files) {
		JsonArray folderHierarchy = new JsonArray();
		folderHierarchy = listDirectoriesInternal(files, folderHierarchy,null);
		return folderHierarchy;
	}
		
	public static JsonArray listDirectoriesInternal(File[] files, JsonArray folderHierarchy, JsonObject whereToAdd) {
		String scriptsPathStrng;
		int scriptsPathLength=0;
		try {
			scriptsPathStrng = PathFinder.getScriptsFolder();
			scriptsPathLength = scriptsPathStrng.length();
		} catch (Exception e) {
			e.printStackTrace();
		}

		for (File file : files) {
			if (file.isDirectory() && !file.getName().startsWith(".")) {
				JsonObject a = new JsonObject();
				a.addProperty("name",file.getName());
				a.addProperty("path",file.getPath().substring(scriptsPathLength));
				
				a.add("_children",new JsonArray());
				if(whereToAdd==null) {
					folderHierarchy.add(a);		
				}else {
					whereToAdd.get("_children").getAsJsonArray().add(a);
				}
				listDirectoriesInternal(file.listFiles(),folderHierarchy,a);
			}else {
				JsonObject a = new JsonObject();
				a.addProperty("name",file.getName());
				a.addProperty("path",file.getPath().substring(scriptsPathLength));

				if(whereToAdd==null) {
					folderHierarchy.add(a);
				}else {
					whereToAdd.get("_children").getAsJsonArray().add(a);					
				}
			}
		}
		return folderHierarchy;
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Path("/folder/{foldername}")
	//@ApiOperation(value = "[READWRITEEXECUTE] Create a script folder")
	public Response createScriptFolder(@PathParam("foldername") String folderName, @Context HttpHeaders headers, String body) throws Exception {
		
		JSONObject bodyJO;
		String folderParent;
		try {
			bodyJO =  new JSONObject(body);	
			folderParent = bodyJO.getString("parent");
		}catch (Exception e) {
			throw new Exception("Error parsing json - "+e.getMessage());
		}
		
		File folderParentFile = new File(PathFinder.getScriptsFolder()+folderParent);
		if(!folderParentFile.exists()) {
			return Response.status(400).entity("Folder parent does not exists").type(MediaType.TEXT_PLAIN).build();
		}
		folderParent = folderParent.equals("/")?"":folderParent+File.separator;
		
		String folderPathStrng = PathFinder.getScriptsFolder()+folderParent+folderName;
		if (PathFinder.isPathSafe(folderPathStrng, PathFinder.getScriptsFolder()) && folderName.length() > 0) {
			File folderFile = new File(folderPathStrng);
			if (!folderFile.exists()){
			    folderFile.mkdirs();
			    // TODO persist in git history
			    return Response.status(200).entity("OK").type(MediaType.TEXT_PLAIN).build();				
			}
			return Response.status(400).entity("Folder already exists").type(MediaType.TEXT_PLAIN).build();
		}
		return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
	}
	
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/folder")
	//@ApiOperation(value = "[READWRITEEXECUTE] Delete a script folder")
	public Response deleteScriptFolder(@Context HttpHeaders headers, String body) throws Exception {
		
		JSONObject bodyJO;
		String deleteFolderPath;
		try {
			bodyJO =  new JSONObject(body);	
			deleteFolderPath = bodyJO.getString("path");
		}catch (Exception e) {
			throw new Exception("Error parsing json - "+e.getMessage());
		}
		
		String deleteFolderFullPath  = PathFinder.getScriptsFolder()+deleteFolderPath;
		File deleteFolderFile = new File(deleteFolderFullPath);
		if(!deleteFolderFile.exists()) {
			return Response.status(400).entity("Folder does not exists").type(MediaType.TEXT_PLAIN).build();
		}
		
		if (PathFinder.isPathSafe(deleteFolderFullPath, PathFinder.getScriptsFolder()) && deleteFolderPath.length() > 0) {
			FileUtils.deleteDirectory(deleteFolderFile);
			return Response.status(200).entity("OK").type(MediaType.TEXT_PLAIN).build();
		}
		return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
	}
	
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	//@ApiOperation(value = "[READWRITEEXECUTE] Uploads a plain text document script")
    //@ApiImplicitParam(name = "X-File-Path", value = "path/to/script.sh", paramType = "header")
	public Response uploadScript(@Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		try {
			// TODO use singleton
			String fileName = headers.getRequestHeader("X-File-Name").get(0);
			String filePathHeaderValue = headers.getRequestHeader("X-File-Path").get(0);
			String relativePath=fileName;
			if(!filePathHeaderValue.equals("/") && !filePathHeaderValue.equals("")){
				relativePath = filePathHeaderValue+File.separator+fileName;				
			}
			String filePath = PathFinder.getScriptsFolder() + relativePath;
			
			if (PathFinder.isPathSafe(filePath, PathFinder.getScriptsFolder()) && fileName.length() > 0) {
				Log.log(Level.INFO, "Upload Script failed '" + filePath + "'");
				File script = new File(filePath);
				if(script.exists()) {
					Persistence.writeUTF8StringToFile(body, filePath, "Edited script '"+fileName+"'", userName);				
				}else {
					Persistence.writeUTF8StringToFile(body, filePath, "Uploaded script '"+fileName+"'", userName);
				}
				new File(filePath).setExecutable(true); // new file as we need the new handle
				return Response.status(200).entity(relativePath).type(MediaType.TEXT_PLAIN).build();
			}
			Log.log(Level.WARNING, "Upload Script failed due to unsafe path '" + filePath + "'");
		}catch (Exception e) {
			e.printStackTrace();
			// missing params
		}
		return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	//@ApiOperation(value = "[READWRITEEXECUTE] Deletes a script")
	//@ApiImplicitParam(name = "X-File-Path", value = "path/to/script.sh", paramType = "header")
	public Response deleteScript(@Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		// TODO use singleton
		String fileName = headers.getRequestHeader("X-File-Name").get(0);
		String filePathHeaderValue = headers.getRequestHeader("X-File-Path").get(0);
		String relativePath=fileName;
		if(!filePathHeaderValue.equals("/") && !filePathHeaderValue.equals("")){
			relativePath = filePathHeaderValue+File.separator+fileName;				
		}
		String filePath = PathFinder.getScriptsFolder() + relativePath;
		
		if (PathFinder.isPathSafe(filePath, PathFinder.getScriptsFolder())) {
			boolean res = Persistence.deleteFile(filePath,userName);
			if(res) {
				return Response.status(200).entity("OK").type(MediaType.TEXT_PLAIN).build();				
			}
			return Response.status(500).entity("Failed to delete file").type(MediaType.TEXT_PLAIN).build();
		}
		Log.log(Level.WARNING, "Delete Script failed due to unsafe path '" + filePath + "'");
		return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
	}

	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@GET
	@Path("/type")
	//@ApiOperation(value = "[READWRITEEXECUTE] Returns script type, either 'text' or 'binary'")
	public Response getScriptType(@Context HttpHeaders headers, @QueryParam("name") String path) throws Exception {
	
		String scriptsPathStrng = PathFinder.getScriptsFolder();		
		JsonObject res = new JsonObject();
		res.addProperty("type", isTextFile(path) ? "text" : "binary");
		File fileObj = new File(scriptsPathStrng+path);
		res.addProperty("name", fileObj.getName());
		int endIndex =  path.length()-fileObj.getName().length()-1;
		if(endIndex<0) {
			res.addProperty("path", "");
		}else {
			res.addProperty("path", path.substring(0,endIndex));			
		}
		return Response.status(200).entity(res.toString()).type(MediaType.APPLICATION_JSON).build();
	}

	private boolean isTextFile(String path) {
		ArrayList<String> textEndings = new ArrayList<String>();
		textEndings.add("txt"); textEndings.add("md");
		textEndings.add("js"); textEndings.add("java");
		textEndings.add("py"); textEndings.add("sh");
		textEndings.add("vb"); textEndings.add("pl");
		textEndings.add("bat"); textEndings.add("json");
		textEndings.add("html"); textEndings.add("cpp");
		textEndings.add("h"); textEndings.add("o");
		textEndings.add("c"); textEndings.add("css");
		textEndings.add("py"); textEndings.add("lua");
		textEndings.add("groovy"); textEndings.add("psd1");
		textEndings.add("rb"); textEndings.add("php");
		textEndings.add("ps1"); textEndings.add("psm1");
		textEndings.add("sh"); textEndings.add("bash");
		textEndings.add("zsh"); textEndings.add("ksh");
		textEndings.add("vb"); textEndings.add("vbs");
		textEndings.add("vbe"); textEndings.add("wsf");
		textEndings.add("vm"); textEndings.add("xml");
		textEndings.add("yaml");

		path = path.toLowerCase();
		for (String ending : textEndings) {
			if (path.endsWith(ending)) {
				return true;
			}
		}
		return false;
	}
}
