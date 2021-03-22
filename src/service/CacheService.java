package service;

import java.util.HashMap;
import java.util.logging.Level;

import helpers.Log;
import pojo.LastRunCache;
import pojo.TestCategoriesList;

public class CacheService {
	
	
	static TestCategoriesList tclCache;
	static long tclCacheAge;

	static HashMap<String, LastRunCache> lastRunCache = new HashMap<String, LastRunCache>();
	
	public static void addLastRunEntry(String testName, LastRunCache lrcToAdd) {
		lastRunCache.put(testName, lrcToAdd);
		Log.log(Level.FINEST, "Added "+testName+" to last run cache - current cache size = "+lastRunCache.size());
	}

	public static LastRunCache getLastRunEntry(String testName) {
		LastRunCache lrc = lastRunCache.get(testName);
		return lrc;
	}
	
	public static void expireLastRunEntry(String testName) {
		lastRunCache.remove(testName);
		Log.log(Level.FINEST, "Removing last run entry for "+testName+" as it expired.");
	}

	public static TestCategoriesList getTestCategories(long lastModified) {
		if(lastModified>tclCacheAge) {
			Log.log(Level.FINEST, "Won't return test categories cache as it expired.");
			return null;			
		}
		Log.log(Level.FINEST, "Returning test categories cache");
		return tclCache;
	}
	
	public static void setTestCategories(TestCategoriesList tcl, long lastModified) {
		Log.log(Level.FINEST, "Updating test categories cache");
		tclCache=tcl;
		tclCacheAge=lastModified;
	}
}