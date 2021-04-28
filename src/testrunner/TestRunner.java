package testrunner;

import java.util.logging.Level;

import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.spi.Container;
import org.glassfish.jersey.server.spi.ContainerLifecycleListener;

import auth.UserManagement;
import helpers.Log;
import helpers.PathFinder;
import persistence.Persistence;


public class TestRunner extends ResourceConfig implements ContainerLifecycleListener {
	
	// TODO synchronize all git operations!
	// TODO copy test
	// TODO edit test name
	// TODO scriptadd -> folder create & delete functionality
	// TODO results create but don't change a file -> this logs git warning, improve code or exclude check for ADD result
	// TODO CLI args are comma seperated in test, additional tags via space!
		
	// TODO frontend JS refactoring 
	// TODO remove inline CSS and JS etc (i.E. innerHTML) in order to be able to set a strict CSP

	// TODO different OS -> TestRunner satellite agents 
	// TODO creating results gives git error (check log for potential others)
	// TODO frontend - collapsed groups will have too low column width
	// TODO frontend -> show and edit users role
	
	@Override
	public void onReload(Container container) {
		Log.log(Level.INFO, "Test Runner - onReload received");
		Log.closeHandle();
		Persistence.gitClose();
	}

	@Override
	public void onShutdown(Container container) {
		Log.log(Level.INFO, "Test Runner - onShutdown received");
		Log.closeHandle();
		Persistence.gitClose();
	}

	@Override
	public void onStartup(Container container) {
		final String version = "1.5";
		try {
			String logBasePath = PathFinder.getLogPath();
			PathFinder.createFolderPath(logBasePath);
			Log.setup(logBasePath+"testrunner.log");
			Log.log(Level.INFO, "Starting Test Runner - "+version+" - meep meep - base path is \""+PathFinder.getBasePath()+"\"");
			
			Persistence.gitInit();
			UserManagement.loadUsers();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		try {
			Persistence.checkFilePermissions();
		} catch (Exception e) {
			Log.log(Level.SEVERE, "Exception encountered while checking file permissions: "+e.getMessage()+" - "+e.getCause());
			e.printStackTrace();
		}
		
		packages("services");
	}
}
