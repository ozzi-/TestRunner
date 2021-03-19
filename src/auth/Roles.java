package auth;

import java.util.logging.Level;

import helpers.Log;

public enum Roles {
	R("READ",1),
	RX("READEXECUTE",2),
	RWX("READWRITEEXECUTE",3),
	A("ADMIN",4);
	
	private final String roleLabel;
	private final int roleLevel;

    Roles(final String roleLabel, int roleLevel) {
        this.roleLabel = roleLabel;
        this.roleLevel = roleLevel;
    }

    public String getRoleLabel() {
        return roleLabel;
    }
    
    public static Roles getRoleByID(String roleID) {
    	roleID = roleID.toUpperCase();
    	for (Roles role : Roles.values()) { 
    	    if(role.name().toUpperCase().equals(roleID)) {
    	    	return role;
    	    }
    	}
    	Log.log(Level.WARNING, "Could not fine role by id '"+roleID+"'");
    	return null;
    }
    
    public static Roles getRoleByLabel(String roleLabel) {
    	roleLabel = roleLabel.toUpperCase();
    	for (Roles role : Roles.values()) { 
    	    if(role.getRoleLabel().toUpperCase().equals(roleLabel)) {
    	    	return role;
    	    }
    	}
    	Log.log(Level.WARNING, "Could not fine role by label '"+roleLabel+"'");
    	return null;
    }
    
    public static boolean isValidRole(String roleToValidate) {
    	for (Roles role : Roles.values()) { 
    	    if(role.getRoleLabel().equals(roleToValidate)) {
    	    	return true;
    	    }
    	}
    	return false;
    }

	public int getRoleLevel() {
		return roleLevel;
	}
}
