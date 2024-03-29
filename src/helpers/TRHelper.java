package helpers;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;

import jakarta.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.MalformedJsonException;

import persistence.Persistence;
import pojo.Commit;
import pojo.GroupTestAbstraction;
import pojo.LastRunCache;
import pojo.Task;
import pojo.Test;
import pojo.TestCategoriesList;
import service.CacheService;
import testrunner.Testing;

public class TRHelper {
	public static final String DESCRIPTION = "description";
	public static final String PASSED = "passed";
	public static final String NAME = "name";
	public static final String TEST = "test";
	public static final String TESTS = "tests";
	public static final String TASKS = "tasks";
	public static final String ARGS = "args";
	public static final String PATH = "path";
	public static final String TIMEOUT = "timeout";
	public static final String RUN_TIME_IN_MS = "runTimeInMS";
	public static final String LAST_RUN_DATE = "lastRunDate";
	public static final String LAST_RUN_PASSED = "lastRunPassed";
	public static final String TOTAL_RUN_TIME_IN_MS = "totalRunTimeInMS";
	public static final String SUCCESS_HOOK = "successHook";
	public static final String FAILURE_HOOK = "failureHook";
	public static final String SETTINGS = "settings";
	public static final String ARCHIVEPATH = "archivePath";
	public static final String ARCHIVENAME = "archiveName";

	/**
	 * 
	 * @return test categories and their associated tests as a JSON array
	 * @throws Exception
	 */
	public static TestCategoriesList getTestCategories() throws Exception {		
		String categoriesPath = PathFinder.getCategoriesFilePath();
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
				categories = JsonParser.parseString(file).getAsJsonObject();
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
	 * @return 
	 * @throws Exception
	 * @throws IOException
	 */
	public static String createRunningFile(String testName, String testTag, long handle, boolean group) throws Exception {
		String basePath;
		String tag = testTag.equals("") ? "" : "_" + testTag;

		if (group) {
			basePath = PathFinder.getSpecificTestGroupResultStatusPath(testName, String.valueOf(handle) + tag, true);
		} else {
			basePath = PathFinder.getSpecificTestResultStatusPath(testName, String.valueOf(handle) + tag, true);
		}
		File runningFile = new File(basePath);
		try {
			runningFile.createNewFile();
		} catch (IOException e) {
			throw new Exception("Could not create running file: " + e.getMessage() + " - " + basePath);
		}
		return basePath;
	}

	public static JsonObject runTestInternal(String testName, String userName, String tag, String args) throws Exception {
		Log.log(Level.INFO, "User " + userName + " running test " + testName + " with tag = " + tag + " and additional args = " + args);
		Settings.getSingleton().setRunningCount(Settings.getSingleton().getRunningCount()+1);
		long handle = System.currentTimeMillis(); 
		String runningFilePath = createRunningFile(testName,tag,handle,false);

		new Thread(() -> {
			try {
				JSONObject obj = Helpers.parsePathToJSONObj(PathFinder.getSpecificTestPath(testName));
				Test test = Helpers.parseTest(obj, testName,true);
				
				ArrayList<Task> tasks = test.tasks;
				for (Task task : tasks) {
					ArrayList<String> argsList = task.args;
					if(args!="") {
						Collections.addAll(argsList, args.split("\\s+"));
						Log.log(Level.FINEST, "Added " + (Arrays.toString(args.split("\\s+"))) + " command line args to task '"+task.name+"' of test '" + testName+"'");				
					}
				}
				test.tag = tag;
				test.start = handle;
				Testing.runTestInThread(test, false, userName);
			}catch (Exception e) {
				String exception = "Exception occured during test preparation - "+e.getClass().getName()+": "+e.getMessage();
				try {
					Persistence.writeUTF8StringToFile(exception, runningFilePath);
				} catch (Exception e1) {
					e1.printStackTrace();
				}
			}
		}).start();
		

		JsonObject resp = new JsonObject();
		resp.addProperty(NAME, testName);
		resp.addProperty("handle", String.valueOf(handle));
		
		return resp;
	}

	public static JsonObject runGroupInternal(String groupName, String userName, String tag, String args) throws Exception {
		Log.log(Level.INFO, "User " + userName + " running group test " + groupName + " with tag = " + tag + " and addtional args = " + args);
		Settings.getSingleton().setRunningCount(Settings.getSingleton().getRunningCount()+1);
		
		long handle = System.currentTimeMillis(); 
		String runningFilePath = createRunningFile(groupName,tag,handle,true);

		new Thread(() -> {
			try {
				JSONObject group = Helpers.parsePathToJSONObj(PathFinder.getSpecificGroupPath(groupName));
				JSONArray tests = (JSONArray) group.get(TESTS);
				Test test = new Test();
				// TODO refactor gathering commits:
				for (Object testObj : tests) {
					JSONObject testToAdd = (JSONObject) testObj;
					String testToAddName = testToAdd.getString(TEST);
					test.commit.add(new Commit(testToAddName, Persistence.getCurrentCommitOfTest(testToAddName)));
				}
				
				test.description = "Group Test '" + groupName + "' consisting of tests: ";
				test.name = groupName;
				test.tag = tag;
				test.start = handle;
				
				mergeTestsToGroupTest(tests, test);
				ArrayList<Task> tasks = test.tasks;
				for (Task task : tasks) {
					ArrayList<String> argsList = task.args;
					if(args!="") {
						Collections.addAll(argsList, args.split("\\s+"));
						Log.log(Level.FINEST, "Added " + (Arrays.toString(args.split("\\s+"))) + " command line args to test " + groupName);				
					}
				}
				Testing.runTestInThread(test, true, userName);
			}catch (Exception e) {
				String exception = "Exception occured during test preparation - "+e.getClass().getName()+": "+e.getMessage();
				try {
					Persistence.writeUTF8StringToFile(exception, runningFilePath);
				} catch (Exception e1) {
					e1.printStackTrace();
				}
			}
		}).start();
		
		JsonObject resp = new JsonObject();
		resp.addProperty(NAME, groupName);
		resp.addProperty("handle", handle);
		return resp;
	}

	/**
	 * Mergers multiple tests into one, this is used for test groups
	 * @param tests
	 * @param groupName
	 * @return a group json element consisting of all tests passed to it
	 * @throws Exception 
	 */
	public static JsonElement mergeTests(ArrayList<JsonElement> tests, String groupName) throws Exception {
		JsonObject merged = new JsonObject();
		JsonObject settingsObj = new JsonObject();
		JsonObject testObj = new JsonObject();
		JsonArray tasksArr = new JsonArray();

		JsonElement finalSuccessHook = null;
		JsonElement finalFailureHook = null;
		String description = "Group Test '" + groupName + "'";

		for (JsonElement test : tests) {
			JsonObject testJO = null;
			try {
				testJO = test.getAsJsonObject();
			}catch (Exception e) {
				throw new Exception("Failed to merge tests to group \""+groupName+"\" due to json error \"" + e.getMessage() + "\" in TRHelper");
			}
			
			JsonElement successHook = testJO.get(SETTINGS).getAsJsonObject().get(TRHelper.SUCCESS_HOOK);
			JsonElement failureHook = testJO.get(SETTINGS).getAsJsonObject().get(TRHelper.FAILURE_HOOK);
			if (successHook != null) {
				finalSuccessHook = successHook;
			}
			if (failureHook != null) {
				finalFailureHook = failureHook;
			}
			JsonArray tasks = testJO.get(TEST).getAsJsonObject().get(TASKS).getAsJsonArray();
			for (JsonElement task : tasks) {
				tasksArr.add(task);
			}
		}
		if (finalSuccessHook != null) {
			settingsObj.add(TRHelper.SUCCESS_HOOK, finalSuccessHook);
		}
		if (finalFailureHook != null) {
			settingsObj.add(TRHelper.FAILURE_HOOK, finalFailureHook);
		}
		testObj.addProperty(TRHelper.DESCRIPTION, description);
		merged.add(SETTINGS, settingsObj);
		testObj.add(TASKS, tasksArr);
		merged.add(TEST, testObj);
		return merged;
	}

	/**
	 * 
	 * @param path on FS
	 * @return a WS response with the test result as json body
	 * @throws Exception
	 */
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
			String runningFileContent = Helpers.readFile(runningFile.toString());
			if(runningFileContent.equals("")) {
				state = "running";				
			}else {
				state = runningFileContent;
			}
		} else if (dataFile.exists()) {
			state = "done";
		} else {
			Log.log(Level.WARNING, "Could not find running or result file for test - "+pathRunning+"-"+path);
			throw new Exception("Could not determine status as neither running nor result file exist!");
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
			JsonElement resultJson = JsonParser.parseString(Helpers.readFile(resultPath));
			result.addProperty("handle", handle);

			result.add("result", resultJson);
			resultsArray.add(result);
		}
	}

	private static String getDescriptionOfGroup(String groupName) throws Exception {
		String path = PathFinder.getSpecificGroupPath(groupName);
		String result = Helpers.readFile(path);
		JsonElement jsonElement = JsonParser.parseString(result);
		return jsonElement.getAsJsonObject().get(TRHelper.DESCRIPTION).getAsString();
	}

	public static JsonObject parseTestGroup(String name, String content) throws Exception {
		JsonObject testGroup = new JsonObject();
		JsonArray testGroupTests = new JsonArray();
		JsonObject test;
		try {
			test = JsonParser.parseString(content).getAsJsonObject();
		} catch (Exception e) {
			throw new Exception("Error parsing test group \"" + name + "\" - " + e.getMessage());
		}
		String groupName = name.substring(0, name.length() - PathFinder.getGroupLabel().length());
		testGroup.addProperty(NAME, groupName);
		testGroup.addProperty(TRHelper.DESCRIPTION, getDescriptionOfGroup(groupName));

		ArrayList<String> listResults = Helpers.getListOfFiles(PathFinder.getGroupTestResultsPath(groupName), PathFinder.getDataLabel(), -1);
		String lastRunDate = "";
		boolean passed = true;
		long totalRunTimeInMS = 0;
		
		// note name already contains the postfix  ".group" 
		LastRunCache lrc = CacheService.getLastRunEntry(name); 
		if(lrc!=null) {
			testGroup.addProperty(TOTAL_RUN_TIME_IN_MS, lrc.getTotalRunTimeInMS());
			testGroup.addProperty(LAST_RUN_DATE, lrc.getLastRunDate());
			testGroup.addProperty(LAST_RUN_PASSED, lrc.didLastRunPass());
		}else {
			if (listResults.size() > 0) {
				String newest = getNewest(listResults);
				String path = PathFinder.getSpecificTestGroupResultPath(groupName, newest, false);
				String lastRun = Helpers.readFile(path);
				JsonObject lastRunJO = JsonParser.parseString(lastRun).getAsJsonObject();
				lastRunDate = lastRunJO.get("testStartString").getAsString();
				JsonArray lastRunResults = lastRunJO.get("results").getAsJsonArray();
				passed = true;
				for (JsonElement lastRunResult : lastRunResults) {
					totalRunTimeInMS += lastRunResult.getAsJsonObject().get(RUN_TIME_IN_MS).getAsLong();
					if (lastRunResult.getAsJsonObject().get(PASSED).getAsString().equals("false")) {
						passed = false;
					}
				}
			}
			testGroup.addProperty(LAST_RUN_DATE, lastRunDate);
			testGroup.addProperty(LAST_RUN_PASSED, passed);
			testGroup.addProperty(TOTAL_RUN_TIME_IN_MS, totalRunTimeInMS);
			CacheService.addLastRunEntry(name, new LastRunCache(totalRunTimeInMS, lastRunDate, passed));
		}
		
		JsonArray tests = (JsonArray) test.get(TESTS);
		for (Object testObj : tests) {
			JsonObject testO = (JsonObject) testObj;
			testGroupTests.add(testO);
		}
		testGroup.add(TESTS, testGroupTests);
		return testGroup;
	}

	public static void enrichLastRunData(JsonObject test, String testName, ArrayList<String> listResults) throws Exception {
		boolean passed = true;
		String lastRunDate = "";
		long totalRunTimeInMS = 0;
		
		LastRunCache lrc = CacheService.getLastRunEntry(testName);
		if(lrc!=null) {
			test.addProperty(TOTAL_RUN_TIME_IN_MS, lrc.getTotalRunTimeInMS());
			test.addProperty(LAST_RUN_DATE, lrc.getLastRunDate());
			test.addProperty(LAST_RUN_PASSED, lrc.didLastRunPass());
			return;
		}
		
		if (listResults.size() > 0) {
			String newest = getNewest(listResults);
			String handle = String.valueOf(newest);
			String path = PathFinder.getSpecificTestResultPath(testName, handle, false);
			String lastRun = Helpers.readFile(path);
			JsonObject lastRunJO = JsonParser.parseString(lastRun).getAsJsonObject();
			lastRunDate = lastRunJO.get("testStartString").getAsString();
			JsonArray lastRunResults = lastRunJO.get("results").getAsJsonArray();
			passed = true;
			for (JsonElement lastRunResult : lastRunResults) {
				totalRunTimeInMS += lastRunResult.getAsJsonObject().get(RUN_TIME_IN_MS).getAsLong();
				if (lastRunResult.getAsJsonObject().get(PASSED).getAsString().equals("false")) {
					passed = false;
				}
			}
		}
		test.addProperty(TOTAL_RUN_TIME_IN_MS, totalRunTimeInMS);
		test.addProperty(LAST_RUN_DATE, lastRunDate);
		test.addProperty(LAST_RUN_PASSED, passed);
		
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
		ArrayList<JsonElement> elements = new ArrayList<JsonElement>();
		for (GroupTestAbstraction gtaObj : gta) {
			String testContent;
			try {
				testContent = Helpers.readFile(gtaObj.getPath());
			} catch (Exception e) {
				throw new Exception("Cannot load group due to an error reading one of its test: " + e.getMessage());
			}
			JsonElement testContentJSON = JsonParser.parseString(testContent);
			elements.add(testContentJSON);
		}
		return elements;
	}

	public static ArrayList<GroupTestAbstraction> getTestInfoByGroupName(String groupName) throws Exception {
		String path = PathFinder.getSpecificGroupPath(groupName);
		String result = Helpers.readFile(path);
		ArrayList<GroupTestAbstraction> paths = new ArrayList<GroupTestAbstraction>();

		JsonElement jsonElement = JsonParser.parseString(result);
		JsonArray groupTestsArray = jsonElement.getAsJsonObject().get(TESTS).getAsJsonArray();
		for (JsonElement testElement : groupTestsArray) {
			String testName = testElement.getAsJsonObject().get(TEST).getAsString();
			String descriptiveName = testElement.getAsJsonObject().get(NAME).getAsString();
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
			String testToAddName = testToAdd.getString(TEST);
			test.description += testToAddName + ", ";
			addedTest = true;
			JSONObject objd = Helpers.parsePathToJSONObj(PathFinder.getSpecificTestPath(testToAddName));
			Test testD = Helpers.parseTest(objd, testToAddName,true);
			if (testD.successHook != null) {
				test.successHook = testD.successHook;
			}
			if (testD.failureHook != null) {
				test.failureHook = testD.failureHook;
			}
			testD.tasks.get(0).descriptiveName = testToAdd.getString(NAME);
			test.tasks.addAll(testD.tasks);
		}
		if (addedTest) {
			test.description = test.description.substring(0, test.description.length() - 2);
		}
	}
}
