package pojo;

import helpers.Crypto;

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
        StringBuilder str = new StringBuilder(); 
        str.append("{ "+System.lineSeparator());
        str.append("\t\"username\" : \""+getUsername()+"\","+System.lineSeparator());
        str.append("\t\"password\" : \""+getPassword()+"\","+System.lineSeparator());
        str.append("\t\"salt\" : \""+getSalt()+"\","+System.lineSeparator());
        str.append("\t\"role\" : \""+getRole()+"\""+System.lineSeparator());
        str.append("}");
        return str.toString();
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
