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
	changeObj.username = username;
	changeObj.password  = password;
	doRequestBody("POST", JSON.stringify(changeObj), "application/json", "../changePasswordForUser/", proccessPasswordChangeForUser, true, true);
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
	doRequestBody("POST", JSON.stringify(changeObj), "application/json", "../createUser/", processCreateUser, true, true);
	return false;
}

function deleteUser(){
	var username = document.getElementById("deleteUsername").value;
	var deleteObj = new Object();
	deleteObj.username = username;
	doRequestBody("POST", JSON.stringify(deleteObj), "application/json", "../deleteUser/", processDeleteUser, true, true);
	return false;
}


function changeMyPassword(){
	var password = document.getElementById("myPassword").value;
	var passwordObj = new Object();
	passwordObj.password  = password;
	doRequestBody("POST", JSON.stringify(passwordObj), "application/json", "../changePassword/", proccessPasswordChange, true, true);
	return false;
}

function proccessPasswordChange(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Password changed successfully - for security reasons, you will be logged out");
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

function proccessPasswordChangeForUser(response){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		alert("Password changed");
		location.reload();
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
	doRequestBody("POST", JSON.stringify(loginObj), "application/json", "../login/", processLoginResult, true, false);
	return false;
}

function processLoginResult(response){
	if(response.status!=200){
		alert(response.responseText);
		document.getElementById("password").value="";
	}else{
		var session = JSON.parse(response.responseText);
		localStorage.setItem(trToken,session.sessionIdentifier);
		localStorage.setItem(trRole,session.role);
		window.location.replace("index.html");
	}
}

function doLogout() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			localStorage.removeItem(trToken);
			localStorage.removeItem(trRole);
			window.location.replace("index.html?page=login");
		}
	};
	request.open("POST", "../logout");
	request.setRequestHeader(sessionHeaderName, localStorage.getItem(trToken));
	request.send();
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

function listTests(tests) {
	var testCount = tests.length;
	removeLoader();
	var table;
	if(localStorage.getItem(trRole)==="rw" || localStorage.getItem(trRole)==="a"){
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
	}else{
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
}

function listGroups(groups){
	var groupCount = groups.length;
	removeLoader();
	var table;
	if(localStorage.getItem(trRole)==="rw" || localStorage.getItem(trRole)==="a"){
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
	}else{
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

	var isGroup=false;
	var name = getQueryParams(document.location.search).name;
	if(name === undefined || name == "undefined"){
		name = getQueryParams(document.location.search).groupname;
		isGroup=true;
	}
	testName.innerHTML = escapeHtml(name);
	
	if(localStorage.getItem(trRole)==="rw" || localStorage.getItem(trRole)==="a"){
		if(isGroup){
			runLink.innerHTML = '<button type="button" class="btn btn-primary" onclick="location.assign(\'index.html?page=run&groupname='+escapeHtml(name)+'\')"> Run Test Group &#9654;</a>';			
		}else{
			runLink.innerHTML = '<button type="button" class="btn btn-primary" onclick="location.assign(\'index.html?page=run&name='+escapeHtml(name)+'\')"> Run Test &#9654;</a>';			
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
			var a = document.createElement("a");
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
	var form = createTestMask(result);
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
				window.location.replace("index.html?page=login");
				return;
			} else {
				try { 
					callback(request);
				} catch (e) {
					if(!window.errorReported){
						window.errorReported=true;
						alert("Unknown error - HTTP code: "+request.status+" - Exception: "+e.message);
						console.log(e);
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
						window.location.replace("index.html?page=login");
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


// ********
// * FORM *
// ********

function createTestMask(json){
	var maskSpan = document.createElement("span");
	if(json.settings==undefined){
		json.settings={};
	}
	var successHook = createInput("Success Hook", json.settings.successhook, true);
	maskSpan.append(successHook);
	maskSpan.append(document.createElement("br"));
	
	var failureHook = createInput("Failure Hook", json.settings.failurehook, true);
	maskSpan.append(failureHook);
	maskSpan.append(document.createElement("br"));

	var description = createInput("Description", json.test.description, true);
	maskSpan.append(description);
	maskSpan.append(document.createElement("br"));
	maskSpan.append(document.createElement("br"));

	var tasksTitle = document.createElement("span");
	tasksTitle.textContent = "Tasks";
	maskSpan.append(tasksTitle);
	maskSpan.append(document.createElement("br"));

	for (var i = 0; i < json.test.tasks.length ; i++) {
		var task = json.test.tasks[i];
		var taskDiv = createTaskDiv(task);
		maskSpan.append(taskDiv);
	}
	
	return maskSpan;
}

function displaySettings(){
	if(localStorage.getItem(trRole)!=="a"){
		document.getElementById("settingsAdmin").remove();		
	}
}

function createTaskDiv(task){
	var tasksDiv = document.createElement("div");
	tasksDiv.setAttribute("class","task");

	var taskName = createInput("Name", task.name, true);
	tasksDiv.append(taskName);
	tasksDiv.append(document.createElement("br"));
	var taskPath = createInput("Path", task.path, true);
	tasksDiv.append(taskPath);
	tasksDiv.append(document.createElement("br"));
	var taskArgs = createInput("Arguments", task.args, true);
	tasksDiv.append(taskArgs);
	tasksDiv.append(document.createElement("br"));
	var taskTimeout = createInput("Timeout", task.timeout, true);
	tasksDiv.append(taskTimeout);
	tasksDiv.append(document.createElement("br"));
	
	return tasksDiv;
}

function createInput(title, value, disabled){
	var resultSpan = document.createElement("span");
	
	var descriptionSpan = document.createElement("span");
	descriptionSpan.textContent = title;
	resultSpan.append(descriptionSpan);
	
	var descriptionBR = document.createElement("br");
	resultSpan.append(descriptionBR);

	var valueInput = document.createElement("input");
	value = value == undefined? "":value;
	valueInput.setAttribute("value", value);
	valueInput.disabled = disabled;
	valueInput.setAttribute("class","form-control");
	resultSpan.append(valueInput);
	
	return resultSpan;
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
