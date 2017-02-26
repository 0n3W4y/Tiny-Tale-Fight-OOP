var game = new Game( 60 );
game.init( creaturesData, humanoidsData );

var player = game.entityRoot.createEntity( "Player" );
var playerParams = {
	Name: {name: "Player", surname: "One"},
	Type: {sex: "Man", race: "Human"},
	AgeStats: { age:18, month:2 ,day:10 },
	FightingStats: { stats: {HP:50, SP:50, STR:10, AGI:10, END:10, INT:10, ASPD:50}, lvlUp: {HP:5, SP:5, STR:1, AGI:1, END:1, INT:1, ASPD:0} },
	ExperienceStats: {lvl:1, exp:0}
}
player.createComponentsWithParams( playerParams );

var mob = game.entityRoot.generateEntity( "Creature" );

game.battleRoot.addPlayersToFight( player, mob );
game.battleRoot.beginFight();



function fillStats(){
	var string2 = document.createElement("li");
	var string = player.getComponent("Name").getFullName();
	string2.innerHTML = string;
	document.getElementById("fighting-log").appendChild(string2);
}