package helpers;

import java.io.IOException;
import java.util.logging.Level;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;

import annotations.Authenticate;
import auth.AuthenticationFilter;
import auth.SessionManagement;
import pojo.Session;

@Authenticate
@Provider
@Priority(Priorities.USER)
public class LogFilter implements ContainerRequestFilter {

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		
		String sessionIdentifier = requestContext.getHeaderString(AuthenticationFilter.SESSIONHEADERNAME);
		Session session = SessionManagement.getSessionFormIdentifier(sessionIdentifier);		
		String userName = session.getUsername();
		
		String method = requestContext.getMethod();
		String uri = "/"+requestContext.getUriInfo().getPath();

		Log.log(Level.INFO, "API Call by "+userName+" - "+method+" "+uri);
	}
}
