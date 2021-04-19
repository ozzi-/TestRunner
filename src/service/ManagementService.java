package service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;

import javax.inject.Singleton;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.text.StringEscapeUtils;
import org.eclipse.jgit.revwalk.RevCommit;
import org.json.JSONObject;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import annotations.Authenticate;
import annotations.LogRequest;
import auth.AuthenticationFilter;
import helpers.Helpers;
import helpers.Log;
import helpers.PathFinder;
import helpers.TRHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import persistence.Persistence;

@Singleton
@Api("/manage")
@Path("/manage")
public class ManagementService {

	// TODO refactor to use Pojos instead of raw request body
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/history/{page}")
	@ApiOperation( value = "[READ] Return recent changes")
	public Response getHistory(@Context HttpHeaders headers, @PathParam("page") int page) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is getting history");
		page = page<0?0:page;
		JsonArray revsJA = new JsonArray();
		
		ArrayList<RevCommit> revs = Persistence.gitHistory(page);
		for (RevCommit rev : revs) {
			JsonObject revJO = new JsonObject();

	        String dateStrng = parseCommitTime(rev);
			revJO.addProperty("user", rev.getCommitterIdent().getName());
			revJO.addProperty("commit", rev.getFullMessage());
			revJO.addProperty("time", dateStrng);
			revJO.addProperty("id", rev.getName());
			revsJA.add(revJO);
		}
		return Response.status(200).entity(revsJA.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	private String parseCommitTime(RevCommit rev) {
		Timestamp ts= new Timestamp(rev.getCommitTime());
		Date date = new Date((long)ts.getTime()*1000);
		String dateStrng = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
		return dateStrng;
	}
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/history/commit/{id}")
	@Produces("application/json; charset=UTF-8")
	@ApiOperation( value = "[READ] Return commit info")
	public Response getCommit(@Context HttpHeaders headers, @PathParam("id") String id) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is getting commit '"+id+"'");
		
		RevCommit rev = Persistence.getCommit(id);
		if(rev==null) {
			return Response.status(404).build();
		}
		JsonObject revJO = new JsonObject();	
        String dateStrng = parseCommitTime(rev);
		revJO.addProperty("user", rev.getCommitterIdent().getName());
		revJO.addProperty("commit", rev.getFullMessage());
		revJO.addProperty("time", dateStrng);
		revJO.addProperty("id", rev.getName());
		String a = Persistence.diffCommit(rev.getName()); 
		revJO.addProperty("diff", a);
		
		return Response.status(200).entity(revJO.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/history/test/{testname}")
	@ApiOperation( value = "[READ] Return all commits for specific test")
	@Produces("application/json; charset=UTF-8")
	public Response getHistoryForTest(@Context HttpHeaders headers, @PathParam("testname") String testname) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is getting commits for test  '"+testname+"'");
				
		Persistence.validateFileNameSafe(testname,true);
		JsonArray revsJA = constructCommitsJsonArray(PathFinder.getTestFolderName()+"/"+testname+PathFinder.getTestLabel());
		if(revsJA.size()==0) {
			return Response.status(404).build();
		}
		return Response.status(200).entity(revsJA.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/history/testgroup/{testgroupname}")
	@ApiOperation( value = "[READ] Return all commits for specific test")
	public Response getHistoryForTestGroup(@Context HttpHeaders headers, @PathParam("testgroupname") String testgroupname) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is getting commits for testgroup  '"+testgroupname+"'");
				
		Persistence.validateFileNameSafe(testgroupname,true);
		JsonArray revsJA = constructCommitsJsonArray(PathFinder.getGroupFolderName()+"/"+testgroupname+PathFinder.getGroupLabel());
		if(revsJA.size()==0) {
			return Response.status(404).build();
		}
		return Response.status(200).entity(revsJA.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
	}
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@Produces("application/json; charset=UTF-8")
	@Path("/history/script/")
	@ApiOperation( value = "[READ] Return all commits for specific test")
	public Response getHistoryForScript(@Context HttpHeaders headers, @QueryParam("name") String name) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		
		Log.log(Level.INFO, "'"+userName+"' is getting commits for script  '"+name+"'");

		String filePath = PathFinder.getScriptsFolder() + name;
		if (PathFinder.isPathSafe(filePath, PathFinder.getScriptsFolder())) {
			File chk = new File(filePath);
			if(!chk.isFile()) {
				return Response.status(404).build();
			}
			String gitPath = PathFinder.getTestFolderName()+"/"+PathFinder.getScriptFolderName()+"/"+(name.replace("\\", "/"));
			JsonArray revsJA = constructCommitsJsonArray(gitPath);
			return Response.status(200).entity(revsJA.toString()).type(MediaType.APPLICATION_JSON_TYPE).build();
		}
		
		Log.log(Level.WARNING, "Couldn't get history for script failed due to unsafe path '" + filePath + "'");
		return Response.status(400).entity("NOK").type(MediaType.TEXT_PLAIN).build();
	}

	private JsonArray constructCommitsJsonArray(String path) throws Exception {
		// note: we need / as a directory separator when working with git paths
		List<RevCommit> revs = Persistence.getCommitsForFile(path);
		JsonArray revsJA = new JsonArray();
		for (RevCommit rev : revs) {
			JsonObject revJO = new JsonObject();	
			String dateStrng = parseCommitTime(rev);
			revJO.addProperty("user", rev.getCommitterIdent().getName());
			revJO.addProperty("commit", rev.getFullMessage());
			revJO.addProperty("time", dateStrng);
			revJO.addProperty("id", rev.getName());
			revsJA.add(revJO);
		}
		return revsJA;
	}


	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@PUT
	@Path("/test/{testname}")
	@ApiOperation( value = "[READWRITEEXECUTE] Edit a test")
	public Response editTest(@PathParam("testname") String testName, @Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is editing test '"+testName+"'");
		
		JSONObject testJO;
		try {
			testJO =  new JSONObject(body);	
			Helpers.parseTest(testJO,testName,false);
		}catch (Exception e) {
			throw new Exception("Error parsing test - "+e.getMessage());
		}
		Persistence.writeTest(testName,body,true, userName);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Path("/test/{testname}")
	@ApiOperation( value = "[READWRITEEXECUTE] Create a test")
	public Response createTest(@PathParam("testname") String testName, @Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is creating test '"+testName+"'");
		
		JSONObject testJO;
		try {
			testJO =  new JSONObject(body);	
			Helpers.parseTest(testJO,testName,false);
		}catch (Exception e) {
			throw new Exception("Error parsing test - "+e.getMessage());
		}
		Persistence.writeTest(testName,body,false, userName);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/test/{testname}")
	@ApiOperation( value = "[READWRITEEXECUTE] Delete a test")
	public Response deleteTest(@PathParam("testname") String testName, @Context HttpHeaders headers) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is deleting test '"+testName+"'");
		
		Persistence.deleteTest(testName,userName);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Path("/group/")
	@ApiOperation( value = "[READWRITEEXECUTE] Create a group")
	public Response createGroup( @Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject groupJO;
		String groupName;
		String groupDescription;
		try {
			groupJO =  JsonParser.parseString(body).getAsJsonObject();
			groupName = groupJO.get(TRHelper.NAME).getAsString();
			groupDescription = StringEscapeUtils.escapeHtml4(groupJO.get(TRHelper.DESCRIPTION).getAsString());
		}catch (Exception e) {
			throw new Exception("Error parsing group json - "+e.getMessage());
		}

		Log.log(Level.INFO, "'"+userName+"' is creating a group '"+groupName+"'");
		Persistence.createGroup(groupName,groupDescription, userName);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@PUT
	@Path("/group/{groupname}")
	@ApiOperation( value = "[READWRITEEXECUTE] Add test to group")
	public Response addToGroup( @Context HttpHeaders headers, String body,  @PathParam("groupname") String groupName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject groupJO;
		String test, name;
		try {
			groupJO =  JsonParser.parseString(body).getAsJsonObject();
			name = groupJO.get(TRHelper.NAME).getAsString();
			test = groupJO.get(TRHelper.TEST).getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing group json - "+e.getMessage());
		}

		Log.log(Level.INFO, "'"+userName+"' is adding '"+test+"' to group '"+groupName+"'");
		Persistence.addToGroup(groupName,test,name,userName);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/group/{groupname}")
	@ApiOperation( value = "[READWRITEEXECUTE] Delete a group")
	public Response deleteGroup( @Context HttpHeaders headers, @PathParam("groupname") String groupName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		Log.log(Level.INFO, "'"+userName+"' is deleting the group '"+groupName+"'");
		Persistence.deleteGroup(groupName,userName);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/group/{groupname}/{testname}")
	@ApiOperation( value = "[READWRITEEXECUTE] Remove a test from a group")
	public Response deleteTestOfGroup( @Context HttpHeaders headers, @PathParam("groupname") String groupName,  @PathParam("testname") String testName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		Log.log(Level.INFO, "'"+userName+"' is removing '"+testName+"' from group '"+groupName+"'");
		Persistence.removeOfGroup(groupName,testName,userName);
		
		return Response.status(200).build();
	}
	
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/category/{categoryname}/{testname}")
	@ApiOperation( value = "[READWRITEEXECUTE] Remove a test from a category")
	public Response deleteTestFromCategory( @Context HttpHeaders headers, @PathParam("categoryname") String categoryName,  @PathParam("testname") String testName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		Log.log(Level.INFO, "'"+userName+"' is removing '"+testName+"' from category '"+categoryName+"'");
		Persistence.removeOfCategory(categoryName,testName,userName);
		
		return Response.status(200).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@PUT
	@Path("/category/{categoryname}")
	@ApiOperation( value = "[READWRITEEXECUTE] Add test to category")
	public Response addToCategory( @Context HttpHeaders headers, String body,  @PathParam("categoryname") String categoryName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject groupJO;
		String test;
		try {
			groupJO =  JsonParser.parseString(body).getAsJsonObject();
			test = groupJO.get(TRHelper.TEST).getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing category json - "+e.getMessage());
		}

		Log.log(Level.INFO, "'"+userName+"' is adding '"+test+"' to group '"+categoryName+"'");
		if(Persistence.addToCategory(categoryName,test,userName)) {
			return Response.status(200).build();			
		}
		return Response.status(409).build();
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@POST
	@Path("/category/")
	@ApiOperation( value = "[READWRITEEXECUTE] Create a category")
	public Response createCategory( @Context HttpHeaders headers, String body) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);

		JsonObject categoryJO;
		String name;
		try {
			categoryJO =  JsonParser.parseString(body).getAsJsonObject();
			name = categoryJO.get(TRHelper.NAME).getAsString();
		}catch (Exception e) {
			throw new Exception("Error parsing category json - "+e.getMessage());
		}
		Log.log(Level.INFO, "'"+userName+"' is creating a category '"+name+"'");
		Persistence.createCategory(name,userName);
		return Response.status(200).build();			
	
	}
	
	@LogRequest
	@Authenticate("READ")
	@GET
	@Path("/category/")
	@ApiOperation( value = "[READ] Returns all categories")
	public Response getCategories( @Context HttpHeaders headers) throws Exception {
		
		try (FileInputStream fis = new FileInputStream(PathFinder.getCategoriesFilePath());
				InputStreamReader isr = new InputStreamReader(fis, StandardCharsets.UTF_8);
				BufferedReader reader = new BufferedReader(isr)) {

			String str;
			String res = "";
			while ((str = reader.readLine()) != null) {
				res+=str;
				System.out.println(str);
			}
			return Response.status(200).entity(res).type(MediaType.APPLICATION_JSON_TYPE).build();

		} catch (IOException e) {
			e.printStackTrace();
		}
		return Response.status(500).build();	
	}
	
	@LogRequest
	@Authenticate("READWRITEEXECUTE")
	@DELETE
	@Path("/category/{categoryname}")
	@ApiOperation( value = "[READWRITEEXECUTE] Delete a category")
	public Response deleteCategory( @Context HttpHeaders headers, @PathParam("categoryname") String categoryName) throws Exception {
		String userName = AuthenticationFilter.getUsernameOfSession(headers);
		Log.log(Level.INFO, "'"+userName+"' is deleting category '"+categoryName+"'");
		Persistence.deleteCategory(categoryName, userName);
		return Response.status(200).build();
	}

}
