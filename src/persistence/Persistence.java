package persistence;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map.Entry;
import java.util.Set;
import java.util.logging.Level;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import helpers.Helpers;
import helpers.Log;
import helpers.PathFinder;
import pojo.Result;
import pojo.Results;
import pojo.Test;

public class Persistence {
	public static String getTestRunAsJSON(Test test, Results results, String userName) {
		JsonObject res = new JsonObject();
		Log.log(Level.FINE, "Persisting test "+test.name+" as JSON");
		res.addProperty("testName", test.name);
		res.addProperty("testStartTimestamp", test.start);
		res.addProperty("testRunBy", userName);
		res.addProperty("testStartString", Helpers.getDateFromUnixTimestamp(test.start));
		res.addProperty("description", test.description);
		
		JsonArray resultsArray = new JsonArray();
		for (Result result : results.results) {
			resultsArray.add(result.toJsonObject());
		}
		res.add("results", resultsArray);	
		
		return res.toString();
	}
	
	public static String persistTestRunAsJSONFile(Test test, Results results, boolean group, String userName) throws Exception {
		String json = getTestRunAsJSON(test, results, userName);
		String handle = String.valueOf(test.start);
		String fullPersistencePath;
		String tag = test.tag.equals("")?"":"_"+test.tag;
		if(group) {
			fullPersistencePath = PathFinder.getSpecificTestGroupResultPath(test.name, String.valueOf(test.start)+tag,true);
		}else {
			fullPersistencePath = PathFinder.getSpecificTestResultPath(test.name, String.valueOf(test.start)+tag,true);			
		}
		Log.log(Level.FINE, "Trying to persist as json file");
        try {
			Files.write(Paths.get(fullPersistencePath), json.getBytes());
			Log.log(Level.FINE, "Success persisting as json file ("+fullPersistencePath+")");
		} catch (IOException e) {
			System.err.println("Error while trying to persist results under '"+fullPersistencePath+"'. Reason: "+e.getClass().getCanonicalName());
			System.exit(4);
		}
        
        String fullPersistencePathRunning; 
        if(group) {
        	fullPersistencePathRunning = PathFinder.getSpecificTestGroupResultStatusPath(test.name, handle+tag, true);        	
        }else {
        	fullPersistencePathRunning = PathFinder.getSpecificTestResultStatusPath(test.name, handle+tag, true);
        }
		File runningFile = new File(fullPersistencePathRunning);
		Log.log(Level.FINE, "Deleting running file");
		runningFile.delete();
		
        return fullPersistencePath;
	}
	
	public static void validateFileNameSafe(String fileName, boolean singleDotAllowed) throws Exception {
		if(singleDotAllowed && fileName.contains("..")) {
			throw new Exception("Invalid file name - contains: .. ");
		}else if(!singleDotAllowed  && fileName.contains(".")) {
			throw new Exception("Invalid file name - contains: . ");
		}
	
		if(fileName.contains("/") || fileName.contains("\\")) {
			throw new Exception("Invalid file name - contains: / or \\");
		}
	}

	public static synchronized void writeTest(String testName, String body) throws Exception {
		validateFileNameSafe(testName,false);
		String savePathStrng = PathFinder.getSpecificTestPath(testName);
		Path savePath = Paths.get(savePathStrng);
		if(Files.exists(savePath)) {
			throw new Exception("A test with the name '"+testName+"' already exists!");
		}
		Path resultPath = Paths.get(PathFinder.getTestResultsPath(testName));
		if(Files.isDirectory(resultPath)) {
			throw new Exception("Results for a now deleted test '"+testName+"' already exist - please remove the test results or pick another test name");			
		}
		try {
			Files.write(savePath, body.getBytes());			
		}catch (Exception e) {
			throw new Exception("Could not write test '"+testName+"' due to: "+e.getMessage()+" - "+e.getCause());
		}
	}

	public static void deleteTest(String testName) throws Exception {
		validateFileNameSafe(testName,false);
		String deletePath = PathFinder.getSpecificTestPath(testName);
		Files.deleteIfExists(Paths.get(deletePath));
	}

	public static void createGroup(String groupName) throws Exception {
		validateFileNameSafe(groupName,false);
		String savePathStrng = PathFinder.getSpecificGroupPath(groupName);
		Path savePath = Paths.get(savePathStrng);
		if(Files.exists(savePath)) {
			throw new Exception("A group with the name '"+groupName+"' already exists!");
		}
		try {
			Files.write(savePath, "{\"description\":\"\",\"tests\":[]}".getBytes());	
		}catch (Exception e) {
			throw new Exception("Could not write group '"+groupName+"' due to: "+e.getMessage()+" - "+e.getCause());
		}		
	}

	public static void deleteGroup(String groupName) throws Exception {
		validateFileNameSafe(groupName,false);
		String deletePath = PathFinder.getSpecificGroupPath(groupName);
		boolean success = Files.deleteIfExists(Paths.get(deletePath));
		if(!success) {
			throw new Exception("Could not delete group '"+groupName+"' due to deleteIfExists returning false");
		}
	}

	public static void addToGroup(String groupName, String test, String name) throws Exception {
		validateFileNameSafe(groupName,false);
		String groupPath = PathFinder.getSpecificGroupPath(groupName);
		
		try {
			String groupContent = new String(Files.readAllBytes(Paths.get(groupPath)));
			JsonObject groupJO =  new JsonParser().parse(groupContent).getAsJsonObject();
			JsonArray tests = groupJO.get("tests").getAsJsonArray();
			
			JsonObject testToAdd = new JsonObject();
			testToAdd.addProperty("name", name);
			testToAdd.addProperty("test", test);
			tests.add(testToAdd);
			
			Files.write(Paths.get(groupPath), groupJO.toString().getBytes());
		}catch (Exception e) {
			throw new Exception("Could not edit group '"+groupName+"' due to: "+e.getMessage()+" - "+e.getCause());
		}		
	}	
	
	public static void removeOfGroup(String groupName, String testNameToRemove) throws Exception {
		validateFileNameSafe(groupName,false);
		String groupPath = PathFinder.getSpecificGroupPath(groupName);
		
		try {
			String groupContent = new String(Files.readAllBytes(Paths.get(groupPath)));
			JsonObject groupJO =  new JsonParser().parse(groupContent).getAsJsonObject();
			JsonArray tests = groupJO.get("tests").getAsJsonArray();
			for (int i = 0; i < tests.size(); i++) {
				String testName = tests.get(i).getAsJsonObject().get("test").getAsString();
				if(testName.equals(testNameToRemove)) {
					tests.remove(i);
				}
			}
	
			Files.write(Paths.get(groupPath), groupJO.toString().getBytes());
		}catch (Exception e) {
			throw new Exception("Could not remove test from group '"+groupName+"' due to: "+e.getMessage()+" - "+e.getCause());
		}		
	}

	public static void removeOfCategory(String categoryName, String testNameToRemove) throws Exception {
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		
		try {
			String categoriesContent = new String(Files.readAllBytes(Paths.get(categoriesPath)));
			JsonObject categoriesJO =  new JsonParser().parse(categoriesContent).getAsJsonObject();
			JsonArray testsInCategory = categoriesJO.get(categoryName).getAsJsonArray();
			System.out.println(testsInCategory.size());
			for (int i = 0; i < testsInCategory.size(); i++) {
				String testName = testsInCategory.get(i).getAsString();
				if(testName.equals(testNameToRemove)) {
					testsInCategory.remove(i);
				}
			}
	
			Files.write(Paths.get(categoriesPath), categoriesJO.toString().getBytes());
		}catch (Exception e) {
			throw new Exception("Could not remove test from category '"+categoryName+"' due to: "+e.getMessage()+" - "+e.getCause());
		}		
	}

	public static boolean addToCategory(String categoryNameToAdd, String test) throws Exception {
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		
		try {
			String categoryContent = new String(Files.readAllBytes(Paths.get(categoriesPath)));
			JsonObject categoryJO =  new JsonParser().parse(categoryContent).getAsJsonObject();
			checkIfTestIsAlreadyInCategory(test, categoryJO);
			JsonArray categoriesR = categoryJO.get(categoryNameToAdd).getAsJsonArray();
			categoriesR.add(test);
			Files.write(Paths.get(categoriesPath), categoryJO.toString().getBytes());
			return true;
		}catch (Exception e) {
			throw new Exception("Could not add '"+test+"' category '"+categoryNameToAdd+"' due to: "+e.getMessage()+" - "+e.getCause());
		}
	}

	private static void checkIfTestIsAlreadyInCategory(String test, JsonObject categoryJO) throws Exception {
		Set<Entry<String, JsonElement>> categories = categoryJO.entrySet();
		for (Entry<String, JsonElement> category : categories) {
			String categoryName =  category.getKey();
			JsonArray testsInCategory = category.getValue().getAsJsonArray();
			for (JsonElement testInCategory : testsInCategory) {
				if(testInCategory.getAsString().equals(test)) {
					throw new Exception("test \""+test+"\" is already part of category \""+categoryName+"\"");
				}
			}
		}
	}

	public static void createCategory(String categoryNameToAdd) throws Exception {
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		JsonObject categoryJO;
		try {
			String categoryContent = new String(Files.readAllBytes(Paths.get(categoriesPath)));
			categoryJO =  new JsonParser().parse(categoryContent).getAsJsonObject();
			categoryJO.add(categoryNameToAdd, new JsonArray());
		}catch (Exception e) {
			throw new Exception("Could not create category '"+categoryNameToAdd+"' due to: "+e.getMessage()+" - "+e.getCause());
		}
		if(categoryExists(categoryNameToAdd, categoryJO)) {
			throw new Exception("Category '"+categoryNameToAdd+"' already exists");
		}
		try {  	
			Files.write(Paths.get(categoriesPath), categoryJO.toString().getBytes());
		}catch (Exception e) {
			throw new Exception("Could not create category '"+categoryNameToAdd+"' due to: "+e.getMessage()+" - "+e.getCause());
		}
	}

	private static boolean categoryExists(String categoryNameToAdd, JsonObject categoryJO) {
		return (categoryJO.get(categoryNameToAdd) != null);
	}

	public static void deleteCategory(String categoryName) throws Exception {
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		
		try {
			String categoryContent = new String(Files.readAllBytes(Paths.get(categoriesPath)));
			JsonObject categoryJO =  new JsonParser().parse(categoryContent).getAsJsonObject();
			categoryJO.remove(categoryName);
			Files.write(Paths.get(categoriesPath), categoryJO.toString().getBytes());
		}catch (Exception e) {
			throw new Exception("Could not remove category '"+categoryName+"' due to: "+e.getMessage()+" - "+e.getCause());
		}
	}	
}