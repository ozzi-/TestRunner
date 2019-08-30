package service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.logging.Level;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import helpers.Crypto;
import helpers.Helpers;
import helpers.Log;
import helpers.PathFinder;
import pojo.User;

public class UserManagement {
	public static ArrayList<User> users = new ArrayList<User>();
	private static final String defaultAdminUsername = "admin";
	private static final String defaultAdminPassword = "letmein";
	private static final int saltLength = 10;

	public static User parseUserLoginJSON(String userJson) throws Exception {
		JsonElement userJO;
		try {
			userJO =  new JsonParser().parse(userJson).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing login json - "+e.getMessage());
		}
		User user = new User();
		try {
			user.setUsername(userJO.getAsJsonObject().get("username").getAsString());
			user.setPasswordRaw(userJO.getAsJsonObject().get("password").getAsString());
		}catch (Exception e) {
			throw new Exception("Error parsing username / password - JSON keys not found");
		}
		return user;
	}
	
	public static User createUserObjByBodyJSON(String userJson) throws Exception {
		JsonElement userJO;
		try {
			userJO =  new JsonParser().parse(userJson).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing user json - "+e.getMessage());
		}
		User user = new User();
		try {
			user.setSalt(Crypto.createSalt(saltLength)); 
			user.setUsername(userJO.getAsJsonObject().get("username").getAsString());
			user.setPassword(userJO.getAsJsonObject().get("password").getAsString());
			user.setRole(userJO.getAsJsonObject().get("role").getAsString());
		}catch (Exception e) {
			throw new Exception("Error parsing username / password / role - keys not found");
		}
		return user;
	}
	
	public static synchronized void changePassword(String username, String password) throws Exception {
		Log.log(Level.FINE, "Changing password for user '"+username+"'");
		SessionManagement.destorySessionByUserName(username);
		boolean changed = false;
		for (User user : users) {
			if(user.getUsername().equals(username)) {
				user.setSalt(Crypto.createSalt(saltLength)); 
				user.setPassword(password);
				persistUsers();
				changed=true;
			}
		}
		if(!changed) {
			throw new Exception("User '"+username+"' not found, could not change password");
		}
	}
	
	public static synchronized void addUser(User userToAdd) throws Exception {
		Log.log(Level.FINE, "Adding user '"+userToAdd.getUsername()+"'");
		users.add(userToAdd);
		persistUsers();
	}

	private static synchronized void persistUsers() throws Exception {
		Log.log(Level.FINE, "Persisting users");
		
		String usersJson = "["+System.lineSeparator();
		int i = 0;
		for (User user : users) {
			usersJson += user.toJSON();
			i++;
			if(i!=users.size()) {
				usersJson+=","+System.lineSeparator();
			}
		}
		usersJson+=System.lineSeparator()+"]";
		String usersFile = PathFinder.getBasePath()+"users.json";
		try {
			Files.write(Paths.get(usersFile), usersJson.getBytes());			
		}catch (Exception e) {
			throw new Exception("Could save users.json - cause: "+e.getMessage()+" - "+e.getCause());
		}
	}
	
	public static void loadUsers() throws Exception {
		users = new ArrayList<User>();
		Log.log(Level.FINE, "Loading users");
		String usersJson;
		String usersFile = PathFinder.getBasePath()+"users.json";
		File usersFileObj = new File(usersFile);
		if(!usersFileObj.exists()) {
			String adminUserJSON ="  {\r\n" + 
					"        \"username\": \""+defaultAdminUsername+"\",\r\n" + 
					"        \"password\": \""+defaultAdminPassword+"\",\r\n" + 
					"        \"role\": \"a\"\r\n" + 
					"  }";
			
			User adminUser = UserManagement.createUserObjByBodyJSON(adminUserJSON);
			Log.log(Level.INFO,"users.json file does not exist, assuming first run. creating default user '"+defaultAdminUsername+"' with password '"+defaultAdminPassword+"'");
			users.add(adminUser);
			persistUsers();
		}else {
			try {
				usersJson = Helpers.readFile(usersFile);
			} catch (Exception e) {
				Log.log(Level.SEVERE, "Cannot load users file");
				throw new Exception("Cannot load users file "+usersFile);
			}
			JsonArray usersJA =  new JsonParser().parse(usersJson).getAsJsonArray();
			for (JsonElement userJO : usersJA) {
				User user = new User();
				String role = "";
				try {
					user.setUsername(userJO.getAsJsonObject().get("username").getAsString());
					user.setPasswordHashed(userJO.getAsJsonObject().get("password").getAsString());
					user.setSalt(userJO.getAsJsonObject().get("salt").getAsString());
					role = userJO.getAsJsonObject().get("role").getAsString();
				}catch (Exception e) {
					Log.log(Level.SEVERE, "Error loading users - JSON missing keys");
					System.exit(-1);
				}
				if(!role.equals("rw") && !role.equals("r") && !role.contentEquals("a")) {
					Log.log(Level.WARNING, "Unknown role set for user '"+user.getUsername()+"'. Setting 'r'");
					role="r";
				}
				user.setRole(role);
				Log.log(Level.FINE, "Loaded user '"+user.getUsername()+"' with role '"+user.getRole()+"'");
				users.add(user);
			}
		}
	}

	public static User checkLogin(User loginUser) {
		for (User user : users) {
			if(MessageDigest.isEqual(user.getUsername().getBytes(),loginUser.getUsername().getBytes())) {
				Log.log(Level.FINE, "Username '"+loginUser.getUsername()+"' found.");
				loginUser.setSalt(user.getSalt());
				loginUser.setPassword(loginUser.getPasswordRaw());
				if(MessageDigest.isEqual(user.getPassword().getBytes(),loginUser.getPassword().getBytes())) {
					Log.log(Level.INFO, "Password for username '"+loginUser.getUsername()+"' matches.");
					loginUser.setRole(user.getRole());
					return loginUser;
				}else {
					Log.log(Level.WARNING, "Unsuccessful login attempt with username '"+loginUser.getUsername()+"' - wrong password.");	
					return null;
				}
			}
		}
		Log.log(Level.WARNING, "Username '"+loginUser.getUsername()+"' not found.");
		return null;
	}

	public static synchronized void deleteUser(String userNameToDelete) throws Exception {
		Log.log(Level.FINE, "Deleting user '"+userNameToDelete+"'");
		boolean deleted = users.removeIf(s -> s.getUsername().equals(userNameToDelete));
		if(!deleted) {
			throw new Exception("Cannot delete unknown user '"+userNameToDelete+"'");
		}
		persistUsers();
	}


}