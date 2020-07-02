package pojo;

public class GroupTestAbstraction {
	private String name;
	private String path;
	
	public GroupTestAbstraction(String name, String path) {
		this.setName(name);
		this.setPath(path);
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
}