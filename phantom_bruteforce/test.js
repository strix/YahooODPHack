var system = require('system');
var args = system.args;
var page = new WebPage();
for(var i = 0; i<args.length; i++){
	console.log(args[i]);
}
// args.forEach(function(arg, i) {
// 	console.log(i + ': ' + arg);
// });
window.setTimeout(function(){
	console.log('HERE NOW');
	phantom.exit();
}, 5000);
// page.open("https://login.yahoo.com/");