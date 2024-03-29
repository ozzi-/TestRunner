package annotations;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import java.lang.annotation.Retention;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import java.lang.annotation.Target;
import jakarta.ws.rs.NameBinding;

@NameBinding
@Retention(RUNTIME)
@Target({ TYPE, METHOD })
public @interface Authenticate {
	public String value() default "ADMIN";
}