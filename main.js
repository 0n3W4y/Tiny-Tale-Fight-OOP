var game = new Game( 60 );
game.init();

var player = game.entityRoot.createEntity( "Player" );
var playerParams = {
	Name: ["Player", "One"],
	Type: {sex: "Man", race: "Human"},
	Stats: {age:"18", month: "2" ,day: "10"},
	FightingStats: {HP:50, SP:50, STR:10, AGI:10, END:10, INT:10, ASPD:0.7}
}
player.createComponentsWithParams( playerParams );

var mob = game.entityRoot.createEntity( "Mob" );
var mobParams = {
	Name: ["Scorpion", "Bloody"],
	Type: {sex: "Man", race: "Lol"},
	Stats: {age:"4", month: "5" ,day: "1"},
	FightingStats: {HP:30, SP:30, STR:10, AGI:4, END:4, INT:4, ASPD:0.5}
}
mob.createComponentsWithParams( mobParams );

game.battleRoot.addPlayersToFight( player, mob );
game.battleRoot.beginFight();

var string2 = document.createElement("li");
var string = player.getComponent("Name").getFullName();
string2.innerHTML = string;