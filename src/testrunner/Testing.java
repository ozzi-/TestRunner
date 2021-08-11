package testrunner;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.logging.Level;

import org.buildobjects.process.ExternalProcessFailureException;
import org.buildobjects.process.ProcBuilder;
import org.buildobjects.process.ProcResult;
import org.buildobjects.process.StartupException;
import org.buildobjects.process.TimeoutException;

import helpers.Helpers;
import helpers.Log;
import helpers.PathFinder;
import helpers.Settings;
import persistence.Persistence;
import pojo.Result;
import pojo.Results;
import pojo.Task;
import pojo.Test;
import service.CacheService;

public class Testing {
	
	private Testing() {}
	
	public static Results runTest(Test test, boolean group) {
		Results results = new Results();
		results.test = test;
		int taskCounter=0;
		for (Task task : test.tasks) {
			Result result = runTask(task);
			results.results.add(result);
			
			if(task.archivePath!=null && task.archivePath!="") {
				try {
					String archivePath;
					result.archiveID = taskCounter;
					if(group) {
						archivePath = PathFinder.getSpecificTestGroupResultArchivePath(test.name, String.valueOf(test.start), result.archiveID ,false);
					}else {
						archivePath = PathFinder.getSpecificTestResultArchivePath(test.name, String.valueOf(test.start), result.archiveID ,false);			
					}
					Helpers.copyFile(task.archivePath,archivePath);
					result.archiveName = new File(task.archivePath).getName();
				} catch (Exception e) {
					Log.log(Level.WARNING,"Failed to read archive path "+task.archivePath+" for task "+task.descriptiveName+" in test "+test.name+": "+e.getClass().getName());
				}
			}
			taskCounter++;
		}
		return results;
	}
	
	public static void runTestInThread(Test test, boolean group, String userName) {
		new Thread() {
			@Override
			public void run() {
				try {
					Results results = Testing.runTest(test,group);
					boolean allPassed = true;
					for (Result result : results.results) {
						Log.log(Level.FINE,result.toJSONString());
						if(!result.pass) {
							allPassed=false;
						}
					}

					if(allPassed && test.successHook != null && !test.successHook.equals("")) {
						Log.log(Level.INFO, "Running success hook '"+test.successHook+"' for test '"+test.name+"'");
						runPostHook(test.successHook);
					}
					if(!allPassed && test.failureHook != null && !test.failureHook.equals("")) {
						Log.log(Level.INFO, "Running failure hook '"+test.failureHook+"' for test '"+test.name+"'");
						runPostHook(test.failureHook);
					}
					Persistence.persistTestRunAsJSONFile(test, results, group, userName);
				} catch (Exception e) {
					Log.log(Level.WARNING, "Exception while running test '"+test.name+"' in a thread: "+e.getMessage()+" ("+e.getClass().getName()+")");
					e.printStackTrace();				
				} finally {
					Settings.getSingleton().setRunningCount(Settings.getSingleton().getRunningCount()-1);
					CacheService.expireLastRunEntry(test.name+(group?PathFinder.getGroupLabel():""));
				}
			}
		}.start();
	}
	
	private static void runPostHook(String hook) {
		ProcBuilder builder = null;
		try {
			String procPath = isAbsolute(hook)?hook:PathFinder.getTestsPath()+hook;
			builder = new ProcBuilder(procPath).withTimeoutMillis(5*1000);
			builder.run();
		} catch (Exception e) {
			Log.log(Level.WARNING, "Exception running post hook '"+hook+"' - "+e.getMessage());
		}
	}
	
	private static boolean isAbsolute(String path) {
		return new File(path).isAbsolute();
	}

	private static Result runTask(Task task) {
		Log.log(Level.INFO, "Starting task "+task.name);

		Result result = new Result();
		result.path=task.path;
		result.commit=task.commit;
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		ByteArrayOutputStream errout = new ByteArrayOutputStream();
		long startTime = System.nanoTime();
		result.timestampStart=System.currentTimeMillis();
		ProcBuilder builder = null;
		String[] argArray = Helpers.getStringArray(task.args);
		String args="";
		for (String arg : argArray) {
			args += arg+";";
		}
		Log.log(Level.FINER, "Task Args = "+args);
		try {
			String procPath = isAbsolute(task.path)?task.path:PathFinder.getScriptsFolder()+task.path;
			builder = new ProcBuilder(procPath, argArray)
					.withTimeoutMillis(task.timeoutInSeconds*1000)
					.withOutputStream(out)
					.withErrorStream(errout);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		long endTime = 0;

		try {
			if(builder!=null) {
				ProcResult res = builder.run();				
				result.returnCode = res.getExitValue();
				result.text = "Script executed successfully";
				result.pass = true;
			}else {
				Log.log(Level.WARNING, "ProcBuilder == null - cannot run test");
			}
		} catch (TimeoutException ex) {
			result.text = "Script execution longer than timeout";
		} catch (StartupException ex) {
			result.text = "StartupException: "+ex.getMessage();
			ex.printStackTrace();
		} catch (ExternalProcessFailureException ex) {
			result.text = "Script returned non zero return code \""+ex.getExitValue()+"\"";
		}
		
		endTime = System.nanoTime();
		result.output = out.toString();
		result.descriptiveName = task.descriptiveName;
		result.errorOutput = errout.toString();
		Log.log(Level.INFO,"Test ERROR OUTPUT :"+result.errorOutput+" .");
		result.timestampEnd=System.currentTimeMillis();
		long timeElapsed = (endTime - startTime) / 1000000;
		result.runTimeInMS = timeElapsed;
		result.name = task.name;
		
		Log.log(Level.INFO, "Finished test "+task.name+" in "+timeElapsed+" ms - pass = "+result.pass);

		return result;
	}
}
