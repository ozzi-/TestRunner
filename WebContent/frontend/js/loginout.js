'use strict';

function doLogin(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var loginObj = {};
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