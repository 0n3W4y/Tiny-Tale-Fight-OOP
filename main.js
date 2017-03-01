var player;
var game;
var mob;

function initGame(){
	game = new Game( 60 );
	var lb = "left-character-main-frame";
	var rb = "right-character-main-frame";
	var journal = "fighting-log";
	game.init( creaturesData, humanoidsData, lb, rb, journal );

	player = game.entityRoot.generateEntity( "Player", "Humanoid" );
	game.userInterface.fillBlock("Left", player);

	mob = game.entityRoot.generateEntity( "Mob", "Creature" );
	game.userInterface.fillBlock("Right", mob);

	game.battle.addPlayerToFight( 1,  player );
	game.battle.addPlayerToFight( 2, mob );
	game.battle.beginFight();
}