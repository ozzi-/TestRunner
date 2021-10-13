package errorhandling;

import java.util.logging.Level;

import helpers.Log;
import jakarta.annotation.Priority;
import jakarta.ws.rs.NotSupportedException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
@Priority(1)
public class UnsupportedMediaTypeMapper implements ExceptionMapper<NotSupportedException> {
	@Override
	public Response toResponse(NotSupportedException ex) {
		Log.log(Level.INFO, "Unsupported media type");
		return Response.status(415).entity(ex.getMessage()).type("text/plain").build();
	}
}