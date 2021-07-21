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

var htmlFormatter = function(cell, formatterParams){
    var data = cell.getData();
    return cell.getValue();
}

window.onunload = function(){}; 

// TODO move all JS into its own folder, split this file into multiple

// ************
// * Settings *
// ************

function changeOthersPassword(){
	var username = getQueryParams(document.location.search).name;
	var password = document.getElementById("changePassword").value;
	var changeObj = new Object();
	changeObj.password  = password;
	doRequestBody("PUT", JSON.stringify(changeObj), "application/json", "../user/"+username+"/password", crudHandle, ["Password changed", () => redirectPage("index.html?page=settings")], true);
	return false;
}

function changeRole(){
	var username = getQueryParams(document.location.search).name;
	var role = document.getElementById("editRole").value;
	if(role==""){
		return false;
	}
	var changeObj = new Object();
	changeObj.role  = role;
	doRequestBody("PUT", JSON.stringify(changeObj), "application/json", "../user/"+username+"/role", crudHandle, ["Role changed", () => redirectPage("index.html?page=settings")], true);
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
	var username = getQueryParams(document.location.search).name;
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

function sessionsDeleted(){
	alert("Sessions Deleted");
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
		window.location.replace("index.html?page=settings");
	}
}

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
	// since an empty string results in split returning an array with one empty string entry, clean up:
	if(task.args.length==1 && task.args[0]==""){
		task.args=[];
	}
	var testName = getQueryParams(document.location.search).name;
	if(testName==undefined){
		testName = document.getElementById("testName").value;
		doRequestBody("POST", JSON.stringify(test), "application/json", "../manage/test/"+testName, crudHandle,["Created Test", () =>{
			window.location.replace("index.html?page=results&name="+testName);
		}], true);
	}else{
		doRequestBody("PUT", JSON.stringify(test), "application/json", "../manage/test/"+testName, crudHandle, ["Edited Test", () => {
			var testName = getQueryParams(document.location.search).name;
			window.location.replace("index.html?page=results&name="+testName);
		}], true);		
	}
	return false;
}


function copyTest(){
	var newTestName =  document.getElementById("testName").value;
	var testName = getQueryParams(document.location.search).name;
	doRequestBody("POST", JSON.stringify({}), "application/json", "../manage/test/copy/"+testName+"/to/"+newTestName, crudHandle,["Created Test", () =>{
		window.location.replace("index.html?page=results&name="+newTestName);
	}], true);
	return false;
}

var historyTable;

function showHistory(res,initial){
	if(initial){
		historyTable = new Tabulator("#historyTable", {
			layoutColumnsOnNewData:true,
			layout:"fitDataFill",
			columns:[
				{title:"User", field:"user"},
				{title:"Time", field:"time"},
				{title:"Commit Message", field:"commit"},
				{title:"Commit ID", field:"id"},
				],
				
				rowClick:function(e, id, data, row){
					var id = id._row.data.id;
					window.location.href='index.html?page=history&id='+encodeURIComponent(id);
				}
		});
		historyTable.setData(res);
	}else{
		if(res.length==0){
			document.getElementById("showMoreBtn").disabled=true;
		}
		historyTable.addData(res);
	}

	removeLoader();

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
	runInternal(res, name ,paramName, "tr/status/test");
}

function runTestGroup(res,name,paramName) {
	runInternal(res, name ,paramName, "tr/status/group");
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
	

	scriptsTable = new Tabulator("#scriptsTable", {
		layoutColumnsOnNewData:true,
	    layout:"fitDataFill",
	    pagination:"local", 
	    dataTree:true,
	    dataTreeStartExpanded:false,
	    paginationSize:10,
	    columns:[
	    	{title:"Name", field:"name", formatter:htmlFormatter, width: 700},

	    ],
	    rowClick:function(e, id, data, row){
	    	if(id._row.data._children==undefined){
	    		var path = id._row.data.path;
	    		window.location.href='index.html?page=script&name='+encodeURIComponent(path);	    		
	    	}
	    }
	});
	scriptsTable.setData(scripts);
	
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

function initScriptAdd(){
	removeLoader();

	var headerObj={};
	headerObj[sessionHeaderName] = localStorage.getItem(trToken);
	
	var myDropzone = new Dropzone("div#dropZoneDiv", { 
		url: "../script/mpfd",
		maxFiles:1,
		init: function() {
		    this.hiddenFileInput.removeAttribute('multiple');
		},
		success:function(file, response){
			window.location.replace("index.html?page=script&name="+encodeURIComponent(response));
        },
		headers: headerObj
	});
	
	myDropzone.on("addedfiles", function(files) {
		document.getElementById("loader").style.display="";
		headerObj[uploadFilePathHeaderName] = document.getElementById("scriptFolderBinary").value;
		headerObj[uploadFileNameHeaderName] = myDropzone.files[0].name;
	});
	myDropzone.on("queuecomplete", function(files) {
		removeLoader();
	});	
	

}

function createNewFolder(){
	var folderName = document.getElementById("folderCreate").value;
	var folderParent = document.getElementById("scriptFolderParent").value;
	var obj = {};
	obj.parent = folderParent;
	doRequestBody("POST", JSON.stringify(obj), "application/json", "../script/folder/"+folderName, crudHandle, ["Script folder created",() => redirectPage("index.html")], true);
}

function removeFolder(){
    if(confirm("Are you sure you wish to delete all test scripts in this folder? This may break your tests")){
    	var folderDelete = document.getElementById("scriptFolderDelete").value;
    	var obj={};
    	obj.path = folderDelete;
    	doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../script/folder/", crudHandle, ["Script folder deleted",() => redirectPage("index.html")], true);    	
    }
}

var scriptAddEditorInitialized=false;

// TODO beautify this
function scriptAddBtn(id){
	if(id=="up"){
		document.getElementById("scriptUploadTab").style="";
		document.getElementById("scriptEditorTab").style.display="none";
		document.getElementById("scriptFolderTab").style.display="none";
		document.getElementById("navUP").classList.add("active");
		document.getElementById("navFE").classList.remove("active");
		document.getElementById("navFO").classList.remove("active");
	}else if(id=="fe"){
		document.getElementById("scriptEditorTab").style="";
		document.getElementById("scriptUploadTab").style.display="none";
		document.getElementById("scriptFolderTab").style.display="none";
		document.getElementById("navFE").classList.add("active");
		document.getElementById("navUP").classList.remove("active");
		document.getElementById("navFO").classList.remove("active");
		if(!scriptAddEditorInitialized){
			var editorElem = document.getElementById("editor");
			var editor = CodeMirror.fromTextArea(editorElem, {
				lineWrapping: true,
				lineNumbers: true,
			});
			editor.setSize("100%","70vh");			
		}
		scriptAddEditorInitialized=true;
		editorElem.editorHandle=editor;
	}else{
		document.getElementById("scriptFolderTab").style="";
		document.getElementById("scriptEditorTab").style.display="none";
		document.getElementById("scriptUploadTab").style.display="none";
		document.getElementById("navFO").classList.add("active");
		document.getElementById("navUP").classList.remove("active");
		document.getElementById("navFE").classList.remove("active");
	}
	
}

function loadScriptEdit(res){
	var name = getQueryParams(document.location.search).name;
	document.getElementById("scriptPath").value=res.path;
	document.getElementById("scriptName").value=res.name;
	if(res.type=="text"){
		doRequest("GET", "../script/download/?name="+encodeURIComponent(name), loadTextScriptEdit);
		document.getElementById("textEditor").style="";
	}else{
		document.getElementById("binaryEditor").style="";
		
		var headerObj={};
		headerObj[sessionHeaderName] = localStorage.getItem(trToken);
		headerObj[uploadFilePathHeaderName] = document.getElementById("scriptPath").value;
		headerObj[uploadFileNameHeaderName] = document.getElementById("scriptName").value;
		
		var myDropzone = new Dropzone("div#dropZoneDiv", { 
			url: "../script/mpfd",
			maxFiles:1,
			init: function() {
			    this.hiddenFileInput.removeAttribute('multiple');
			},
			headers: headerObj
		});
		removeLoader();
		
		myDropzone.on("addedfiles", function(files) {
			document.getElementById("loader").style.display="";
		});
		myDropzone.on("queuecomplete", function(files) {
			removeLoader();
		});	
	}
}

function downloadBinaryButton(){
	document.getElementById("loader").style.display="";
	console.log(document.getElementById("loader").style.display);
	var name = getQueryParams(document.location.search).name;
	doRequest("GET", "../script/download/?name="+encodeURIComponent(name), loadBinaryScriptEdit, true, true);
}

function  loadBinaryScriptEdit(blob){
	var name = getQueryParams(document.location.search).name;	
	var dataUri = window.URL.createObjectURL(blob);
    var anchor = document.getElementById("downloadBinaryLink");
    anchor.setAttribute('href', dataUri);
    anchor.setAttribute('download', document.getElementById("scriptName").value);
    document.getElementById("loader").style.display="none";
    anchor.click();
}

function saveScript(){	
	var textAreaEditor = document.getElementById('editor');
	var scriptContent = textAreaEditor.editorHandle.getValue();
	var metaObj={};
	metaObj.path=document.getElementById("scriptPath").value;
	metaObj.name=document.getElementById("scriptName").value;
	doRequestBody("POST", scriptContent, "text/plain", "../script", crudHandle, ["Script saved"], true,metaObj);
}


function deleteScript(){
	if(confirm('Are you sure you want to delete this script?\r\nThis may break existing tests.')){
		var metaObj={};
		metaObj.path=document.getElementById("scriptPath").value;
		metaObj.name=document.getElementById("scriptName").value;
		doRequestBody("DELETE", {}, "application/json", "../script", crudHandle, ["Script deleted", () => redirectPage("index.html")], true, metaObj);
	}
}

var historyPage=1;
function loadMoreHistory(){
	doRequest("GET", "../manage/history/"+historyPage, showHistory, [false]);
	historyPage++;
}

function saveNewScript(){
	var textAreaEditor = document.getElementById('editor');
	var scriptContent = textAreaEditor.editorHandle.getValue();
	var name = document.getElementById("scriptName").value;
	var path = document.getElementById("scriptFolder").value;
	var meta =  {};
	meta.name=name;
	meta.path=path;
	if(name==""){
		alert("Empty file name")
	}else{
		doRequestBody("POST", scriptContent, "text/plain", "../script", goToScript, [], true,meta);		
	}
}

function goToScript(res){
	if(res.status!=200){
		alert(JSON.parse(response.responseText).error);
	}else{
		window.location.replace("index.html?page=script&name="+encodeURIComponent(res.responseText));		
	}
}

function showCommit(rev){
	document.getElementById("commitID").value=rev.id;
	document.getElementById("commitUser").value=rev.user;
	document.getElementById("commitTime").value=rev.time;
	document.getElementById("commitMessage").value=rev.commit;
	
	var textAreaEditor = document.getElementById('editor');
	textAreaEditor.value=rev.diff;
	
	if(rev.diff=="Start of Repository"){
		document.getElementById("revertCommit").remove();
	}
	var editor = CodeMirror.fromTextArea(textAreaEditor, {
		mode: "diff",
		readOnly: true,
		lineWrapping: true,
		lineNumbers: true,
	});
	editor.setSize("100%","50vh");
	
	
	removeLoader();
}

function loadTextScriptEdit(scriptContent){
	document.getElementById('editor').value=scriptContent;
	var name = (getQueryParams(document.location.search).name).toLowerCase();
	var mode="none";

	if(name.endsWith(".md")){
		mode="markdown";
	}else if(name.endsWith(".js") || name.endsWith(".json")){
		mode="text/javascript";
	}else if(name.endsWith(".java")){
		mode="jsx";
	}else if(name.endsWith(".cpp")||name.endsWith(".h")||name.endsWith(".o")||name.endsWith(".c")){
		mode="clike";
	}else if(name.endsWith(".css")){
		mode="css";
	}else if(name.endsWith(".py")){
		mode="python";
	}else if(name.endsWith(".lua")){
		mode="lua";
	}else if(name.endsWith(".html")){
		mode="htmlmixed";
	}else if(name.endsWith(".groovy")){
		mode="groovy";
	}else if(name.endsWith(".pl")){
		mode="perl";
	}else if(name.endsWith(".php")){
		mode="php";
	}else if(name.endsWith(".ps1")||name.endsWith(".psm1")||name.endsWith(".psd1")){
		mode="powershell";
	}else if(name.endsWith(".rb")){
		mode="ruby";
	}else if(name.endsWith(".sh")||name.endsWith(".bash")||name.endsWith(".zsh")||name.endsWith(".ksh")){
		mode="shell";
	}else if(name.endsWith(".vb")){
		mode="vb";
	}else if(name.endsWith(".vbs")||name.endsWith(".vbe")||name.endsWith(".wsf")){
		mode="vbscript";
	}else if(name.endsWith(".vm")){
		mode="velocity";
	}else if(name.endsWith(".xml")){
		mode="xml";
	}else if(name.endsWith(".yaml")){
		mode="yaml";
	}
	
	var textAreaEditor = document.getElementById('editor');
	var editor;
	if(name.endsWith(".bat")){
		editor = CodeMirror.fromTextArea(textAreaEditor, {
			lineNumbers:true,
		});
	}else{
		editor = CodeMirror.fromTextArea(textAreaEditor, {
			mode: mode,
			lineNumbers: true,
		});		
	}
	editor.setSize("100%","73vh");
	textAreaEditor.editorHandle=editor;
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
	
	var collapse = getQueryParams(document.location.search).collapse;
	if(collapse==undefined){
		document.getElementById("collapseGroupsHref").style="";
	}else{
		document.getElementById("expandGroupsHref").style="";
	}
		
	if(localStorage.getItem(trRole)==="r"){
		table = new Tabulator("#testsTable", {
			layoutColumnsOnNewData:true,
		    layout:"fitDataFill",
		    groupBy:"category",
		    pagination:"local",
		    groupStartOpen:function(value, count, data, group){
		    	return collapse==undefined;
		    },
		    paginationSize:20,
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
		    groupStartOpen:function(value, count, data, group){
		    	return collapse==undefined;
		    },
		    pagination:"local", 
		    paginationSize:20,
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
	doRequestBody("PUT", JSON.stringify(obj), "application/json", "../manage/category/"+category, crudHandle, true, true);
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
	document.getElementById("addTestGroupMappingForm").reset();
	
	var obj = {};
	obj.test=test;
	obj.name=name;
	doRequestBody("PUT", JSON.stringify(obj), "application/json", "../manage/group/"+group, crudHandle, [], true);

	return false;
}


function loadTestSettingsPage(tests){
	doRequest("GET", "../manage/category", listTestCategories,[tests]);
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
	        {title:"Categories", field:"name", width:400},
	        {formatter:"buttonCross", hozAlign:"center", title:"", headerSort:false, cellClick:function(e, cell){
	        	if(confirm('Are you sure you want to remove this test from the category?'))
	        		var testName = cell.getRow()._row.data.name;
	        		var categoryName = cell.getRow()._row.data.category;
	        		var obj={};
	        		doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/category/"+categoryName+"/"+testName, crudHandle, [], true);
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
	var groupDescription = document.getElementById("groupDescription").value;
	var obj =  {};
	obj.name=groupName;
	obj.description=groupDescription;
	doRequestBody("POST", JSON.stringify(obj), "application/json", "../manage/group/", crudHandle, ["Group created",pageReload], true);

	return false;
}

function createCategory(){
	var categoryName = document.getElementById("categoryName").value;
	var obj =  {};
	obj.name=categoryName;
	doRequestBody("POST", JSON.stringify(obj), "application/json", "../manage/category/", crudHandle, ["Category created", pageReload], true);

	return false;
}

function deleteTestGroup(){
	var groupName = document.getElementById("testGroupSelectDelete").value
	var obj={};
	doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/group/"+groupName, crudHandle, ["Group deleted",reloadPage], true);
	return false;
}


function deleteCategory(){
	var categoryName = document.getElementById("categoryNameDelete").value
	var obj={};
	// TODO don't really need a reload here, might as well add the row to tabulator 
	doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/category/"+categoryName, crudHandle, ["Category deleted", reloadPage], true);
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
	        {formatter:"buttonCross", hozAlign:"center", title:"", headerSort:false, cellClick:function(e, cell){
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
		    pagination:"local", 
		    paginationSize:10,
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
		    pagination:"local", 
		    paginationSize:10,
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
	
	if(localStorage.getItem(trRole)===roleRWX || localStorage.getItem(trRole)===roleA ){
		document.getElementById("testGroupsSettings").style.display="";
		document.getElementById("testSettings").style.display="";
		document.getElementById("testAdd").style.display="";
		document.getElementById("scriptAdd").style.display="";
	}
}

function fillScripts(res, checkScriptExistent){
	var scriptSelects = document.getElementsByClassName("scriptSelect");
	for(let i = 0; i < scriptSelects.length; i++){
		if(scriptSelects[i].wasFilled===undefined){
			for(let y = 0; y < res.length; y++){
				scriptSelects[i].wasFilled=true;
				var scriptName = res[y];
				var option = document.createElement("option");
				option.setAttribute("value", scriptName);			
				var text = document.createTextNode(scriptName);
				option.appendChild(text);
				scriptSelects[i].appendChild(option);
			}
			if(scriptSelects[i].preselectScript!==undefined){
				scriptSelects[i].value=scriptSelects[i].preselectScript;
				// check if it is an exiting test, if the script can't be selected, it is an invalid value
				if(checkScriptExistent && getQueryParams(document.location.search).name !==undefined && scriptSelects[i].value==""){
					alert("The script \""+scriptSelects[i].preselectScript+"\" does not exist (anymore)");
				}
			}
		}
	}
}


function fillUsers(res){

	var table = new Tabulator("#usersTable", {
	    layout:"fitDataFill",
	    columns:[
	    	{title:"User", field:"user"},
	    	{title:"Role", field:"role"},
		    {title:"Edit", field:"edit",  formatter:htmlFormatter},

	    ],
	});
	
	var users =[];
	for(let y = 0; y < res.length; y++){
		var usrName= Object.keys(res[y])[0];
		var usrRole= Object.values(res[y])[0];
		var user = {};
		user.user=usrName;
		user.role=usrRole;
		user.edit = "<a href=\"index.html?page=edituser&name="+usrName+"\">&#x270E;</a>";
		users.push(user);
	}
	table.setData(users);
	
}


function fillFolders(res){
	var folderSelects = document.getElementsByClassName("folderSelect");
	for(let i = 0; i < folderSelects.length; i++){
		fillFoldersInternal(res,folderSelects[i]);
	}
}

function fillFoldersInternal(res,select){
	for(let y = 0; y < res.length; y++){
		if(res[y]._children!==undefined){
			var path= res[y].path;
			var option = document.createElement("option");
			option.setAttribute("value", path);			
			var text = document.createTextNode(path);
			option.appendChild(text);
			select.appendChild(option);		
			fillFoldersInternal(res[y]._children,select);
		}
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
		doRequest("GET", "../tr/result/group/"+name+"/page/"+pageIndex, addResults,[paramName]);
	}else{
		paramName="name";
		doRequest("GET", "../tr/result/test/"+name+"/page/"+pageIndex, addResults,[paramName]);
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


function reRunLink() {
	removeLoader();
	var runLink = document.getElementById("runLink");

	
	var isGroup=false;
	var name = getQueryParams(document.location.search).name;
	if(name === undefined || name == "undefined"){
		name = getQueryParams(document.location.search).groupname;
		isGroup=true;
	}

	if(localStorage.getItem(trRole)!=="r"){
		if(isGroup){
			createNavButton("runLink","Rerun Test Group &#9654;", 'index.html?page=run&groupname='+encodeURIComponent(name));
		}else{
			createNavButton("runLink","Rerun Test &#9654;", 'index.html?page=run&name='+encodeURIComponent(name));
		}
	}
}

function listResults(results,paramName) {
	removeLoader();
	var testName = document.getElementById("testName");
	var runLink = document.getElementById("runLink");
	var editLink = document.getElementById("editLink");
	var copyLink = document.getElementById("copyLink");
	var historyLink = document.getElementById("historyLink");	

	
	var isGroup=false;
	var name = getQueryParams(document.location.search).name;
	if(name === undefined || name == "undefined"){
		name = getQueryParams(document.location.search).groupname;
		isGroup=true;
	}
	testName.textContent = name;	
	
	if(isGroup){
		createNavButton("historyLink","Show History",'index.html?page=history&groupname='+encodeURIComponent(name));		
	}else{
		createNavButton("historyLink","Show History",'index.html?page=history&testname='+encodeURIComponent(name));	
	}
	
	if(localStorage.getItem(trRole)!=="r"){
		if(isGroup){
			createNavButton("runLink","Run Test Group &#9654;", 'index.html?page=run&groupname='+encodeURIComponent(name));
		}else{
			createNavButton("runLink","Run Test &#9654;", 'index.html?page=run&name='+encodeURIComponent(name));
		}
	}
	
	if(localStorage.getItem(trRole)===roleRWX || localStorage.getItem(trRole)===roleA){
		if(isGroup){
			createNavButton("editLink","Edit Test Group", 'index.html?page=testgroupsettings');			
		}else{
			createNavButton("editLink","Edit Test", 'index.html?page=edit&name='+encodeURIComponent(name));
			createNavButton("copyLink","Copy Test", 'index.html?page=copy&name='+encodeURIComponent(name));
		}
	}

	
	var resultCount = results.length;
	var resultsSpan = document.getElementById("resultsSpan");
	if(resultCount==0){
		resultsSpan.textContent = "This test has not been run yet.";
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
	doRequest("GET", "../script", fillScripts,[true]);
}

function revert(){
	var commitID = getQueryParams(document.location.search).id;
	doRequestBody("POST", "", "application/json", "../manage/history/revert/"+commitID, crudHandle, ["Reverted to commit", () => redirectPage("index.html?page=history")],true);
}


function killSession(){
	var userName = getQueryParams(document.location.search).name;

	if(userName!=""){
		doRequest("DELETE", "../user/"+userName+"/session", sessionsDeleted,[]);		
	}
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

function listResult(result) {
	removeLoader();
	// TODO use a class
	var style = ' style="color:green;" ';
	for (var i = 0; i < result.results.length; i++) {
		if(! result.results[i].passed){
			style=' style="color:red;" ';
		}
	}
	// TODO remove innerHTML here
	var infoSpan = document.getElementById("info");
	infoSpan.innerHTML = ("<h3"+style+">" + escapeHtml(result.testName) + " - "+ result.testStartString + "</h3>");
	infoSpan.innerHTML += "<b>Run by</b>: "+escapeHtml(result.testRunBy)+"&nbsp;&nbsp; <b>Description</b>: "+ escapeHtml(result.description)+"<br><br><b>Test Commits:</b><br>";
	if(result.commits==undefined){
		infoSpan.innerHTML+="-";
	}else{
		for (var i = 0; i < result.commits.length; i++) {
			infoSpan.innerHTML += result.commits[i].name+" - "+result.commits[i].commit+"<br>";
		}		
	}
	infoSpan.innerHTML +="<hr>";

	var resultsSpan = document.getElementById("results");
	for (var i = 0; i < result.results.length; i++) {
		// tests in groups have a descriptive name
		if(result.results[i].commit==undefined){
			result.results[i].commit="-";
		}
		var descriptiveName =  result.results[i].descriptiveName==undefined?"":result.results[i].descriptiveName+ " - ";
		resultsSpan.innerHTML += "<h3>"+escapeHtml(descriptiveName+result.results[i].name) + " " + (result.results[i].passed == false ? cloud : sun) + "</h3>"
				+ "<b>Script Commit</b>: <i>"+ escapeHtml(result.results[i].commit) + "</i><br>"
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
	doRequest("GET", "../script", fillScripts,[true]);
}

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
	if(localStorage.getItem(trRole)!==roleA){
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
	addTask(true);
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
