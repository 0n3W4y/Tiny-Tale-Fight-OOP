class UserInterface {

	public leftCharacterBlock:any;
	public rightCharacterBlock:any;
	public journal:any;

	private parent:any;

	constructor( parent ){
		this.parent = parent;
	}

	public init( leftBlock, rightBlock, journal){
		this.leftCharacterBlock = leftBlock;
		this.rightCharacterBlock = rightBlock;
		this.journal = journal;
	}

	private fillCharacterBlock( blockName, entity ){
		//params { name:"full name", hp:100, sp:100, exp:[0,100], lvl: str:1, end:1, int:1 };
		var params = this.collectDataFromEntity( entity );
		var nameContainer = params["Name"];
		var name = nameContainer["fullname"];
		var fightingStatsContainer = params["FightingStats"];
		var currentStatsContainer = fightingStatsContainer["currentStats"];
		var hp = currentStatsContainer["HP"];
		var sp = currentStatsContainer["SP"];
		var str = currentStatsContainer["STR"];
		var end = currentStatsContainer["END"];
		var int = currentStatsContainer["INT"];
		var experienceStats = params["ExperienceStats"];
		var exp = experienceStats["exp"];
		var expToNextLvl = experienceStats["expToNextLvl"];
		var lvl = experienceStats["lvl"];


		var container = this.getContainer( blockName );
		container.getElementsByClassName("name")[0].innerHTML = name;
		container.getElementsByClassName("red")[0].innerHTML = hp + "/" + hp;
		container.getElementsByClassName("green")[0].innerHTML = sp + "/" + sp;
		container.getElementsByClassName("violet")[0].innerHTML = exp + "/" + expToNextLvl;
		var percent = Math.floor( (exp/expToNextLvl) *100 );
		var stringPercent = percent+ "%";
		container.getElementsByClassName("violet")[0].style.width = stringPercent;
		container.getElementsByClassName("level")[0].innerHTML = lvl;
		container.getElementsByClassName("phisic-attack")[0].innerHTML = str;
		container.getElementsByClassName("defense")[0].innerHTML = end;
		container.getElementsByClassName("magic-attack")[0].innerHTML = int;

	}

	private addLineToJournal( string ){
		var container = document.getElementById( this.journal );
		var li = document.createElement( "li" );
		li.innerHTML = string;
		container.insertBefore(li, container.firstChild);
	}

	private getContainer( blockName ):any{
		if( blockName == "Left" )
		return document.getElementById( this.leftCharacterBlock );
		else if( blockName == "Right" )
			return document.getElementById( this.rightCharacterBlock );
		else
			return document.getElementById( this.journal );
	}

	public fillBlock( blockName, entity ){
		if( blockName == "Left" )
			this.fillCharacterBlock( blockName, entity );
		else if( blockName == "Right" )
			this.fillCharacterBlock( blockName, entity );
		else
			console.log("Error no key with name: " + blockName + ". Error in UserInterface/fillBlock" );
	}

	public drawAvatar( blockName, params ){
		var container = this.rightCharacterBlock;
		if( blockName == "Left" )
			container = this.leftCharacterBlock;

		var avatar = container.getElementsByClassName("avatar");
		//img.src= params;
	}

	public collectDataFromEntity( entity ):any{
		var name = entity.getComponent( "Name" ).exportDataToObject();
		var type = entity.getComponent( "Type" ).exportDataToObject();
		var fightingStats = entity.getComponent( "FightingStats" ).exportDataToObject();
		var experienceStats = entity.getComponent( "ExperienceStats" ).exportDataToObject();
		var ageStats = entity.getComponent( "AgeStats" ).exportDataToObject();

		//if params == null, collect all data;
		var data = { "Name": name, "Type": type, "FightingStats": fightingStats, "ExperienceStats": experienceStats, "AgeStats": ageStats };

		return data;
	}
}