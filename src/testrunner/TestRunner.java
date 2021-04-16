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
	
	// TODO when running tests, save meta data current commit of test config & script involved
	// TODO revert to old versions of file via UI?
	// TODO dropdown when choosing test scripts?

	// TODO frontend JS refactoring 
	// TODO remove inline CSS and JS etc (i.E. innerHTML) in order to be able to set a strict CSP
	// TODO different OS -> TestRunner satellite agents 
	// TODO create script text button -> repeat error
	// TODO scriptadd -> folder create & delete functionality
	// TODO timeout gives "unknown error" instead of properly handled by frontend
	
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
