package service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.logging.Level;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import annotations.Authenticate;
import annotations.LogRequest;
import helpers.Helpers;
import helpers.Log;
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
	@Path("/archive")
	@ApiOperation(value = "[READ] Serves a specific archive file as APPLICATION_OCTET_STREAM")
	// we are using a query param as it contains / and or \
	public Response getArchive(@Context HttpHeaders headers, @QueryParam("name") String name, @QueryParam("handle") String handle,  @QueryParam("archiveID") int archiveID) throws Exception {
		String archivePath = PathFinder.getSpecificTestResultArchivePath(name, handle, archiveID, false);
		return serveArchiveFile(archivePath);
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/archive/group")
	@ApiOperation(value = "[READ] Serves a specific group archive file as APPLICATION_OCTET_STREAM")
	// we are using a query param as it contains / and or \
	public Response getGroupArchive(@Context HttpHeaders headers, @QueryParam("name") String name, @QueryParam("handle") String handle,  @QueryParam("archiveID") int archiveID) throws Exception {
		String archivePath = PathFinder.getSpecificTestGroupResultArchivePath(name, handle, archiveID, false);
		return serveArchiveFile(archivePath);
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
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestsPath(), PathFinder.getTestLabel(),-1);
		for (String name : listOfFiles) {
			JsonObject test = new JsonObject();
			String testName = name.substring(0, name.length() - PathFinder.getTestLabel().length());
			ArrayList<String> listResults = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName),
					PathFinder.getDataLabel(), -1);
			test.addProperty(TRHelper.NAME, testName);
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
		String categoriesPath = PathFinder.getCategoriesFilePath();
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
	

	@Authenticate("READWRITEEXECUTE")
	@GET
	@Path("/log")
	@ApiOperation(value = "[READWRITEEXECUTE] Returns recent log entries")
	public Response getLog(@Context HttpHeaders headers) throws Exception {
		String logEntries = Log.getRecentLogEntries();
		return Response.status(200).entity(logEntries).type(MediaType.TEXT_PLAIN).build();
	}

	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/group")
	@ApiOperation(value = "[READ] Returns test groups")
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
	
	private Response serveArchiveFile(String archivePath) throws Exception, IOException {
		if (!PathFinder.isPathSafe(archivePath, PathFinder.getBasePath()) || !archivePath.endsWith(PathFinder.getArchiveLabel())) {
			Log.log(Level.WARNING, "Get archive file failed due to unsafe path '" + archivePath + "'");
			return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
		}
		try {
			File file = new File(archivePath);
			if(file.exists()) {
				ResponseBuilder rb = Response.ok(file, MediaType.APPLICATION_OCTET_STREAM);
				rb.header("Content-Disposition", "attachment;");
				return rb.build();					
			}
		} catch (Exception e) {}
		return Response.status(404).entity("File not found").type(MediaType.TEXT_PLAIN).build();
	}
}