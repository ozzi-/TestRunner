package helpers;

import java.util.ArrayList;
import java.util.List;

import pojo.User;

public class Settiings {

	static Settiings singleton;
	private int runningCount; // TODO synchronize?
	private String DEFAULT_ADMIN_USERNAME = "admin";
	private String DEFAUlT_ADMIN_PASSWORD = "letmein";
	private int SALT_LENGTH = 10;
	private List<User> users = new ArrayList<User>();

	
	public static Settiings getSingleton(){
		if(singleton==null) {
			singleton = new Settiings();
		}
		return singleton;
	}

	public int getRunningCount() {
		return runningCount;
	}

	public void setRunningCount(int runningCount) {
		this.runningCount = runningCount;
	}

	public String getDEFAULT_ADMIN_USERNAME() {
		return DEFAULT_ADMIN_USERNAME;
	}

	public void setDEFAULT_ADMIN_USERNAME(String dEFAULT_ADMIN_USERNAME) {
		DEFAULT_ADMIN_USERNAME = dEFAULT_ADMIN_USERNAME;
	}

	public String getDEFAUlT_ADMIN_PASSWORD() {
		return DEFAUlT_ADMIN_PASSWORD;
	}

	public void setDEFAUlT_ADMIN_PASSWORD(String dEFAUlT_ADMIN_PASSWORD) {
		DEFAUlT_ADMIN_PASSWORD = dEFAUlT_ADMIN_PASSWORD;
	}

	public int getSALT_LENGTH() {
		return SALT_LENGTH;
	}

	public void setSALT_LENGTH(int sALT_LENGTH) {
		SALT_LENGTH = sALT_LENGTH;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}


}
