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
	
	// TODO shabby performance on chrome based browsers - /testrunner/frontend/index.html?page=testgroupsettings
	// [Violation] 'readystatechange' handler took 4425ms
	// [Violation] Forced reflow while executing JavaScript took 690ms
		
	// TODO Solve todos in tests.js

	// TODO show running tasks as list?
	// TODO different OS -> TestRunner satellite agents 
	// TODO frontend - collapsed groups will have too low column width
	
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
