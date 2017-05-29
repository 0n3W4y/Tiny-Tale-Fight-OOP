var game;

function initGame(){
	game = new Game( 30 );
	var lb = "left-character-main-block";
	var rb = "right-character-main-block";
	var journal = "journal";
	var hb = "helper-block";
	var el = "enemy-list";
	var ob = "orbs";
	game.init( creaturesData, creaturesClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData, orbsClassData, lb, rb, journal, hb, el, ob );
	game.start();
}

function toHeroCreater(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "none";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "block";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "none";
	var welcomeContainer = document.getElementById( "login" ).style.display = "none";
}

function toLogin(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "none";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "none";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "none";
	var welcomeContainer = document.getElementById( "login" ).style.display = "block";
}

function toBattle(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "block";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "none";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "none";
	var welcomeContainer = document.getElementById( "login" ).style.display = "none";
}

/*
function toHome(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "none";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "none";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "none";
	var welcomeContainer = document.getElementById( "login" ).style.display = "none";
}
*/

function toHome(){ // временная, которая генерирует персонажа, и сразу бросает его в бой.
	this.toBattle();
	game.preStart();
}

function toShop(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "none";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "none";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "block";
	var welcomeContainer = document.getElementById( "login" ).style.display = "none";
}

function addAOEOrb(){
	var item = game.entityRoot.generateEntity("Orb", "AttackingOrbAOE", null, null);
	game.userInterface.addOrbToBlock( item );
}

function addSTOrb(){
	var item = game.entityRoot.generateEntity("Orb", "AttackingOrbST", null, null);
	game.userInterface.addOrbToBlock( item );
}

function addOrbToBattle( e ){
	var currentTarget = e.currentTarget;
	var id = currentTarget.id;
	var list = game.entityRoot.getListOfEntities();
	var orb;
	for( var i = 0; i < list.length; i++ ){
		var item = list[i];
		if( item.id == id ){
			orb = list[i];
			break;
		}
	}

	if( game.battle.addOrbToBattle( orb ) ){
		game.userInterface.removeOrbFromBlock( id );
	}
}
