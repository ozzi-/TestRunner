package helpers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class PathFinder {
	private static String dataLabel = ".data";
	private static String testLabel = ".test";
	private static String groupLabel = ".group";
	private static String stateLabel = ".running";
	private static String categoriesLabel = ".categories";

	private static String resultsFolder = "results";
	private static String scriptFolder = "scripts";
	private static String testFolder = "tests";
	private static String groupFolder = "groups";

	public static String getDataLabel() {
		return dataLabel;
	}
	public static String getTestLabel() {
		return testLabel;
	}
	public static String getCategoriesLabel() {
		return categoriesLabel;
	}
	public static String getGroupLabel() {
		return groupLabel;
	}
	public static String getResultsFolderName() {
		return resultsFolder;
	}
	public static String getTestFolderName() {
		return testFolder;
	}
	public static String getGroupFolderName() {
		return groupFolder;
	}	
	public static String getScriptFolderName() {
		return scriptFolder;
	}
	
	public static boolean isPathSafe(String filePathStrng, String basePath) throws Exception, IOException {
		try {
			java.io.File filePath = new java.io.File(filePathStrng);
			java.nio.file.Path normalizedFilePath = filePath.toPath().toAbsolutePath().normalize();
			normalizedFilePath.toFile(); // might throw a invalidPathException
			return (normalizedFilePath.startsWith(basePath));		
		}catch (Exception e) {
			return false;
		}
	}
	
	
	/**
	 * @return i.E: "C:\Users\TR\Desktop\"
	 */
	public static String getBasePath() throws Exception {
		String basePath ="";
		if(System.getProperty("os.name").toLowerCase().contains("windows")) {
			basePath = System.getenv("APPDATA")+File.separator+"TR"+File.separator;
		}else {
			basePath = "/var/lib/TR/";
		}
		createFolderPath(basePath);
		return basePath;
	}
	
	/**
	 * @return i.E: "C:\Users\TR\Desktop\.git"
	 */
	public static String getGitBasePath() throws Exception {
		String bp = getBasePath();
		return bp+".git";
	}


	
	/**
	 * @return "C:\Users\TR\Desktop\tests\"
	 */
	public static String getTestsPath() throws Exception {
		String pathString = getBasePath()+testFolder+File.separator;
		createFolderPath(pathString);
		return pathString;
	}
	
	/**
	 * @return "C:\Users\TR\Desktop\groups\"
	 */
	public static String getGroupsPath() throws Exception {
		String pathString = getBasePath()+groupFolder+File.separator;
		createFolderPath(pathString);
		return pathString;
	}

	/**
	 * @return "C:\Users\TR\Desktop\tests\[name].test"
	 */
	public static String getSpecificTestPath(String testName) throws Exception {
		return getTestsPath() + testName + testLabel;
	}

	/**
	 * @return "C:\Users\TR\Desktop\groups\[name].group"
	 */
	public static String getSpecificGroupPath(String groupName) throws Exception {
		return getGroupsPath() + groupName + groupLabel;
	}

	
	/**
	 * @return "C:\Users\TR\Desktop\results\[name]\"
	 */
	public static String getTestResultsPath (String testName) throws Exception {
		String path = getBasePath() + resultsFolder + File.separator + testName + File.separator;
		return path;
	}
	
	/**
	 * @return "C:\Users\TR\Desktop\results\groups\[name]\"
	 */	
	public static String getGroupTestResultsPath(String groupName) throws Exception {
		String path = getBasePath() + resultsFolder + File.separator + groupFolder + File.separator + groupName + File.separator;
		return path;
	}
	

	/**
	 * @return "C:\Users\TR\Desktop\results\[name]\[handle].data"
	 * @throws Exception 
	 */
	public static String getSpecificTestResultPath(String testName, String handle, boolean createPath) throws Exception {
		String path = getTestResultsPath(testName);
		if (createPath) {
			createFolderPath(path);
		}
		return path + handle + dataLabel;
	}
	
	/**
	 * @return "C:\Users\TR\Desktop\results\groups\[name]\[handle].data"
	 * @throws Exception 
	 */
	public static String getSpecificTestGroupResultPath(String groupName, String handle, boolean createPath) throws Exception {
		String path = getGroupTestResultsPath(groupName);
		if (createPath) {
			createFolderPath(path);
		}
		return path + handle + dataLabel;
	}

	/**
	 * @return "C:\Users\TR\Desktop\results\[name]\[handle].status"
	 * @throws Exception 
	 */
	public static String getSpecificTestResultStatusPath(String testName, String handle, boolean createPath) throws Exception {
		String path = getTestResultsPath(testName);
		if (createPath) {
			createFolderPath(path);
		}
		return path + handle + stateLabel;
	}
	
	/**
	 * @return "C:\Users\TR\Desktop\results\groups\[name]\[handle].status"
	 * @throws Exception 
	 */
	public static String getSpecificTestGroupResultStatusPath(String testName, String handle, boolean createPath) throws Exception {		
		String path = getGroupTestResultsPath(testName);
		if (createPath) {
			createFolderPath(path);
		}
		return path + handle + stateLabel;
	}
	
	/**
	 * @return 
	 * @return "C:\Users\TR\Desktop\tests\scripts\"
	 * @throws Exception 
	 */
	public static String getScriptsFolder() throws Exception {
		String path = getBasePath() + testFolder + File.separator + scriptFolder + File.separator;
		try {
			Files.createDirectories(Paths.get(path));
		} catch (IOException e) {
			throw new Exception("Could not greate path '"+path+"' - due to: "+e.getMessage());
		}
		return path;
	}
	

	public static void createFolderPath(String pathString) throws Exception {
		Path path = Paths.get(pathString);
		try {
			Files.createDirectories(path);
		} catch (IOException e) {
			throw new Exception("Could not greate path '"+pathString+"' - due to: "+e.getMessage());
		}
	}
	
	public static String getCategoriesFilePath() throws Exception {
		String categoriesFilePath = PathFinder.getTestsPath() + "test"+categoriesLabel;
		File categoriesFile = new File(categoriesFilePath);
		if(!categoriesFile.isFile()) {
			Files.write(Paths.get(categoriesFilePath), "{}".getBytes());
		}
		return categoriesFilePath;
	}
	
	public static String getLogPath() throws Exception {
		return getBasePath()+"logs"+File.separator;
	}

}
