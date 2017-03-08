var game;

function initGame(){
	game = new Game( 60 );
	var lb = "left-character-main-block";
	var rb = "right-character-main-block";
	var journal = "fighting-log";
	game.init( creaturesData, humanoidsData, humanoidsClassData, lb, rb, journal );
	game.start();
}
