package service;

import java.util.logging.Level;

import javax.inject.Singleton;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.AuthenticationFilter;
import helpers.Helpers;
import helpers.Log;
import persistence.Persistence;

@Singleton
@Path("/")
public class ManagementService {
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Path("/manage/test/{testname}")
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
		// TODO pretty print the JSON output
		// TODO hooks not written into file
		Persistence.writeTest(testName,body);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/manage/test/{testname}")
	public Response deleteTest(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is deleting test '"+testName+"'");
		
		Persistence.deleteTest(testName);
		
		return Response.status(200).build();
	}
	
	
}
