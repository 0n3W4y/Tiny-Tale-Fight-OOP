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

function toHeroCreater(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "none";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "block";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "none";
	var welcomeContainer = document.getElementById( "welcome" ).style.display = "none";
}

function toWelcome(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "none";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "none";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "none";
	var welcomeContainer = document.getElementById( "welcome" ).style.display = "block";
}

function toBattle(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "block";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "none";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "none";
	var welcomeContainer = document.getElementById( "welcome" ).style.display = "none";
}

function toHome(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "none";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "none";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "none";
	var welcomeContainer = document.getElementById( "welcome" ).style.display = "none";
}

function toShop(){
	var battleContainer = document.getElementById( "batlle-wrapper" ).style.display = "none";
	var heroCreater = document.getElementById( "hero-creater" ).style.display = "none";
	var inventoryWrapperContainer = document.getElementById( "inventory-wrapper" ).style.display = "none";
	var shopWrapperContainer = document.getElementById( "shop-wrapper" ).style.display = "block";
	var welcomeContainer = document.getElementById( "welcome" ).style.display = "none";
}
