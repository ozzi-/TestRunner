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
	var name = getQueryParams(document.location.search).name;

	document.getElementById("container").innerHTML = response;

	if(page!="login" && page !="logout"){
		doRequest("GET", "../tr/runningcount", insertRunningCount);
		setInterval(function() {
			doRequest("GET", "../tr/runningcount", insertRunningCount);
		}, 2000);
		
	}

	if(page=="main"){
		doRequest("GET", "../tr/test", listTests);
		doRequest("GET", "../tr/group", listGroups);
		doRequest("GET", "../script/folder", listScripts);
	}
	if(page=="login"){
	    document.getElementById("username").focus();
	    removeLoader();
		document.getElementById("settings").remove();
		document.getElementById("logout").remove();
		document.getElementById("runningTestsSpan").remove();
		document.getElementById("historyHref").remove();
	}
	if(page=="info"){
		doRequest("GET", "../tr/basepath", basePath);
	}
	if(page=="logout"){
		doLogout();
	}
	if(page=="script"){
		document.getElementById("scriptNameSpan").textContent=name;
		doRequest("GET", "../script/type/?name="+encodeURIComponent(name), loadScriptEdit);
		createNavButton("historyLink","Show History",'index.html?page=history&scriptname='+encodeURIComponent(name));
	}
	if(page=="scriptadd"){
		initScriptAdd();
		scriptAddBtn('up');
		doRequest("GET", "../script/folder", fillFolders);
	}
	if(page=="hash"){
		doRequest("GET", "../tr/basepath", basePath);
		var hashInputField = document.getElementById("in");
		var hashOutputField = document.getElementById("out");
		hashInputField.oninput = function(){
			var toHash = "TR_"+hashInputField.value;
			sha512(toHash).then(x => hashOutputField.value=x.toUpperCase());
		};
	}
	if(page=="result"){
		var handle = getQueryParams(document.location.search).handle;
		reRunLink();
		if(name === undefined || name == "undefined"){
			name = getQueryParams(document.location.search).groupname;
			doRequest("GET", "../tr/result/group/" + name + "/" + handle, listResult);
		}else{
			doRequest("GET", "../tr/result/test/" + name + "/" + handle, listResult);
		}
	}
	if(page=="testgroupsettings"){
		doRequest("GET", "../tr/group", listGroupSettings);
		doRequest("GET", "../tr/test", listGroupSettingsTestNames);
	}
	if(page=="testsettings"){
		doRequest("GET", "../tr/test", loadTestSettingsPage);
	}
	if(page=="results"){
		if(name=="undefined" || name === undefined ){
			name = getQueryParams(document.location.search).groupname;
			paramName="groupname";
			doRequest("GET", "../tr/result/group/"+name+"/page/0", listResults,[paramName]);
			doRequest("GET", "../tr/group/" + name , listTestContent);
		}else{
			paramName="name";
			doRequest("GET", "../tr/result/test/" + name+"/page/0", listResults,[paramName]);
			doRequest("GET", "../tr/test/" + name , listTestContent);
		}
	}
	if(page=="edit"){
		doRequest("GET", "../tr/test/" + encodeURIComponent(name), editTestContent);
	}
	if(page=="copy"){
		document.getElementById("testName").value=name+" - Copy";
		removeLoader();
	}
	if(page=="new"){
		initNewTestPage();
	}
	if(page=="reload"){
		doRequest("GET", "../user/reload/", reload,[]);
	}
	if(page=="history"){
		var id = getQueryParams(document.location.search).id;
		var testname = getQueryParams(document.location.search).testname;
		var groupname = getQueryParams(document.location.search).groupname;
		var scriptname = getQueryParams(document.location.search).scriptname;
		var title="";
		
		if(id!==undefined){
			doRequest("GET", "../manage/history/commit/"+id, showCommit);		
			title="Commit Info";
			document.getElementById("showMoreBtn").remove();
		}else if(testname!==undefined){
			document.getElementById("commitSpan").remove();
			document.getElementById("showMoreBtn").remove();
			doRequest("GET", "../manage/history/test/"+testname, showHistory, [true]);
			title="Commits of test '"+testname+"'";
			document.getElementById("revertCommit").remove();
		}else if(groupname!==undefined){
			document.getElementById("commitSpan").remove();
			document.getElementById("showMoreBtn").remove();
			doRequest("GET", "../manage/history/testgroup/"+groupname, showHistory,[true]);
			title="Commits of group '"+groupname+"'";
			document.getElementById("revertCommit").remove();
		}else if(scriptname!==undefined){
			document.getElementById("commitSpan").remove();
			document.getElementById("showMoreBtn").remove();
			doRequest("GET", "../manage/history/script/?name="+encodeURIComponent(scriptname), showHistory, [true]);
			title="Commits of script '"+scriptname+"'";
			document.getElementById("revertCommit").remove();
		}else{
			document.getElementById("commitSpan").remove();
			doRequest("GET", "../manage/history/0", showHistory,[true]);
			title="Commit history";
			document.getElementById("revertCommit").remove();
		}
		document.getElementById("titleSpan").textContent=title;
	}
	if(page=="custom"){
		removeLoader();
	}
	if(page=="settings"){
	    removeLoader();
	    displaySettings();
		doRequest("GET", "../user", fillUsers);		
	}
	if(page=="edituser"){
		var usrName = getQueryParams(document.location.search).name;
		document.getElementById("changeUsrName").textContent=usrName;
		document.getElementById("deleteUsrName").textContent=usrName;
	    removeLoader();		
	}
	if(page=="run"){
		removeLoader();
		
		var tag = encodeURI(getQueryParams(document.location.search).tag);
		var args = encodeURI(getQueryParams(document.location.search).args);
		var additional="";
		
		if(tag != "undefined" && tag !== undefined && args !="undefined" && args !== undefined){
			additional="/"+tag+"/"+args;
		}
		if(name=="undefined" || name === undefined){
			name = getQueryParams(document.location.search).groupname;
			paramName = "groupname";
			doRequest("POST", "../run/group/" + name + additional, runTestGroup, [name,paramName]);
		}else{
			paramName = "name";
			doRequest("POST", "../run/test/" + name + additional, runTest,[name,paramName]);
		}
	}
}