package pojo;

public class Commit {
	
	public Commit(String name, String revision) {
		this.revisionOfFile=revision;
		this.nameOfFile=name;
	}
	private String revisionOfFile;
	private  String nameOfFile;
	
	public String getRevisionOfFile() {
		return revisionOfFile;
	}
	public void setRevisionOfFile(String revisionOfFile) {
		this.revisionOfFile = revisionOfFile;
	}
	public String getNameOfFile() {
		return nameOfFile;
	}
	public void setNameOfFile(String nameOfFile) {
		this.nameOfFile = nameOfFile;
	}
	
}
