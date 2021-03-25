package service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.UserManagement;
import helpers.Helpers;
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
			throw new Exception("Cannot load users - "+e.getMessage());
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
	public Response getResultsByName(@PathParam("testname") String testName, @PathParam("page") int page, @Context HttpHeaders headers) throws Exception {	
		JsonArray resultsArray = new JsonArray();
		try {
			ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName), PathFinder.getDataLabel(),page);
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
	public Response getGroupResultsByName(@PathParam("groupname") String groupName, @PathParam("page") int page, @Context HttpHeaders headers) throws Exception {
		JsonArray resultsArray = new JsonArray();
		try {
			ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getGroupTestResultsPath(groupName), PathFinder.getDataLabel(), page);
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
	public Response getLatestResultByName(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName), PathFinder.getDataLabel(),-1);
		String newest = TRHelper.getNewest(listOfFiles);
		String handle = String.valueOf(newest);
		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		return TRHelper.getResultInternal(path);
	}

	@LogRequest
	@Authenticate("READ")	
	@GET
	@Path("/getLatestGroupResult/{groupname}")
	public Response getLatestGroupResultByName(@PathParam("groupname") String groupName, @Context HttpHeaders headers) throws Exception {
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getGroupTestResultsPath(groupName), PathFinder.getDataLabel(),-1);
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
			test = TRHelper.mergeTests(tests,groupName);
		} catch (IOException e) {
			throw new Exception("Cannot find test result!");
		}
		
		return Response.status(200).entity(test.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getResult/{testname}/{handle}")
	public Response getLatestResultByName(@PathParam("testname") String testName, @PathParam("handle") String handle, @Context HttpHeaders headers)
			throws Exception {

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
	public Response getStatusByName(@PathParam("testname") String testName, @PathParam("handle") String handle, @Context HttpHeaders headers)
			throws Exception {

		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		String pathRunning = PathFinder.getSpecificTestResultStatusPath(testName, handle, false);

		return TRHelper.getStatusInternal(path, pathRunning);
	}

	@LogRequest
	@Authenticate("READ")	
	@GET
	@Path("/getGroupStatus/{groupname}/{handle}")
	public Response getGroupStatusByName(@PathParam("groupname") String groupName, @PathParam("handle") String handle, @Context HttpHeaders headers)
			throws Exception {

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
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestsPath(), PathFinder.getTestLabel(),-1);
		for (String name : listOfFiles) {
			JsonObject test = new JsonObject();
			String testName = name.substring(0, name.length() - PathFinder.getTestLabel().length());
			ArrayList<String> listResults = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName), PathFinder.getDataLabel(),-1);
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
		return Response.status(200).entity("{\"count\":"+TRHelper.runningTests+"}").type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	// TODO make the "getXX" calls more rest-like
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@GET
	@Path("/getScriptList")
	public Response getScripts( @Context HttpHeaders headers) throws Exception {
		String scriptsPathStrng = PathFinder.getScriptsFolder();
		int scriptsPathLength = scriptsPathStrng.length();
		List<String> result;
	    try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(scriptsPathStrng))) {
	        result = walk.filter(Files::isRegularFile)
	                .map(x -> x.toString()).collect(Collectors.toList());
	    } catch (IOException e) {
	        throw new Exception ("Exception encountered reading script path - "+e.getMessage());
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
	public Response getScript( @Context HttpHeaders headers, @QueryParam("name") String path) throws Exception {	
		String scriptsPathStrng = PathFinder.getScriptsFolder()+path;
		// TODO list of file types editable
		String scriptContent = new String(Files.readAllBytes(Paths.get(scriptsPathStrng)));
		return Response.status(200).entity(scriptContent).type(MediaType.TEXT_PLAIN).build();
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/getTestGroupList")
	public Response getGroupList(@Context HttpHeaders headers) throws Exception {

		JsonArray groupsArray = new JsonArray();
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getGroupsPath(), PathFinder.getGroupLabel(),-1);
		for (String name : listOfFiles) {
			String testName = name.substring(0, name.length() - PathFinder.getGroupLabel().length());
			String content = Helpers.readFile(PathFinder.getSpecificGroupPath(testName));
			JsonObject tests = TRHelper.parseTestGroup(name, content);			
			groupsArray.add(tests);
		}
		return Response.status(200).entity(groupsArray.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
}