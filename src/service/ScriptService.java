package service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.media.multipart.FormDataParam;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import annotations.Authenticate;
import annotations.LogRequest;
import helpers.Log;
import helpers.PathFinder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;


@Singleton
@Api("/script")
@Path("/script")
public class ScriptService {
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@ApiOperation(value = "[READ] Returns all scripts")
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
	@ApiOperation(value = "[READWRITEEXECUTE] Serves a specific script as TEXT_PLAIN or APPLICATION_OCTET_STREAM")
	// we are using a query param as it contains / and or \
	public Response getScript(@Context HttpHeaders headers, @QueryParam("name") String path) throws Exception {
		String scriptsPathStrng = PathFinder.getScriptsFolder() + path;
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
	@ApiOperation(value = "[READWRITEEXECUTE] Uploads a multipart form document script")
    @ApiImplicitParam(name = "X-File-Path", value = "path/to/binary", paramType = "header")
	public Response uploadScriptMPFD(@Context HttpHeaders headers, @FormDataParam("file") InputStream fileInputStream) throws Exception {
		String fileName;
		String filePath;
		byte[] buf;
		try {
			buf = IOUtils.toByteArray(fileInputStream);
			fileName = headers.getRequestHeader("X-File-Path").get(0);
			filePath = PathFinder.getScriptsFolder() + fileName;
		}catch (Exception e) {
			return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
		}
	
		if (PathFinder.isPathSafe(filePath, PathFinder.getScriptsFolder())) {
			FileUtils.writeByteArrayToFile(new File(filePath), buf);
			return Response.status(201).entity("OK").type(MediaType.TEXT_PLAIN).build();
		}
		Log.log(Level.WARNING, "Upload Script failed due to unsafe path '" + filePath + "'");
		return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
	}

	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@ApiOperation(value = "[READWRITEEXECUTE] Uploads a plain text document script")
    @ApiImplicitParam(name = "X-File-Path", value = "path/to/script.sh", paramType = "header")
	public Response uploadScript(@Context HttpHeaders headers, String body) throws Exception {
		String fileName = headers.getRequestHeader("X-File-Path").get(0);
		String filePath = PathFinder.getScriptsFolder() + fileName;

		if (PathFinder.isPathSafe(filePath, PathFinder.getScriptsFolder())) {
			Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(filePath), "UTF-8"));
			try {
				out.write(body);
			} finally {
				out.close();
			}
			return Response.status(200).entity("OK").type(MediaType.TEXT_PLAIN).build();
		}
		Log.log(Level.WARNING, "Upload Script failed due to unsafe path '" + filePath + "'");
		return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@ApiOperation(value = "[READWRITEEXECUTE] Deletes a script")
	@ApiImplicitParam(name = "X-File-Path", value = "path/to/script.sh", paramType = "header")
	public Response deleteScript(@Context HttpHeaders headers) throws Exception {
		String fileName = headers.getRequestHeader("X-File-Path").get(0);
		String filePath = PathFinder.getScriptsFolder() + fileName;

		if (PathFinder.isPathSafe(filePath, PathFinder.getScriptsFolder())) {
			File fileToDelete =  new File(filePath); 
			if(fileToDelete.delete()) {
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
	@ApiOperation(value = "[READWRITEEXECUTE] Returns script type, either 'text' or 'binary'")
	public Response getScriptType(@Context HttpHeaders headers, @QueryParam("name") String path) throws Exception {
		JsonObject res = new JsonObject();
		res.addProperty("type", isTextFile(path) ? "text" : "binary");
		return Response.status(200).entity(res.toString()).type(MediaType.APPLICATION_JSON).build();
	}

	private boolean isTextFile(String path) {
		ArrayList<String> textEndings = new ArrayList<String>();
		textEndings.add("txt");
		textEndings.add("md");
		textEndings.add("js");
		textEndings.add("java");
		textEndings.add("py");
		textEndings.add("sh");
		textEndings.add("vb");
		textEndings.add("pl");
		textEndings.add("bat");
		textEndings.add("json");
		textEndings.add("html");
		textEndings.add("cpp");
		textEndings.add("h");
		textEndings.add("o");
		textEndings.add("c");
		textEndings.add("css");
		textEndings.add("py");
		textEndings.add("lua");
		textEndings.add("groovy");
		textEndings.add("psd1");
		textEndings.add("rb");
		textEndings.add("php");
		textEndings.add("ps1");
		textEndings.add("psm1");
		textEndings.add("sh");
		textEndings.add("bash");
		textEndings.add("zsh");
		textEndings.add("ksh");
		textEndings.add("vb");
		textEndings.add("vbs");
		textEndings.add("vbe");
		textEndings.add("wsf");
		textEndings.add("vm");
		textEndings.add("xml");
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
