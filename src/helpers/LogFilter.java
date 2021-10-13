package helpers;

import java.io.IOException;
import java.util.logging.Level;

import annotations.Authenticate;
import auth.AuthenticationFilter;
import auth.SessionManagement;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;
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
		
		String additionalInfo="";
		if(requestContext.getHeaderString(Settings.getSingleton().getFilePathHeader())!=null) {
			additionalInfo+=" , "+Settings.getSingleton().getFilePathHeader()+" = '"+requestContext.getHeaderString(Settings.getSingleton().getFilePathHeader())+"'";
		}
		if(requestContext.getUriInfo().getQueryParameters()!=null) {
			additionalInfo+=" , URL Params = '"+requestContext.getUriInfo().getQueryParameters()+"'";
		}
		String method = requestContext.getMethod();
		String uri = "/"+requestContext.getUriInfo().getPath();
		if(!uri.equals("/tr/runningcount")) {
			Log.log(Level.INFO, "API Call by "+userName+" - "+method+" "+uri+additionalInfo);
		}
	}
}
