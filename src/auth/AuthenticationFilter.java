package auth;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import annotations.Authenticate;
import helpers.Log;
import pojo.Session;

@Authenticate
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

	public static final String SESSIONHEADERNAME = "X-TR-Session-ID";

	@Context
	private ResourceInfo resourceInfo;

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {

		String requiredRoleLabel = resourceInfo.getResourceMethod().getAnnotation(Authenticate.class).value();
		if(!Roles.isValidRole(requiredRoleLabel)) {
			Log.log(Level.SEVERE, "Invalid annotation value '" + requiredRoleLabel + "' used - defaulting to 'ADMIN'");
			requiredRoleLabel = Roles.A.getRoleLabel();
		}

		String sessionIdentifier = requestContext.getHeaderString(SESSIONHEADERNAME);
		
		if (sessionIdentifier != null) {
			Session session = SessionManagement.getSessionFormIdentifier(sessionIdentifier);
			if (session != null) {
				String userName = session.getUsername();
				Roles requiredRole = Roles.getRoleByLabel(requiredRoleLabel);
				Roles sessionRole = Roles.getRoleByID(session.getRoleID());
				if(sessionRole.getRoleLevel()>=requiredRole.getRoleLevel()) {
					// all good
					return;
				} else {
					abortWithAuthFailed(requestContext,userName,"Login check failed - user " + session.getUsername() + " attempted to execute an API call which he / she does not have sufficient privileges for.");
				}
			} else {
				abortWithAuthFailed(requestContext,"", "Login check failed due to session provided not found in session storage (hs)");
			}
		} else {
			abortWithAuthFailed(requestContext,"", "Login check failed due to missing header");
		}
	}
		
	private void abortWithAuthFailed(ContainerRequestContext requestContext, String userNameFromHeader, String msg) {
		Log.log(Level.INFO, msg +" - "+ userNameFromHeader);
		requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).entity("unauthorized").build());
	}
	
	public static String getUsernameOfSession(HttpHeaders headers) {
		if (headers != null) {
			List<String> sessionHeaders = headers.getRequestHeader(SESSIONHEADERNAME);
			if(sessionHeaders != null && !sessionHeaders.isEmpty()) {
				String sessionIdentifier = sessionHeaders.get(0);
				Session session = SessionManagement.getSessionFormIdentifier(sessionIdentifier);
				if (session != null) {
					return session.getUsername();					
				}
			}
		}
		return "<session failure>";
	}
}
