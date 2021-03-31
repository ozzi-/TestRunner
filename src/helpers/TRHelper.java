package helpers;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;

import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.MalformedJsonException;

import pojo.GroupTestAbstraction;
import pojo.LastRunCache;
import pojo.Task;
import pojo.Test;
import pojo.TestCategoriesList;
import service.CacheService;
import testrunner.Testing;

public class TRHelper {
	
	public int runningTests = 0;

	public static TestCategoriesList getTestCategories() throws Exception {		
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		long lastModified = Helpers.getLastModifiedTimeByPath(categoriesPath);

		TestCategoriesList tclCache = CacheService.getTestCategories(lastModified);
		if(tclCache!=null) {
			return tclCache;
		}
		TestCategoriesList tcl = new TestCategoriesList();
		if (Helpers.fileExistsAndReadable(categoriesPath)) {
			String file = Helpers.readFile(categoriesPath);
			JsonObject categories;
			try {
				categories = new JsonParser().parse(file).getAsJsonObject();
			} catch (Exception e) {
				throw new MalformedJsonException("Error parsing test.categories file - " + e.getMessage() + " - " + e.getCause());
			}
			Set<Map.Entry<String, JsonElement>> entries = categories.entrySet();
			for (Map.Entry<String, JsonElement> entry : entries) {
				String categoryName = entry.getKey();
				JsonArray tests = entry.getValue().getAsJsonArray();
				for (JsonElement test : tests) {
					String testName = test.getAsString();
					tcl.addTestToCategory(testName, categoryName);
				}
			}
		}
		CacheService.setTestCategories(tcl,lastModified);
		return tcl;
	}

	/**
	 * Creates a running file which indicates a test still being executed This file
	 * is deleted as soon as the test is done, which creates a .data result file
	 * 
	 * @param test
	 * @throws Exception
	 * @throws IOException
	 */
	public static void createRunningFile(Test test, boolean group) throws Exception {
		String basePath;
		String tag = test.tag.equals("") ? "" : "_" + test.tag;

		if (group) {
			basePath = PathFinder.getSpecificTestGroupResultStatusPath(test.name, String.valueOf(test.start) + tag, true);
		} else {
			basePath = PathFinder.getSpecificTestResultStatusPath(test.name, String.valueOf(test.start) + tag, true);
		}
		File runningFile = new File(basePath);
		try {
			runningFile.createNewFile();
		} catch (IOException e) {
			throw new Exception("Could not create running file: " + e.getMessage() + " - " + basePath);
		}
	}

	public static JsonObject runTestInternal(String testName, String userName, String tag, String args) throws Exception {
		Log.log(Level.INFO, "User " + userName + " running test " + testName + " with tag = " + tag + " and additional args = " + args);
		Settiings.getSingleton().setRunningCount(Settiings.getSingleton().getRunningCount()+1);
		
		JSONObject obj = Helpers.parsePathToJSONObj(PathFinder.getSpecificTestPath(testName));
		Test test = Helpers.parseTest(obj, testName);

		ArrayList<Task> tasks = test.tasks;
		for (Task task : tasks) {
			ArrayList<String> argsList = task.args;
			Collections.addAll(argsList, args.split("\\s+"));
			Log.log(Level.FINEST, "Added " + (Arrays.toString(args.split("\\s+"))) + " command line args to test '" + testName+"'");
		}
		test.tag = tag;
		test.start = System.currentTimeMillis();
		createRunningFile(test, false);
		Testing.runTestInThread(test, false, userName);

		JsonObject resp = new JsonObject();
		resp.addProperty("name", test.name);
		resp.addProperty("handle", String.valueOf(test.start));
		
		
		return resp;
	}

	public static JsonObject runGroupInternal(String groupName, String userName, String tag, String args) throws Exception {
		Log.log(Level.INFO, "User " + userName + " running group test " + groupName + " with tag = " + tag + " and addtional args = " + args);
		Settiings.getSingleton().setRunningCount(Settiings.getSingleton().getRunningCount()+1);
		
		JSONObject group = Helpers.parsePathToJSONObj(PathFinder.getSpecificGroupPath(groupName));
		JSONArray tests = (JSONArray) group.get("tests");
		long curMil = System.currentTimeMillis();
		String handle = String.valueOf(curMil);
		Test test = new Test();
		test.description = "Group Test '" + groupName + "' consisting of tests: ";
		test.name = groupName;
		test.tag = tag;
		test.start = curMil;
		
		mergeTestsToGroupTest(tests, test);
		ArrayList<Task> tasks = test.tasks;
		for (Task task : tasks) {
			ArrayList<String> argsList = task.args;
			Collections.addAll(argsList, args.split("\\s+"));
			Log.log(Level.FINEST, "Added " + (Arrays.toString(args.split("\\s+"))) + " command line args to test " + groupName);
		}

		createRunningFile(test, true);
		Testing.runTestInThread(test, true, userName);
		
		JsonObject resp = new JsonObject();
		resp.addProperty("name", groupName);
		resp.addProperty("handle", handle);
		return resp;
	}

	public static JsonElement mergeTests(ArrayList<JsonElement> tests, String groupName) {
		JsonObject merged = new JsonObject();
		JsonObject settingsObj = new JsonObject();
		JsonObject testObj = new JsonObject();
		JsonArray tasksArr = new JsonArray();

		JsonElement finalSuccessHook = null;
		JsonElement finalFailureHook = null;
		String description = "Group Test '" + groupName + "'";
		for (JsonElement test : tests) {
			JsonElement successHook = test.getAsJsonObject().get("settings").getAsJsonObject().get("successhook");
			JsonElement failureHook = test.getAsJsonObject().get("settings").getAsJsonObject().get("failurehook");
			if (successHook != null) {
				finalSuccessHook = successHook;
			}
			if (failureHook != null) {
				finalFailureHook = failureHook;
			}
			JsonArray tasks = test.getAsJsonObject().get("test").getAsJsonObject().get("tasks").getAsJsonArray();
			for (JsonElement task : tasks) {
				tasksArr.add(task);
			}
		}
		if (finalSuccessHook != null) {
			settingsObj.add("successhook", finalSuccessHook);
		}
		if (finalFailureHook != null) {
			settingsObj.add("failurehook", finalFailureHook);
		}
		testObj.addProperty("description", description);
		merged.add("settings", settingsObj);
		testObj.add("tasks", tasksArr);
		merged.add("test", testObj);
		return merged;
	}

	public static Response getResultInternal(String path) throws Exception {
		String result = "";
		try {
			result = Helpers.readFile(path);
		} catch (IOException e) {
			throw new Exception("Cannot find test result!");
		}
		try {
			new JSONObject(result);
		} catch (Exception e) {
			throw new Exception("Error parsing json file (" + path + ")   \"" + e.getMessage() + "\" in TRHelper");
		}
		return Response.status(200).entity(result).type("application/json").build();
	}

	public static Response getStatusInternal(String path, String pathRunning) throws Exception {
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

	public static void getResultsInternal(String testName, JsonArray resultsArray, ArrayList<String> listOfFiles, boolean group) throws Exception {
		for (String handle : listOfFiles) {
			handle = handle.substring(0, handle.length() - PathFinder.getDataLabel().length());
			String resultPath;
			if (group) {
				resultPath = PathFinder.getSpecificTestGroupResultPath(testName, handle, false);
			} else {
				resultPath = PathFinder.getSpecificTestResultPath(testName, handle, false);
			}

			JsonObject result = new JsonObject();
			if (handle.contains("_")) {
				result.addProperty("tag", handle.substring(handle.indexOf("_") + 1));
			}
			JsonElement resultJson = new JsonParser().parse(Helpers.readFile(resultPath));
			result.addProperty("handle", handle);

			result.add("result", resultJson);
			resultsArray.add(result);
		}
	}

	private static String getDescriptionOfGroup(String groupName) throws Exception {
		String path = PathFinder.getSpecificGroupPath(groupName);
		String result = Helpers.readFile(path);
		JsonParser parser = new JsonParser();
		JsonElement jsonElement = parser.parse(result);
		return jsonElement.getAsJsonObject().get("description").getAsString();
	}

	public static JsonObject parseTestGroup(String name, String content) throws Exception {
		JsonObject testGroup = new JsonObject();
		JsonArray testGroupTests = new JsonArray();
		JsonObject test;
		try {
			test = new JsonParser().parse(content).getAsJsonObject();
		} catch (Exception e) {
			throw new Exception("Error parsing test group \"" + name + "\" - " + e.getMessage());
		}
		String groupName = name.substring(0, name.length() - PathFinder.getGroupLabel().length());
		testGroup.addProperty("name", groupName);
		testGroup.addProperty("description", getDescriptionOfGroup(groupName));

		ArrayList<String> listResults = Helpers.getListOfFiles(PathFinder.getGroupTestResultsPath(groupName), PathFinder.getDataLabel(), -1);
		String lastRunDate = "";
		boolean passed = true;
		long totalRunTimeInMS = 0;
		
		// note name already contains the postfix  ".group" 
		LastRunCache lrc = CacheService.getLastRunEntry(name); 
		if(lrc!=null) {
			testGroup.addProperty("totalRunTimeInMS", lrc.getTotalRunTimeInMS());
			testGroup.addProperty("lastRunDate", lrc.getLastRunDate());
			testGroup.addProperty("lastRunPassed", lrc.didLastRunPass());
		}else {
			if (listResults.size() > 0) {
				String newest = getNewest(listResults);
				String path = PathFinder.getSpecificTestGroupResultPath(groupName, newest, false);
				String lastRun = Helpers.readFile(path);
				JsonObject lastRunJO = new JsonParser().parse(lastRun).getAsJsonObject();
				lastRunDate = lastRunJO.get("testStartString").getAsString();
				JsonArray lastRunResults = lastRunJO.get("results").getAsJsonArray();
				passed = true;
				for (JsonElement lastRunResult : lastRunResults) {
					totalRunTimeInMS += lastRunResult.getAsJsonObject().get("runTimeInMS").getAsLong();
					if (lastRunResult.getAsJsonObject().get("passed").getAsString().equals("false")) {
						passed = false;
					}
				}
			}
			testGroup.addProperty("lastRunDate", lastRunDate);
			testGroup.addProperty("lastRunPassed", passed);
			testGroup.addProperty("totalRunTimeInMS", totalRunTimeInMS);
			CacheService.addLastRunEntry(name, new LastRunCache(totalRunTimeInMS, lastRunDate, passed));
		}
		
		JsonArray tests = (JsonArray) test.get("tests");
		for (Object testObj : tests) {
			JsonObject testO = (JsonObject) testObj;
			testGroupTests.add(testO);
		}
		testGroup.add("tests", testGroupTests);
		return testGroup;
	}

	public static void enrichLastRunData(JsonObject test, String testName, ArrayList<String> listResults) throws Exception {
		boolean passed = true;
		String lastRunDate = "";
		long totalRunTimeInMS = 0;
		
		LastRunCache lrc = CacheService.getLastRunEntry(testName);
		if(lrc!=null) {
			test.addProperty("totalRunTimeInMS", lrc.getTotalRunTimeInMS());
			test.addProperty("lastRunDate", lrc.getLastRunDate());
			test.addProperty("lastRunPassed", lrc.didLastRunPass());
			return;
		}
		
		if (listResults.size() > 0) {
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
				if (lastRunResult.getAsJsonObject().get("passed").getAsString().equals("false")) {
					passed = false;
				}
			}
		}
		test.addProperty("totalRunTimeInMS", totalRunTimeInMS);
		test.addProperty("lastRunDate", lastRunDate);
		test.addProperty("lastRunPassed", passed);
		
		CacheService.addLastRunEntry(testName, new LastRunCache(totalRunTimeInMS, lastRunDate, passed));
	}

	public static String getNewest(ArrayList<String> toSortAL) {

		for (int i = 0; i < toSortAL.size(); i++) {
			toSortAL.set(i, cutDataLabelFromString(toSortAL.get(i)));
		}

		Collections.sort(toSortAL, Collections.reverseOrder());
		return toSortAL.get(0);
	}

	private static String cutDataLabelFromString(String strng) {
		return strng.substring(0, strng.length() - PathFinder.getDataLabel().length());
	}

	public static ArrayList<JsonElement> getJsonElementsOfPath(ArrayList<GroupTestAbstraction> gta) throws Exception {
		JsonParser parser = new JsonParser();
		ArrayList<JsonElement> elements = new ArrayList<JsonElement>();
		for (GroupTestAbstraction gtaObj : gta) {
			String testContent;
			try {
				testContent = Helpers.readFile(gtaObj.getPath());
			} catch (Exception e) {
				throw new Exception("Cannot load group due to an error reading one of its test: " + e.getMessage());
			}
			JsonElement testContentJSON = parser.parse(testContent);
			elements.add(testContentJSON);
		}
		return elements;
	}

	public static ArrayList<GroupTestAbstraction> getTestInfoByGroupName(String groupName) throws Exception {
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

	private static void mergeTestsToGroupTest(JSONArray testsToAdd, Test test) throws Exception {
		boolean addedTest = false;
		for (Object testObj : testsToAdd) {
			JSONObject testToAdd = (JSONObject) testObj;
			String testToAddName = testToAdd.getString("test");
			test.description += testToAddName + ", ";
			addedTest = true;
			JSONObject objd = Helpers.parsePathToJSONObj(PathFinder.getSpecificTestPath(testToAddName));
			Test testD = Helpers.parseTest(objd, testToAddName);
			if (testD.successHook != null) {
				test.successHook = testD.successHook;
			}
			if (testD.failureHook != null) {
				test.failureHook = testD.failureHook;
			}
			testD.tasks.get(0).descriptiveName = testToAdd.getString("name");
			test.tasks.addAll(testD.tasks);
		}
		if (addedTest) {
			test.description = test.description.substring(0, test.description.length() - 2);
		}
	}
}
