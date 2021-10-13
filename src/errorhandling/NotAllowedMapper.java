package errorhandling;

import java.util.logging.Level;

import helpers.Log;
import jakarta.ws.rs.NotAllowedException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
@jakarta.annotation.Priority(1)

public class NotAllowedMapper implements ExceptionMapper<NotAllowedException> {
	@Override
	public Response toResponse(NotAllowedException ex) {
		Log.log(Level.INFO, "Unsupported method");
		return Response.status(405).entity(ex.getMessage()).type("text/plain").build();
	}
}