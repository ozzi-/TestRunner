package pojo;

import java.util.ArrayList;
import java.util.logging.Level;

import helpers.Log;


public class TestCategoriesList {
	private ArrayList<TestCategory> testCategories = new ArrayList<>();
	
	public void addTestToCategory(String testName, String categoryName) {
		boolean foundCategory=false;
		for (TestCategory testCategory : testCategories) {
			if(testCategory.getCategory().equals(categoryName)) {
				if(foundCategory) {
					Log.log(Level.INFO, "Tests cannot be added to multiple categories. Ignoring mapping of test '"+testName+"' to category '"+categoryName);
				}else {
					foundCategory = true;
					testCategory.getTests().add(testName);					
				}
			}
		}
		if(!foundCategory) {
			testCategories.add(new TestCategory(categoryName,testName));
		}
	}
	
	public String getCategoryOfTest(String testName) {
		for (TestCategory testCategory : testCategories) {
			for (String test : testCategory.getTests()) {
				if(test.equals(testName)) {
					return testCategory.getCategory();
				}
			}
		}
		return "-";
	}
}
