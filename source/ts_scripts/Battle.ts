class Battle {

	public teamOne:Array<any>;
	public teamTwo:Array<any>;

	public isFighting:boolean;
	private isFightEnd:boolean;

	private parent:any;

	constructor( parent ){
		this.parent = parent;
		this.isFighting = false;
		this.isFightEnd = true;
		this.teamOne = new Array();
		this.teamTwo = new Array();
	}

	public addPlayerToFight( team, entity ){
		if( team == 1 )
			this.teamOne.push( entity );
		else if( team == 2 )
			this.teamTwo.push( entity );
		else
			console.log( "Error in add entity in team, team = " + team + " not found. Error in Battle/addPlayerToGight" );

	}


	public beginFight(){
		this.prepareFight();
		this.isFighting = true;
		this.isFightEnd = false;
	}

	public stopFight(){
		this.isFighting = false;
	}

	private fight( delta ){
		var p1Attack = this.teamOne[0].getComponent( "FightingStats" );
		var p2Attack = this.teamTwo[0].getComponent( "FightingStats" );
		if( p1Attack.checkAttack( delta ))
			this.attack( this.teamOne[0], this.teamTwo[0] );

		if( p2Attack.checkAttack( delta ) )
			this.attack( this.teamTwo[0], this.teamOne[0] );

		if( this.isFightEnd )
			this.isFighting= false;
	}

	private attack( player, target ){
		var targetFightStats = target.getComponent( "FightingStats" );
		var targetDefense = targetFightStats.getCurrentStat( "END" );
		var targetChanceToEvade = targetFightStats.getCurrentStat( "AGI" ) / 100;
		var randomNum = Math.random();
		if( targetChanceToEvade >= randomNum ){
			this.parent.userInterface.addLineToJournal( target.getComponent("Name").getFullName() + " dodge the attack!" );
			return;
		}

		var playerFightStats = player.getComponent( "FightingStats" );
		var playerDamage = playerFightStats.getCurrentStat( "STR" );
		var playerMaxDamage = playerDamage*2;
		var playerMinDamage = playerDamage/2;
		playerDamage = Math.round( playerMinDamage + Math.random()*( playerMaxDamage - playerMinDamage ) );

		var damage = playerDamage - targetDefense;
		var hp = targetFightStats.getCurrentStat( "HP" );
		if( damage > 0 ){
			hp -= damage;
			targetFightStats.setStats( "current", { "HP":hp } );
			this.parent.userInterface.addLineToJournal( player.getComponent( "Name" ).getFullName() + " attacking " + target.getComponent( "Name" ).getFullName() + " on " + damage + "; Attack: " + playerDamage + "; TargetDefense: " + targetDefense );
		}
		else{
			this.parent.userInterface.addLineToJournal( player.getComponent( "Name" ).getFullName() + " attacking " + target.getComponent( "Name" ).getFullName() + ", but can't avoid the defense" );
		}

		if( hp <= 0 ){
			this.parent.userInterface.addLineToJournal( target.getComponent( "Name" ).getFullName() + " - Dead!" );
			this.isFightEnd = true;;
			return;
		}

		this.parent.userInterface.addLineToJournal( target.getComponent( "Name" ).getFullName() + " now have " + hp + " HP" );
		this.parent.userInterface.updateCharacterBlock( target );

	}

	public update(delta){
		if( this.isFighting ){
			this.fight( delta );
		}
	}

	private prepareFight(){
		var fullNamePlayer = this.teamOne[0].getComponent("Name").getFullname();
		var fullNameEnemy = this.teamTwo[0].getComponent("Name").getFullName();
		var enemyHp = this.teamTwo[0].getComponent("FightingStats").getCurrentStat("HP");
		var damage = this.teamTwo[0].getComponent("FightingStats").getCurrentStat("STR");
		var stringDamage = Math.round( damage/2 ) + " - " + Math.round( damage*2 );
		var string = fullNamePlayer + " found new troubles. " + fullNameEnemy + " on the road! It have: " + enemyHp + ", and can attack on: " + stringDamage + " phisical damage! Prepare to battle!";
	}
}