package service;

import java.util.logging.Level;

import helpers.Log;

public class GlobalExceptionHandler implements Thread.UncaughtExceptionHandler {

	@Override
	public void uncaughtException(Thread t, Throwable e) {
		Log.log(Level.SEVERE, "Exception:"+e.getMessage());
	}

}
