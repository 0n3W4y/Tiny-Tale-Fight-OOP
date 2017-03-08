var game;

function initGame(){
	game = new Game( 60 );
	var lb = "left-character-main-frame";
	var rb = "right-character-main-frame";
	var journal = "fighting-log";
	game.init( creaturesData, humanoidsData, humanoidsClassData, lb, rb, journal );
	game.start();
}
