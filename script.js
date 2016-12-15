//initialize Firebase
var config = {
	apiKey: "AIzaSyCbnVnhtE9gqNqgPQ0HIasqnTnM86bZKHI",
	authDomain: "my-awesome-project-21662.firebaseapp.com",
	databaseURL: "https://my-awesome-project-21662.firebaseio.com",
	storageBucket: "my-awesome-project-21662.appspot.com",
	messagingSenderId: "497853709455"
};

firebase.initializeApp(config);

var database = firebase.database();


//Assign player -----------------------------------------
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {

  if (snap.val()) {

    var con = connectionsRef.push(true);

    con.onDisconnect().remove();
  }
});

var playNum = false;

connectionsRef.on("value", function(snap) {
	console.log(snap.numChildren());
  if (snap.numChildren() === 1){
  	playNum = '1';
  } else if (snap.numChildren() === 2 && !playNum){
  	playNum = '2';
  }
});


// -------------------------------------------------------

// choose psr --------------------------------------------
oneChoice = 3;
twoChoice = 3;
result = '';

oneScore = 0;
twoScore = 0;

var outcome = [['Draw!', 'Player one wins!', 'Player two wins!'], ['Player two wins!', 'Draw!', 'Player one wins!'], ['Player one wins!', 'Player two wins!', 'Draw!']];


$('.paperButton').on('click', function(){
	if (playNum == '1'){
		database.ref().update({
      		playerOne: 0,
    	});
	} else if (playNum == '2'){
		database.ref().update({
      		playerTwo: 0,
    	});
	}
});

$('.scissorsButton').on('click', function(){
	if (playNum == '1'){
		database.ref().update({
      		playerOne: 1,
    	});
	} else if (playNum == '2'){
		database.ref().update({
      		playerTwo: 1,
    	});
	}
});

$('.rockButton').on('click', function(){
	if (playNum === '1'){
		database.ref().update({
      		playerOne: 2,
    	});
	} else if (playNum === '2'){
		database.ref().update({
      		playerTwo: 2,
    	});
	}
});

database.ref().on("value", function(snapshot) {
	if (snapshot.child('playerOne').val() != 3 && snapshot.child('playerTwo').val() != 3){
		oneChoice = snapshot.child('playerOne').val();
		twoChoice = snapshot.child('playerTwo').val();
		runGame();
	}
});


var runGame = function(){

	result = outcome[twoChoice][oneChoice];
	console.log(result);

	switch (result){
		case 'Draw!': 
			console.log('draw');
			break;
		case 'Player one wins!':
			oneScore++; 
			console.log('one');
			break;
		case 'Player two wins!':
			twoScore++; 
			console.log('two');
			break;
		default:
			console.log('default');
	}

	$('.oneScore').html(oneScore);
	$('.twoScore').html(twoScore);
	
	//reset -- 3 doesn't allow runGame() to execute
	database.ref().update({
      	playerOne: 3,
      	playerTwo: 3
    });	
};

// 0 = paper
// 1 = scissors
// 2 = rock