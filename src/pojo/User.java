package pojo;

import com.google.gson.JsonObject;

import helpers.Crypto;
import helpers.Settings;

public class User {
	private String username;
	private String role;
	private String passwordSaltedHashed;
	private String passwordRaw;
	private String salt;
	private int passwordRawLength;

	public String toString() {
		return username;
	}

	public String getPassword() {
		return passwordSaltedHashed.toUpperCase();
	}
	
	public void setPassword(String password) {
		if(this.salt==null) {
			this.salt=Crypto.createSalt(Settings.getSingleton().getSaltLength());			
		}
		this.passwordRawLength=password.length();
		this.passwordSaltedHashed = Crypto.saltHashString(this.salt,password);
	}

	public void setPasswordHashed(String passwordSaltedHashed) {
		this.passwordSaltedHashed = passwordSaltedHashed;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	public String toJSON() {
		JsonObject res = new JsonObject();
		res.addProperty("username", getUsername());
		res.addProperty("password", getPassword());
		res.addProperty("salt", getSalt());
		res.addProperty("role", getRole());
		return res.toString();
	}

	public int getPwLength() {
		return passwordRawLength;
	}

	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public String getPasswordRaw() {
		return passwordRaw;
	}

	public void setPasswordRaw(String passwordRaw) {
		this.passwordRaw = passwordRaw;
	}
	
	public static User getUser(NewUser newuser) {
		User user = new User();
		user.setUsername(newuser.getUsername());
		user.setRole(newuser.getRole());
		user.setPassword(newuser.getPassword());
		return user;
	}

}
