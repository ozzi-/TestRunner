package service;

import java.util.List;
import java.util.logging.Level;

import org.json.JSONObject;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.AuthenticationFilter;
import auth.Roles;
import auth.SessionManagement;
import auth.UserManagement;
import helpers.Log;
import jakarta.inject.Singleton;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import pojo.Login;
import pojo.NewUser;
import pojo.Password;
import pojo.Session;
import pojo.User;

@Singleton
//@Api("/user")
@Path("/user")
public class UserService {
	
	@LogRequest
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	//@ApiOperation( response = Session.class, value = "[NONE] If successful, returns a session", produces="application/json")
	@Path("/login")
	//@ApiResponses(value = { @ApiResponse(code = 401, message = "Username or Password wrong") }) 
	public Response doLogin(Login login) throws Exception {
		User user = new User();
		user.setUsername(login.getUsername());
		user.setPasswordRaw(login.getPassword());
		user = UserManagement.checkLogin(user);
		if (user != null) {
			Session session = SessionManagement.createSession(user.getUsername(),user.getRole());
			return Response.status(200).entity(session.toJSONObj().toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
		}
		return Response.status(401).entity("Username or Password wrong").build();
	}
	
	@LogRequest
	@Authenticate("READ")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	//@ApiOperation( value = "[READ] Invalidates current session")
	@Path("/logout")
	public Response doLogout(@Context HttpHeaders headers) throws Exception {
		if(headers!=null) {
			List<String> sessionHeaders = headers.getRequestHeader(AuthenticationFilter.SESSIONHEADERNAME);
			if (sessionHeaders != null && !sessionHeaders.isEmpty()) { 
				String sessionIdentifier = sessionHeaders.get(0);
				Session session = SessionManagement.getSessionFormIdentifier(sessionIdentifier);
				if (session != null) {
					SessionManagement.destroySession(session);
					Log.log(Level.FINE, "User "+session.getUsername()+" logged out");
					return Response.status(204).entity("").build();
				}
			}
		}
		return Response.status(401).entity("").build();
	}

	@LogRequest
	@Authenticate("ADMIN")
	@DELETE
	@Consumes(MediaType.APPLICATION_JSON)
	//@ApiOperation(value = "[ADMIN] Deletes a user", produces="application/json")
	@Path("/{user}")
	public Response deleteUser(@Context HttpHeaders headers, @PathParam("user") String userNameToDelete) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is deleting  user '"+userNameToDelete+"'");
		UserManagement.deleteUser(userNameToDelete);
		return Response.status(200).entity("{\"user\" : \"deleted\"}").type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@Consumes(MediaType.APPLICATION_JSON)
	//@ApiOperation( response = Login.class , responseContainer="List", value = "[READ] Get all users", produces="application/json")
	public Response getUsers(@Context HttpHeaders headers) throws Exception {
		JsonArray usersJA = new JsonArray();
		List<User> users = helpers.Settings.getSingleton().getUsers();
		for (User user : users) {
			JsonObject userJO = new JsonObject();
			userJO.addProperty(user.getUsername(), user.getRole());
			usersJA.add(userJO);
		}
		return Response.status(200).entity(usersJA.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}


	@LogRequest
	@Authenticate("ADMIN")
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/{user}/password")
	//@ApiOperation( response = Password.class, value = "[ADMIN] Set password of user")
	public Response changePasswordForUser(@Context HttpHeaders headers, Password password, @PathParam("user") String userNameToChangePW) throws Exception {		
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
				
		if(password.getPassword().length()<8) {
			throw new Exception("Password length is 8 characters minimum");
		}
		Log.log(Level.INFO, "'"+userName+"' is changing the password of user '"+userNameToChangePW+"'");
		UserManagement.changePassword(userNameToChangePW, password.getPassword());
		return Response.status(200).entity("{\"password\" : \"changed\"}").type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	@LogRequest
	@Authenticate("ADMIN")
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/{user}/role")
	//@ApiOperation( response = Password.class, value = "[ADMIN] Set role of user")
	public Response changeRoleForUser(@Context HttpHeaders headers, String body, @PathParam("user") String userNameToChangeRole) throws Exception {		
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		// TODO use pojo instead of parsing body
		String role="";
		try {
			JSONObject roleJO =  new JSONObject(body);
			role = roleJO.getString("role");
		}catch (Exception e) {
			throw new Exception("Error parsing role - "+e.getMessage());
		}

		Log.log(Level.INFO, "'"+userName+"' is changing the role of user '"+userNameToChangeRole+"' to '"+role+"'");
		UserManagement.changeRole(userNameToChangeRole, role);
		return Response.status(200).entity("{\"role\" : \"changed\"}").type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	@LogRequest
	@Authenticate("ADMIN")
	@DELETE
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/{user}/session")
	//@ApiOperation( response = Password.class, value = "[ADMIN] Set password of user")
	public Response deleteSessionOfUser(@Context HttpHeaders headers,  @PathParam("user") String userNameOfSessionDel) throws Exception {		
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is killing all sessions of '"+userNameOfSessionDel+"'");
		SessionManagement.destorySessionByUserName(userNameOfSessionDel);
		return Response.status(200).entity("{\"sessions\" : \"deleted\"}").type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	@LogRequest
	@Authenticate("ADMIN")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	//@ApiOperation(value = "[ADMIN] Creates a new user", produces="application/json")
	public Response createUser(@Context HttpHeaders headers, NewUser user) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		if(user.getPassword().length()<8) {
			throw new Exception("Password length is 8 characters minimum");
		}
		for (User userToCheck : helpers.Settings.getSingleton().getUsers()) {
			if(userToCheck.getUsername().equals(user.getUsername())) {
				throw new Exception("Username already taken");
			}
		}
		if(Roles.getRoleByID(user.getRole())==null) {
			throw new Exception("Invalid role received when calling / createUser");
		}
		
		Log.log(Level.INFO, "'"+userName+"' is adding user '"+user.getUsername()+"' with role '"+user.getRole()+"'");
		UserManagement.addUser(User.getUser(user));
		
		try {
			UserManagement.loadUsers();
		} catch (Exception e) {
			throw new Exception("Cannot load users - "+e.getMessage());
		}
		return Response.status(200).entity("{\"user\" : \"created\"}").type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("READ")
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/password")
	//@ApiOperation(value = "[READ] Changes the password of the current sessions user", produces="application/json")
	public Response changePassword(@Context HttpHeaders headers, Password password) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		
		if(password.getPassword().length()<8) {
			throw new Exception("Password length is 8 characters minimum");
		}
		Log.log(Level.INFO, "'"+userName+"' is changing his password");

		UserManagement.changePassword(userName, password.getPassword());
		return Response.status(200).entity("{\"password\" : \"changed\"}").type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	@Authenticate("ADMIN")
	@LogRequest
	@GET
	@Path("/reload")
	//@ApiOperation(value = "[ADMIN] Reloads the users from storage")
	public Response reload(@Context HttpHeaders headers) throws Exception {
		try {
			UserManagement.loadUsers();
		} catch (Exception e) {
			throw new Exception("Cannot load users - " + e.getMessage());
		}

		return Response.status(200).entity("reloaded").build();
	}

	
}
