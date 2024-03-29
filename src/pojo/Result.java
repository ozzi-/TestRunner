package pojo;
import com.google.gson.JsonObject;

import helpers.Helpers;
import helpers.TRHelper;

public class Result {
	public Result() {
		// default case is we fail
		this.pass = false; 
	}
	
	public String text;
	public String name;
	public String descriptiveName;
	public String output;
	public String errorOutput;
	public int returnCode;
	public boolean pass;
	public long runTimeInMS;
	public long timestampStart;
	public long timestampEnd;
	public String path;
	public String commit;
	public String archiveName;
	public int archiveID;

	@Override
	public String toString() {
		return (pass ? "✓" : "X") + " \"" + name + "\" " + text + " (" + runTimeInMS + " ms)";
	}
	
	public JsonObject toJsonObject() {
		JsonObject res = new JsonObject();
		res.addProperty(TRHelper.NAME, name);
		res.addProperty("commit", commit);
		res.addProperty("path", path);
		res.addProperty("descriptiveName", descriptiveName);
		res.addProperty(TRHelper.PASSED, pass);
		res.addProperty(TRHelper.DESCRIPTION, text);
		res.addProperty("output", output);
		res.addProperty("errorOutput", errorOutput);
		res.addProperty("archiveName", archiveName);
		res.addProperty("archiveID", archiveID);
		res.addProperty(TRHelper.RUN_TIME_IN_MS, runTimeInMS);
		res.addProperty("startTimestamp", timestampStart);
		res.addProperty("endTimestamp", timestampEnd);
		res.addProperty("startDate", Helpers.getDateFromUnixTimestamp(timestampStart));
		res.addProperty("endDate", Helpers.getDateFromUnixTimestamp(timestampEnd));
		return res;
	}
	
	public String toJSONString() {
		return toJsonObject().toString();
	}
}
