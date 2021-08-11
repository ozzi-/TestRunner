'use strict';

function changeOthersPassword(){
	var username = getQueryParams(document.location.search).name;
	var password = document.getElementById("changePassword").value;
	var changeObj = {};
	changeObj.password  = password;
	doRequestBody("PUT", JSON.stringify(changeObj), "application/json", "../user/"+username+"/password", crudHandle, ["Password changed", () => redirectPage("index.html?page=settings")], true);
	return false;
}

function changeRole(){
	var username = getQueryParams(document.location.search).name;
	var role = document.getElementById("editRole").value;
	if(role!=""){
		var changeObj = {};
		changeObj.role  = role;
		doRequestBody("PUT", JSON.stringify(changeObj), "application/json", "../user/"+username+"/role", crudHandle, ["Role changed", () => redirectPage("index.html?page=settings")], true);
	}
	return false;
}

function createUser(){
	var username = document.getElementById("createUsername").value;
	var password = document.getElementById("createPassword").value;
	var role = document.getElementById("createRole").value;
	var changeObj = {};
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
	var passwordObj = {};
	passwordObj.password  = password;
	doRequestBody("PUT", JSON.stringify(passwordObj), "application/json", "../user/password", proccessPasswordChange, true, true);
	return false;
}

function proccessPasswordChange(response){
	if(response.status!=200){
		Swal.fire({
			title: 'Error '+response.status,
			text: JSON.parse(response.responseText).error,
			icon: 'error'
		});
	}else{
		Swal.fire({
			title: 'Password changed successfully',
			text: "For security reasons, you will now be logged out",
			icon: 'success'
		}).then(function () {
			doLogout();			
		});
	}
}

function sessionsDeleted(){
	Swal.fire({
		title: 'Success',
		text: "Session(s) deleted",
		icon: 'success'
	});
}

function processCreateUser(response){
	if(response.status!=200){
		Swal.fire({
			title: 'Error ('+response.status+')',
			text: JSON.parse(response.responseText).error,
			icon: 'error'
		});
	}else{
		Swal.fire({
			title: 'Success',
			text: "User created",
			icon: 'success'
		}).then(function(){
			location.reload();			
		});
	}
}


function processDeleteUser(response){
	if(response.status!=200){
		Swal.fire({
			title: 'Error ('+response.status+')',
			text: JSON.parse(response.responseText).error,
			icon: 'error'
		});
	}else{
		Swal.fire({
			title: 'Success',
			text: "User deleted",
			icon: 'success'
		}).then(function(){
			window.location.replace("index.html?page=settings");
		});
	}
}

function fillUsers(res){

	window.usersTable = new Tabulator("#usersTable", {
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
	usersTable.setData(users);
	
}

function displaySettings(){
	if(localStorage.getItem(trRole)!==roleA){
		document.getElementById("settingsAdmin").remove();		
	}
}

function killSession(){
	var userName = getQueryParams(document.location.search).name;

	if(userName!=""){
		doRequest("DELETE", "../user/"+userName+"/session", sessionsDeleted,[]);		
	}
}
