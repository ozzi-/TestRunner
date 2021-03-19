package service;

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
public class WriteService {
	
	
	@LogRequest
	@Authenticate("WRITE")
	@POST
	@Path("/wdrun/{testname}/{tag}/{args}")
	public Response runTestByNameCustom(@PathParam("testname") String testName , @PathParam("tag") String tag, @PathParam("args") String args, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		

		JsonObject resp = TRHelper.runTestInternal(testName, userName,tag,args);
		
		return Response.status(200).entity(resp.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	
}
