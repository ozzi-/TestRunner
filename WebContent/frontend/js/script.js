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


function addTestGroupEntry(){
	var test = document.getElementById("testNameSelect").value;
	var group = document.getElementById("testGroupSelect").value;
	var name = document.getElementById("testName").value;
	testGroupsTable.addRow([{test: test, name:name, group:group}], false);
	document.getElementById("addTestGroupMappingForm").reset();
	
	var obj = {};
	obj.test=test;
	obj.name=name;
	doRequestBody("PUT", JSON.stringify(obj), "application/json", "../manage/group/"+group, crudHandle, [], true);

	return false;
}

function listGroupSettingsTestNames(tests){
	var sel = document.getElementById("testNameSelect");
	for (var i = 0; i < tests.length; i++) {
		var option = document.createElement("option");
		option.text = tests[i].name;
		sel.add(option);
	}
}


function createTestGroup(){
	var groupName = document.getElementById("groupName").value;
	var groupDescription = document.getElementById("groupDescription").value;
	var obj =  {};
	obj.name=groupName;
	obj.description=groupDescription;
	doRequestBody("POST", JSON.stringify(obj), "application/json", "../manage/group/", crudHandle, ["Group created",reloadPage], true);

	return false;
}

function createCategory(){
	var categoryName = document.getElementById("categoryName").value;
	var obj =  {};
	obj.name=categoryName;
	doRequestBody("POST", JSON.stringify(obj), "application/json", "../manage/category/", crudHandle, ["Category created", reloadPage], true);

	return false;
}

function deleteTestGroup(){
	var groupName = document.getElementById("testGroupSelectDelete").value;
	var obj={};
	doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/group/"+groupName, crudHandle, ["Group deleted",reloadPage], true);
	return false;
}


function deleteCategory(){
	var categoryName = document.getElementById("categoryNameDelete").value;
	var obj={};
	// TODO don't really need a reload here, might as well add the row to tabulator 
	doRequestBody("DELETE", JSON.stringify(obj), "application/json", "../manage/category/"+categoryName, crudHandle, ["Category deleted", reloadPage], true);
	return false;
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
			scriptAddEditorInitialized=true;
			editorElem.editorHandle=editor;
		}
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

function revert(){
	var commitID = getQueryParams(document.location.search).id;
	doRequestBody("POST", "", "application/json", "../manage/history/revert/"+commitID, crudHandle, ["Reverted to commit", () => redirectPage("index.html?page=history")],true);
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

function fillScripts(res, checkScriptExistent){
	var scriptSelects = document.getElementsByClassName("scriptSelect");
	for(var i = 0; i < scriptSelects.length; i++){
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

function fillFolders(res){
	var folderSelects = document.getElementsByClassName("folderSelect");
	for(var i = 0; i < folderSelects.length; i++){
		fillFoldersInternal(res,folderSelects[i]);
	}
}

function fillFoldersInternal(res,select){
	for(var y = 0; y < res.length; y++){
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