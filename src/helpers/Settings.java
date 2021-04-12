package helpers;

import java.util.ArrayList;
import java.util.List;

import pojo.User;

public class Settings {

	static Settings singleton;
	private int runningCount;
	private String defaultAdminUsername = "admin";
	private String defaultAdminPassword = "letmein";
	// changing this requires changes to the @ApiImplicitParam annotations, as they need to be static
	private String filePathHeader = "X-File-Path"; 
	private int saltLength = 10;
	private List<User> users = new ArrayList<User>();

	
	public static Settings getSingleton(){
		if(singleton==null) {
			singleton = new Settings();
		}
		return singleton;
	}

	public int getRunningCount() {
		return runningCount;
	}

	public void setRunningCount(int runningCount) {
		this.runningCount = runningCount;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public String getDefaultAdminUsername() {
		return defaultAdminUsername;
	}

	public String getDefaultAdminPassword() {
		return defaultAdminPassword;
	}

	public int getSaltLength() {
		return saltLength;
	}

	public String getFilePathHeader() {
		return filePathHeader;
	}
}
