package pojo;

public class LastRunCache {
	private long totalRunTimeInMS;
	private String lastRunDate;
	private boolean lastRunPassed;
	
	public LastRunCache(long totalRunTimeInMS, String lastRunDate, boolean lastRunPassed) {
		this.setTotalRunTimeInMS(totalRunTimeInMS);
		this.setLastRunDate(lastRunDate);
		this.setLastRunPassed(lastRunPassed);
	}

	public long getTotalRunTimeInMS() {
		return totalRunTimeInMS;
	}

	public void setTotalRunTimeInMS(long totalRunTimeInMS) {
		this.totalRunTimeInMS = totalRunTimeInMS;
	}

	public String getLastRunDate() {
		return lastRunDate;
	}

	public void setLastRunDate(String lastRunDate) {
		this.lastRunDate = lastRunDate;
	}

	public boolean didLastRunPass() {
		return lastRunPassed;
	}

	public void setLastRunPassed(boolean lastRunPassed) {
		this.lastRunPassed = lastRunPassed;
	}
}
