package service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import annotations.Authenticate;
import annotations.LogRequest;
import helpers.Helpers;
import helpers.PathFinder;
import helpers.TRHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import pojo.GroupTestAbstraction;
import pojo.TestCategoriesList;


@Singleton
@Api("/tr")
@Path("/tr")
public class TRService {

	
	// TODO refactor calls
	
	@Authenticate("READ")
	@LogRequest
	@GET
	@Path("/basepath")
	@ApiOperation( response = String.class, value = "[READ] Returns the application base path")
	public Response getBasePath(@Context HttpHeaders headers) throws Exception {
		return Response.status(200).entity(PathFinder.getBasePath()).build();
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/result/test/{testname}/page/{page}")
	@ApiOperation( response = String.class, value = "[READ] Returns the application base path")
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
	@Path("/result/test/{testname}/latest")
	@ApiOperation(value = "[READ] Returns the latest result for a test")
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
	@ApiOperation(value = "[READ] Returns the latest result for a test group")
	@Path("/result/group/{groupname}/latest")
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
	@Path("/result/group/{groupname}/page/{page}")
	@ApiOperation(value = "[READ] Returns group result by name - paginated")
	public Response getGroupResultsByName(@PathParam("groupname") String groupName, @PathParam("page") int page, @Context HttpHeaders headers) throws Exception {
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
	@Path("/result/group/{groupname}/{handle}")
	@ApiOperation(value = "[READ] Returns a specific result for a group")
	public Response getLatestGroupResultByNameAndHandle(@PathParam("groupname") String groupname, @PathParam("handle") String handle, @Context HttpHeaders headers) throws Exception {

		String path = PathFinder.getSpecificTestGroupResultPath(groupname, handle, false);
		return TRHelper.getResultInternal(path);
	}


	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/test/{testname}")
	@ApiOperation(value = "[READ] Returns a test description")
	public Response getTest(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String path = PathFinder.getSpecificTestPath(testName);
		return TRHelper.getResultInternal(path);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/group/{groupname}")
	@ApiOperation(value = "[READ] Returns a group description")
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
	@Path("/result/test/{testname}/{handle}")
	@ApiOperation(value = "[READ] Returns a specific result for a test")
	public Response getSpecficResultByNameAndHandle(@PathParam("testname") String testName, @PathParam("handle") String handle,
			@Context HttpHeaders headers) throws Exception {

		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		return TRHelper.getResultInternal(path);
	}


	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/status/test/{testname}/{handle}")
	@ApiOperation(value = "[READ] Returns the current status of a test")
	public Response getStatusByName(@PathParam("testname") String testName, @PathParam("handle") String handle,
			@Context HttpHeaders headers) throws Exception {

		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		String pathRunning = PathFinder.getSpecificTestResultStatusPath(testName, handle, false);

		return TRHelper.getStatusInternal(path, pathRunning);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/status/group/{groupname}/{handle}")
	@ApiOperation(value = "[READ] Returns the current status of a group")
	public Response getGroupStatusByName(@PathParam("groupname") String groupName, @PathParam("handle") String handle,
			@Context HttpHeaders headers) throws Exception {

		String path = PathFinder.getSpecificTestGroupResultPath(groupName, handle, false);
		String pathRunning = PathFinder.getSpecificTestGroupResultStatusPath(groupName, handle, false);

		return TRHelper.getStatusInternal(path, pathRunning);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/test")
	@ApiOperation(value = "[READ] Returns all tests")
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
	@ApiOperation(value = "[READ] Returns all categories")
	public Response getCategories(@Context HttpHeaders headers) throws Exception {
		// TODO pathfinder call for test.categories
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		String categories = new String(Files.readAllBytes(Paths.get(categoriesPath)));
		return Response.status(200).entity(categories).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@Authenticate("READ")
	@GET
	@Path("/runningcount")
	@ApiOperation(value = "[READ] Returns amount of currently running tests")
	public Response getRunningCount(@Context HttpHeaders headers) throws Exception {
		return Response.status(200).entity("{\"count\":" + 	helpers.Settings.getSingleton().getRunningCount() + "}")
				.type(MediaType.APPLICATION_JSON_TYPE).build();
	}


	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/group")
	@ApiOperation(value = "[READ] Returns test groups")
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