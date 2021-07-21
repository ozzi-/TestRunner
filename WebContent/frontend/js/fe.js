'use strict';
var sun = "&#9728";
var cloud = "&#127785;";
var trToken = "TR_Token";
var trRole = "TR_Role";
var sessionHeaderName ="X-TR-Session-ID";
var uploadFileNameHeaderName = "X-File-Name";
var uploadFilePathHeaderName = "X-File-Path";
var pageIndex=0;
var roleRWX ="rwx";
var roleA = "a";

var testGroupsTable, testsTable, scriptsTable, usersTable, testCategoriesTable, historyTable;

window.onunload = function(){}; 

// ***********
// * Network *
// ***********

window.errorReported=false;

function doRequestBody(method, data, type, url, callback, params, sendAuth, uploadMeta) {
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
						console.log(e);
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
							if(request.responseText=="NOK"){
								window.errorReported=false;
								alert("Invalind input received ("+request.status+"): "+request.responseText);	
							}else{
								alert("Unknown error ("+request.status+"): "+request.responseText);
							}
						}
					}
				}
			}
		}
	};
	
	request.open(method, url);
	request.timeout = 5000;

	if(uploadMeta !== undefined &&  uploadMeta.path !==undefined &&  uploadMeta.name !== undefined){
		 // when running under unix, empty request headers will throw a nullpointer exception (while empty headers work on windows..)
		var res = uploadMeta.path==""?"/":uploadMeta.path;
		console.log("uploadMeta path = "+res);
		request.setRequestHeader(uploadFilePathHeaderName, res);
		request.setRequestHeader(uploadFileNameHeaderName, uploadMeta.name);
	}
	if(sendAuth){
		request.setRequestHeader(sessionHeaderName, localStorage.getItem(trToken));
	}
	request.setRequestHeader("Content-Type", type);
	request.send(data);
}


function doRequest(method, url, callback, params, blob) {
	var request = new XMLHttpRequest();

	if(typeof blob !== 'undefined' && blob){
		request.responseType = "blob";		
	}

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
					if(typeof blob !== 'undefined' && blob){
						response = request.response;
						console.log(response);
					}else{						
						var responseJSON = JSON.parse(request.responseText);
						response = responseJSON;
					}
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
							if(request.responseText==""){
								alert("Lost connection to backend (Empty Response)")
							}else{
								alert("Unknown error - Exception: "+e.message+" ("+request.status+")");	
							}
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

function crudHandle(response,successMsg,successAction){
	if(response.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		if(successMsg!==undefined){			
			alert(successMsg);
		}
		if(successAction!==undefined){
			successAction();			
		}
	}
}

function reloadPage(){
	location.reload();
}

function redirectPage(uri){
	window.location.replace(uri);
}


function insertRunningCount(res){
	document.getElementById("runningTestsSpan").style="";
	document.getElementById("runningTests").textContent=res.count;
}


var htmlFormatter = function(cell, formatterParams){
    var data = cell.getData();
    return cell.getValue();
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
		document.getElementById("loader").style.display="none";
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


function createTaskDiv(task, i, disabled){
	var tasksDiv = document.createElement("div");
	tasksDiv.setAttribute("id","taskDiv_"+i);
	tasksDiv.setAttribute("class","task");

	var taskName = createInput("Name", task.name, "taskName_"+i, disabled,false,  true);
	tasksDiv.append(taskName);
	tasksDiv.append(document.createElement("br"));
		
	var select = createSelect("-- Choose a Script --", task.path, "taskPath_"+i,disabled,true); 
	tasksDiv.append(select);	
	
	tasksDiv.append(document.createElement("br"));
	var taskArgs = createInput("Arguments (Comma-seperated)", task.args, "taskArgs_"+i, disabled,false,false);
	tasksDiv.append(taskArgs);
	tasksDiv.append(document.createElement("br"));
	var taskTimeout = createInput("Timeout", task.timeout, "taskTimeout_"+i, disabled,false, true,true);
	tasksDiv.append(taskTimeout);
	tasksDiv.append(document.createElement("br"));
	
	if(!disabled){
		var button = document.createElement("button");
		button.textContent = "Remove Task";
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
		doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/test/"+testName, crudHandle, ["Test deleted",() => redirectPage("index.html")], true);
	}
}

function addTask(checkExistence){
	var task = {};
	task.name="";
	task.path="";
	task.args="";
	task.timeout="";	
	var markSpan = document.getElementById("maskSpan");
	var taskDiv = createTaskDiv(task, getCurrentTaskIndex(), false);
	maskSpan.append(taskDiv);
	doRequest("GET", "../script", fillScripts,[checkExistence]);
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

function createSelect(title, script, id, disabled,required){ 
	var select = document.createElement("select");
	select.classList.add("form-control");
	select.classList.add("scriptSelect");
	select.id=id;
	select.disabled=disabled;
	select.required=required;
	
	var option = document.createElement("option");
	option.text = title;
	option.disabled=true;
	if(script!==undefined&&script!==null){
		option.selected=true;
		select.preselectScript=script;
	}
	option.value="";
	select.add(option);
	return select;
}

function createNavButton(outerspan,label,locAssign){
	var outerspan = document.getElementById(outerspan);	
	var btn = document.createElement("BUTTON");
	btn.classList.add("btn");
	btn.classList.add("btn-primary");
	btn.classList.add("ml-1");
	btn.innerHTML=label; // needed for html entities (emojis) in btn label
	btn.addEventListener("click", function(){
		location.assign(locAssign);
	});
	outerspan.appendChild(btn);
}
	
function createInput(title, value, id, disabled, bold, required, isInt){
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
	if(isInt !== undefined){
		valueInput.type="number";
	}
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
