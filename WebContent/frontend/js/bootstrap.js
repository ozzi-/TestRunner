function loadJS(url) {
	return new Promise(function(resolve, reject) {
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.src = url+"?cacheBuster="+ (Math.random()*1000000);
		js.async = true;
		js.onload = function() {
			resolve(url);
		};
		js.onerror = function() {
			reject(url);
		};
    	document.body.appendChild(js);
	});
}

let scripts = [
	'js/fe.js',
	'js/loginout.js',
	'js/script.js',
	'js/settings.js',
	'js/tests.js',
	'js/list.js',
	'js/logic.js'
];

let promises = [];
scripts.forEach(function(url) {
	promises.push(loadJS(url));
});

Promise.all(promises)
.then(function() {
	start();
}).catch(function(script) {
	alert("Bootstrapping error: "+script + ' failed to load');
});

