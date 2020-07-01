package auth;

import java.io.IOException;
import java.util.logging.Level;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import helpers.Log;
import pojo.Session;

@Authenticate
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

	public static final String headerNameSessionID = "X-TR-Session-ID";

	@Context
	private ResourceInfo resourceInfo;

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {

		String mode = resourceInfo.getResourceMethod().getAnnotation(Authenticate.class).value();
		boolean requiresWritePrivilege = mode.equals("WRITE") || mode.equals("ADMIN");
		boolean requiresAdminPrivilege = mode.equals("ADMIN");
		if (mode.equals("ADMIN") && mode.equals("WRITE") && mode.equals("READ")) {
			Log.log(Level.SEVERE, "Invalid annotation value '" + mode + "' used - defaulting to 'ADMIN'");
			requiresAdminPrivilege = true;
		}

		MultivaluedMap<String, String> headers = requestContext.getHeaders();
		
		if (headers != null && headers.get(headerNameSessionID) != null && headers.get(headerNameSessionID).size() > 0) {
			String sessionIdentifier = headers.get(headerNameSessionID).get(0);
			Session session = SessionManagement.getSessionFormIdentifier(sessionIdentifier);
			if (session != null) {
				if (requiresWritePrivilege && !session.getRole().equals("rw") && !session.getRole().equals("a")) {
					abortWithAuthFailed(requestContext,headers.get(headerNameSessionID).toString(),"Login check failed - user " + session.getUsername() + " attempted to execute write API call which he does not have sufficient privileges for.");
				} else if (requiresAdminPrivilege && !session.getRole().equals("a")) {
					abortWithAuthFailed(requestContext,headers.get(headerNameSessionID).toString(),"Login check failed - user " + session.getUsername() + " attempted to execute admin API call which he does not have sufficient privileges for.");
				} else {
					// all good
					return;
				}
			} else {
				abortWithAuthFailed(requestContext,headers.get(headerNameSessionID).toString(), "Login check failed due to session provided not found in session storage (hs)");
			}
		} else {
			abortWithAuthFailed(requestContext,headers.get(headerNameSessionID).toString(), "Login check failed due to missing header");
		}
	}
		
	private void abortWithAuthFailed(ContainerRequestContext requestContext, String userNameFromHeader, String msg) {
		Log.log(Level.INFO, msg + userNameFromHeader);
		requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).entity("unauthorized").build());
	}
	
	public static String checkLogin(HttpHeaders headers) {
		if (headers != null && headers.getRequestHeader(headerNameSessionID) != null && headers.getRequestHeader(headerNameSessionID).size() > 0) { 
			String sessionIdentifier = headers.getRequestHeader(headerNameSessionID).get(0);
			Session session = SessionManagement.getSessionFormIdentifier(sessionIdentifier);
			if (session != null) {
				return session.getUsername();					
			}
		}
		return "<session failure>";
	}
}
