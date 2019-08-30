package pojo;

import helpers.Crypto;

public class User {
	private String username;
	private String passwordSaltedHashed;
	private String passwordRaw;
	private String salt;
	private int passwordRawLength;
	private String role;

	public String toString() {
		return username;
	}

	public String getPassword() {
		return passwordSaltedHashed.toUpperCase();
	}
	
	public void setPassword(String password) {
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
		return "{ "+System.lineSeparator()
				+ "	\"username\" : \""+getUsername()+"\","+System.lineSeparator()
				+ "	\"password\" : \""+getPassword()+"\","+System.lineSeparator()
				+ "	\"salt\" : \""+getSalt()+"\","+System.lineSeparator()
				+ "	\"role\" : \""+getRole()+"\""+System.lineSeparator()
				+"}";
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

}
