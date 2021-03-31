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
import javax.ws.rs.PathParam;
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
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.UserManagement;
import helpers.Helpers;
import helpers.Log;
import helpers.PathFinder;
import helpers.TRHelper;
import pojo.GroupTestAbstraction;
import pojo.TestCategoriesList;


@Singleton
@Path("/")
public class TRService {

	@Authenticate("ADMIN")
	@LogRequest
	@GET
	@Path("/reload")
	public Response reload(@Context HttpHeaders headers) throws Exception {
		try {
			UserManagement.loadUsers();
		} catch (Exception e) {
			throw new Exception("Cannot load users - " + e.getMessage());
		}

		return Response.status(200).entity("reloaded").build();
	}

	@Authenticate("READ")
	@LogRequest
	@GET
	@Path("/getBasePath")
	public Response getBasePath(@Context HttpHeaders headers) throws Exception {
		return Response.status(200).entity(PathFinder.getBasePath()).build();
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getResults/{testname}/{page}")
	public Response getResultsByName(@PathParam("testname") String testName, @PathParam("page") int page,
			@Context HttpHeaders headers) throws Exception {
		JsonArray resultsArray = new JsonArray();
		try {
			ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName),
					PathFinder.getDataLabel(), page);
			TRHelper.getResultsInternal(testName, resultsArray, listOfFiles, false);
		} catch (Exception e) {
			throw new Exception("Cannot load or parse test result");
		}
		return Response.status(200).entity(resultsArray.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getGroupResults/{groupname}/{page}")
	public Response getGroupResultsByName(@PathParam("groupname") String groupName, @PathParam("page") int page,
			@Context HttpHeaders headers) throws Exception {
		JsonArray resultsArray = new JsonArray();
		try {
			ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getGroupTestResultsPath(groupName),
					PathFinder.getDataLabel(), page);
			TRHelper.getResultsInternal(groupName, resultsArray, listOfFiles, true);
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("Cannot load or parse test result - " + e.getMessage());
		}
		return Response.status(200).entity(resultsArray.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getLatestResult/{testname}")
	public Response getLatestResultByName(@PathParam("testname") String testName, @Context HttpHeaders headers)
			throws Exception {
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName),
				PathFinder.getDataLabel(), -1);
		String newest = TRHelper.getNewest(listOfFiles);
		String handle = String.valueOf(newest);
		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		return TRHelper.getResultInternal(path);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getLatestGroupResult/{groupname}")
	public Response getLatestGroupResultByName(@PathParam("groupname") String groupName, @Context HttpHeaders headers)
			throws Exception {
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getGroupTestResultsPath(groupName),
				PathFinder.getDataLabel(), -1);
		String newest = TRHelper.getNewest(listOfFiles);
		String handle = String.valueOf(newest);
		String path = PathFinder.getSpecificTestGroupResultPath(groupName, handle, false);
		return TRHelper.getResultInternal(path);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getTest/{testname}")
	public Response getTest(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String path = PathFinder.getSpecificTestPath(testName);
		return TRHelper.getResultInternal(path);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getGroup/{groupname}")
	public Response getGroup(@PathParam("groupname") String groupName, @Context HttpHeaders headers) throws Exception {
		JsonElement test = null;
		try {
			ArrayList<GroupTestAbstraction> paths = TRHelper.getTestInfoByGroupName(groupName);
			ArrayList<JsonElement> tests = TRHelper.getJsonElementsOfPath(paths);
			test = TRHelper.mergeTests(tests, groupName);
		} catch (IOException e) {
			throw new Exception("Cannot find test result!");
		}

		return Response.status(200).entity(test.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getResult/{testname}/{handle}")
	public Response getLatestResultByName(@PathParam("testname") String testName, @PathParam("handle") String handle,
			@Context HttpHeaders headers) throws Exception {

		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		return TRHelper.getResultInternal(path);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getGroupResult/{groupname}/{handle}")
	public Response getLatestGroupResultByName(@PathParam("groupname") String groupname,
			@PathParam("handle") String handle, @Context HttpHeaders headers) throws Exception {

		String path = PathFinder.getSpecificTestGroupResultPath(groupname, handle, false);
		return TRHelper.getResultInternal(path);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getStatus/{testname}/{handle}")
	public Response getStatusByName(@PathParam("testname") String testName, @PathParam("handle") String handle,
			@Context HttpHeaders headers) throws Exception {

		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		String pathRunning = PathFinder.getSpecificTestResultStatusPath(testName, handle, false);

		return TRHelper.getStatusInternal(path, pathRunning);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getGroupStatus/{groupname}/{handle}")
	public Response getGroupStatusByName(@PathParam("groupname") String groupName, @PathParam("handle") String handle,
			@Context HttpHeaders headers) throws Exception {

		String path = PathFinder.getSpecificTestGroupResultPath(groupName, handle, false);
		String pathRunning = PathFinder.getSpecificTestGroupResultStatusPath(groupName, handle, false);

		return TRHelper.getStatusInternal(path, pathRunning);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getTestList")
	public Response getTestList(@Context HttpHeaders headers) throws Exception {

		TestCategoriesList tcl = TRHelper.getTestCategories();

		JsonArray testsArray = new JsonArray();
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestsPath(), PathFinder.getTestLabel(),
				-1);
		for (String name : listOfFiles) {
			JsonObject test = new JsonObject();
			String testName = name.substring(0, name.length() - PathFinder.getTestLabel().length());
			ArrayList<String> listResults = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName),
					PathFinder.getDataLabel(), -1);
			test.addProperty("name", testName);
			TRHelper.enrichLastRunData(test, testName, listResults);
			String category = tcl.getCategoryOfTest(testName);
			test.addProperty("category", category);
			testsArray.add(test);
		}
		return Response.status(200).entity(testsArray.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/category")
	public Response getCategories(@Context HttpHeaders headers) throws Exception {
		// TODO pathfinder call for test.categories
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		String categories = new String(Files.readAllBytes(Paths.get(categoriesPath)));
		return Response.status(200).entity(categories).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@Authenticate("READ")
	@GET
	@Path("/getRunningCount")
	public Response getRunningCount(@Context HttpHeaders headers) throws Exception {
		return Response.status(200).entity("{\"count\":" + 	helpers.Settiings.getSingleton().getRunningCount() + "}")
				.type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	// TODO make the "getXX" calls more rest-like
	// maybe we need to have an abstraction ID for scripts as the path characters
	// mess us up
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@GET
	@Path("/getScriptList")
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
	@Path("/getScript")
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
	@Path("/script/mpfd")
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
	@Path("/script")
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
	@Path("/script")
	public Response deleteScript(@Context HttpHeaders headers, String body) throws Exception {
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
	@Path("/getScriptType")
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

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getTestGroupList")
	public Response getGroupList(@Context HttpHeaders headers) throws Exception {

		JsonArray groupsArray = new JsonArray();
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getGroupsPath(), PathFinder.getGroupLabel(),
				-1);
		for (String name : listOfFiles) {
			String testName = name.substring(0, name.length() - PathFinder.getGroupLabel().length());
			String content = Helpers.readFile(PathFinder.getSpecificGroupPath(testName));
			JsonObject tests = TRHelper.parseTestGroup(name, content);
			groupsArray.add(tests);
		}
		return Response.status(200).entity(groupsArray.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
}