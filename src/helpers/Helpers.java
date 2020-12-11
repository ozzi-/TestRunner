package helpers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.logging.Level;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import pojo.Task;
import pojo.Test;

public class Helpers {

	private static final ArrayList<String> allowedChars = new ArrayList<String>();
	private static final int pageSize = 20;

	public static long getLastModifiedTimeByPath(String pathS) {
		Path path = Paths.get(pathS);
		BasicFileAttributes attr;
		try {
			attr = Files.readAttributes(path, BasicFileAttributes.class);
			return (attr.lastModifiedTime().toMillis());
		} catch (IOException e) {
			Log.log(Level.WARNING, "Error trying to read last modified time of file " + pathS + " - " + e.getMessage()
					+ " - " + e.getCause());
		}
		return 0;
	}

	public static ArrayList<String> getAllowedSessionChars() {
		if (allowedChars.size() == 0) {
			allowedChars.addAll(getASCIICharacters(48, 57)); // 0-9
			allowedChars.addAll(getASCIICharacters(65, 90)); // A-Z
			allowedChars.addAll(getASCIICharacters(97, 122)); // a-z
		}
		return allowedChars;
	}

	public static boolean fileExistsAndReadable(String path) {
		File file = new File(path);
		try {
			if (file.isFile()) {
				return true;
			}
		} catch (Exception e) {
		}
		return false;
	}

	private static ArrayList<String> getASCIICharacters(int from, int to) {
		ArrayList<String> chars = new ArrayList<String>();
		for (int i = from; i <= to; i++) {
			chars.add(String.valueOf((char) i));
		}
		return chars;
	}

	public static SimpleDateFormat dtf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	public static String sanitizeFilename(String inputName) {
		return inputName.replaceAll("[^a-zA-Z0-9-_\\.]", "_");
	}

	public static File[] getListOfFiles(String path) {
		File folder = new File(path);
		return folder.listFiles();
	}

	public static ArrayList<String> getListOfFiles(String path, String endsWith, int page) {
		File folder = new File(path);
		File[] listOfFiles = folder.listFiles();
		ArrayList<String> listOfFilesFiltered = new ArrayList<String>();
		if (listOfFiles != null) {
			for (int i = 0; i < listOfFiles.length; i++) {
				if (listOfFiles[i].isFile() && listOfFiles[i].getName().endsWith(endsWith)) {
					listOfFilesFiltered.add(listOfFiles[i].getName());
				}
			}
		}

		if (page == -1) {
			return listOfFilesFiltered;
		} else {
			Collections.sort(listOfFilesFiltered, Collections.reverseOrder());
			ArrayList<String> result = new ArrayList<String>();
			int i = 0;
			int addedCount = 0;
			for (String name : listOfFilesFiltered) {
				if (i >= (pageSize * page)) {
					if (addedCount < pageSize) {
						result.add(name);
						addedCount++;
					}
				}
				i++;
			}
			return result;
		}
	}

	public static String readFile(String path) throws Exception {
		Log.log(Level.FINEST, "Reading file " + path);
		byte[] encoded;
		try {
			encoded = Files.readAllBytes(Paths.get(path));
		} catch (Exception e) {
			throw new Exception("Could not read file: " + path);
		}
		return new String(encoded, "UTF-8");
	}

	public static JSONObject parsePathToJSONObj(String path) throws Exception {
		String json = "";
		try {
			json = readFile(path);
		} catch (IOException e) {
			throw new Exception("Cannot load test json file in loadConfig!");
		}

		String findTrailingComma = "(\\,)(?!\\s*?[\\{\\[\\\"\\\'\\w])"; // = (\,)(?!\s*?[\{\[\"\'\w])
		Pattern p = Pattern.compile(findTrailingComma);
		Matcher m = p.matcher(json);
		if (m.find()) {
			json = m.replaceAll("");
		}

		final JSONObject obj;
		try {
			obj = new JSONObject(json);
			return obj;
		} catch (Exception e) {
			throw new Exception(
					"Error parsing test json file (" + path + ")   \"" + e.getMessage() + "\" in loadConfig");
		}
	}

	public static String getDateFromUnixTimestamp(long timestamp) {
		Date date = new Date(timestamp);
		return dtf.format(date);
	}

	public static String getDateTime() {
		return dtf.format(System.currentTimeMillis());
	}

	public static Test parseConfig(JSONObject cfg, String name) throws Exception {
		JSONObject settings;
		JSONObject test;
		Test testElem = new Test();
		Log.log(Level.FINE, "Parsing config file for " + name);
		try {
			settings = (JSONObject) cfg.get("settings");
			try {
				testElem.successHook = settings.getString("successhook");
			} catch (Exception e) {
			}
			try {
				testElem.failureHook = settings.getString("failurehook");
			} catch (Exception e) {
			}
			test = (JSONObject) cfg.get("test");
			testElem.name = name;
			testElem.description = test.getString("description");
			JSONArray tasks = (JSONArray) test.get("tasks");
			for (Object taskObj : tasks) {
				JSONObject task = (JSONObject) taskObj;
				Task taskElem = new Task();
				taskElem.name = task.getString("name");
				taskElem.path = task.getString("path");
				if (task.has("args")) {
					JSONArray args = task.getJSONArray("args");
					for (Object argObj : args) {
						taskElem.args.add(argObj.toString());
					}
				}
				if (task.has("timeout")) {
					taskElem.timeoutInSeconds = task.getInt("timeout");
				}
				testElem.tasks.add(taskElem);
			}
		} catch (Exception e) {
			if (e instanceof JSONException) {
				throw new Exception("Could not load test due to JSON error: " + e.getMessage());
			} else {
				throw new Exception("Could not load settings and / or tests from test json: " + e.getMessage());
			}
		}
		return testElem;
	}

	public static String[] getStringArray(ArrayList<String> arr) {
		int size = arr.size()==0?0:arr.size()-1;
		String str[] = new String[size];
		for (int j = 0; j < size; j++) {
			str[j] = arr.get(j);
		}
		return str;
	}
}
