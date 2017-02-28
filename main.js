var player;
var game;
var mob;



function fillStats(){

	game.userInterface.fillBlock("Left", player);
	game.userInterface.fillBlock("Right", mob);

}

function initGame(){
	game = new Game( 60 );
	var lb = "left-character-main-frame";
	var rb = "right-character-main-frame";
	var journal = "fighting-log";
	game.init( creaturesData, humanoidsData, lb, rb, journal );

	player = game.entityRoot.createEntity( "Player" );
	var playerParams = {
		Name: {name: "Player", surname: "One"},
		Type: {sex: "Man", race: "Human"},
		AgeStats: { age:18, month:2 ,day:10 },
		FightingStats: { stats: {HP:50, SP:50, STR:10, AGI:10, END:10, INT:10, ASPD:50}, lvlUp: {HP:5, SP:5, STR:1, AGI:1, END:1, INT:1, ASPD:0} },
		ExperienceStats: {lvl:1, exp:0}
	}
	player.createComponentsWithParams( playerParams );
	player.getComponent("FightingStats").updateStatsWithLevelUp();

	mob = game.entityRoot.generateEntity( "Creature" );
	mob.getComponent("FightingStats").updateStatsWithLevelUp();

	game.battle.addPlayerToFight( 1,  player );
	game.battle.addPlayerToFight( 2, mob );
	game.battle.beginFight();
}