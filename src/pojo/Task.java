package pojo;

import java.util.ArrayList;

public class Task {
	public String name;
	public String descriptiveName;
	public String path;
	public String commit;
	public ArrayList<String> args = new ArrayList<String>();
	public int timeoutInSeconds = 10;
	public String archivePath;
}