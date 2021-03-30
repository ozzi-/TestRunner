package service;

import java.util.logging.Level;

import javax.inject.Singleton;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

import org.apache.commons.text.StringEscapeUtils;
import org.json.JSONObject;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.AuthenticationFilter;
import helpers.Helpers;
import helpers.Log;
import persistence.Persistence;

@Singleton
@Path("/manage")
public class ManagementService {


	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@PUT
	@Path("/test/{testname}")
	public Response editTest(@PathParam("testname") String testName, @Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is editing test '"+testName+"'");
		
		JSONObject testJO;
		try {
			testJO =  new JSONObject(body);	
			Helpers.parseTest(testJO,testName);
		}catch (Exception e) {
			throw new Exception("Error parsing test - "+e.getMessage());
		}
		Persistence.writeTest(testName,body,true);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Path("/test/{testname}")
	public Response createTest(@PathParam("testname") String testName, @Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is creating test '"+testName+"'");
		
		JSONObject testJO;
		try {
			testJO =  new JSONObject(body);	
			Helpers.parseTest(testJO,testName);
		}catch (Exception e) {
			throw new Exception("Error parsing test - "+e.getMessage());
		}
		Persistence.writeTest(testName,body,false);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/test/{testname}")
	public Response deleteTest(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is deleting test '"+testName+"'");
		
		Persistence.deleteTest(testName);
		
		return Response.status(200).build();
	}
	
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Path("/group/")
	public Response createGroup( @Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject groupJO;
		String groupName;
		String groupDescription;
		try {
			groupJO =  new JsonParser().parse(body).getAsJsonObject();
			groupName = groupJO.get("name").getAsString();
			groupDescription = StringEscapeUtils.escapeHtml4(groupJO.get("description").getAsString());
		}catch (Exception e) {
			throw new Exception("Error parsing group json - "+e.getMessage());
		}

		Log.log(Level.INFO, "'"+userName+"' is creating a group '"+groupName+"'");
		Persistence.createGroup(groupName,groupDescription);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@PUT
	@Path("/group/{groupname}")
	public Response addToGroup( @Context HttpHeaders headers, String body,  @PathParam("groupname") String groupName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject groupJO;
		String test, name;
		try {
			groupJO =  new JsonParser().parse(body).getAsJsonObject();
			name = groupJO.get("name").getAsString();
			test = groupJO.get("test").getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing group json - "+e.getMessage());
		}

		Log.log(Level.INFO, "'"+userName+"' is adding '"+test+"' to group '"+groupName+"'");
		Persistence.addToGroup(groupName,test,name);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/group/{groupname}")
	public Response deleteGroup( @Context HttpHeaders headers, @PathParam("groupname") String groupName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		Log.log(Level.INFO, "'"+userName+"' is deleting the group '"+groupName+"'");
		Persistence.deleteGroup(groupName);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/group/{groupname}/{testname}")
	public Response deleteTestOfGroup( @Context HttpHeaders headers, @PathParam("groupname") String groupName,  @PathParam("testname") String testName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		Log.log(Level.INFO, "'"+userName+"' is removing '"+testName+"' from group '"+groupName+"'");
		Persistence.removeOfGroup(groupName,testName);
		
		return Response.status(200).build();
	}
	
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/category/{categoryname}/{testname}")
	public Response deleteTestFromCategory( @Context HttpHeaders headers, @PathParam("categoryname") String categoryName,  @PathParam("testname") String testName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		Log.log(Level.INFO, "'"+userName+"' is removing '"+testName+"' from category '"+categoryName+"'");
		Persistence.removeOfCategory(categoryName,testName);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@PUT
	@Path("/category/{categoryname}")
	public Response addToCategory( @Context HttpHeaders headers, String body,  @PathParam("categoryname") String categoryName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject groupJO;
		String test;
		try {
			groupJO =  new JsonParser().parse(body).getAsJsonObject();
			test = groupJO.get("test").getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing category json - "+e.getMessage());
		}

		Log.log(Level.INFO, "'"+userName+"' is adding '"+test+"' to group '"+categoryName+"'");
		if(Persistence.addToCategory(categoryName,test)) {
			return Response.status(200).build();			
		}
		return Response.status(409).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Path("/category/")
	public Response createCategory( @Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject categoryJO;
		String name;
		try {
			categoryJO =  new JsonParser().parse(body).getAsJsonObject();
			name = categoryJO.get("name").getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing category json - "+e.getMessage());
		}
		Log.log(Level.INFO, "'"+userName+"' is creating a category '"+name+"'");
		Persistence.createCategory(name);
		return Response.status(200).build();			
	
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/category/{categoryname}")
	public Response deleteCategory( @Context HttpHeaders headers, @PathParam("categoryname") String categoryName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is deleting category '"+categoryName+"'");
		Persistence.deleteCategory(categoryName);
		return Response.status(200).build();			
	}
}
