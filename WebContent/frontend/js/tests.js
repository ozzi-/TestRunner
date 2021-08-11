'use strict';

function runTest(res,name,paramName) {
	runInternal(res, name ,paramName, "tr/status/test");
}

function runTestGroup(res,name,paramName) {
	runInternal(res, name ,paramName, "tr/status/group");
}

function runCustomTest(){
	var tag = document.getElementById("tag").value;
	if(tag.length<1){
		Swal.fire({
			title: 'Input validation',
			text: "Please provide a string to tag this test run.",
			icon: 'warning'
		});
		return;
	}
	var tagValid = document.getElementById("tag").checkValidity();
	if(!tagValid){
		Swal.fire({
			title: 'Input validation',
			text: "Tags may only contain letters, numbers and underscores.",
			icon: 'warning'
		});
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

function runInternal(res, name, paramName, call){
	var pollTime = 1200;
	var handle = res.handle;	
	function doPoll() {
		var tag = getQueryParams(document.location.search).tag;
		var handleS = handle;
		if(tag!="undefined" && tag!==undefined){
			handleS = handleS+"_"+tag;
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
	}else if(res.state!="running"){
		if(poller === undefined || poller == "undefined" || poller != null){
			clearInterval(poller);			
		}
	}
}

function reRunLink() {
	removeLoader();
	
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

function addResults(results,paramName){
	var resultCount = results.length;
	var loadMore = document.getElementById("loadmore");
	if(resultCount==0) {
		loadMore.disabled = true;
		loadMore.textContent = "no further results";
		return;
	}
	
	var table = document.getElementById("resultsSpan").tableHandle;
	
	for (var i = 0; i < resultCount; i++) {
		var passed = true;
		for (var j = 0; j < results[i].result.results.length; j++) {
			passed = results[i].result.results[j].passed;
			if(!passed){
				break;
			}
		}
		results[i].status = (passed ? " "+sun : " "+cloud);
		results[i].lastRun = "<a href=\"index.html?page=result&"+paramName+"="+results[i].result.testName+"&handle="+ results[i].handle+"\">"+results[i].result.testStartString+"</a>";
	}
	table.addData(results);
	loadMore.disabled = false;
}


function loadMoreResults(){
	var paramName;
	window.pageIndex++;
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

function loadTestSettingsPage(tests){
	doRequest("GET", "../manage/category", listTestCategories,[tests]);
}


function listTestCategories(categories, tests){
	removeLoader();

	var testObjs = [];
	var testInCategories = [];

	var plainCategories = Object.keys(categories);

	var catNameSel = document.getElementById("categoryNameSelect");
	var catNameDelSel = document.getElementById("categoryNameDelete");
	for (var i = 0; i < plainCategories.length; i++) {
		var option = document.createElement("option");
		option.text = plainCategories[i];
		catNameSel.add(option);
		var option2 = document.createElement("option");
		option2.text = plainCategories[i];
		catNameDelSel.add(option2);
		testInCategories = testInCategories.concat(categories[plainCategories[i]]);
	}
	
	var testNameSel = document.getElementById("testNameSelect");
	for (i = 0; i <tests.length; i++) {
		if(!testInCategories.includes(tests[i].name)) {
			var newOption = document.createElement("option");
			newOption.text = tests[i].name;
			testNameSel.add(newOption);
		}
		var testObj = {name:tests[i].name, category:tests[i].category};
		testObjs.push(testObj);			
			
	}
	
	window.testCategoriesTable = new Tabulator("#testcategories", {
	    groupBy:"category",
	    groupStartOpen:false,
	    layout:"fitDataFill",
	    groupValues:[plainCategories],
	    columns:[
	        {title:"Categories", field:"name", width:400},
	        {
	        	formatter:"buttonCross", hozAlign:"center", title:"", headerSort:false, cellClick:function(e, cell){
		        	if(confirm('Are you sure you want to remove this test from the category?')){
		        		var testName = cell.getRow()._row.data.name;
		        		var categoryName = cell.getRow()._row.data.category;
		        		var obj={};
		        		doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/category/"+categoryName+"/"+testName, crudHandle, [], true);
		        		var sel = document.getElementById("testNameSelect");
		        		var testOption = document.createElement("option");
		        		testOption.text = testName;
		        		sel.add(testOption);
		        		cell.getRow().delete();
		        	}
	        	}
	        }
	     ],
	});
	testCategoriesTable.setData(testObjs);
}

function showHistory(res,initial){
	if(initial){
		window.historyTable = new Tabulator("#historyTable", {
			layoutColumnsOnNewData:true,
			layout:"fitDataFill",
			columns:[
				{title:"User", field:"user"},
				{title:"Time", field:"time"},
				{title:"Commit Message", field:"commit"},
				{title:"Commit ID", field:"id"},
				],
				
				rowClick:function(e, id, data, row){
					var dataID = id._row.data.id;
					window.location.href='index.html?page=history&id='+encodeURIComponent(dataID);
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


function addTestCategoryEntry(){
	var test = document.getElementById("testNameSelect").value;
	var category = document.getElementById("categoryNameSelect").value;
	testCategoriesTable.addRow([{name: test,category:category}], false);
	var obj = {};
	obj.test=test;
	doRequestBody("PUT", JSON.stringify(obj), "application/json", "../manage/category/"+category, crudHandle, [], true);
	var x = document.getElementById("testNameSelect");
	x.remove(x.selectedIndex); 
	document.getElementById("addTestGroupMappingForm").reset();
	return false;
}

function saveTest(){
	var test = {};
	test.settings = {};
	test.settings.successHook = document.getElementById("successHook").value;
	test.settings.failureHook = document.getElementById("failureHook").value;
	test.test = {};
	test.test.description = document.getElementById("description").value;
	
	var taskCounter = 1;
	test.test.tasks = [];
	while (document.getElementById("taskName_"+taskCounter)!==null) {
		if(!document.getElementById("taskDiv_"+taskCounter).getAttribute("removed")){
			var task = {};
			task.name = document.getElementById("taskName_"+taskCounter).value;
			task.path = document.getElementById("taskPath_"+taskCounter).value;
			task.archivePath = document.getElementById("taskArchive_"+taskCounter).value;
			task.args = document.getElementById("taskArgs_"+taskCounter).value.split(",");
			task.timeout = document.getElementById("taskTimeout_"+taskCounter).value;
			test.test.tasks.push(task);			
			// since an empty string results in split returning an array with one empty string entry, clean up:
			if(task.args.length==1 && task.args[0]==""){
				task.args=[];
			}
		}
		taskCounter++;
	}
	var testName = getQueryParams(document.location.search).name;
	if(testName==undefined){
		testName = document.getElementById("testName").value;
		doRequestBody("POST", JSON.stringify(test), "application/json", "../manage/test/"+testName, crudHandle,["Created Test", () =>{
			window.location.replace("index.html?page=results&name="+testName);
		}], true);
	}else{
		doRequestBody("PUT", JSON.stringify(test), "application/json", "../manage/test/"+testName, crudHandle, ["Edited Test", () => {
			testName = getQueryParams(document.location.search).name;
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


function goToNewTest(){
	window.location.href='index.html?page=new'; 
	return false;
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

function listResult(result){
	listResultInternal(result, false);
	listResultInternal(result, true);
}

function listResultInternal(result, printable) {
	var printableIDPrefix=printable?"printable_":"";
	removeLoader();
	var className = 'color-pass';
	for (var i = 0; i < result.results.length; i++) {
		if(! result.results[i].passed){
			className = 'color-fail';
		}
	}
	// TODO remove innerHTML here
	var infoSpan = document.getElementById(printableIDPrefix+"info");
	infoSpan.innerHTML = ("<h3 class=\""+className+"\">" + escapeHtml(result.testName) + " - "+ result.testStartString + "</h3>");
	infoSpan.innerHTML += "<b>Run by</b>: "+escapeHtml(result.testRunBy)+"&nbsp;&nbsp; <b>Description</b>: "+ escapeHtml(result.description)+"<br><br><b>Test Commits:</b><br>";
	if(result.commits==undefined){
		infoSpan.innerHTML+="-";
	}else{
		for (var i = 0; i < result.commits.length; i++) {
			infoSpan.innerHTML += result.commits[i].name+" - "+result.commits[i].commit+"<br>";
		}		
	}
	infoSpan.innerHTML +="<hr>";

	var resultsSpan = document.getElementById(printableIDPrefix+"results");
	for (var i = 0; i < result.results.length; i++) {
		// tests in groups have a descriptive name
		if(result.results[i].commit==undefined){
			result.results[i].commit="-";
		}

		if(i>0){
			resultsSpan.appendChild(document.createElement("br"));
			resultsSpan.appendChild(document.createElement("br"));
			resultsSpan.appendChild(document.createElement("br"));
		}

		var descriptiveName =  result.results[i].descriptiveName==undefined?"":result.results[i].descriptiveName+ " - ";
		var header = document.createElement("H3");
		header.innerHTML = escapeHtml(descriptiveName+result.results[i].name)+ " " + (result.results[i].passed ? sun : cloud);
		resultsSpan.appendChild(header);

		var b = document.createElement("b");
		b.textContent="Script Commit: ";
		resultsSpan.appendChild(b);
		var res = document.createElement("i");
		res.innerHTML=escapeHtml(result.results[i].commit);
		resultsSpan.appendChild(res);
		resultsSpan.appendChild(document.createElement("br"));
		
		b = document.createElement("b");
		b.textContent="Result: ";
		resultsSpan.appendChild(b);
		res = document.createElement("span");
		res.innerHTML=escapeHtml(result.results[i].description);
		resultsSpan.appendChild(res);
		resultsSpan.appendChild(document.createElement("br"));

		var archiveName = result.results[i].archiveName;
		if(!printable && archiveName!=undefined && archiveName!=""){
			var btn = document.createElement("button");
			btn.id="downloadArchiveBtn_"+i;
			btn.classList.add("btn");
			btn.classList.add("btn-primary");
			btn.innerHTML="Show archived content";
			btn.archiveName=archiveName;
			btn.archiveID=result.results[i].archiveID;
			resultsSpan.appendChild(btn);
			
			var href = document.createElement("a");
			href.id="downloadArchiveHref_"+i;
			btn.hrefID=href.id;
			resultsSpan.appendChild(href);
			resultsSpan.appendChild(document.createElement("br"));
		}

		if(!printable){
			var accordion = createAccordion("Output",result.results[i].output);
			resultsSpan.appendChild(accordion);
			resultsSpan.appendChild(document.createElement("br"));
		
			accordion = createAccordion("Error Output",result.results[i].errorOutput);
			resultsSpan.appendChild(accordion);
			resultsSpan.appendChild(document.createElement("br"));
		}else{
			b = document.createElement("b");
			b.textContent="Output: ";
			resultsSpan.appendChild(b);
			res = document.createElement("span");
			res.innerHTML=escapeHtml(result.results[i].output).replace(/\n/g, "<br />");
			resultsSpan.appendChild(res);
			resultsSpan.appendChild(document.createElement("br"));

			b = document.createElement("b");
			b.textContent="Error Output: ";
			resultsSpan.appendChild(b);
			res = document.createElement("span");
			res.innerHTML=escapeHtml(result.results[i].errorOutput).replace(/\n/g, "<br />");
			resultsSpan.appendChild(res);
			resultsSpan.appendChild(document.createElement("br"));
		}
		
		b = document.createElement("b");
		b.textContent="Runtime: ";
		resultsSpan.appendChild(b);
		res = document.createElement("span");
		res.innerHTML=escapeHtml(escapeHtml(result.results[i].runTimeInMS) + " ms");
		resultsSpan.appendChild(res);

		if(!printable && archiveName!=null && archiveName!=""){
			document.getElementById("downloadArchiveBtn_"+i).index = i;
			document.getElementById("downloadArchiveBtn_"+i).onclick = function(){
				document.getElementById("loader").style.display="";
				console.log(result);
				var groupPrefix = viewingGroup()?"/group":"";
				if(this.archiveID==undefined){
					Swal.fire({
						title: 'No Archive ID found',
						text: "Could not load archive",
						icon: 'warning'
					});
				}else{
					doRequest("GET", "../tr/archive"+groupPrefix+"?name="+encodeURIComponent(result.testName)+"&handle="+encodeURIComponent(result.testStartTimestamp)+"&archiveID="+encodeURIComponent(this.archiveID), loadArchiveBlobBtn, [this.hrefID,this.archiveName], true);					
				}
			}
		}
	}
}

function  loadArchiveBlobBtn(blob,hrefID,archiveName){
	var dataUri = window.URL.createObjectURL(blob);
    var anchor = document.getElementById(hrefID);
    anchor.setAttribute('href', dataUri);
    anchor.setAttribute('download', archiveName);
    document.getElementById("loader").classList.add("display-none");
    anchor.click();
}

function viewingGroup(){
	var name = getQueryParams(document.location.search).name;
	if(name === undefined || name == "undefined"){
		return true;
	}
	return false;
}

function createAccordion(title,content){
	var uuid = uuidv4();
	var accDiv = document.createElement("div");
	accDiv.id="accordion_"+uuid;
	var cardDiv = document.createElement("div");
	cardDiv.classList.add("card");
	var cardHeadDiv = document.createElement("div");
	cardHeadDiv.classList.add("card-header");
	var cardh5 = document.createElement("h5");
	cardh5.classList.add("mb-0");
	var collapseCardBtn = document.createElement("button");
	collapseCardBtn.classList.add("btn");
	collapseCardBtn.classList.add("btn-link");
	collapseCardBtn.classList.add("collapsed");
	collapseCardBtn.setAttribute("data-toggle","collapse");
	collapseCardBtn.setAttribute("data-target","#cardCollapse_"+uuid);
	collapseCardBtn.textContent = title;
	accDiv.appendChild(cardDiv);
	cardDiv.appendChild(cardHeadDiv);
	cardHeadDiv.appendChild(cardh5);
	cardh5.appendChild(collapseCardBtn);
	
	var collapseDiv = document.createElement("div");
	collapseDiv.id="cardCollapse_"+uuid;
	collapseDiv.setAttribute("data-parent","#accordion_"+uuid);
	collapseDiv.classList.add("collapse");
	var cardBodyDiv = document.createElement("div");
	cardBodyDiv.classList.add("card-body");
	cardBodyDiv.innerHTML=escapeHtml(content).replace(/\n/g, "<br />");
	collapseDiv.appendChild(cardBodyDiv);
	cardDiv.appendChild(collapseDiv);
	return accDiv;
}

function listResults(results,paramName) {
	removeLoader();
	var testName = document.getElementById("testName");
	
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

		window.resultsTable = new Tabulator("#resultsSpan", {
		    layout:"fitDataFill",
		    columns:[
		    {title:"Status", field:"status", formatter:htmlFormatter},
		    {title:"Last Run", field:"lastRun", formatter:htmlFormatter, minWidth:170},
		    {title:"Tag", field:"tagS", minWidth:50},
		    ],
		});
		document.getElementById("resultsSpan").tableHandle = resultsTable;
		
		for (var i = 0; i < resultCount; i++) {
			var passed = true;
			for (var j = 0; j < results[i].result.results.length; j++) {
				passed = results[i].result.results[j].passed;
				if(!passed){
					break;
				}
			}
			results[i].status = (passed ? " "+sun: " "+cloud);
			results[i].tagS = results[i].tag !== undefined ? results[i].tag : "";
			results[i].lastRun = "<a href=\"index.html?page=result&"+paramName+"="+results[i].result.testName+"&handle="+ results[i].handle+"\">"+results[i].result.testStartString+"</a>";
		}
		resultsTable.setData(results);
	}
	doRequest("GET", "../script", fillScripts,[true]);
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
	
	window.testGroupsTable = new Tabulator("#testgroups", {
	    groupBy:"group",
	    groupStartOpen:false,
	    layout:"fitDataFill",
	    groupValues:[groupNames],
	    columns:[
	        {title:"Test", field:"test", width:400},
	        {title:"Name", field:"name", width:400},
	        {
	        	formatter:"buttonCross", hozAlign:"center", title:"", headerSort:false, cellClick:function(e, cell){
		        	if(confirm('Are you sure you want to remove this test from the group?')){
		        		var testName = cell.getRow()._row.data.test;
		        		var groupName = cell.getRow()._row.data.group;
		        		var obj={};
		        		doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/group/"+groupName+"/"+testName, crudHandle, [], true);
		        		cell.getRow().delete();
		        	}
	        	}
	        }
	     ],
	});
	// TODO refactor to use setData and prepare array first
	for (i = 0; i < groups.length; i++) {
		var groupTests = groups[i].tests;
		for (var x = 0; x < groupTests.length; x++) {
			testGroupsTable.addRow([{test:groupTests[x].test, name:groupTests[x].name, group:groups[i].name}], false);
		}
	}
	
	testGroupsTable.redraw(true);
}
