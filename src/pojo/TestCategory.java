package pojo;

import java.util.ArrayList;

public class TestCategory {
	private ArrayList<String> tests = new ArrayList<>();
	private String category;
	
	public TestCategory(String category) {
		this.setCategory(category);
	}
	
	public TestCategory(String category, String testName) {
		this.setCategory(category);
		this.getTests().add(testName);
	}

	public ArrayList<String> getTests() {
		return tests;
	}

	public void setTests(ArrayList<String> tests) {
		this.tests = tests;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
}
