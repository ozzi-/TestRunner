package testrunner;

import java.io.File;
import java.util.logging.Level;

import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.spi.Container;
import org.glassfish.jersey.server.spi.ContainerLifecycleListener;

import auth.UserManagement;
import helpers.Log;
import helpers.PathFinder;
import persistence.Persistence;


public class TestRunner extends ResourceConfig implements ContainerLifecycleListener {
	
	// TODO frontend JS refactoring 
	// TODO remove inline CSS and JS etc (i.E. innerHTML) in order to be able to set a strict CSP
	
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
			String logBasePath = PathFinder.getBasePath()+File.separator+"logs"+File.separator;
			PathFinder.createFolderPath(logBasePath);
			
			Log.setup(logBasePath+"testrunner.log");
			Log.log(Level.INFO, "Starting Test Runner - "+version+" - meep meep - base path is \""+PathFinder.getBasePath()+"\"");
			Persistence.gitInit();
			UserManagement.loadUsers();
		} catch (Exception e) {
			e.printStackTrace();
		}
		packages("services");
	}
}
