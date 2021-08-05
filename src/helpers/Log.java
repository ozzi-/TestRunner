package helpers;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.Queue;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

import org.apache.commons.collections4.QueueUtils;
import org.apache.commons.collections4.queue.CircularFifoQueue;

public class Log {
	static Logger logger;
	private static boolean pathSet = false;
	private static ArrayList<LogEntry> backLog = new ArrayList<LogEntry>();
	private static String testRunnerLogPrefix = "TestRunner";
	private static FileHandler fileH;
	private static Queue<String> fifoLog;
    private static SimpleDateFormat dateTimeFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  


	public static void setup(String path) {
		pathSet = true;
		logger = Logger.getLogger(Log.class.getName());
		logger.setLevel(Level.INFO);
		fifoLog = QueueUtils.synchronizedQueue(new CircularFifoQueue<String>(1000));

		try {
			fileH = new FileHandler(path, 1000000, 10);
			SimpleFormatter formatterTxt = new SimpleFormatter();
			fileH.setFormatter(formatterTxt);
			logger.addHandler(fileH);
		} catch (SecurityException e) {
			e.printStackTrace();
			System.err.println("Security Exception while creating logger. Exiting (2)");
			System.exit(2);
		} catch (java.nio.file.NoSuchFileException e) {
			e.printStackTrace();
			System.err.println("Could not write log file, have you set a invalid logPath in config.properties? Exiting (2)");
			System.exit(2);
		} catch (IOException e) {
			e.printStackTrace();
			System.err.println("IO Exception while creating logger. Exiting (2)");
			System.exit(2);
		}
	}

	public static void closeHandle() {
		fileH.close();
	}

	public static void setLogPath(String path) {
		pathSet = true;
		setup(path);
		for (LogEntry logEntry : backLog) {
			log(logEntry.getLevel(), logEntry.getMessage());
		}
	}

	public static String getRecentLogEntries() {
		synchronized (fifoLog) {
			StringBuilder res = new StringBuilder();
			Iterator<String> i = fifoLog.iterator(); // Must be in synchronized block
			while (i.hasNext()) {
				res.append(i.next()+"\n");
			}
			return res.toString();
		}
	}

	public static void log(Level level, String log) {
		if (pathSet) {
			logger.log(level, testRunnerLogPrefix + " - " + log);
			fifoLog.add(dateTimeFormatter.format(new Date()) + "["+level+"] " + " - " + log);
			if (level.equals(Level.SEVERE)) {
				System.err.println(testRunnerLogPrefix + " - " + level.getName() + ": " + log);
			} else {
				System.out.println(testRunnerLogPrefix + " - " + level.getName() + ": " + log);
			}
		} else {
			backLog.add(new LogEntry(level, log));
		}
	}
}
