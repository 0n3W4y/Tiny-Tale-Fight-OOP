class UserInterface {

	public journal:any;

	private leftCharacterBlock:any;
	private rightCharacterBlock:any;
	private leftHelperBlock:any;
	private enemyList:any;

	private parent:any;

	constructor( parent ){
		this.parent = parent;
	}

	public init( leftBlock, rightBlock, journal, helperBlock, enemyList ){
		this.leftCharacterBlock =  document.getElementById( leftBlock );
		this.rightCharacterBlock =  document.getElementById( rightBlock);
		this.leftHelperBlock = document.getElementById( helperBlock );
		this.enemyList = document.getElementById( enemyList );
		this.journal = new Journal( journal );
		//this.journal.init();
	}

	private fillLeftCharacterBlock( entity ){
		//data =  { name:"full name", hp:100, sp:100, exp:[0,100], lvl: str:1, end:1, int:1 };
		var data = this.parent.entityRoot.collectDataFromEntity( entity );
		var container = this.leftCharacterBlock;

		var nameContainer = data["Name"];
		var fullName = nameContainer["fullname"];
		var fightingStatsContainer = data["FightingStats"];
		var currentStatsContainer = fightingStatsContainer["currentStats"];
		var hp = Math.round( currentStatsContainer["HP"] );
		var str = currentStatsContainer["STR"];
		var end = currentStatsContainer["AGI"];
		var int = currentStatsContainer["INT"];
		var staticStatsContainer = fightingStatsContainer["staticStats"];
		var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
		var lvlUpClassStatsContainer = fightingStatsContainer["levelUpClassStats"];
		var experienceStats = data["ExperienceStats"];
		var exp = experienceStats["exp"];
		var expToNextLvl = experienceStats["expToNextLvl"];
		var lvl = experienceStats["lvl"];

		var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"]*lvl;

		container.getElementsByClassName("name")[0].innerHTML = fullName;
		container.getElementsByClassName("red")[0].innerHTML = Math.round( hp ) + "/" + staticHp;
		var hpBar = Math.round( ( hp/staticHp ) * 100 );
		if( hpBar < 0 )
			hpBar = 0;
		container.getElementsByClassName("red")[0].style.width = hpBar + "%";
		container.getElementsByClassName("violet")[0].innerHTML = exp + "/" + expToNextLvl;
		var percent = Math.floor( (exp/expToNextLvl) *100 );
		var stringPercent = percent + "%";
		container.getElementsByClassName("violet")[0].style.width = stringPercent;
		container.getElementsByClassName("level")[0].innerHTML = lvl;

	}

	private fillRightCharacterBlock( entity ){
		var data = this.parent.entityRoot.collectDataFromEntity( entity );
		var container = this.rightCharacterBlock;

		var nameContainer = data["Name"];
		var fullName = nameContainer["fullname"];
		var fightingStatsContainer = data["FightingStats"];
		var currentStatsContainer = fightingStatsContainer["currentStats"];
		var hp = currentStatsContainer["HP"];
		var str = currentStatsContainer["STR"];
		var int = currentStatsContainer["INT"];
		var staticStatsContainer = fightingStatsContainer["staticStats"];
		var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
		var experienceStats = data["ExperienceStats"];
		var bounty = experienceStats["bounty"];
		var lvl = experienceStats["lvl"];

		var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"]*lvl;

		container.getElementsByClassName("name")[0].innerHTML = fullName;
		container.getElementsByClassName("red")[0].innerHTML = Math.round( hp ) + "/" + staticHp;
		var hpBar = Math.round( ( hp/staticHp ) * 100 );
		if( hpBar < 0 )
			hpBar = 0;
		container.getElementsByClassName("red")[0].style.width = hpBar + "%";
		container.getElementsByClassName("level")[0].innerHTML = lvl;
	}

	private fillLeftHelperBlock( entity ){
		var data = this.parent.entityRoot.collectDataFromEntity( entity );
		var container = this.leftHelperBlock;

		var nameContainer = data["Name"];
		var fullName = nameContainer["fullname"];
		var fightingStatsContainer = data["FightingStats"];
		var currentStatsContainer = fightingStatsContainer["currentStats"];
		var hp = Math.round( currentStatsContainer["HP"] );
		var str = currentStatsContainer["STR"];
		var end = currentStatsContainer["AGI"];
		var int = currentStatsContainer["INT"];
		var staticStatsContainer = fightingStatsContainer["staticStats"];
		var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
		var lvlUpClassStatsContainer = fightingStatsContainer["levelUpClassStats"];
		var experienceStats = data["ExperienceStats"];
		var exp = experienceStats["exp"];
		var expToNextLvl = experienceStats["expToNextLvl"];
		var lvl = experienceStats["lvl"];

		var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"]*lvl;

		container.getElementsByClassName("name")[0].innerHTML = fullName;
		container.getElementsByClassName("red")[0].innerHTML = Math.round( hp ) + "/" + staticHp;
		var hpBar = Math.round( ( hp/staticHp ) * 100 );
		if( hpBar < 0 )
			hpBar = 0;
		container.getElementsByClassName("red")[0].style.width = hpBar + "%";
		container.getElementsByClassName("violet")[0].innerHTML = exp + "/" + expToNextLvl;
		var percent = Math.floor( (exp/expToNextLvl) * 100 );
		var stringPercent = percent + "%";
		container.getElementsByClassName("violet")[0].style.width = stringPercent;
		container.getElementsByClassName("level")[0].innerHTML = lvl;
	}

	public fillBlock( entity ){ // можно использовать как обновление 1 из стат, так и всего целиком.
		if( entity.type == "Player" )
			this.fillLeftCharacterBlock( entity );
		else if( entity.type == "Mob" )
			this.fillRightCharacterBlock( entity );
		else if( entity.type == "Helper" )
			this.fillLeftHelperBlock( entity );
		else
			console.log("Error no key with name: " + entity.type + ". Error in UserInterface/fillBlock" );
	}

	public drawAvatar( blockName, params ){
		var container = this.rightCharacterBlock;
		if( blockName == "Left" )
			container = this.leftCharacterBlock;

		var avatar = container.getElementsByClassName("avatar");
		//img.src= params;
	}

	public removeFromEnemyList( index ):void{
		var child = document.getElementById( index );
		var container = this.enemyList;
		container.removeChild( child );
	}

	public addMobFromEnemyListToMainBlock( mob, index ){
		this.removeFromEnemyList( index );
		this.fillBlock( mob );
	}

	public addMobFromMainBlockToEnemyList( mob, index ){
		this.addToEnemyList( mob, index );
		this.clearRightBlock();
	}

	public addToEnemyList( entity, id ):void{
		var race = entity.getComponent( "Type" ).race; // for image ( avatar );
		var level = entity.getComponent( "ExperienceStats" ).lvl;
		var fightingComponent = entity.getComponent( "FightingStats" );
		var currentHPStat = Math.round( fightingComponent.getCurrentStat( "HP" ) );
		var staticHPStat = fightingComponent.getStaticStat( "HP" );
		var lvlUpHPStat = fightingComponent.getLevelUpStat( "HP" );

		var staticHP = staticHPStat + lvlUpHPStat * level;
		var hpWidth = Math.round( ( currentHPStat / staticHP ) * 100 );

		var li = document.createElement("li");
		li.id = "" + id;
		var divAvatar = document.createElement("div");
		divAvatar.id = "avatar";
		//divAvatar.style.background-image = 

		var divLevel = document.createElement("div");
		divLevel.className = "level";
		divLevel.innerHTML = level;

		var divBar = document.createElement("div");
		divBar.className = "bar-li";

		var spanBar = document.createElement("span");
		spanBar.className = "red";
		spanBar.innerHTML = currentHPStat + "/" + staticHP;
		spanBar.style.width = hpWidth + "%";

		li.appendChild( divAvatar );
		divAvatar.appendChild( divLevel );
		divAvatar.appendChild( divBar );
		divBar.appendChild( spanBar );

		var container = this.enemyList;
		container.appendChild( li );

		//create tooltip;

	}

	public clearBlock( blockName ){
		if( blockName == "Left" )
			this.clearLeftBlock();
		else if( blockName == "Right" )
			this.clearRightBlock();
		else if( blockName == "Helper" )
			this.clearLeftHelperBlock();
		else if( blockName == "EnemyList" )
			this.clearEnemyList();
		else
			console.log( "Error, block name : " + blockName + " not found. Error in UserInterface/clearBlock.");
	}

	public clearAllBlocks(){
		this.clearLeftBlock();
		this.clearRightBlock();
		//this.clearLeftHelperBlock();
		this.clearEnemyList();
	}

	private clearRightBlock(){
		var container = this.rightCharacterBlock;
		container.getElementsByClassName("name")[0].innerHTML = "";
		container.getElementsByClassName("red")[0].innerHTML = "0/0";
		container.getElementsByClassName("red")[0].style.width = "0%";
		container.getElementsByClassName("level")[0].innerHTML = "0";
	}

	private clearLeftBlock(){
		var container = this.leftCharacterBlock;
		container.getElementsByClassName("name")[0].innerHTML = "";
		container.getElementsByClassName("red")[0].innerHTML = "0/0";
		container.getElementsByClassName("red")[0].style.width = "0%";
		container.getElementsByClassName("level")[0].innerHTML = "0";
	}

	private clearLeftHelperBlock(){
		var container = this.leftHelperBlock;
		container.getElementsByClassName("name")[0].innerHTML = "";
		container.getElementsByClassName("red")[0].innerHTML = "0/0";
		container.getElementsByClassName("red")[0].style.width = "0%";
		container.getElementsByClassName("level")[0].innerHTML = "0";
		this.leftHelperBlock = null;
	}

	private clearEnemyList(){
		var container = this.enemyList;
		while (container.firstChild) {
   			container.removeChild(container.firstChild);
   		}
	}

	public updateUIForEntity( entity, index ){
		if( entity.type == "Player" || entity.type == "Helper" )
			this.fillBlock( entity );
		else if( entity.type == "Mob" ){
			var result = this.checkMobInEnemyList( index );
			if( result != null )
				this.updateMobInEnemyList( entity, result );
			else
				this.fillBlock( entity );
		}
			
	}

	private checkMobInEnemyList( index ):any{
		var container = this.enemyList;
		var list = container.getElementsByTagName("li");
		for( var i = 0; i < list.length; i++ ){
			if ( list[i].id == index )
				return list[i];
		}

		return null;
	}

	private updateMobInEnemyList( entity, container ){
		var currentHPStat = Math.round( entity.getComponent( "FightingStats" ).getCurrentStat( "HP" ) );
		var lvl = entity.getComponent( "ExperienceStats" ).lvl;
		var staticHp = entity.getComponent( "FightingStats" ).getStaticStat( "HP" );
		var lvlUpHp = entity.getComponent( "FightingStats" ).getLevelUpStat( "HP" );

		staticHp = staticHp + lvlUpHp*lvl;

		var hpWidth = Math.round( ( currentHPStat / staticHp ) * 100);
		if( hpWidth < 0 )
			hpWidth = 0;

		var hpBar = container.getElementsByClassName( "red" )[0];
		hpBar.innerHTML = currentHPStat + "/" + staticHp;
		hpBar.style.width = hpWidth + "%";
	}

	public createToolTip( entity ){

	}

	public updateTollTip( entity ){

	}

	public updateInterface(){

	}
}		