package auth;

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
    
    public static Roles getRoleByLabel(String roleLabel) {
    	for (Roles role : Roles.values()) { 
    	    if(role.toString().equals(roleLabel)) {
    	    	return role;
    	    }
    	}
    	return null;
    }
    
    public static boolean isValidRole(String roleToValidate) {
    	for (Roles role : Roles.values()) { 
    	    if(role.toString().equals(roleToValidate)) {
    	    	return true;
    	    }
    	}
    	return false;
    }

	public int getRoleLevel() {
		return roleLevel;
	}
}
