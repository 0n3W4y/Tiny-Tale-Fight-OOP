class UserInterface {

	public leftCharacterBlock:any;
	public rightCharacterBlock:any;
	public journal:any;

	private parent:any;

	constructor( parent ){
		this.parent = parent;
	}

	public init( leftBlock, rightBlock, journal){
		this.leftCharacterBlock =  document.getElementById( leftBlock );
		this.rightCharacterBlock =  document.getElementById( rightBlock);
		this.journal = document.getElementById( journal );
	}

	private fillLeftCharacterBlock( entity ){
		//data =  { name:"full name", hp:100, sp:100, exp:[0,100], lvl: str:1, end:1, int:1 };
		var data = this.parent.entityRoot.collectDataFromEntity( entity );
		var container = this.leftCharacterBlock;

		var nameContainer = data["Name"];
		var fullName = nameContainer["fullname"];
		var fightingStatsContainer = data["FightingStats"];
		var currentStatsContainer = fightingStatsContainer["currentStats"];
		var hp = currentStatsContainer["HP"];
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
		container.getElementsByClassName("red")[0].innerHTML = hp + "/" + staticHp;
		var hpBar = Math.round( ( hp/staticHp ) * 100 );
		if( hpBar < 0 )
			hpBar = 0;
		container.getElementsByClassName("red")[0].style.width = hpBar + "%";
		container.getElementsByClassName("violet")[0].innerHTML = exp + "/" + expToNextLvl;
		var percent = Math.floor( (exp/expToNextLvl) *100 );
		var stringPercent = percent+ "%";
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
		container.getElementsByClassName("red")[0].innerHTML = hp + "/" + staticHp;
		var hpBar = Math.round( ( hp/staticHp ) * 100 );
		if( hpBar < 0 )
			hpBar = 0;
		container.getElementsByClassName("red")[0].style.width = hpBar + "%";
		container.getElementsByClassName("level")[0].innerHTML = lvl;
	}

	private addLineToJournal( string ){
		var container = this.journal;
		var li = document.createElement( "li" );
		li.innerHTML = string;
		container.insertBefore(li, container.firstChild);
	}

	public fillBlock( entity ){
		if( entity.type == "Player" )
			this.fillLeftCharacterBlock( entity );
		else if( entity.type == "Mob" )
			this.fillRightCharacterBlock( entity );
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
		var container = document.getElementById( "enemy-list" );
		container.removeChild( child );
	}

	public addToEnemyList( entity, id ):void{
		var race = entity.getComponent( "Type" ).race; // for image ( avatar );
		var level = entity.getComponent( "ExperienceStats" ).lvl;
		var fightingComponent = entity.getComponent( "FightingStats" );
		var currentHPStat = fightingComponent.getCurrentStat( "HP" );
		var staticHPStat = fightingComponent.getStaticStat( "HP" );
		var lvlUpHPStat = fightingComponent.getLevelUpStat( "HP" );

		var staticHP = staticHPStat + lvlUpHPStat * level;

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
		spanBar.style.width = "100%";

		li.appendChild( divAvatar );
		divAvatar.appendChild( divLevel );
		divAvatar.appendChild( divBar );
		divBar.appendChild( spanBar );

		var container = document.getElementById( "enemy-list" );
		container.appendChild( li );

		//create tooltip;

	}

	public createToolTip( entity ){

	}

	public updateTollTip( entity ){

	}

	public updateInterface(){

	}

}

		