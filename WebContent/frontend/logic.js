'use strict';
var page = getQueryParams(document.location.search).page;
if(page === undefined || page == "undefined" || page == "index" ){
	page = "main";
}
page = page.replace(/[^A-Za-z0-9]/g,'');
doRequest("GET", page+".html", pageLogic, []);

setTimeout(function() {
	var loader = document.getElementById("loader");
	if(loader!=undefined){
		loader.style.visibility="visible";		
	}
}, 300); 

function pageLogic (response){
	var paramName;

	document.getElementById("container").innerHTML = response;

	if(page!="login" && page !="logout"){
		doRequest("GET", "../getRunningCount", insertRunningCount);
		setInterval(function() {
			doRequest("GET", "../getRunningCount", insertRunningCount);
		}, 2000);
		
	}

	if(page=="main"){
		doRequest("GET", "../getTestList", listTests);
		doRequest("GET", "../getTestGroupList", listGroups);
	}
	if(page=="login"){
	    document.getElementById("username").focus();
	    removeLoader();
		document.getElementById("settings").remove();
		document.getElementById("logout").remove();
	}
	if(page=="info"){
		doRequest("GET", "../getBasePath", basePath);
	}
	if(page=="logout"){
		doLogout();
	}
	if(page=="hash"){
		doRequest("GET", "../getBasePath", basePath);
		var hashInputField = document.getElementById("in");
		var hashOutputField = document.getElementById("out");
		hashInputField.oninput = function(){
			var toHash = "TR_"+hashInputField.value;
			sha512(toHash).then(x => hashOutputField.value=x.toUpperCase());
		}
	}
	if(page=="result"){
		var handle = getQueryParams(document.location.search).handle;
		var name = getQueryParams(document.location.search).name;
		if(name === undefined || name == "undefined"){
			name = getQueryParams(document.location.search).groupname;
			doRequest("GET", "../getGroupResult/" + name + "/" + handle, listResult);
		}else{
			doRequest("GET", "../getResult/" + name + "/" + handle, listResult);
		}
	}
	if(page=="results"){
		var name = getQueryParams(document.location.search).name;
		if(name=="undefined" || name === undefined ){
			name = getQueryParams(document.location.search).groupname;
			paramName="groupname";
			doRequest("GET", "../getGroupResults/"+name+"/0", listResults,[paramName]);
			doRequest("GET", "../getGroup/" + name , listTestContent)
		}else{
			paramName="name";
			doRequest("GET", "../getResults/" + name+"/0", listResults,[paramName]);
			doRequest("GET", "../getTest/" + name , listTestContent)
		}
	}
	if(page=="reload"){
		doRequest("GET", "../reload/", reload,[]);
	}
	if(page=="custom"){
		removeLoader();
	}
	if(page=="settings"){
	    removeLoader();
	    displaySettings();
	}
	if(page=="run"){
		removeLoader();
		
		var tag = encodeURI(getQueryParams(document.location.search).tag);
		var args = encodeURI(getQueryParams(document.location.search).args);
		var additional="";
		
		if(tag != "undefined" && tag !== undefined && args !="undefined" && args !== undefined){
			additional="/"+tag+"/"+args;
		}
		var name = getQueryParams(document.location.search).name;
		if(name=="undefined" || name === undefined){
			name = getQueryParams(document.location.search).groupname;
			paramName = "groupname";
			doRequest("POST", "../runGroup/" + name + additional, runTestGroup, [name,paramName]);
		}else{
			paramName = "name";
			doRequest("POST", "../run/" + name+ additional, runTest,[name,paramName]);
		}
	}
}