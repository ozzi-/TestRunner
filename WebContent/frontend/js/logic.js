'use strict';

var page = getQueryParams(document.location.search).page;
if(page === undefined || page == "undefined" || page == "index" ){
	page = "main";
}	
page = page.replace(/[^A-Za-z0-9]/g,'');


function start(){
	doRequest("GET", page+".html", pageLogic, []);
}

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
		document.getElementById("loginForm").onsubmit = function(){return doLogin();};
	    document.getElementById("username").focus();
	    removeLoader();
		document.getElementById("settings").remove();
		document.getElementById("logout").remove();
		document.getElementById("runningTestsSpan").remove();
		document.getElementById("historyHref").remove();
	}
	if(page=="log"){
		document.getElementById("logReloadBtn").onclick = function(){
			doRequest("GET", "../tr/log", displayLog);		
		};
		doRequest("GET", "../tr/log", displayLog);
	}
	if(page=="info"){
		doRequest("GET", "../tr/basepath", basePath);
	}
	if(page=="logout"){
		doLogout();
	}
	if(page=="script"){
		document.getElementById("saveScriptBtn").onclick = function(){saveScript();};
		document.getElementById("deleteScriptBtn").onclick = function(){deleteScript(); return false;};
		document.getElementById("binaryDownloadBtn").onclick = function(){downloadBinaryButton();};
		document.getElementById("deleteBinaryBtn").onclick = function(){deleteScript(); return false;};
		
		document.getElementById("scriptNameSpan").textContent=name;
		doRequest("GET", "../script/type/?name="+encodeURIComponent(name), loadScriptEdit);
		createNavButton("historyLink","Show History",'index.html?page=history&scriptname='+encodeURIComponent(name));
	}
	if(page=="scriptadd"){
		document.getElementById("navUP").onclick = function(){scriptAddBtn('up');};
		document.getElementById("navFE").onclick = function(){scriptAddBtn('fe');};
		document.getElementById("navFO").onclick = function(){scriptAddBtn('fo');};
		document.getElementById("saveScriptBtn").onclick = function(){saveNewScript();};
		document.getElementById("createFolderBtn").onclick = function(){createNewFolder();};
		document.getElementById("removeFolderBtn").onclick = function(){removeFolder();};

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
		document.getElementById("printResultsBtn").onclick = function(){
			printJS({
					printable: 'printable_resultPage',
					type: 'html',
					style: ' .printableResultPage { display: block!important; } '
			});
		};
		document.getElementById("backBtn").onclick = function(){back();};
		
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
		document.getElementById("addTestGroupMappingForm").onsubmit = function(){return addTestGroupEntry();};
		document.getElementById("createGroupMappingForm").onsubmit = function(){return createTestGroup();};
		document.getElementById("deleteGroupForm").onsubmit = function(){return deleteTestGroup();};

		doRequest("GET", "../tr/group", listGroupSettings);
		doRequest("GET", "../tr/test", listGroupSettingsTestNames);
	}
	if(page=="testsettings"){
		document.getElementById("createNewTestBtn").onclick = function(){return goToNewTest();};
		document.getElementById("addTestGroupMappingForm").onsubmit = function(){return addTestCategoryEntry();};
		document.getElementById("createNewTestForm").onsubmit = function(){return createCategory();};
		document.getElementById("deleteGroupForm").onsubmit = function(){return deleteCategory();};

		doRequest("GET", "../tr/test", loadTestSettingsPage);
	}
	if(page=="results"){
		document.getElementById("backBtn").onclick = function(){location.assign('index.html');};
		document.getElementById("loadmore").onclick = function(){loadMoreResults();};
		
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
		document.getElementById("editTestForm").onsubmit = function(){return saveTest();};
		document.getElementById("addTaskBtn").onclick = function(){addTask(false); return false;};	
		document.getElementById("deleteTestBtn").onclick = function(){deleteTest(); return false;};		
		doRequest("GET", "../tr/test/" + encodeURIComponent(name), editTestContent);
	}
	if(page=="copy"){
		document.getElementById("testName").value=name+" - Copy";
		document.getElementById("copyTestForm").onsubmit = function(){return copyTest();};
		removeLoader();
	}
	if(page=="new"){
		document.getElementById("createTestForm").onsubmit = function(){return saveTest();};
		document.getElementById("addTaskBtn").onclick = function(){addTask(); return false;};
		initNewTestPage();
	}
	if(page=="reload"){
		doRequest("GET", "../user/reload/", reload,[]);
	}
	if(page=="history"){
		document.getElementById("showMoreBtn").onclick = function(){loadMoreHistory();};			
		document.getElementById("revertCommit").onclick = function(){revert();};			
		
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
		document.getElementById("runTestBtn").onclick = function(){runCustomTest();};
		removeLoader();
	}
	if(page=="settings"){
		document.getElementById("changeMyPasswordForm").onsubmit = function(){return changeMyPassword();};
		document.getElementById("createUserForm").onsubmit = function(){return createUser();};

	    removeLoader();
	    displaySettings();
		doRequest("GET", "../user", fillUsers);		
	}
	if(page=="edituser"){
		document.getElementById("changePasswordForm").onsubmit = function(){return changeOthersPassword();};	
		document.getElementById("changeRoleForm").onsubmit = function(){return changeRole();};	
		document.getElementById("killSessionBtn").onclick = function(){killSession();};
		document.getElementById("deleteUserBtn").onclick = function(){deleteUser()};
		
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