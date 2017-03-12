var game;

function initGame(){
	game = new Game( 30 );
	var lb = "left-character-main-block";
	var rb = "right-character-main-block";
	var journal = "journal";
	var hb = "helper-block";
	var el = "enemy-list";
	game.init( creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData, lb, rb, journal, hb, el );
	game.start();
}
