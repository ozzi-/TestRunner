'use strict';
var sun = "&#9728";
var cloud = "&#127785;";
var trToken = "TR_Token";
var trRole = "TR_Role";
var sessionHeaderName ="X-TR-Session-ID";
var pageIndex=0;

var htmlFormatter = function(cell, formatterParams){
    var data = cell.getData();
    return cell.getValue();
}


// ************
// * Settings *
// ************

function changeOthersPassword(){
	var username = document.getElementById("changeUsername").value;
	var password = document.getElementById("changePassword").value;
	var changeObj = new Object();
	changeObj.password  = password;
	doRequestBody("PUT", JSON.stringify(changeObj), "application/json", "../user/"+username+"/password", proccessPasswordChangeForUser, true, true);
	return false;
}


function createUser(){
	var username = document.getElementById("createUsername").value;
	var password = document.getElementById("createPassword").value;
	var role = document.getElementById("createRole").value;
	var changeObj = new Object();
	changeObj.username = username;
	changeObj.password  = password;
	changeObj.role  = role;
	doRequestBody("POST", JSON.stringify(changeObj), "application/json", "../user/", processCreateUser, true, true);
	return false;
}

function deleteUser(){
	var username = document.getElementById("deleteUsername").value;
	doRequestBody("DELETE", JSON.stringify({}), "application/json", "../user/"+username, processDeleteUser, true, true);
	return false;
}


function changeMyPassword(){
	var password = document.getElementById("myPassword").value;
	var passwordObj = new Object();
	passwordObj.password  = password;
	doRequestBody("PUT", JSON.stringify(passwordObj), "application/json", "../user/password", proccessPasswordChange, true, true);
	return false;
}

function proccessPasswordChange(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Password changed successfully - for security reasons, you will now be logged out");
		doLogout();
	}
}

function processCreateUser(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("User created");
		location.reload();
	}
}


function processDeleteUser(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("User deleted");
		location.reload();
	}
}

// TODO refactor all the CRUD callbacks . . . 

function groupDeleted(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Group deleted");
		location.reload();
	}
}

function testDeleted(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Test deleted");
		window.location.replace("index.html");
	}
}

function categoryDeleted(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		// TODO don't really need a reload here, migth as well add the row to tabulator 
		alert("Category deleted");
		location.reload();
	}
}

function categoryCreated(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Category created");
		// TODO don't really need a reload here, migth as well add the row to tabulator 
		location.reload();
	}	
}

function groupCreated(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Group created");
		location.reload();
	}
}

function groupEdited(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}
}

function categoryEdited(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}
}


function proccessPasswordChangeForUser(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Password changed");
		location.reload();
	}
}

function proccessTestEdited(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Edited Test");
		var testName = getQueryParams(document.location.search).name;
		window.location.replace("index.html?page=results&name="+testName);
	}
}

function proccessTestCreated(response, testName){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Created Test");
		window.location.replace("index.html?page=results&name="+testName);
	}
}

// *************
// * Login/out *
// *************
function doLogin(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var loginObj = new Object();
	loginObj.username = username;
	loginObj.password  = password;
	var toPage = "";
	var redir = getQueryParams(document.location.search).redir;
	if(redir){
		toPage = atob(redir);
	}
	doRequestBody("POST", JSON.stringify(loginObj), "application/json", "../user/login/", processLoginResult, [toPage], false);
	return false;
}

function processLoginResult(response, toPage){
	if(response.status!=200){
		alert(response.responseText);
		document.getElementById("password").value="";
	}else{
		var session = JSON.parse(response.responseText);
		localStorage.setItem(trToken,session.sessionIdentifier);
		localStorage.setItem(trRole,session.role);
		if(toPage.startsWith("?")){ // prevent open redirect
			window.location.replace("index.html"+toPage);
		}else{
			window.location.replace("index.html");
		}
	}
}

function doLogout() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			localStorage.removeItem(trToken);
			localStorage.removeItem(trRole);
			goToLoginPage();
		}
	};
	request.open("POST", "../user/logout");
	request.setRequestHeader(sessionHeaderName, localStorage.getItem(trToken));
	request.send();
}

function goToLoginPage(){
	var currentPage =  window.location.search;
	if(currentPage==="?page=login" || currentPage==="?page=logout"){
		currentPage="";
	}
	window.location.replace("index.html?page=login&redir="+btoa(currentPage));	
}

// ********
// * Edit *
// ********

function saveTest(){
	var test = new Object();
	test.settings = {};
	test.settings.successHook = document.getElementById("successHook").value;
	test.settings.failureHook = document.getElementById("failureHook").value;
	test.test = {};
	test.test.description = document.getElementById("description").value;
	
	var taskCounter = 1;
	test.test.tasks = [];
	while (document.getElementById("taskName_"+taskCounter)!==null) {
		if(!document.getElementById("taskDiv_"+taskCounter).getAttribute("removed")){
			var task = new Object();
			task.name = document.getElementById("taskName_"+taskCounter).value;
			task.path = document.getElementById("taskPath_"+taskCounter).value;
			task.args = document.getElementById("taskArgs_"+taskCounter).value.split(",");
			task.timeout = document.getElementById("taskTimeout_"+taskCounter).value;
			test.test.tasks.push(task);			
		}
		taskCounter++;
	}
	
	var testName = getQueryParams(document.location.search).name;
	if(testName==undefined){
		testName = document.getElementById("testName").value;
		doRequestBody("POST", JSON.stringify(test), "application/json", "../manage/test/"+testName, proccessTestCreated,[testName], true);
	}else{
		doRequestBody("PUT", JSON.stringify(test), "application/json", "../manage/test/"+testName, proccessTestEdited, true, true);		
	}
	return false;
}

// *******
// * Run *
// *******

function runCustomTest(){
	var tag = document.getElementById("tag").value;
	if(tag.length<1){
		alert("Please provide string to tag this test run.");
		return;
	}
	var tagValid = document.getElementById("tag").checkValidity();
	if(!tagValid){
		alert("Tags may only contain letters, numbers and underscores.");
		return;
	}

	var args = document.getElementById("args").value;
	 
	var name = getQueryParams(document.location.search).name;
	if(name=="undefined" || name === undefined ){
		name = getQueryParams(document.location.search).groupname;
		location.assign('index.html?page=run&groupname='+name+"&tag="+encodeURIComponent(tag)+"&args="+encodeURIComponent(args));
	}else{
		location.assign('index.html?page=run&name='+name+"&tag="+encodeURIComponent(tag)+"&args="+encodeURIComponent(args));
	}
}

function runTest(res,name,paramName) {
	runInternal(res, name ,paramName, "getStatus");
}

function runTestGroup(res,name,paramName) {
	runInternal(res, name ,paramName, "getGroupStatus");
}

function runInternal(res, name, paramName, call){
	var pollTime = 1200;
	var handle = res.handle;	
	function doPoll() {
		var tag = getQueryParams(document.location.search).tag;
		var handleS = handle;
		if(tag!="undefined" && tag!==undefined){
			handleS = handleS+"_"+tag
		}
		doRequest("GET", "../"+call+"/" + name + "/" + handleS, poll, [name,paramName, poller, handleS]);
	}
	doPoll();
	var poller;
	poller = setInterval(doPoll, pollTime);
}

function poll(res,name,paramName, poller, handle) {
	document.getElementById("state").textContent=res.state;
	if(res.state=="done"){
		removeLoader();
		if(poller === undefined || poller == "undefined" || poller != null){
			clearInterval(poller);			
		}
		window.location.replace("index.html?page=result&"+paramName+"="+ name + "&handle="+ handle);
	}
}


// ********
// * List *
// ********
var scriptsTable;

function listScripts(scripts){
	removeLoader();
	
	var scriptObjArr = [];
	for(var i = 0; i < scripts.length; i++){
		var scriptObj = {};
		scriptObj.path = scripts[i];
		console.log(scriptObj.pathLink);
		scriptObjArr.push(scriptObj);
	}	
		
	scriptsTable = new Tabulator("#scriptsTable", {
		layoutColumnsOnNewData:true,
	    layout:"fitDataFill",
	    columns:[
	    	{title:"Path", field:"path", formatter:htmlFormatter},
	    ],
	    rowClick:function(e, id, data, row){
	        var id = id._row.data.path;
			window.location.href='index.html?page=script&name='+encodeURIComponent(id);
	    }
	});
	scriptsTable.setData(scriptObjArr);
	
	if(scripts.length==0){
		scriptsTable.addRow([{path:"No scripts found yet"}], false);
		scriptsTable.redraw(true);
	}

	var filterInput = document.getElementById("filterInputScripts");
	
	filterInput.addEventListener("keyup", event => {
		scriptsTable.setFilter("path", "like", document.getElementById("filterInputScripts").value);
		// TODO why does tabulator.js scroll around like crazy on FF
		//window.scrollTo(0,document.body.scrollHeight);
	});
}

function loadScriptEdit(script){
	document.getElementById('editor').value=script;
	var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
	    mode: "javascript",
	    lineNumbers: true,
	});
	removeLoader();
}

function insertRunningCount(res){
	document.getElementById("runningTestsSpan").style="";
	document.getElementById("runningTests").textContent=res.count;
}

function listTests(tests) {
	var testCount = tests.length;
	removeLoader();
	var table;
	if(localStorage.getItem(trRole)==="r"){
		table = new Tabulator("#testsTable", {
			layoutColumnsOnNewData:true,
		    layout:"fitDataFill",
		    groupBy:"category",
		    columns:[
		    {title:"Test", field:"testLink", minWidth:300, formatter:htmlFormatter},
		    {title:"Status", field:"runState", minWidth:70, formatter:htmlFormatter},
		    {title:"Last Run", field:"lastRunDate" , minWidth:170},
		    {title:"Last Run Time", field:"lastRunTime"},
		    ],
		});
	}else{
		table = new Tabulator("#testsTable", {
			layoutColumnsOnNewData:true,
		    layout:"fitDataFill",
		    groupBy:"category",
		    columns:[
		    {title:"Test", field:"testLink",  formatter:htmlFormatter},
		    {title:"Run", field:"runLink",  minWidth:70, formatter:htmlFormatter},
		    {title:"Custom", field:"runTLink",  minWidth:70, formatter:htmlFormatter},
		    {title:"Status", field:"runState", minWidth:70, formatter:htmlFormatter},
		    {title:"Last Run", field:"lastRunDate"},
		    {title:"Last Run Time", field:"lastRunTime"},
		    ],
		});
	}

	if(testCount==0){
		table.addRow([{test:"No tests defined yet", run:"", status:"", lastRun: "", lastRunTime:""}], false);
	}
	for (var i = 0; i < testCount; i++) {
		tests[i].testLink = "<a href=\"index.html?page=results&name="+tests[i].name+"\">"+tests[i].name+"</a>";
		tests[i].runLink = "<a style=\"text-decoration:none;\" href=\"index.html?page=run&name="+tests[i].name+"\"> &#9654; </a>";
		tests[i].runTLink = "<a style=\"text-decoration:none;\" href=\"index.html?page=custom&name="+tests[i].name+"\"> &#128221; </a>";
		tests[i].runState = tests[i].lastRunPassed ? sun : cloud;
		tests[i].runState = tests[i].lastRunDate.length==0 ? "-" : tests[i].runState;
		tests[i].lastRunTime = timeConversion(tests[i].totalRunTimeInMS);
	}
	table.setData(tests);
	var filterInput = document.getElementById("filterInputTests");
	var timer;
	filterInput.onkeyup = function(){
		timer = setTimeout(function() {	
			var filterInput = document.getElementById("filterInputTests");
			table.setFilter(matchAny, [filterInput.value,"name"]);
		},700)
	}
	filterInput.onkeydown = function(){
		clearTimeout(timer);
	}
}



function matchAny(data, filterParams){
    var match = false;
    var searchTerm = filterParams[0];
    var columnName = filterParams[1];
    // empty search string means all match
    if(searchTerm==""){
    	return true;
    }
   
	var searchTermRaw = searchTerm.toLowerCase();
	var searchTerms = searchTermRaw.split(" ");
	var searchTermsCount = 0;
	var matches = 0;
	
	for (var i = 0; i < searchTerms.length; i++) {
		var alreadyMatchedSearchTerm = false;
		var searchTerm = searchTerms[i];
		if(searchTerm!="" && searchTerm!=" "){
			for(var key in data){
				if(key===columnName){
					var value = String(data[key]).toLowerCase();
					if(value.includes(searchTerm)){
						return true;
					}					
				}
		    }
		}
	}  
    return false;
}

function addTestCategoryEntry(){
	var test = document.getElementById("testNameSelect").value;
	var category = document.getElementById("categoryNameSelect").value;
	testCategoriesTableHandle.addRow([{name: test,category:category}], false);
	var obj = {};
	obj.test=test;
	doRequestBody("PUT", JSON.stringify(obj), "application/json", "../manage/category/"+category, categoryEdited, true, true);
	var x = document.getElementById("testNameSelect");
	x.remove(x.selectedIndex); 
	document.getElementById("addTestGroupMappingForm").reset();
	return false;
}


function addTestGroupEntry(){
	var test = document.getElementById("testNameSelect").value;
	var group = document.getElementById("testGroupSelect").value;
	var name = document.getElementById("testName").value;
	testGroupsTableHandle.addRow([{test: test, name:name, group:group}], false);
	addTestGroupMappingForm.reset();
	
	var obj = {};
	obj.test=test;
	obj.name=name;
	doRequestBody("PUT", JSON.stringify(obj), "application/json", "../manage/group/"+group, groupEdited, true, true);

	return false;
}


function loadTestSettingsPage(tests){
	doRequest("GET", "../category", listTestCategories,[tests]);
}

function listTestCategories(categories, tests){
	removeLoader();

	var testObjs = [];
	var testInCategories = [];

	var plainCategories = Object.keys(categories);

	var sel = document.getElementById("categoryNameSelect");
	var sel2 = document.getElementById("categoryNameDelete");
	for (var i = 0; i < plainCategories.length; i++) {
		var option = document.createElement("option");
		option.text = plainCategories[i];
		sel.add(option);
		var option2 = document.createElement("option");
		option2.text = plainCategories[i];
		sel2.add(option2);
		testInCategories = testInCategories.concat(categories[plainCategories[i]]);
	}
	
	console.log(testInCategories);
	var sel2 = document.getElementById("testNameSelect");
	for (var i = 0; i <tests.length; i++) {
		if(!testInCategories.includes(tests[i].name)) {
			var option = document.createElement("option");
			option.text = tests[i].name;
			sel2.add(option);
		}
		var testObj = {name:tests[i].name, category:tests[i].category}
		testObjs.push(testObj);			
			
	}
	
	testCategoriesTableHandle = new Tabulator("#testcategories", {
	    groupBy:"category",
	    groupStartOpen:false,
	    layout:"fitDataFill",
	    groupValues:[plainCategories],
	    columns:[
	        {title:"Test", field:"name", width:400},
	        {formatter:"buttonCross", align:"center", title:"", headerSort:false, cellClick:function(e, cell){
	        	if(confirm('Are you sure you want to remove this test from the category?'))
	        		var testName = cell.getRow()._row.data.name;
	        		var categoryName = cell.getRow()._row.data.category;
	        		var obj={};
	        		doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/category/"+categoryName+"/"+testName, categoryEdited, true, true);
	        		var sel = document.getElementById("testNameSelect");
	        		var option = document.createElement("option");
	        		option.text = testName;
	        		sel.add(option);
	        		cell.getRow().delete();
	        	}
	        }
	     ],
	});
	testCategoriesTableHandle.setData(testObjs);
}

function listGroupSettingsTestNames(tests){
	//document.getElementById("addTestGroupMappingForm").addEventListener('onsubmit', addTestGroupEntry);
	var sel = document.getElementById("testNameSelect");
	for (var i = 0; i < tests.length; i++) {
		var option = document.createElement("option");
		option.text = tests[i].name;
		sel.add(option);
	}
}

var testGroupsTableHandle;
var testCategoriesTableHandle;

function createTestGroup(){
	var groupName = document.getElementById("groupName").value;
	var obj =  {};
	obj.name=groupName;
	doRequestBody("POST", JSON.stringify(obj), "application/json", "../manage/group/", groupCreated, true, true);

	return false;
}

function createCategory(){
	var categoryName = document.getElementById("categoryName").value;
	var obj =  {};
	obj.name=categoryName;
	doRequestBody("POST", JSON.stringify(obj), "application/json", "../manage/category/", categoryCreated, true, true);

	return false;
}

function deleteTestGroup(){
	var groupName = document.getElementById("testGroupSelectDelete").value
	var obj={};
	doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/group/"+groupName, groupDeleted, true, true);
	return false;
}


function deleteCategory(){
	var categoryName = document.getElementById("categoryNameDelete").value
	var obj={};
	doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/category/"+categoryName, categoryDeleted, true, true);
	return false;
}

function listGroupSettings(groups){
	var groupNames=[];
	
	
	var sel = document.getElementById("testGroupSelect");
	var sel2 = document.getElementById("testGroupSelectDelete");
	
	for (var i = 0; i < groups.length; i++) {
		groupNames.push(groups[i].name);
		var option = document.createElement("option");
		option.text = groups[i].name;
		sel.add(option);
		
		var option2 = document.createElement("option");
		option2.text = groups[i].name;
		sel2.add(option2);
	}
	removeLoader();
	
	testGroupsTableHandle = new Tabulator("#testgroups", {
	    groupBy:"group",
	    groupStartOpen:false,
	    layout:"fitDataFill",
	    groupValues:[groupNames],
	    columns:[
	        {title:"Test", field:"test", width:400},
	        {title:"Name", field:"name", width:400},
	        {formatter:"buttonCross", align:"center", title:"", headerSort:false, cellClick:function(e, cell){
	        	if(confirm('Are you sure you want to remove this test from the group?'))
	        		var testName = cell.getRow()._row.data.test;
	        		var groupName = cell.getRow()._row.data.group;
	        		var obj={};
	        		doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/group/"+groupName+"/"+testName, groupEdited, true, true);
	        		cell.getRow().delete();
	        	}
	        }
	     ],
	});
	// TODO refactor to use setData and prepare array first
	for (var i = 0; i < groups.length; i++) {
		var groupTests = groups[i].tests;
		for (var x = 0; x < groupTests.length; x++) {
			testGroupsTableHandle.addRow([{test:groupTests[x].test, name:groupTests[x].name, group:groups[i].name}], false);
		}
	}
	
	testGroupsTableHandle.redraw(true);
}

function listGroups(groups){
	var groupCount = groups.length;
	removeLoader();
	var table;
	if(localStorage.getItem(trRole)==="r"){
		table = new Tabulator("#testGroupsTable", {
			layoutColumnsOnNewData:true,
		    layout:"fitDataFill",
		    columns:[
			    {title:"Group", field:"groupLink", formatter:htmlFormatter},
			    {title:"Description", field:"description", formatter:htmlFormatter},
			    {title:"Tests", field:"tests",  width:300},
			    {title:"Status", field:"runState", formatter:htmlFormatter},
			    {title:"Last Run", field:"lastRunDate" },
			    {title:"Last Run Time", field:"lastRunTime"},
		    ],
		});
	}else{
		table = new Tabulator("#testGroupsTable", {
			layoutColumnsOnNewData:true,
		    layout:"fitDataFill",
		    columns:[
		    {title:"Group", field:"groupLink",  formatter:htmlFormatter},
		    {title:"Description", field:"description", formatter:htmlFormatter},
		    {title:"Tests", field:"tests", width:300},
		    {title:"Run", field:"runLink", minWidth:70, formatter:htmlFormatter},
		    {title:"Custom", field:"runTLink", minWidth:70, formatter:htmlFormatter},
		    {title:"Status", field:"runState", formatter:htmlFormatter},
		    {title:"Last Run", field:"lastRunDate"},
		    {title:"Last Run Time", field:"lastRunTime"},
		    ],
		});
	}
	if(groupCount==0){
		table.addRow([{group:"No Groups defined yet", tests:"", run:"", status:"", lastRun: "", lastRunTime:""}], false);
	}
	for (var i = 0; i < groupCount; i++) {
		var tests ="";
		for(var j = 0; j < groups[i].tests.length; j++){
			tests+=groups[i].tests[j].name+"("+groups[i].tests[j].test+") , ";
		}
		groups[i].tests = tests.slice(0, -2); // remove trailing ,_
		
		groups[i].groupLink = "<a href=\"index.html?page=results&groupname="+groups[i].name+"\">"+groups[i].name+"</a>";
		groups[i].runLink = "<a style=\"text-decoration:none;\" href=\"index.html?page=run&groupname="+groups[i].name+"\"> &#9654; </a>";
		groups[i].runTLink = "<a style=\"text-decoration:none;\" href=\"index.html?page=custom&groupname="+groups[i].name+"\"> &#128221; </a>";
		groups[i].runState = groups[i].lastRunPassed ? sun : cloud;
		groups[i].status = groups[i].lastRunDate.length==0 ? "-" : groups[i].runState;
		groups[i].lastRunTime = timeConversion(groups[i].totalRunTimeInMS);
	}
	table.setData(groups);
	
	if(localStorage.getItem(trRole)==="rwe" || localStorage.getItem(trRole)==="a" ){
		document.getElementById("testGroupsSettings").style.display="";
		document.getElementById("testSettings").style.display="";
		//document.getElementById("scriptSettings").style.display="";
	}
}

function loadMore(){
	var paramName;
	pageIndex++;
	document.getElementById("loadmore").disabled = true;
	
	var isGroup=false;
	var name = getQueryParams(document.location.search).name;
	if(name=="undefined" || name === undefined ){
		isGroup=true;
		name = getQueryParams(document.location.search).groupname;
	}
	
	if(isGroup){
		paramName="groupname";
		doRequest("GET", "../getGroupResults/"+name+"/"+pageIndex, addResults,[paramName]);
	}else{
		paramName="name";
		doRequest("GET", "../getResults/" + name+"/"+pageIndex, addResults,[paramName]);
	}
}

function addResults(results,paramName){
	var resultCount = results.length;
	
	if(resultCount==0) {
		document.getElementById("loadmore").disabled = true;
		document.getElementById("loadmore").textContent = "no further results";
		return;
	}
	
	var table = document.getElementById("resultsSpan").tableHandle;
	
	for (var i = 0; i < resultCount; i++) {
		var a = document.createElement("a");
		var passed = true;
		for (var j = 0; j < results[i].result.results.length; j++) {
			passed = results[i].result.results[j].passed;
			if(!passed){
				break;
			}
		}
		results[i].status = (passed==true ? " "+sun: " "+cloud);
		results[i].lastRun = "<a href=\"index.html?page=result&"+paramName+"="+results[i].result.testName+"&handle="+ results[i].handle+"\">"+results[i].result.testStartString+"</a>";
	}
	table.addData(results);
	document.getElementById("loadmore").disabled = false;
}

function listResults(results,paramName) {
	removeLoader();
	var testName = document.getElementById("testName");
	var runLink = document.getElementById("runLink");
	var editLink = document.getElementById("editLink");

	var isGroup=false;
	var name = getQueryParams(document.location.search).name;
	if(name === undefined || name == "undefined"){
		name = getQueryParams(document.location.search).groupname;
		isGroup=true;
	}
	testName.innerHTML = escapeHtml(name);
	
	// TODO build dom elements properly instead of using innerHTML
	if(localStorage.getItem(trRole)!=="r"){
		if(isGroup){
			runLink.innerHTML = '<button type="button" class="btn btn-primary" onclick="location.assign(\'index.html?page=run&groupname='+escapeHtml(name)+'\')"> Run Test Group &#9654;</button>&nbsp;';			
		}else{
			runLink.innerHTML = '<button type="button" class="btn btn-primary" onclick="location.assign(\'index.html?page=run&name='+escapeHtml(name)+'\')"> Run Test &#9654;</button>&nbsp;';			
		}
	}
	
	if(localStorage.getItem(trRole)==="rwe" || localStorage.getItem(trRole)==="a"){
		if(isGroup){
			editLink.innerHTML = '<button type="button" class="btn btn-primary" onclick="location.assign(\'index.html?page=edit&groupname='+escapeHtml(name)+'\')"> Edit Test Group</button>&nbsp;';			
		}else{
			editLink.innerHTML = '<button type="button" class="btn btn-primary" onclick="location.assign(\'index.html?page=edit&name='+escapeHtml(name)+'\')"> Edit Test</button>&nbsp;';			
		}
	}

	
	var resultCount = results.length;
	var resultsSpan = document.getElementById("resultsSpan");
	if(resultCount==0){
		resultsSpan.innerHTML = "<i>This test has not been run yet.</i>";
	}else{	
		results = results.sort((a, b) => (a.handle < b.handle) ? 1 : -1);

		var table = new Tabulator("#resultsSpan", {
		    layout:"fitDataFill",
		    columns:[
		    {title:"Status", field:"status", formatter:htmlFormatter},
		    {title:"Last Run", field:"lastRun", formatter:htmlFormatter, minWidth:170},
		    {title:"Tag", field:"tagS", minWidth:50},
		    ],
		});
		document.getElementById("resultsSpan").tableHandle = table;
		
		for (var i = 0; i < resultCount; i++) {
			var passed = true;
			for (var j = 0; j < results[i].result.results.length; j++) {
				passed = results[i].result.results[j].passed;
				if(!passed){
					break;
				}
			}
			results[i].status = (passed==true ? " "+sun: " "+cloud);
			results[i].tagS = results[i].tag !== undefined ? results[i].tag : "";
			results[i].lastRun = "<a href=\"index.html?page=result&"+paramName+"="+results[i].result.testName+"&handle="+ results[i].handle+"\">"+results[i].result.testStartString+"</a>";
		}
		table.setData(results);
	}
}


function listResult(result) {
	removeLoader();
	var style = ' style="color:green;" ';
	for (var i = 0; i < result.results.length; i++) {
		if(! result.results[i].passed){
			style=' style="color:red;" ';
		}
	}
	var infoSpan = document.getElementById("info");
	infoSpan.innerHTML = ("<h3"+style+">" + escapeHtml(result.testName) + " - "
			+ result.testStartString + "</h3>");
	infoSpan.innerHTML += "<b>Run by</b>: "+escapeHtml(result.testRunBy)+"&nbsp;&nbsp; <b>Description</b>: "+ escapeHtml(result.description) + "<br><hr>";

	var resultsSpan = document.getElementById("results");
	for (var i = 0; i < result.results.length; i++) {
		// tests in groups have a descriptive name
		var descriptiveName =  result.results[i].descriptiveName==undefined?"":"<b>"+result.results[i].descriptiveName+ "</b> - ";
		resultsSpan.innerHTML += "<h3>"+descriptiveName+result.results[i].name + " " + (result.results[i].passed == false ? cloud : sun) + "</h3>"
				+ "<b>Result</b>: <i>"+ escapeHtml(result.results[i].description) + "</i><br>"
				+ "<b>Output:</b><br> "+ escapeHtml(result.results[i].output).replace(/\n/g, "<br />") + " <br> " 
				+ "<b>Error Output:</b><br> " + escapeHtml(result.results[i].errorOutput).replace(/\n/g, "<br />") + "<br>"
				+ "<b>Runtime: </b> "+ escapeHtml(result.results[i].runTimeInMS) + " ms<br> "
				+ "<br><hr><br>";
	}
}

function listTestContent(result){
	var form = createTestMask(result,true);
	var testContent = document.getElementById("testContent");
	testContent.append(form);
}

function editTestContent(result){
	removeLoader();
	var form = createTestMask(result,false);
	var testContent = document.getElementById("testContent");
	testContent.append(form);
}

// ***********
// * Network *
// ***********

window.errorReported=false;

function doRequestBody(method, data, type, url, callback, params, sendAuth) {
	var request = new XMLHttpRequest();
	request.ontimeout = function() {
		if(!window.errorReported){
			window.errorReported=true;
			alert("The request for " + url + " timed out.");
		}
	};

	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if (request.status == 200) {
				try { 
					params = [request].concat(params);
					callback.apply(this,params);
				} catch (e) {
					if(!window.errorReported){
						window.errorReported=true;
						alert("Unknown error - could not run callback");
					}
				}
			}else if(request.status==403){
				goToLoginPage();
				return;
			} else {
				try { 
					callback(request);
				} catch (e) {
					if(!window.errorReported){
						window.errorReported=true;
						console.log(e);
						if(isJsonString(e.message)){
							alert("Error ("+request.status+"): "+e.message);							
						}else{
							alert("Unknown error ("+request.status+"): "+request.responseText);	
						}
					}
				}
			}
		}
	};
	request.open(method, url);
	request.timeout = 5000;

	if(sendAuth){
		request.setRequestHeader(sessionHeaderName, localStorage.getItem(trToken));
	}
	request.setRequestHeader("Content-Type", type);
	request.send(data);
}

function doRequest(method, url, callback, params) {
	var request = new XMLHttpRequest();
	
	request.ontimeout = function() {
		if(!window.errorReported){
			window.errorReported=true;
			alert("The request for " + url + " timed out.");
		}
	};
	
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if (request.status == 200) {
				var response = "";
				try { 
					var responseJSON = JSON.parse(request.responseText);
					response = responseJSON;
				} catch (e) {
					response = request.responseText;
				}
				params = [response].concat(params);
				callback.apply(this,params);
			} else {
				try { 
					if(request.status==403){
						goToLoginPage();
						return;
					}else{
						response = JSON.parse(request.responseText);
						alert("Error: " + response.error);						
					}
				} catch (e) {
					if(request.status==404){
						window.location.replace("index.html");
					}else{
						if(!window.errorReported){
							window.errorReported=true;
							alert("Unknown error");	
						}
					}
				}
			}
		}
	};
	
	if(method.toUpperCase()==="GET"){
		var cacheBusterStrng = "cacheBuster=";
		if(!url.includes(cacheBusterStrng)){
			var appendChar = url.includes("?") ? "&" : "?"; 
			url = url + appendChar + cacheBusterStrng + (Math.random()*1000000);
		}
	}
	
	request.open(method, url);
	request.timeout = 5000;

	request.setRequestHeader(sessionHeaderName, localStorage.getItem(trToken));
	request.send();
}

// ********************
// * Helper Functions *
// ********************

function getQueryParams(qs) {
	qs = qs.split('+').join(' ');
	var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
}

function escapeHtml(stn) {
	stn = String(stn);
	return stn.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g,"&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function removeLoader(){
	if(document.getElementById("loader")){
		document.getElementById("loader").remove();					
	}
}

function sha512(str) {
	return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
		return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
	});
}

function reload(){
	window.location.href="index.html";
}

function back(){
	var param = "name";
	var name = getQueryParams(document.location.search).name;
	if(name === undefined || name == "undefined"){
		name = getQueryParams(document.location.search).groupname;
		param = "groupname";
	}
	window.location.href='index.html?page=results&'+param+'='+name;
}

function basePath(path) { 
	removeLoader();
	var basePathSpans = document.getElementsByClassName("basePath");
	for(let i = 0; i < basePathSpans.length; i++){
		basePathSpans[i].textContent = path;
	}		
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

// ********
// * FORM *
// ********

function goToNewTest(){
	window.location.href='index.html?page=new'; 
	return false;
}

function createTestMask(json,disabled){
	var maskSpan = document.createElement("span");
	maskSpan.setAttribute("id","maskSpan");
	if(json==null){
		json={};
		json.settings={};
		json.test={};
		json.test.tasks=[];
	}
	if(json.settings==undefined){
		json.settings={};
	}
	var successHook = createInput("Success Hook", json.settings.successHook, "successHook", disabled,!disabled, false);
	maskSpan.append(successHook);
	maskSpan.append(document.createElement("br"));
	
	var failureHook = createInput("Failure Hook", json.settings.failureHook, "failureHook", disabled,!disabled, false);
	maskSpan.append(failureHook);
	maskSpan.append(document.createElement("br"));

	var description = createInput("Description", json.test.description, "description", disabled,!disabled, false);
	maskSpan.append(description);
	maskSpan.append(document.createElement("br"));
	maskSpan.append(document.createElement("br"));

	var tasksTitle = document.createElement("span");
	tasksTitle.textContent = "Tasks";
	if(!disabled){
		tasksTitle.style.fontWeight = "bold";
	}
	maskSpan.append(tasksTitle);
	maskSpan.append(document.createElement("br"));

	for (var i = 0; i < json.test.tasks.length ; i++) {
		var task = json.test.tasks[i];
		var taskDiv = createTaskDiv(task, i+1, disabled);
		maskSpan.append(taskDiv);
	}

	return maskSpan;
}

function displaySettings(){
	if(localStorage.getItem(trRole)!=="a"){
		document.getElementById("settingsAdmin").remove();		
	}
}

function createTaskDiv(task, i, disabled){
	var tasksDiv = document.createElement("div");
	tasksDiv.setAttribute("id","taskDiv_"+i);
	tasksDiv.setAttribute("class","task");

	var taskName = createInput("Name", task.name, "taskName_"+i, disabled,false,  true);
	tasksDiv.append(taskName);
	tasksDiv.append(document.createElement("br"));
	var taskPath = createInput("Path", task.path, "taskPath_"+i, disabled,false, true);
	tasksDiv.append(taskPath);
	tasksDiv.append(document.createElement("br"));
	var taskArgs = createInput("Arguments", task.args, "taskArgs_"+i, disabled,false,false);
	tasksDiv.append(taskArgs);
	tasksDiv.append(document.createElement("br"));
	var taskTimeout = createInput("Timeout", task.timeout, "taskTimeout_"+i, disabled,false, true);
	tasksDiv.append(taskTimeout);
	tasksDiv.append(document.createElement("br"));
	
	if(!disabled){
		var button = document.createElement("button");
		button.innerHTML = "Remove Task";
		button.onclick=function() { removeTaskDiv(i); return false; }
		button.classList.add("btn");
		button.classList.add("btn-danger");
		button.classList.add("float-right");
		tasksDiv.append(button);
		tasksDiv.append(document.createElement("br"));
		tasksDiv.append(document.createElement("br"));
	}
	return tasksDiv;
}

function deleteTest(){
	var obj={};
	var testName = getQueryParams(document.location.search).name;
	if(confirm('Are you sure you want to delete this test?')){
		doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/test/"+testName, testDeleted, true, true);
	}
}

function addTask(){
	var task = {};
	task.name="";
	task.path="";
	task.args="";
	task.timeout="";	
	var markSpan = document.getElementById("maskSpan");
	var taskDiv = createTaskDiv(task, getCurrentTaskIndex(), false);
	maskSpan.append(taskDiv);
}

function getCurrentTaskIndex(){
	var taskCounter = 0;
	do {
		taskCounter++;
	}while(document.getElementById("taskName_"+taskCounter)!==null);
	return taskCounter;
}

function removeTaskDiv(i){
	document.getElementById("taskDiv_"+i).style.display="none";
	document.getElementById("taskDiv_"+i).setAttribute("removed",true);
	document.getElementById("taskName_"+i).required = false;
	document.getElementById("taskPath_"+i).required = false;
	document.getElementById("taskArgs_"+i).required = false;
	document.getElementById("taskTimeout_"+i).required = false;
}

function initNewTestPage(){
	removeLoader();
	var testContent = document.getElementById("testContent");
	var descriptionSpan = document.createElement("span");
	descriptionSpan.textContent = "Test Name";
	descriptionSpan.style.fontWeight = "bold";		

	testContent.append(descriptionSpan);
	var valueInput = document.createElement("input");
	valueInput.setAttribute("id","testName");
	valueInput.setAttribute("class","form-control");
	testContent.append(valueInput);
	testContent.append(document.createElement("br"));

	var form = createTestMask(null,null);
	testContent.append(form);
	addTask();
}

function createInput(title, value, id, disabled, bold, required){
	var resultSpan = document.createElement("span");
	
	var descriptionSpan = document.createElement("span");
	descriptionSpan.textContent = title;
	if(bold){
		descriptionSpan.style.fontWeight = "bold";		
	}
	resultSpan.append(descriptionSpan);
	
	var descriptionBR = document.createElement("br");
	resultSpan.append(descriptionBR);

	var valueInput = document.createElement("input");
	value = value == undefined? "":value;
	valueInput.setAttribute("value", value);
	valueInput.disabled = disabled;
	valueInput.required = required;
	valueInput.setAttribute("id",id);
	valueInput.setAttribute("class","form-control");
	resultSpan.append(valueInput);
	
	return resultSpan;
}

function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

function timeConversion(millisec) {
    var seconds = (millisec / 1000).toFixed(1);
    var minutes = (millisec / (1000 * 60)).toFixed(1);
    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    
    if (millisec < 1000) {
    	return millisec +" ms"
    } else if (seconds < 60) {
        return seconds + " sec";
    } else if (minutes < 60) {
        return minutes + " min";
    } else if (hours < 24) {
        return hours + " hrs";
    } else {
        return days + " days"
    }
}
