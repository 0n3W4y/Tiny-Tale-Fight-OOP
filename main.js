var game = new Game();
game.commonTick = new CommonTick(60);
game.entityRoot = new EntityRoot();
var player = game.entityRoot.createEntity( "Player" );
var params = {
	Name: ["Player", "One"],
	Type: {sex: "Man", race: "Human"},
	Stats: {age:"18", month: "2" ,day: "10"},
	FightingStats: {HP:50, SP:50, STR:10, AGI:10, END:10, INT:10}
}

player.createComponentsWithParams( params );
var string2 = document.createElement("li");
var string = player.getComponent("Name").getFullName();
string2.innerHTML = string;