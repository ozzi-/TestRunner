package auth;

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
import helpers.Settings;
import pojo.User;

public class UserManagement {
	
	private UserManagement() {}	
	


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
	
	public static User addUser(String userJson) throws Exception {
		JsonElement userJO;
		try {
			userJO =  new JsonParser().parse(userJson).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing user json - "+e.getMessage());
		}
		User user = new User();
		try {
			user.setSalt(Crypto.createSalt(Settings.getSingleton().getSaltLength())); 
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
		for (User user : Settings.getSingleton().getUsers()) {
			if(user.getUsername().equals(username)) {
				user.setSalt(Crypto.createSalt(Settings.getSingleton().getSaltLength())); 
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
		Settings.getSingleton().getUsers().add(userToAdd);
		persistUsers();
	}

	private static synchronized void persistUsers() throws Exception {
		Log.log(Level.FINE, "Persisting users");
		
		String usersJson = "["+System.lineSeparator();
		int i = 0;
		for (User user : Settings.getSingleton().getUsers()) {
			usersJson += user.toJSON();
			i++;
			if(i!=Settings.getSingleton().getUsers().size()) {
				usersJson+=","+System.lineSeparator();
			}
		}
		usersJson+=System.lineSeparator()+"]";
		String usersFile = PathFinder.getBasePath()+"users.json";
		try {
			Files.write(Paths.get(usersFile), usersJson.getBytes());			
		}catch (Exception e) {
			throw new Exception("Could not save users.json - cause: "+e.getMessage()+" - "+e.getCause());
		}
	}
	
	public static void loadUsers() throws Exception {
		Settings.getSingleton().setUsers(new ArrayList<User>());
		Log.log(Level.FINE, "Loading users");
		String usersJson;
		String usersFile = PathFinder.getBasePath()+"users.json";
		File usersFileObj = new File(usersFile);
		if(!usersFileObj.exists()) {
			// TODO instead of string, create proper JsonObj
			String adminUserJSON ="  {\r\n" + 
					"        \"username\": \""+Settings.getSingleton().getDefaultAdminUsername()+"\",\r\n" + 
					"        \"password\": \""+Settings.getSingleton().getDefaultAdminPassword()+"\",\r\n" + 
					"        \"role\": \"a\"\r\n" + 
					"  }";
			
			User adminUser = UserManagement.addUser(adminUserJSON);
			Log.log(Level.INFO,"users.json file does not exist, assuming first run. creating default user '"+Settings.getSingleton().getDefaultAdminUsername()+"' with password '"+Settings.getSingleton().getDefaultAdminPassword()+"'");
			Settings.getSingleton().getUsers().add(adminUser);
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
				Settings.getSingleton().getUsers().add(user);
			}
		}
	}

	public static User checkLogin(User loginUser) {
		for (User user : Settings.getSingleton().getUsers()) {
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
		boolean deleted = Settings.getSingleton().getUsers().removeIf(s -> s.getUsername().equals(userNameToDelete));
		if(!deleted) {
			throw new Exception("Cannot delete unknown user '"+userNameToDelete+"'");
		}
		persistUsers();
	}


}