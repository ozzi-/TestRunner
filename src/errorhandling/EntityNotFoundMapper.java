package errorhandling;

import java.util.logging.Level;

import jakarta.annotation.Priority;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import helpers.Log;

@Provider
@Priority(1)
public class EntityNotFoundMapper implements ExceptionMapper<NotFoundException> {
	@Override
	public Response toResponse(NotFoundException ex) {
		Log.log(Level.WARNING, "404 not found");
		return Response.status(404).entity(ex.getMessage()).type("text/plain").build();
	}
}