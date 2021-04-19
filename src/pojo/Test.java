package pojo;
import java.util.ArrayList;

public class Test {
	public String name;
	public String testName;
	public ArrayList<Commit> commit = new ArrayList<Commit>();
	public long start;
	public ArrayList<Task> tasks = new ArrayList<Task>();
	public String description;
	public String successHook;
	public String failureHook;
	public String tag;
}
