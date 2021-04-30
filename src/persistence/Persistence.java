package persistence;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;
import java.util.logging.Level;

import org.apache.commons.io.FileUtils;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.LogCommand;
import org.eclipse.jgit.api.Status;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.NoHeadException;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.diff.DiffFormatter;
import org.eclipse.jgit.diff.RawTextComparator;
import org.eclipse.jgit.errors.AmbiguousObjectException;
import org.eclipse.jgit.errors.IncorrectObjectTypeException;
import org.eclipse.jgit.errors.MissingObjectException;
import org.eclipse.jgit.errors.RevisionSyntaxException;
import org.eclipse.jgit.lib.ConfigConstants;
import org.eclipse.jgit.lib.Constants;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectReader;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.treewalk.AbstractTreeIterator;
import org.eclipse.jgit.treewalk.CanonicalTreeParser;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import helpers.Helpers;
import helpers.Log;
import helpers.PathFinder;
import helpers.TRHelper;
import pojo.Commit;
import pojo.Result;
import pojo.Results;
import pojo.Test;

public class Persistence {
	
	// TODO optimize: beautify json does double parsing 
	private static Git git;
	private static boolean gitReady;
	private static int gitHistoryPageSize = 20; 
	
	public static void gitInit() throws Exception {
		
		File gitBPF = new File(PathFinder.getBasePath());
		boolean gitRepoInitialized = false;
		
	    try {
	    	git = Git.open(gitBPF);
	    	gitRepoInitialized = true;
	    	gitReady = true;
	    }catch (Exception e) {
	    	Log.log(Level.INFO, "Could not open Git Repo '"+PathFinder.getGitBasePath()+"' - assuming it is not initialized yet");
	    }
		
	    if(!gitRepoInitialized) {
	    	try {
		    	Log.log(Level.INFO, "Trying to initialize Git Repo");
	    		git = Git.init().setDirectory(gitBPF).call();
	    		git.add().addFilepattern(PathFinder.getGroupFolderName()+"/").call();
	    		git.add().addFilepattern(PathFinder.getTestFolderName()+"/").call();
	    		git.add().addFilepattern(PathFinder.getTestFolderName()+"/"+PathFinder.getScriptFolderName()+"/").call();
	    		git.add().addFilepattern(PathFinder.getResultsFolderName()+"/").call();

	    		git.commit().setMessage("initial").call();
	    		
	    	    git.getRepository().getConfig()
	    	    .setBoolean(ConfigConstants.CONFIG_CORE_SECTION, null,
	    	            ConfigConstants.CONFIG_KEY_AUTOCRLF, true);
	    	    
	    		gitReady = true;
	    	} catch (Exception e) {
	    		e.printStackTrace();
	    		Log.log(Level.SEVERE, "Cannot initialize local Git Repo due to: "+e.getMessage()+"-"+e.getCause()+" - "+e.getClass().getName());
	    	}	    	
	    }
	}
	
	public static Repository gitRepo() {
		return git.getRepository();
	}
	
	public static void gitClose() {
		git.getRepository().close();
		git.close();
		// TODO sometimes clean leaves orphan thread
		//WARNING: The web application [testrunner] appears to have started a thread named [JGit-FileStoreAttributeReader-1] but has failed to stop it. This is very likely to create a memory leak. Stack trace of thread:
		//	 sun.misc.Unsafe.park(Native Method)
		// . . . .
	}
	
	
	public static void gitCommit(String commitMessage, String author, String filePath) {
		gitCommitInternal(commitMessage, author, filePath,false);
	}
	
	public static void gitCommitRM(String commitMessage, String author, String filePath) {
		gitCommitInternal(commitMessage, author, filePath,true);
	}
	
	private static synchronized void gitCommitInternal(String commitMessage, String author, String filePath, boolean doRM) {
		String gitPath = pathToGitPath(filePath);
		if(gitReady) {
			try {
				if(doRM) {
					git.rm().addFilepattern(gitPath).call();
				}else {
					git.add().addFilepattern(gitPath).call();
				}
		        Status status = git.status().call();
		        if(status.getChanged().size()<1 && status.getRemoved().size()<1 && status.getAdded().size() <1) {
					Log.log(Level.WARNING, "Git status reports no files changed, removed or added. Something must have gone wrong for commit: "+commitMessage+" and path "+gitPath+"!");
		        }
		        git.commit().setMessage(commitMessage).setCommitter(author, "TESTRUNNER").call();
				Log.log(Level.INFO, "Git commit - \""+commitMessage+"\" - \""+gitPath+"\"");
			} catch (Exception e) {
				Log.log(Level.SEVERE, "Cannot commit to local Git Repo due to: "+e.getMessage()+"-"+e.getCause()+" - "+e.getClass().getName());
			}
		}else {
			Log.log(Level.WARNING, "Skipping Git commit \""+commitMessage+"\" due to repo not being intialized");
		}
	}

	private static String pathToGitPath(String filePath) {
		String gitPath="";
		try {
			gitPath = filePath.substring(PathFinder.getBasePath().length());
			// git doesn't like windows \
			if(File.separator.equals("\\")){
				gitPath=gitPath.replace("\\", "/");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return gitPath;
	}

	public static ArrayList<RevCommit> gitHistory(int page) throws NoHeadException, GitAPIException {
		ArrayList<RevCommit> revs = new ArrayList<RevCommit>();
		if(gitReady) {
			Iterable<RevCommit> logs = git.log().setSkip(page*gitHistoryPageSize).setMaxCount(gitHistoryPageSize).call();
			for (RevCommit rev : logs) {
				revs.add(rev);
			}
		}
		return revs;
	}	
	
	public static RevCommit getCommit(String id) {
        try {
        	RevWalk rw = new RevWalk(git.getRepository());
			RevCommit commit = rw.parseCommit(git.getRepository().resolve(id));
			rw.close();
			return commit;
		} catch (RevisionSyntaxException | IOException e) {
			Log.log(Level.WARNING, "Failed to get commit '"+id+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		} catch (NullPointerException e) {
			Log.log(Level.WARNING, "Failed to get commit '"+id+"' due to it being invalid");
	
		}
        return null;
	}
	
	public static String diffCommit(String hashID) throws IOException {
	    RevCommit newCommit = getRevByID(hashID);
	    String res = getDiffOfCommit(newCommit,false);
	    res = res.replace("\\ No newline at end of file", "");
	    return res; 
	}

	private static RevCommit getRevByID(String hashID) throws MissingObjectException, IncorrectObjectTypeException, IOException, AmbiguousObjectException {
		RevCommit newCommit;
	    try (RevWalk walk = new RevWalk(git.getRepository())) {
	        newCommit = walk.parseCommit(git.getRepository().resolve(hashID));
	    }
		return newCommit;
	}
	
	public static List<RevCommit> getCommitsForFile(String filePath) throws Exception {
		List<RevCommit> commitsList = new ArrayList<RevCommit>();
		LogCommand logCommand = git.log()
		        .add(git.getRepository().resolve(Constants.HEAD))
		        .addPath(filePath);

		for (RevCommit revCommit : logCommand.call()) {
			commitsList.add(revCommit);
		}
		return commitsList;
	}
	
	
	
	public static synchronized void revertCommit(String revertToCommit, String userName) throws Exception {		
		RevCommit toRevert = getRevByID(revertToCommit);
		ArrayList<String> toRevertFiles = getChangedFiles(toRevert);
		System.out.println(toRevertFiles.toString());
		git.checkout().addPaths(toRevertFiles).setStartPoint(toRevert).call();
		git.commit().setMessage("Reverted to commit "+revertToCommit).setCommitter(userName, "TESTRUNNER").call();
	}

	private static ArrayList<String> getChangedFiles(RevCommit toRevert) throws Exception {
	    RevCommit oldCommit = getPrevHash(toRevert);

	    ArrayList<String> filesChanges = magic(toRevert, oldCommit);
		if(filesChanges.size()==1 && filesChanges.contains("/dev/null")) {
			ObjectId id = git.getRepository().resolve(Constants.HEAD);
		    filesChanges = magic(toRevert, getCommit(id.getName()));
		}
		return filesChanges;
	}

	private static ArrayList<String> magic(RevCommit toRevert, RevCommit oldCommit) throws IOException {
		ArrayList<String> filesChanges = new ArrayList<String>();
		ByteArrayOutputStream put = new ByteArrayOutputStream(1024);
		DiffFormatter df = new DiffFormatter(put);
		df.setRepository(git.getRepository());
		df.setDiffComparator(RawTextComparator.DEFAULT);
		df.setDetectRenames(true);
		List<DiffEntry> diffs = df.scan(toRevert.getTree(), oldCommit.getTree());
		for (DiffEntry diffEntry : diffs) {
			filesChanges.add(diffEntry.getNewPath());
		}
		df.close();
		return filesChanges;
	}
	
	private static String getDiffOfCommit(RevCommit newCommit,boolean filePath) throws IOException {
	    RevCommit oldCommit = getPrevHash(newCommit);
	    
	    if(oldCommit == null){
	        return "Start of Repository";
	    }
	    AbstractTreeIterator oldTreeIterator = getCanonicalTreeParser(oldCommit);
	    AbstractTreeIterator newTreeIterator = getCanonicalTreeParser(newCommit);
	    OutputStream outputStream = new ByteArrayOutputStream();
	    try (DiffFormatter formatter = new DiffFormatter(outputStream)) {
	        formatter.setRepository(git.getRepository());
	        formatter.format(oldTreeIterator, newTreeIterator);
	    }
	    // we need to force UTF-8 otherwise the diff will have encoding issues
	    String diff = new String(outputStream.toString().getBytes("iso-8859-1"), "utf8");
	    return diff;
	}
	
	public static RevCommit getPrevHash(RevCommit commit)  throws  IOException {
	    try (RevWalk walk = new RevWalk(git.getRepository())) {
	        // Starting point
	        walk.markStart(commit);
	        int count = 0;
	        for (RevCommit rev : walk) {
	            // got the previous commit.
	            if (count == 1) {
	                return rev;
	            }
	            count++;
	        }
	        walk.dispose();
	    }
	    return null;
	    //Reached end and no previous commits -> use empty tree hash
	    //return getRevByID("4b825dc642cb6eb9a060e54bf8d69288fbee4904");
	    // this magic string could be returned by calling 'git hash-object -t tree /dev/null' - how does that work with jgit though ?
	    // https://stackoverflow.com/questions/9765453/is-gits-semi-secret-empty-tree-object-reliable-and-why-is-there-not-a-symbolic
	}
	
	
	
	// Written by Rüdiger Herrmann -> www.codeaffine.com
	private static AbstractTreeIterator getCanonicalTreeParser(ObjectId commitId) throws IOException {
	    try (RevWalk walk = new RevWalk(git.getRepository())) {
	        RevCommit commit = walk.parseCommit(commitId);
	        ObjectId treeId = commit.getTree().getId();
	        try (ObjectReader reader = git.getRepository().newObjectReader()) {
	            return new CanonicalTreeParser(null, reader, treeId);
	        }
	    }
	}
	
	public static void writeByteArrToFile(String filePath, byte[] buf, String commitMessage, String userName) throws IOException {
		FileUtils.writeByteArrayToFile(new File(filePath), buf);
		gitCommit(commitMessage,userName, filePath);
	}
	
	public static void writeUTF8StringToFile(String body, String filePath, String commitMessage, String userName)
			throws UnsupportedEncodingException, FileNotFoundException, IOException {
		Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(filePath), "UTF-8"));
		try {
			out.write(body);
		} finally {
			out.close();
			gitCommit(commitMessage,userName,filePath);
		}
	}
	
	public static String getTestRunAsJSON(Test test, Results results, String userName) {
		JsonObject res = new JsonObject();
		res.addProperty("testName", test.name);
		JsonArray commits = new JsonArray();
		for (Commit commit : test.commit) {
			JsonObject commitJO = new JsonObject();
			commitJO.addProperty("name", commit.getNameOfFile());
			commitJO.addProperty("commit", commit.getRevisionOfFile());
			commits.add(commitJO);
		}
		res.add("commits", commits);
		res.addProperty("testStartTimestamp", test.start);
		res.addProperty("testRunBy", userName);
		res.addProperty("testStartString", Helpers.getDateFromUnixTimestamp(test.start));
		res.addProperty(TRHelper.DESCRIPTION, test.description);
		
		JsonArray resultsArray = new JsonArray();
		for (Result result : results.results) {
			resultsArray.add(result.toJsonObject());
		}
		res.add("results", resultsArray);	
		
		return res.toString();
	}
	
	public static String persistTestRunAsJSONFile(Test test, Results results, boolean group, String userName) throws Exception {
		Log.log(Level.FINE, "Persisting test "+test.name+" as JSON");
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
			gitCommit("added test result for \""+test.name+"\"",userName,fullPersistencePath);
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
		if(fileName.contains("/") || fileName.contains("\\") || fileName.contains("\"") || fileName.contains("<") || fileName.contains(">")) {
			throw new Exception("Invalid file name - contains: / , \\ , <, > or \"");
		}
	}

	public static synchronized void writeTest(String testName, String body, boolean isEdit, String userName) throws Exception {
		validateFileNameSafe(testName,false);
		String savePathStrng = PathFinder.getSpecificTestPath(testName);
		Path savePath = Paths.get(savePathStrng);
		if(!isEdit && Files.exists(savePath)) {
			throw new Exception("A test with the name '"+testName+"' already exists!");
		}
		Path resultPath = Paths.get(PathFinder.getTestResultsPath(testName));
		if(!isEdit && Files.isDirectory(resultPath)) {
			throw new Exception("Results for a now deleted test '"+testName+"' already exist - please remove the test results or pick another test name");			
		}
		try {
			Files.write(savePath, beautifyJSON(body).getBytes());
			gitCommit((isEdit?"edited":"created")+" test \""+testName+"\"",userName,savePathStrng);
		}catch (Exception e) {
			throw new Exception("Could not write test '"+testName+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		}
	}

	public static void deleteTest(String testName, String userName) throws Exception {
		validateFileNameSafe(testName,false);
		String deletePath = PathFinder.getSpecificTestPath(testName);
		Files.deleteIfExists(Paths.get(deletePath));
		gitCommitRM("Deleted test \""+testName+"\"",userName,deletePath);
	}

	public static void createGroup(String groupName, String groupDescription, String userName) throws Exception {
		validateFileNameSafe(groupName,false);
		String savePathStrng = PathFinder.getSpecificGroupPath(groupName);
		Path savePath = Paths.get(savePathStrng);
		if(Files.exists(savePath)) {
			throw new Exception("A group with the name '"+groupName+"' already exists!");
		}
		try {
			JSONObject jo = new JSONObject();
			jo.put(TRHelper.DESCRIPTION, groupDescription);
			jo.put(TRHelper.TESTS, new JSONArray());
			Files.write(savePath, jo.toString().getBytes());
			gitCommit("Created group \""+groupName+"\"",userName,savePathStrng);
		}catch (Exception e) {
			throw new Exception("Could not write group '"+groupName+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		}		
	}

	public static void deleteGroup(String groupName, String userName) throws Exception {
		validateFileNameSafe(groupName,false);
		String deletePath = PathFinder.getSpecificGroupPath(groupName);
		boolean success = Files.deleteIfExists(Paths.get(deletePath));
		gitCommitRM("Deleted group \""+groupName+"\"",userName,deletePath);
		if(!success) {
			throw new Exception("Could not delete group '"+groupName+"' due to deleteIfExists returning false");
		}
	}

	public static synchronized void addToGroup(String groupName, String test, String name, String userName) throws Exception {
		validateFileNameSafe(groupName,false);
		String groupPath = PathFinder.getSpecificGroupPath(groupName);
		
		try {
			String groupContent = new String(Files.readAllBytes(Paths.get(groupPath)));
			JsonObject groupJO = JsonParser.parseString(groupContent).getAsJsonObject();
			JsonArray tests = groupJO.get(TRHelper.TESTS).getAsJsonArray();
			
			JsonObject testToAdd = new JsonObject();
			testToAdd.addProperty(TRHelper.NAME, name);
			testToAdd.addProperty(TRHelper.TEST, test);
			tests.add(testToAdd);
			
			Files.write(Paths.get(groupPath), beautifyJSON(groupJO.toString()).getBytes());
			gitCommit("Added test \""+name+"\" to group \""+groupName+"\"",userName,groupPath);

		}catch (Exception e) {
			throw new Exception("Could not edit group '"+groupName+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		}		
	}	
	
	public static synchronized void removeOfGroup(String groupName, String testNameToRemove, String userName) throws Exception {
		validateFileNameSafe(groupName,false);
		String groupPath = PathFinder.getSpecificGroupPath(groupName);
		
		try {
			String groupContent = new String(Files.readAllBytes(Paths.get(groupPath)));
			JsonObject groupJO = JsonParser.parseString(groupContent).getAsJsonObject();
			JsonArray tests = groupJO.get(TRHelper.TESTS).getAsJsonArray();
			for (int i = 0; i < tests.size(); i++) {
				String testName = tests.get(i).getAsJsonObject().get(TRHelper.TEST).getAsString();
				if(testName.equals(testNameToRemove)) {
					tests.remove(i);
				}
			}
			gitCommit("Removed test \""+testNameToRemove+"\" from group \""+groupName+"\"",userName,groupPath);
			Files.write(Paths.get(groupPath), beautifyJSON(groupJO.toString()).getBytes());
		}catch (Exception e) {
			throw new Exception("Could not remove test from group '"+groupName+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		}		
	}

	public static synchronized void removeOfCategory(String categoryName, String testNameToRemove, String userName) throws Exception {
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		
		try {
			String categoriesContent = new String(Files.readAllBytes(Paths.get(categoriesPath)));
			JsonObject categoriesJO = JsonParser.parseString(categoriesContent).getAsJsonObject();
			JsonArray testsInCategory = categoriesJO.get(categoryName).getAsJsonArray();
			System.out.println(testsInCategory.size());
			for (int i = 0; i < testsInCategory.size(); i++) {
				String testName = testsInCategory.get(i).getAsString();
				if(testName.equals(testNameToRemove)) {
					testsInCategory.remove(i);
				}
			}
			Files.write(Paths.get(categoriesPath), beautifyJSON(categoriesJO.toString()).getBytes());
			gitCommit("Removed test \""+testNameToRemove+"\" from category \""+categoryName+"\"",userName,categoriesPath);
		}catch (Exception e) {
			throw new Exception("Could not remove test from category '"+categoryName+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		}		
	}

	public static synchronized boolean addToCategory(String categoryNameToAdd, String test, String userName) throws Exception {
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		
		try {
			String categoryContent = new String(Files.readAllBytes(Paths.get(categoriesPath)));
			JsonObject categoryJO = JsonParser.parseString(categoryContent).getAsJsonObject();
			checkIfTestIsAlreadyInCategory(test, categoryJO);
			JsonArray categoriesR = categoryJO.get(categoryNameToAdd).getAsJsonArray();
			categoriesR.add(test);
			Files.write(Paths.get(categoriesPath), beautifyJSON(categoryJO.toString()).getBytes());
			gitCommit("Added test \""+test+"\" to category \""+categoryNameToAdd+"\"",userName,categoriesPath);
			return true;
		}catch (Exception e) {
			throw new Exception("Could not add '"+test+"' category '"+categoryNameToAdd+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		}
	}
	
	private static String beautifyJSON(String json) {
		return (new GsonBuilder().setPrettyPrinting().create().toJson(JsonParser.parseString(json)));
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

	public static void createCategory(String categoryNameToAdd, String userName) throws Exception {
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		JsonObject categoryJO;
		try {
			String categoryContent = new String(Files.readAllBytes(Paths.get(categoriesPath)));
			categoryJO = JsonParser.parseString(categoryContent).getAsJsonObject();
			if(categoryExists(categoryNameToAdd, categoryJO)) {
				throw new Exception("Category '"+categoryNameToAdd+"' already exists");
			}
			categoryJO.add(categoryNameToAdd, new JsonArray());
		}catch (Exception e) {
			throw new Exception("Could not create category '"+categoryNameToAdd+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		}
		try {  	
			Files.write(Paths.get(categoriesPath), beautifyJSON(categoryJO.toString()).getBytes());
			gitCommit("Created category \""+categoryNameToAdd+"\"",userName,categoriesPath);
		}catch (Exception e) {
			throw new Exception("Could not create category '"+categoryNameToAdd+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		}
	}

	private static boolean categoryExists(String categoryNameToAdd, JsonObject categoryJO) {
		return (categoryJO.get(categoryNameToAdd) != null);
	}

	public static void deleteCategory(String categoryName, String userName) throws Exception {
		String categoriesPath = PathFinder.getTestsPath() + "test.categories";
		
		try {
			String categoryContent = new String(Files.readAllBytes(Paths.get(categoriesPath)));
			JsonObject categoryJO = JsonParser.parseString(categoryContent).getAsJsonObject();
			categoryJO.remove(categoryName);
			Files.write(Paths.get(categoriesPath), beautifyJSON(categoryJO.toString()).getBytes());
			gitCommit("Deleted category \""+categoryName+"\"",userName,categoriesPath);
		}catch (Exception e) {
			throw new Exception("Could not remove category '"+categoryName+"' due to: "+e.getMessage()+" - "+e.getCause()+" - "+e.getClass().getName());
		}
	}

	public static boolean deleteFile(String filePath, String userName) {
		File fileToDelete =  new File(filePath);
		boolean fsDelRes = fileToDelete.delete();
		gitCommitRM("Deleted \""+filePath+"\"", userName, filePath);
		return fsDelRes;
	}

	public static void checkFilePermissions() throws Exception {
			boolean basePathWritable = Files.isWritable(Paths.get(PathFinder.getBasePath()));
			boolean groupsPathWritable = Files.isWritable(Paths.get(PathFinder.getGroupsPath()));
			boolean scriptsPathWritable = Files.isWritable(Paths.get(PathFinder.getScriptsFolder()));
			if(!basePathWritable || !groupsPathWritable || !scriptsPathWritable) {
				throw new Exception("Cannot write to the TestRunner directories under \""+PathFinder.getBasePath()+"\". Please make sure Tomcat has RWX permissions for all files under said directory.");
			}
	}

	public static String getCurrentCommitOfTest(String name) {
		String filePath = PathFinder.getTestFolderName()+"/"+name+PathFinder.getTestLabel();
		return getLatestCommit(filePath);
	}

	public static String getCurrentCommitOfScript(String path){		
		String filePath = PathFinder.getTestFolderName()+"/"+PathFinder.getScriptFolderName()+"/"+(path.replace("\\", "/"));
		
		return getLatestCommit(filePath);
	}
	
	private static String getLatestCommit(String filePath) {
		try {
			LogCommand logCommand = git.log().setMaxCount(1)
					.add(git.getRepository().resolve(Constants.HEAD))
					.addPath(filePath);
			
			String commit = logCommand.call().iterator().next().getName();
			return commit;
		}catch (Exception e) {
			return "<Commit could not be found due to: "+e.getClass().getName()+"-"+e.getMessage()+">";
		}
	}


}