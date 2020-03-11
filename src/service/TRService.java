package service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.logging.Level;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import helpers.Helpers;
import helpers.Log;
import helpers.PathFinder;
import pojo.GroupTestAbstraction;
import pojo.Session;
import pojo.Task;
import pojo.Test;
import pojo.User;
import testRunner.Testing;

@Path("/")
public class TRService {
	private static final String headerNameSessionID = "X-TR-Session-ID";
	
	// TODO refactor
	// TODO debug additional args in script ? greoups add multiple times??
	// TODO improved error handling (i.E. when parsing tests, it throws json parser error, but not which file it crashed . . )
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/login")
	public Response doLogin(String jsonLogin) throws Exception {
		User user = UserManagement.parseUserLoginJSON(jsonLogin);
		Log.log(Level.INFO, "Login attempt for user '" + user.getUsername() + "'");
		user = UserManagement.checkLogin(user);
		if (user != null) {
			Session session = SessionManagement.createSession(user.getUsername(),user.getRole());
			return Response.status(200).entity(session.toJSONObj().toString()).type("application/json").build();
		}
		return Response.status(401).entity("Username or Password wrong").build();
	}
	
	@GET
	@Path("/reload")
	public Response reload(@Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,true,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		Log.log(Level.INFO, "User "+userName+" reloading TR");
		try {
			UserManagement.loadUsers();
		} catch (Exception e) {
			throw new Exception("Cannot load users - "+e.getMessage());
		}
		
		return Response.status(200).entity("reloaded").build();
	}

	@GET
	@Path("/testLogin")
	public Response test(@Context HttpHeaders headers) {
		if (checkLogin(headers,false,false) != null) {
			return Response.status(200).entity("OK").build();
		} else {
			return Response.status(203).entity("NOK").build();
		}
	}
		
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/logout")
	public Response doLogout(@Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		if (headers != null && headers.getRequestHeader(headerNameSessionID) != null && headers.getRequestHeader(headerNameSessionID).size() > 0) { 
			String sessionIdentifier = headers.getRequestHeader(headerNameSessionID).get(0);
			Session session = SessionManagement.getSessionFormIdentifier(sessionIdentifier);
			if (session != null) {
				SessionManagement.destroySession(session);
			}
		}
		Log.log(Level.FINE, "User "+userName+" logged out");
		return Response.status(204).entity("").build();
	}
	

	@GET
	@Path("/getBasePath") 
	public Response getBasePath(@Context HttpHeaders headers) throws Exception {
		if (checkLogin(headers,false,false) == null) {
			return unauthorizedResponse();
		}
		return Response.status(200).entity(PathFinder.getBasePath()).build();
	}

	private Response unauthorizedResponse() {
		JsonObject error = new JsonObject();
		error.addProperty("error", "You need to be logged in / you are lacking privileges");
		return Response.status(403).entity(error.toString()).type("application/json").build();
	}

	@POST
	@Path("/run/{testname}/{tag}/{args}")
	public Response runTestByNameCustom(@PathParam("testname") String testName , @PathParam("tag") String tag, @PathParam("args") String args, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,true,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		JsonObject resp = runTestInternal(testName, userName,tag,args);

		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}
	
	@POST
	@Path("/run/{testname}/{tag}")
	public Response runTestByNameTag(@PathParam("testname") String testName , @PathParam("tag") String tag, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,true,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		JsonObject resp = runTestInternal(testName, userName,tag,"");

		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}


	
	@POST
	@Path("/run/{testname}")
	public Response runTestByName(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,true,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		JsonObject resp = runTestInternal(testName, userName,"","");

		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}

	@POST
	@Path("/runGroup/{groupname}")
	public Response runTestGroupByName(@PathParam("groupname") String groupName, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,true,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		JsonObject resp = runGroupInternal(groupName, userName,"","");
		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}
	
	@POST
	@Path("/runGroup/{groupname}/{tag}")
	public Response runTestGroupByNameTag(@PathParam("groupname") String groupName, @PathParam("tag") String tag, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,true,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		JsonObject resp = runGroupInternal(groupName, userName,tag,"");
		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}
	
	@POST
	@Path("/runGroup/{groupname}/{tag}/{args}")
	public Response runTestGroupByNameCustom(@PathParam("groupname") String groupName, @PathParam("tag") String tag,  @PathParam("args") String args, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,true,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		JsonObject resp = runGroupInternal(groupName, userName,tag,args);
		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}

	
	private JsonObject runTestInternal(String testName, String userName, String tag, String args) throws Exception {
		Log.log(Level.INFO, "User "+userName+" running test " + testName+" with tag = "+tag+" and additional args = "+args);
		JSONObject obj = Helpers.loadConfig(PathFinder.getSpecificTestPath(testName));
		Test test = Helpers.parseConfig(obj, testName);
		
		ArrayList<Task> tasks = test.tasks;
		for (Task task : tasks) { 
			ArrayList<String> argsList = task.args;
			Collections.addAll(argsList, args.split("\\s+"));
			Log.log(Level.FINEST, "Added "+(Arrays.toString(args.split("\\s+")))+" command line args to test " + testName);
		} 
		test.tag = tag;
		test.start = System.currentTimeMillis();
		Helpers.createRunningFile(test, false);
		Testing.runTestInThread(test, false, userName);

		JsonObject resp = new JsonObject();
		resp.addProperty("name", test.name);
		resp.addProperty("handle", String.valueOf(test.start));

		return resp;
	}
	
	private JsonObject runGroupInternal(String groupName, String userName, String tag, String args) throws Exception {
		Log.log(Level.INFO, "User "+userName+" running group test " + groupName+" with tag = "+tag+" and addtional args = "+args);

		JSONObject group = Helpers.loadConfig(PathFinder.getSpecificGroupPath(groupName));
		JSONArray tests = (JSONArray) group.get("tests");
		long curMil = System.currentTimeMillis();
		String handle = String.valueOf(curMil);
		Test test = new Test();
		test.description = "Group Test '" + groupName + "' consisting of tests: ";
		test.name = groupName;
		test.tag = tag;
		test.start = curMil;
		// Merging Tests
		mergeTestsToGroupTest(tests, test);
		
		ArrayList<Task> tasks = test.tasks;
		for (Task task : tasks) { 
			ArrayList<String> argsList = task.args;
			Collections.addAll(argsList, args.split("\\s+"));
			Log.log(Level.FINEST, "Added "+(Arrays.toString(args.split("\\s+")))+" command line args to test " + groupName);
		} 
		
		Helpers.createRunningFile(test, true);
		Testing.runTestInThread(test, true, userName);

		JsonObject resp = new JsonObject();
		resp.addProperty("name", groupName);
		resp.addProperty("handle", handle);
		return resp;
	}

	@GET
	@Path("/getResults/{testname}/{page}")
	public Response getResultsByName(@PathParam("testname") String testName, @PathParam("page") int page, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		
		JsonArray resultsArray = new JsonArray();
		try {
			ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName), PathFinder.getDataLabel(),page);
			getResultsInternal(testName, resultsArray, listOfFiles, false);
		} catch (Exception e) {
			throw new Exception("Cannot load or parse test result");
		}
		return Response.status(200).entity(resultsArray.toString()).type("application/json").build();
	}

	@GET
	@Path("/getGroupResults/{groupname}/{page}")
	public Response getGroupResultsByName(@PathParam("groupname") String groupName, @PathParam("page") int page, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		JsonArray resultsArray = new JsonArray();
		try {
			ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getGroupTestResultsPath(groupName), PathFinder.getDataLabel(), page);
			getResultsInternal(groupName, resultsArray, listOfFiles, true);
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("Cannot load or parse test result - " + e.getMessage());
		}
		return Response.status(200).entity(resultsArray.toString()).type("application/json").build();
	}

	@GET
	@Path("/getLatestResult/{testname}")
	public Response getLatestResultByName(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName), PathFinder.getDataLabel(),-1);
		String newest = getNewest(listOfFiles);
		String handle = String.valueOf(newest);
		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		return getResultInternal(path);
	}

	@GET
	@Path("/getLatestGroupResult/{groupname}")
	public Response getLatestGroupResultByName(@PathParam("groupname") String groupName, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getGroupTestResultsPath(groupName), PathFinder.getDataLabel(),-1);
		String newest = getNewest(listOfFiles);
		String handle = String.valueOf(newest);
		String path = PathFinder.getSpecificTestGroupResultPath(groupName, handle, false);
		return getResultInternal(path);
	}
	
	@GET
	@Path("/getTest/{testname}")
	public Response getTest(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		String path = PathFinder.getSpecificTestPath(testName);	
		return getResultInternal(path);
	}
	
	@GET
	@Path("/getGroup/{groupname}")
	public Response getGroup(@PathParam("groupname") String groupName, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		JsonElement test = null;
		try {
			ArrayList<GroupTestAbstraction> paths = getTestInfoByGroupName(groupName);
			ArrayList<JsonElement> tests = getJsonElementsOfPath(paths);
			test = mergeTests(tests,groupName);
		} catch (IOException e) {
			throw new Exception("Cannot find test result!");
		}
		
		return Response.status(200).entity(test.toString()).type("application/json").build();
	}

	private JsonElement mergeTests(ArrayList<JsonElement> tests, String groupName) {
		JsonObject merged = new JsonObject();
		JsonObject settingsObj = new JsonObject();
		JsonObject testObj = new JsonObject();
		JsonArray tasksArr = new JsonArray();

		JsonElement finalSuccessHook = null;
		JsonElement finalFailureHook = null;
		String description = "Group Test '"+groupName+"'";
		for (JsonElement test : tests) {
			JsonElement successHook = test.getAsJsonObject().get("settings").getAsJsonObject().get("successhook");
			JsonElement failureHook = test.getAsJsonObject().get("settings").getAsJsonObject().get("failurehook");
			if(successHook!=null) {
				finalSuccessHook=successHook;
			}
			if(failureHook!=null) {
				finalFailureHook=failureHook;
			}
			JsonArray tasks = test.getAsJsonObject().get("test").getAsJsonObject().get("tasks").getAsJsonArray();
			for (JsonElement task : tasks) {
				tasksArr.add(task);
			}
		}
		if(finalSuccessHook != null) {
			settingsObj.add("successhook", finalSuccessHook);
		}
		if(finalFailureHook != null) {
			settingsObj.add("failurehook", finalFailureHook);
		}
		testObj.addProperty("description", description);
		merged.add("settings", settingsObj);
		testObj.add("tasks", tasksArr);
		merged.add("test", testObj);
		return merged;
	}

	@GET
	@Path("/getResult/{testname}/{handle}")
	public Response getLatestResultByName(@PathParam("testname") String testName, @PathParam("handle") String handle, @Context HttpHeaders headers)
			throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		return getResultInternal(path);
	}

	@GET
	@Path("/getGroupResult/{groupname}/{handle}")
	public Response getLatestGroupResultByName(@PathParam("groupname") String groupname,
			@PathParam("handle") String handle, @Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		String path = PathFinder.getSpecificTestGroupResultPath(groupname, handle, false);
		return getResultInternal(path);
	}

	@GET
	@Path("/getStatus/{testname}/{handle}")
	public Response getStatusByName(@PathParam("testname") String testName, @PathParam("handle") String handle, @Context HttpHeaders headers)
			throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
		String pathRunning = PathFinder.getSpecificTestResultStatusPath(testName, handle, false);

		return getStatusInternal(path, pathRunning);
	}

	@GET
	@Path("/getGroupStatus/{groupname}/{handle}")
	public Response getGroupStatusByName(@PathParam("groupname") String groupName, @PathParam("handle") String handle, @Context HttpHeaders headers)
			throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		String path = PathFinder.getSpecificTestGroupResultPath(groupName, handle, false);
		String pathRunning = PathFinder.getSpecificTestGroupResultStatusPath(groupName, handle, false);

		return getStatusInternal(path, pathRunning);
	}

	@GET
	@Path("/getTestList")
	public Response getTestList(@Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}

		JsonArray testsArray = new JsonArray();
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getTestsPath(), PathFinder.getTestLabel(),-1);
		for (String name : listOfFiles) {
			JsonObject test = new JsonObject();
			String testName = name.substring(0, name.length() - PathFinder.getTestLabel().length());
			ArrayList<String> listResults = Helpers.getListOfFiles(PathFinder.getTestResultsPath(testName), PathFinder.getDataLabel(),-1);
			test.addProperty("name", testName);
			enrichLastRunData(test, testName, listResults);
			testsArray.add(test);
		}
		return Response.status(200).entity(testsArray.toString()).type("application/json").build();
	}

	@GET
	@Path("/getTestGroupList")
	public Response getGroupList(@Context HttpHeaders headers) throws Exception {
		String userName = checkLogin(headers,false,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		JsonArray groupsArray = new JsonArray();
		ArrayList<String> listOfFiles = Helpers.getListOfFiles(PathFinder.getGroupsPath(), PathFinder.getGroupLabel(),-1);
		for (String name : listOfFiles) {
			String testName = name.substring(0, name.length() - PathFinder.getGroupLabel().length());
			String content = Helpers.readFile(PathFinder.getSpecificGroupPath(testName));
			JsonObject tests = parseTestGroup(name, content);			
			groupsArray.add(tests);
		}
		return Response.status(200).entity(groupsArray.toString()).type("application/json").build();
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/createUser")
	public Response createUser(@Context HttpHeaders headers, String body) throws Exception {
		String userName = checkLogin(headers,true,true);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		User userToAdd = UserManagement.createUserObjByBodyJSON(body);
		
		if(userToAdd.getPwLength()<8) {
			throw new Exception("Password length is 8 characters minimum");
		}
		for (User user : UserManagement.users) {
			if(user.getUsername().equals(userToAdd.getUsername())) {
				throw new Exception("Username already taken");
			}
		}
		if( !userToAdd.getRole().equals("a") && !userToAdd.getRole().equals("rw") && !userToAdd.getRole().equals("r")) {
			throw new Exception("Invalid role");
		}
		Log.log(Level.INFO, "'"+userName+"' is adding user '"+userToAdd.getUsername()+"' with role '"+userToAdd.getRole()+"'");
		UserManagement.addUser(userToAdd);
		try {
			UserManagement.loadUsers();
		} catch (Exception e) {
			throw new Exception("Cannot load users - "+e.getMessage());
		}
		return Response.status(200).entity("{\"user\" : \"created\"}").type("application/json").build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/changePassword")
	public Response changePassword(@Context HttpHeaders headers, String body) throws Exception {
		String userName = checkLogin(headers,true,false);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		
		String password = "";
		JsonObject userJO;
		try {
			userJO =  new JsonParser().parse(body).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing password json - "+e.getMessage());
		}
		try {
			password = userJO.getAsJsonObject().get("password").getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing password - key not found");
		}
		
		if(password.length()<8) {
			throw new Exception("Password length is 8 characters minimum");
		}
		Log.log(Level.INFO, "'"+userName+"' is changing his password");

		UserManagement.changePassword(userName, password);
		return Response.status(200).entity("{\"password\" : \"changed\"}").type("application/json").build();
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/changePasswordForUser")
	public Response changePasswordForUser(@Context HttpHeaders headers, String body) throws Exception {
		String userName = checkLogin(headers,true,true);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		
		String userNameToChange = ""; 
		String password = "";
		JsonObject userJO;
		try {
			userJO =  new JsonParser().parse(body).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing password json - "+e.getMessage());
		}
		try {
			userNameToChange = userJO.getAsJsonObject().get("username").getAsString();
			password = userJO.getAsJsonObject().get("password").getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing username / password - key not found");
		}
		
		if(password.length()<8) {
			throw new Exception("Password length is 8 characters minimum");
		}
		Log.log(Level.INFO, "'"+userName+"' is changing the password of user '"+userNameToChange+"'");
		UserManagement.changePassword(userNameToChange, password);
		return Response.status(200).entity("{\"password\" : \"changed\"}").type("application/json").build();
	}
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/deleteUser")
	public Response deleteUser(@Context HttpHeaders headers, String body) throws Exception {
		String userName = checkLogin(headers,true,true);
		if ( userName == null) {
			return unauthorizedResponse();
		}
		
		String userNameToDelete = ""; 
		JsonObject userJO;
		try {
			userJO =  new JsonParser().parse(body).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing user json - "+e.getMessage());
		}
		try {
			userNameToDelete = userJO.getAsJsonObject().get("username").getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing username - key not found");
		}

		Log.log(Level.INFO, "'"+userName+"' is deleting  user '"+userNameToDelete+"'");
		UserManagement.deleteUser(userNameToDelete);
		return Response.status(200).entity("{\"user\" : \"deleted\"}").type("application/json").build();
	}
	
	private Response getResultInternal(String path) throws Exception {
		String result = "";
		try {
			result = Helpers.readFile(path);
		} catch (IOException e) {
			throw new Exception("Cannot find test result!");
		}
		return Response.status(200).entity(result).type("application/json").build();
	}

	private Response getStatusInternal(String path, String pathRunning) throws Exception {
		File runningFile;
		File dataFile;
		runningFile = new File(pathRunning);
		dataFile = new File(path);

		String state = "";
		if (runningFile.exists()) {
			state = "running";
		} else if (dataFile.exists()) {
			state = "done";
		} else {
			throw new Exception("Could not find test!"); 
		}
		JsonObject test = new JsonObject();
		test.addProperty("state", state);
		return Response.status(200).entity(test.toString()).type("application/json").build();
	}

	private void getResultsInternal(String testName, JsonArray resultsArray, ArrayList<String> listOfFiles, boolean group) throws Exception {
		for (String handle : listOfFiles) {
			handle = handle.substring(0, handle.length() - PathFinder.getDataLabel().length());
			String resultPath;
			if (group) {
				resultPath = PathFinder.getSpecificTestGroupResultPath(testName, handle, false);
			} else {
				resultPath = PathFinder.getSpecificTestResultPath(testName, handle, false);
			}
			
			JsonObject result = new JsonObject();
			if(handle.contains("_")) {
				result.addProperty("tag", handle.substring(handle.indexOf("_")+1));
			}
			JsonElement resultJson = new JsonParser().parse(Helpers.readFile(resultPath));
			result.addProperty("handle", handle);

			result.add("result", resultJson);
			resultsArray.add(result);
		}
	}

	private String getDescriptionOfGroup(String groupName) throws Exception {
		String path = PathFinder.getSpecificGroupPath(groupName);
		String result = Helpers.readFile(path);
		JsonParser parser = new JsonParser();
		JsonElement jsonElement = parser.parse(result);
		return jsonElement.getAsJsonObject().get("description").getAsString();
	}
	
	private JsonObject parseTestGroup(String name, String content) throws Exception {
		JsonObject testGroup = new JsonObject();
		JsonArray testGroupTests = new JsonArray();
		JsonObject test;
		try {
			test = new JsonParser().parse(content).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing test group \""+name+"\" - "+e.getMessage());
		}
		String groupName = name.substring(0, name.length() - PathFinder.getGroupLabel().length());
		testGroup.addProperty("name", groupName);		
		testGroup.addProperty("description", getDescriptionOfGroup(groupName));
		
		ArrayList<String> listResults = Helpers.getListOfFiles(PathFinder.getGroupTestResultsPath(groupName), PathFinder.getDataLabel(),-1);
		String lastRunDate = "";
		boolean passed = true;
		long totalRunTimeInMS = 0;
		
		if(listResults.size()>0) {
			String newest = getNewest(listResults);
			String handle = String.valueOf(newest);
			String path = PathFinder.getSpecificTestGroupResultPath(groupName, handle, false);
			String lastRun = Helpers.readFile(path);			
			JsonObject lastRunJO = new JsonParser().parse(lastRun).getAsJsonObject();
			lastRunDate = lastRunJO.get("testStartString").getAsString();
			JsonArray lastRunResults = lastRunJO.get("results").getAsJsonArray();
			passed = true;
			for (JsonElement lastRunResult : lastRunResults) {
				totalRunTimeInMS += lastRunResult.getAsJsonObject().get("runTimeInMS").getAsLong();
				if(lastRunResult.getAsJsonObject().get("passed").getAsString().equals("false")) {
					passed = false;
				}
			}
		}
		testGroup.addProperty("lastRunDate", lastRunDate);
		testGroup.addProperty("lastRunPassed", passed);
		testGroup.addProperty("totalRunTimeInMS", totalRunTimeInMS);
		JsonArray tests = (JsonArray) test.get("tests");
		for (Object testObj : tests) {
			JsonObject testO = (JsonObject) testObj;
			testGroupTests.add(testO);
		}
		testGroup.add("tests", testGroupTests);
		return testGroup;
	}
	

	private void enrichLastRunData(JsonObject test, String testName, ArrayList<String> listResults) throws Exception {
		boolean passed = true;
		String lastRunDate = "";
		long totalRunTimeInMS = 0;

		if(listResults.size()>0) {
			String newest = getNewest(listResults);
			String handle = String.valueOf(newest);
			String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
			String lastRun = Helpers.readFile(path);
			JsonObject lastRunJO = new JsonParser().parse(lastRun).getAsJsonObject();
			lastRunDate = lastRunJO.get("testStartString").getAsString();
			JsonArray lastRunResults = lastRunJO.get("results").getAsJsonArray();
			passed = true;
			for (JsonElement lastRunResult : lastRunResults) {
				totalRunTimeInMS += lastRunResult.getAsJsonObject().get("runTimeInMS").getAsLong();
				if(lastRunResult.getAsJsonObject().get("passed").getAsString().equals("false")) {
					passed = false;
				}
			}
		}
		test.addProperty("totalRunTimeInMS", totalRunTimeInMS);
		test.addProperty("lastRunDate", lastRunDate);
		test.addProperty("lastRunPassed", passed);
	}

	private String getNewest(ArrayList<String> toSortAL) {
		
        for(int i = 0;i<toSortAL.size();i++) {
        	toSortAL.set(i, cutDataLabelFromString(toSortAL.get(i)));
        }

		Collections.sort(toSortAL, Collections.reverseOrder());	
		return toSortAL.get(0);
	}

	private String cutDataLabelFromString(String strng) {
		return strng.substring(0, strng.length() - PathFinder.getDataLabel().length());
	}
	
	private ArrayList<JsonElement> getJsonElementsOfPath(ArrayList<GroupTestAbstraction> gta) throws Exception {
		JsonParser parser = new JsonParser();
		ArrayList<JsonElement> elements = new ArrayList<JsonElement>();
		for (GroupTestAbstraction gtaObj : gta) {
			String testContent;
			try {
				testContent = Helpers.readFile(gtaObj.getPath());
			} catch (Exception e) {
				throw new Exception("Cannot load group due to an error reading one of its test: "+e.getMessage());
			}
			JsonElement testContentJSON = parser.parse(testContent);
			elements.add(testContentJSON);
		}
		return elements;
	}

	private ArrayList<GroupTestAbstraction> getTestInfoByGroupName(String groupName) throws Exception {
		String path = PathFinder.getSpecificGroupPath(groupName);
		String result = Helpers.readFile(path);
		ArrayList<GroupTestAbstraction> paths = new ArrayList<GroupTestAbstraction>();
		
		JsonParser parser = new JsonParser();
		JsonElement jsonElement = parser.parse(result);
		
		JsonArray groupTestsArray = jsonElement.getAsJsonObject().get("tests").getAsJsonArray();
		for (JsonElement testElement : groupTestsArray) {
			String testName = testElement.getAsJsonObject().get("test").getAsString();
			String descriptiveName = testElement.getAsJsonObject().get("name").getAsString();
			String testPath = PathFinder.getSpecificTestPath(testName);	
			
			GroupTestAbstraction gta = new GroupTestAbstraction(descriptiveName, testPath);
			paths.add(gta);
		}
		return paths;
	}
	
	private void mergeTestsToGroupTest(JSONArray tests, Test test) throws Exception {
		for (Object testObj : tests) {
			JSONObject testJObj = (JSONObject) testObj;
			String testName = testJObj.getString("test");
			test.description += testName + ",";
			JSONObject objd = Helpers.loadConfig(PathFinder.getSpecificTestPath(testName));
			Test testD = Helpers.parseConfig(objd, testName);
			if(testD.successHook != null) {
				test.successHook = testD.successHook;
			}
			if(testD.failureHook != null) {
				test.failureHook = testD.failureHook;
			}
			test.tasks.addAll(testD.tasks);
		}
	}


	private String checkLogin(HttpHeaders headers, boolean requiresWritePrivilege, boolean requiresAdminPrivilege) {
		if (headers != null && headers.getRequestHeader(headerNameSessionID) != null && headers.getRequestHeader(headerNameSessionID).size() > 0) { 
			String sessionIdentifier = headers.getRequestHeader(headerNameSessionID).get(0);
			Session session = SessionManagement.getSessionFormIdentifier(sessionIdentifier);
			if (session != null) {
				if(requiresWritePrivilege && !session.getRole().equals("rw") && !session.getRole().equals("a")) {
					Log.log(Level.WARNING, "Login check failed - user "+session.getUsername()+" attempted to execute write API call which he does not have sufficient privileges for.");
				}else if(requiresAdminPrivilege && !session.getRole().equals("a")) {
					Log.log(Level.WARNING, "Login check failed - user "+session.getUsername()+" attempted to execute admin API call which he does not have sufficient privileges for.");
				}else {
					return session.getUsername();					
				}
			}else {
				Log.log(Level.INFO, "Login check failed due to session provided not found in session storage (hs)");
			}
		}else {
			Log.log(Level.INFO, "Login check failed due to missing header");			
		}
		return null;
	}
}