'use strict';
console.log("loaded lists");

function listGroups(groups){
	var groupCount = groups.length;
	removeLoader();
	if(localStorage.getItem(trRole)==="r"){
		window.testGroupsTable = new Tabulator("#testGroupsTable", {
		    pagination:"local", 
		    paginationSize:10,
		    layout:"fitDataFill",
		    columns:[
			    {title:"Group", field:"groupLink", maxWidth:240,  formatter:htmlFormatter},
			    {title:"Description", field:"description", maxWidth:290, formatter:htmlFormatter},
			    {title:"Tests", field:"tests", tooltip: true, width:290},
			    {title:"Status", field:"runState", formatter:htmlFormatter},
			    {title:"Last Run", field:"lastRunDate" },
			    {title:"LRT", field:"lastRunTime", headerTooltip:"Last Run Time"},
		    ],
		});
	}else{
		window.testGroupsTable = new Tabulator("#testGroupsTable", {
		    pagination:"local", 
		    paginationSize:10,
		    layout:"fitDataFill",
		    columns:[
		    {title:"Group", field:"groupLink",maxWidth:240, formatter:htmlFormatter},
		    {title:"Description", field:"description", maxWidth:290, formatter:htmlFormatter},
		    {title:"Tests", field:"tests", tooltip: true,  width:290},
		    {title:"Run", field:"runLink", minWidth:70, formatter:htmlFormatter},
		    {title:"Custom", field:"runTLink", minWidth:70, formatter:htmlFormatter},
		    {title:"Status", field:"runState", formatter:htmlFormatter},
		    {title:"Last Run", field:"lastRunDate"},
		    {title:"LRT", field:"lastRunTime", headerTooltip:"Last Run Time"},
		    ],
		});
	}
	if(groupCount==0){
		testGroupsTable.addRow([{group:"No Groups defined yet", tests:"", run:"", status:"", lastRun: "", lastRunTime:""}], false);
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
	testGroupsTable.setData(groups);
	
	if(localStorage.getItem(trRole)===roleRWX || localStorage.getItem(trRole)===roleA ){
		document.getElementById("testGroupsSettings").classList.remove("display-none");
		document.getElementById("testSettings").classList.remove("display-none");
		document.getElementById("testAdd").classList.remove("display-none");
		document.getElementById("scriptAdd").classList.remove("display-none");
	}
}

function listTests(tests) {
	var testCount = tests.length;
	removeLoader();
	
	var collapse = getQueryParams(document.location.search).collapse;
	if(collapse==undefined){
		document.getElementById("collapseGroupsHref").classList.remove("display-none");
	}else{
		document.getElementById("expandGroupsHref").classList.remove("display-none");
	}
		
	if(localStorage.getItem(trRole)==="r"){
		window.testsTable = new Tabulator("#testsTable", {
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
		    {title:"LRT", field:"lastRunTime", headerTooltip:"Last Run Time"},
		    ],
		});
	}else{
		window.testsTable = new Tabulator("#testsTable", {
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
		    {title:"LRT", field:"lastRunTime", headerTooltip:"Last Run Time"},
		    ],
		});
	}

	if(testCount==0){
		testsTable.addRow([{test:"No tests defined yet", run:"", status:"", lastRun: "", lastRunTime:""}], false);
	}
	for (var i = 0; i < testCount; i++) {
		tests[i].testLink = "<a href=\"index.html?page=results&name="+tests[i].name+"\">"+tests[i].name+"</a>";
		tests[i].runLink = "<a style=\"text-decoration:none;\" href=\"index.html?page=run&name="+tests[i].name+"\"> &#9654; </a>";
		tests[i].runTLink = "<a style=\"text-decoration:none;\" href=\"index.html?page=custom&name="+tests[i].name+"\"> &#128221; </a>";
		tests[i].runState = tests[i].lastRunPassed ? sun : cloud;
		tests[i].runState = tests[i].lastRunDate.length==0 ? "-" : tests[i].runState;
		tests[i].lastRunTime = timeConversion(tests[i].totalRunTimeInMS);
	}
	testsTable.setData(tests);
	var filterInput = document.getElementById("filterInputTests");
	var timer;
	filterInput.onkeyup = function(){
		timer = setTimeout(function() {	
			testsTable.setFilter(matchAny, [filterInput.value,"name"]);
		},700);
	};
	filterInput.onkeydown = function(){
		clearTimeout(timer);
	};
}


function listScripts(scripts){
	removeLoader();

	window.scriptsTable = new Tabulator("#scriptsTable", {
		layoutColumnsOnNewData:true,
	    layout:"fitDataFill",
	    pagination:"local", 
	    dataTree:true,
	    dataTreeFilter:false,
	    dataTreeStartExpanded:true,
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

	var filterTree = function (data, filter) {		
		if(data[filter.field].includes(filter.value)){
			return true;
		}
	    if (data['_children'] && data['_children'].length > 0) {
	    	for(var i = 0; i < data['_children'].length; i++){
	    		return filterTree(data['_children'][i], filter);
	    	}
	    }
	    return data[filter.field] == filter.value;
	};
	
	var filterInput = document.getElementById("filterInputScripts");
	
	filterInput.addEventListener("keyup", event => {
		scriptsTable.setFilter(filterTree, {field:'name', value:document.getElementById("filterInputScripts").value});
		// TODO why does tabulator.js scroll around like crazy on FF
		//window.scrollTo(0,document.body.scrollHeight);
	});
}


function displayLog(logs){
	removeLoader();
	var logField = document.getElementById("logfield");
	logField.value=logs;
	logField.scrollTop = logField.scrollHeight;
}