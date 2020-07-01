package testRunner;

import java.io.File;
import java.util.logging.Level;

import org.glassfish.jersey.server.ResourceConfig;

import auth.UserManagement;
import helpers.Log;
import helpers.PathFinder;

public class TestRunner extends ResourceConfig {
	public TestRunner() throws Exception {
		
		final String version = "1.1";
		String logBasePath = PathFinder.getBasePath()+File.separator+"logs"+File.separator;
		PathFinder.createFolderPath(logBasePath);
		Log.setup(logBasePath+"testrunner.log");
		Log.log(Level.INFO, "Starting Test Runner - "+version+" - meep meep - base path is \""+PathFinder.getBasePath()+"\"");
		UserManagement.loadUsers();
		packages("services");
	}
}
