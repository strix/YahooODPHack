var util = require('util'),
	fs = require('fs'),
	os = require('os'),
	spawn = require('child_process').spawn,
	numCpus = os.cpus().length,
	alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
	perms = [],
	chunk = 4;

for(var i = 0; i<alphabet.length; i++){
	for(var j = 0; j < alphabet.length; j++){
		var combo = alphabet[i]+alphabet[j];
		perms.push(combo);
	}
}
console.log('Total combos: '+perms.length);

// var resender = spawn('phantomjs', ['resendCode.js']);
// resender.stdout.on('data', function (data) {
// 	if(typeof data === 'object'){
// 		console.log(data.toString());
// 	} else {
// 		console.log(data);
// 	}
// });

var count = 0;
for (var i = 0; i<perms.length; i+=chunk) { // CAREFUL!!!
	var spliced = perms.slice(i,i+chunk),
		commandParams = ['phahoo.mute.js'];
	commandParams.push.apply(commandParams, spliced);
	var phantom = spawn('phantomjs', commandParams);
	phantom.stdout.on('data', function (data) {
		if(typeof data === 'object'){
			console.log(data.toString());
		} else {
			console.log(data);
		}
		
	});
	count++;
}
console.log('Total psuedo tabs: '+count);