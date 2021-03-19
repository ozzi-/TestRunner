package persistence;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Level;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

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
	
	public static void validateFileNameSafe(String fileName) throws Exception {
		if(fileName.contains(".") || fileName.contains("/") || fileName.contains("\\")) {
			throw new Exception("Invalid file name - contains . / \\");
		}
	}

	public static synchronized void writeTest(String testName, String body) throws Exception {
		validateFileNameSafe(testName);
		String savePath = PathFinder.getSpecificTestPath(testName);
		try {
			Files.write(Paths.get(savePath), body.getBytes());			
		}catch (Exception e) {
			throw new Exception("Could not write test '"+testName+"' due to: "+e.getMessage()+" - "+e.getCause());
		}
	}

	public static void deleteTest(String testName) throws Exception {
		validateFileNameSafe(testName);
		String deletePath = PathFinder.getSpecificTestPath(testName);
		Files.deleteIfExists(Paths.get(deletePath));
	}	
}