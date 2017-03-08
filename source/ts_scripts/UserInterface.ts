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
		//params { name:"full name", hp:100, sp:100, exp:[0,100], lvl: str:1, end:1, int:1 };
		var data = this.parent.entityRoot.collectDataFromEntity( entity );
		var container = this.leftCharacterBlock;

		var nameContainer = data["Name"];
		var fullName = nameContainer["fullname"];
		var fightingStatsContainer = data["FightingStats"];
		var currentStatsContainer = fightingStatsContainer["currentStats"];
		var hp = currentStatsContainer["HP"];
		var sp = currentStatsContainer["SP"];
		var str = currentStatsContainer["STR"];
		var end = currentStatsContainer["END"];
		var int = currentStatsContainer["INT"];
		var staticStatsContainer = fightingStatsContainer["staticStats"];
		var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
		var experienceStats = data["ExperienceStats"];
		var exp = experienceStats["exp"];
		var expToNextLvl = experienceStats["expToNextLvl"];
		var lvl = experienceStats["lvl"];

		var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"]*lvl;
		var staticSp = staticStatsContainer["SP"] + lvlUpStatsContainer["SP"]*lvl;

		container.getElementsByClassName("name")[0].innerHTML = fullName;
		container.getElementsByClassName("red")[0].innerHTML = hp + "/" + staticHp;
		var hpBar = Math.round( ( hp/staticHp ) * 100 );
		if( hpBar < 0 )
			hpBar = 0;
		container.getElementsByClassName("red")[0].style.width = hpBar + "%";
		container.getElementsByClassName("green")[0].innerHTML = sp + "/" + staticSp;
		var spBar = Math.round( ( sp/staticSp ) * 100 );
		if( spBar < 0 )
			spBar = 0;
		container.getElementsByClassName("green")[0].style.width = spBar + "%";
		container.getElementsByClassName("violet")[0].innerHTML = exp + "/" + expToNextLvl;
		var percent = Math.floor( (exp/expToNextLvl) *100 );
		var stringPercent = percent+ "%";
		container.getElementsByClassName("violet")[0].style.width = stringPercent;
		container.getElementsByClassName("level")[0].innerHTML = lvl;
		container.getElementsByClassName("phisic-attack")[0].innerHTML = str;
		container.getElementsByClassName("defense")[0].innerHTML = end;
		container.getElementsByClassName("magic-attack")[0].innerHTML = int;

	}

	private fillRightCharacterBlock( entity ){
		var data = this.parent.entityRoot.collectDataFromEntity( entity );
		var container = this.rightCharacterBlock;

		var nameContainer = data["Name"];
		var fullName = nameContainer["fullname"];
		var fightingStatsContainer = data["FightingStats"];
		var currentStatsContainer = fightingStatsContainer["currentStats"];
		var hp = currentStatsContainer["HP"];
		var sp = currentStatsContainer["SP"];
		var str = currentStatsContainer["STR"];
		var end = currentStatsContainer["END"];
		var int = currentStatsContainer["INT"];
		var staticStatsContainer = fightingStatsContainer["staticStats"];
		var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
		var experienceStats = data["ExperienceStats"];
		var bounty = experienceStats["bounty"];
		var lvl = experienceStats["lvl"];

		var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"]*lvl;
		var staticSp = staticStatsContainer["SP"] + lvlUpStatsContainer["SP"]*lvl;

		container.getElementsByClassName("name")[0].innerHTML = fullName;
		container.getElementsByClassName("red")[0].innerHTML = hp + "/" + staticHp;
		var hpBar = Math.round( ( hp/staticHp ) * 100 );
		if( hpBar < 0 )
			hpBar = 0;
		container.getElementsByClassName("red")[0].style.width = hpBar + "%";
		container.getElementsByClassName("green")[0].innerHTML = sp + "/" + staticSp;
		var spBar = Math.round( ( sp/staticSp ) * 100 );
		if( spBar < 0 )
			spBar = 0;
		container.getElementsByClassName("green")[0].style.width = spBar + "%";
		container.getElementsByClassName("level")[0].innerHTML = lvl;
		container.getElementsByClassName("phisic-attack")[0].innerHTML = str;
		container.getElementsByClassName("defense")[0].innerHTML = end;
		container.getElementsByClassName("magic-attack")[0].innerHTML = int;
		container.getElementsByClassName("bounty")[0].innerHTML = bounty + " Exp";
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

	}

	public addToEnemyList( entity, id ):void{
		var race = entity.getComponent( "Type" ).race; // for image ( avatar );
		var level = entity.getComponent( "ExperienceStats" ).lvl;

		var li = document.createElement("li");
		li.id = "" + id;
		var divAvatar = document.createElement("div");
		divAvatar.className = "avatar";
		//divAvatar.style.background-image = 

		var divLevel = document.createElement("div");
		divLevel.className = "level";
		divLevel.innerHTML = level;


		li.appendChild( divAvatar );
		divAvatar.appendChild( divLevel );


		var container = document.getElementById( "enemy-list" );
		container.appendChild( li );

		//create tooltip;

	}

	public createToolTip( entity ){

	}

	public updateTollTip( entity ){

	}

}

		