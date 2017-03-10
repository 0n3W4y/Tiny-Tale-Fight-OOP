var game;

function initGame(){
	game = new Game( 30 );
	var lb = "left-character-main-block";
	var rb = "right-character-main-block";
	var journal = "journal";
	var hb = "left-helper-main-block";
	var el = "enemy-list";
	game.init( creaturesData, humanoidsData, humanoidsClassData, lb, rb, journal, hb, el );
	game.start();
}
