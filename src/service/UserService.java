package service;

import java.util.logging.Level;

import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.AuthenticationFilter;
import auth.SessionManagement;
import auth.UserManagement;
import helpers.Log;
import pojo.Session;
import pojo.User;

@Singleton
@Path("/")
public class UserService {
	
	@LogRequest
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/login")
	public Response doLogin(String jsonLogin) throws Exception {
		User user = UserManagement.parseUserLoginJSON(jsonLogin);
		user = UserManagement.checkLogin(user);
		if (user != null) {
			Session session = SessionManagement.createSession(user.getUsername(),user.getRole());
			return Response.status(200).entity(session.toJSONObj().toString()).type("application/json").build();
		}
		return Response.status(401).entity("Username or Password wrong").build();
	}
	
	@LogRequest
	@Authenticate("READ")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/logout")
	public Response doLogout(@Context HttpHeaders headers) throws Exception {
		// TODO this
		String userName = AuthenticationFilter.checkLogin(headers);
		if (headers != null && headers.getRequestHeader(AuthenticationFilter.headerNameSessionID) != null && headers.getRequestHeader(AuthenticationFilter.headerNameSessionID).size() > 0) { 
			String sessionIdentifier = headers.getRequestHeader(AuthenticationFilter.headerNameSessionID).get(0);
			Session session = SessionManagement.getSessionFormIdentifier(sessionIdentifier);
			if (session != null) {
				SessionManagement.destroySession(session);
			}
		}
		Log.log(Level.FINE, "User "+userName+" logged out");
		return Response.status(204).entity("").build();
	}
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/testLogin")
	public Response test(@Context HttpHeaders headers) {
		return Response.status(200).entity("OK").build();
	}
	
	@LogRequest
	@Authenticate("ADMIN")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/deleteUser")
	public Response deleteUser(@Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.checkLogin(headers);

		String userNameToDelete = ""; 
		JsonObject userJO;
		try {
			userJO =  new JsonParser().parse(body).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing user json - "+e.getMessage());
		}
		try {
			userNameToDelete = userJO.getAsJsonObject().get("username").getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing username - key not found");
		}

		Log.log(Level.INFO, "'"+userName+"' is deleting  user '"+userNameToDelete+"'");
		UserManagement.deleteUser(userNameToDelete);
		return Response.status(200).entity("{\"user\" : \"deleted\"}").type("application/json").build();
	}

	@LogRequest
	@Authenticate("ADMIN")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/changePasswordForUser")
	public Response changePasswordForUser(@Context HttpHeaders headers, String body) throws Exception {		
		String userName = AuthenticationFilter.checkLogin(headers);

		String userNameToChange = ""; 
		String password = "";
		JsonObject userJO;
		try {
			userJO =  new JsonParser().parse(body).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing password json - "+e.getMessage());
		}
		try {
			userNameToChange = userJO.getAsJsonObject().get("username").getAsString();
			password = userJO.getAsJsonObject().get("password").getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing username / password - key not found");
		}
		
		if(password.length()<8) {
			throw new Exception("Password length is 8 characters minimum");
		}
		Log.log(Level.INFO, "'"+userName+"' is changing the password of user '"+userNameToChange+"'");
		UserManagement.changePassword(userNameToChange, password);
		return Response.status(200).entity("{\"password\" : \"changed\"}").type("application/json").build();
	}
	
	@LogRequest
	@Authenticate("ADMIN")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/createUser")
	public Response createUser(@Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.checkLogin(headers);

		User userToAdd = UserManagement.createUserObjByBodyJSON(body);
		
		if(userToAdd.getPwLength()<8) {
			throw new Exception("Password length is 8 characters minimum");
		}
		for (User user : UserManagement.users) {
			if(user.getUsername().equals(userToAdd.getUsername())) {
				throw new Exception("Username already taken");
			}
		}
		if( !userToAdd.getRole().equals("a") && !userToAdd.getRole().equals("rw") && !userToAdd.getRole().equals("r")) {
			throw new Exception("Invalid role");
		}
		Log.log(Level.INFO, "'"+userName+"' is adding user '"+userToAdd.getUsername()+"' with role '"+userToAdd.getRole()+"'");
		UserManagement.addUser(userToAdd);
		try {
			UserManagement.loadUsers();
		} catch (Exception e) {
			throw new Exception("Cannot load users - "+e.getMessage());
		}
		return Response.status(200).entity("{\"user\" : \"created\"}").type("application/json").build();
	}

	@LogRequest
	@Authenticate("WRITE")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/changePassword")
	public Response changePassword(@Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.checkLogin(headers);

		String password = "";
		JsonObject userJO;
		try {
			userJO =  new JsonParser().parse(body).getAsJsonObject();			
		}catch (Exception e) {
			throw new Exception("Error parsing password json - "+e.getMessage());
		}
		try {
			password = userJO.getAsJsonObject().get("password").getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing password - key not found");
		}
		
		if(password.length()<8) {
			throw new Exception("Password length is 8 characters minimum");
		}
		Log.log(Level.INFO, "'"+userName+"' is changing his password");

		UserManagement.changePassword(userName, password);
		return Response.status(200).entity("{\"password\" : \"changed\"}").type("application/json").build();
	}
	
}
