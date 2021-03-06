package service;

import java.util.regex.Pattern;

import javax.inject.Singleton;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.JsonObject;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.AuthenticationFilter;
import helpers.TRHelper;

@Singleton
@Path("/")
public class RunService {
	
	private static String tagValidRegexp="[a-zA-Z0-9_]+";
	
	@LogRequest
	@Authenticate("WRITE")
	@POST
	@Path("/run/{testname}/{tag}/{args}")
	public Response runTestByNameCustom(@PathParam("testname") String testName , @PathParam("tag") String tag, @PathParam("args") String args, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		if(!Pattern.matches(tagValidRegexp, tag)) {
			return Response.status(400).entity("invalid tag name").type(MediaType.APPLICATION_JSON_TYPE).build();
		}

		JsonObject resp = TRHelper.runTestInternal(testName, userName,tag,args);
		
		return Response.status(200).entity(resp.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	@LogRequest
	@Authenticate("WRITE")
	@POST
	@Path("/run/{testname}/{tag}")
	public Response runTestByNameTag(@PathParam("testname") String testName , @PathParam("tag") String tag, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		if(!Pattern.matches(tagValidRegexp, tag)) {
			return Response.status(400).entity("invalid tag name").type(MediaType.APPLICATION_JSON_TYPE).build();
		}
		
		JsonObject resp = TRHelper.runTestInternal(testName, userName,tag,"");

		return Response.status(200).entity(resp.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("WRITE")	
	@POST
	@Path("/run/{testname}")
	public Response runTestByName(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject resp = TRHelper.runTestInternal(testName, userName,"","");

		return Response.status(200).entity(resp.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("WRITE")	
	@POST
	@Path("/runGroup/{groupname}")
	public Response runTestGroupByName(@PathParam("groupname") String groupName, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject resp = TRHelper.runGroupInternal(groupName, userName,"","");
		return Response.status(200).entity(resp.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	@LogRequest
	@Authenticate("WRITE")	
	@POST
	@Path("/runGroup/{groupname}/{tag}")
	public Response runTestGroupByNameTag(@PathParam("groupname") String groupName, @PathParam("tag") String tag, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		if(!Pattern.matches(tagValidRegexp, tag)) {
			return Response.status(400).entity("invalid tag name").type(MediaType.APPLICATION_JSON_TYPE).build();
		}
		
		JsonObject resp = TRHelper.runGroupInternal(groupName, userName,tag,"");
		return Response.status(200).entity(resp.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	@LogRequest
	@Authenticate("WRITE")	
	@POST
	@Path("/runGroup/{groupname}/{tag}/{args}")
	public Response runTestGroupByNameCustom(@PathParam("groupname") String groupName, @PathParam("tag") String tag,  @PathParam("args") String args, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		if(!Pattern.matches(tagValidRegexp, tag)) {
			return Response.status(400).entity("invalid tag name").type(MediaType.APPLICATION_JSON_TYPE).build();
		}
		
		JsonObject resp = TRHelper.runGroupInternal(groupName, userName,tag,args);
		return Response.status(200).entity(resp.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
}
