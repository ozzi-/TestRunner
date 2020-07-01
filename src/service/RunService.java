package service;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

import com.google.gson.JsonObject;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.AuthenticationFilter;
import helpers.TRHelper;

public class RunService {
	
	@LogRequest
	@Authenticate("WRITE")
	@POST
	@Path("/run/{testname}/{tag}/{args}")
	public Response runTestByNameCustom(@PathParam("testname") String testName , @PathParam("tag") String tag, @PathParam("args") String args, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.checkLogin(headers);

		JsonObject resp = TRHelper.runTestInternal(testName, userName,tag,args);

		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}
	
	@LogRequest
	@Authenticate("WRITE")
	@POST
	@Path("/run/{testname}/{tag}")
	public Response runTestByNameTag(@PathParam("testname") String testName , @PathParam("tag") String tag, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.checkLogin(headers);

		JsonObject resp = TRHelper.runTestInternal(testName, userName,tag,"");

		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}

	@LogRequest
	@Authenticate("WRITE")	
	@POST
	@Path("/run/{testname}")
	public Response runTestByName(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.checkLogin(headers);

		JsonObject resp = TRHelper.runTestInternal(testName, userName,"","");

		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}

	@LogRequest
	@Authenticate("WRITE")	
	@POST
	@Path("/runGroup/{groupname}")
	public Response runTestGroupByName(@PathParam("groupname") String groupName, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.checkLogin(headers);

		JsonObject resp = TRHelper.runGroupInternal(groupName, userName,"","");
		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}

	@LogRequest
	@Authenticate("WRITE")	
	@POST
	@Path("/runGroup/{groupname}/{tag}")
	public Response runTestGroupByNameTag(@PathParam("groupname") String groupName, @PathParam("tag") String tag, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.checkLogin(headers);

		JsonObject resp = TRHelper.runGroupInternal(groupName, userName,tag,"");
		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}
	
	@LogRequest
	@Authenticate("WRITE")	
	@POST
	@Path("/runGroup/{groupname}/{tag}/{args}")
	public Response runTestGroupByNameCustom(@PathParam("groupname") String groupName, @PathParam("tag") String tag,  @PathParam("args") String args, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.checkLogin(headers);

		JsonObject resp = TRHelper.runGroupInternal(groupName, userName,tag,args);
		return Response.status(200).entity(resp.toString()).type("application/json").build();
	}
}
