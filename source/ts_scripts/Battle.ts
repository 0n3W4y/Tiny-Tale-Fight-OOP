class Battle {

	public teamOne:Array<any>;
	public teamTwo:Array<any>;

	public isFighting:boolean;

	private parent:any;

	constructor( parent ){
		this.parent = parent;
		this.isFighting = false;
		this.teamOne = new Array();
		this.teamTwo = new Array();
	}

	public addPlayerToFight( team, entity ){
		if( team == 1 )
			this.teamOne.push( entity );
		else if( team == 2 ){
			var id = this.teamTwo.length;
			this.parent.userInterface.addToEnemyList( entity, id );
			this.teamTwo.push( entity );
		}
		else
			console.log( "Error in add entity in team, team = " + team + " not found. Error in Battle/addPlayerToGight" );

	}


	public beginFight(){
		this.prepareFight();
		this.isFighting = true;
	}

	public stopFight(){
		this.isFighting = false;
	}

	private fight( delta ){
		var p1 = this.teamOne[0];
		var p2 = null;
		var p1Attack = p1.getComponent( "FightingStats" );
		
		for( var i = 0; i < this.teamTwo.length; i++ ){
			p2 = this.teamTwo[i];
			if( !( p2.getComponent( "FightingStats" ).isDead ) )
				break;
		}

		if( p1Attack.isDead || p2 == null ){
			this.isFighting = false;
			this.resetStats();
			return;
		}

		var p2Attack = p2.getComponent( "FightingStats" );

		if( p1Attack.checkAttack( delta ) )
			this.attack( p1, p2 );

		if( p2Attack.checkAttack( delta ) )
			this.attack( p2, p1 );

	}

	private resetStats(){
		if( this.teamTwo.length == 0 ){
			this.teamOne[0].getComponent( "FightingStats" ).resetStats();
			this.parent.userInterface.fillBlock( this.teamOne[0] );
			this.parent.userInterface.addLineToJournal("Grats, u kill them all" );
		}
	}

	private attack( player, target ):void{
		var playerName = player.getComponent( "Name" ).getFullName();
		var targetName = target.getComponent( "Name" ).getFullName();
		var targetFightStats = target.getComponent( "FightingStats" );
		var targetDefense = targetFightStats.getCurrentStat( "END" );
		var targetChanceToEvade = targetFightStats.getCurrentStat( "AGI" ) / 100;
		var randomNum = Math.random();
		if( targetChanceToEvade >= randomNum ){
			this.parent.userInterface.addLineToJournal( playerName + " attacking " + targetName + ", but it dodge the attack!" );
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
			this.parent.userInterface.addLineToJournal( playerName + " attacking " + targetName + " on " + damage + "; Attack: " + playerDamage + "; TargetDefense: " + targetDefense );
		}
		else{
			this.parent.userInterface.addLineToJournal( playerName + " attacking " + targetName + ", but can't avoid the defense" );
		}

		if( hp <= 0 ){
			this.parent.userInterface.addLineToJournal( targetName + " - Killed by " + playerName );
			var exp = target.getComponent( "ExperienceStats" ).bounty;
			this.gainExperience( player, exp );
			target.getComponent( "FightingStats" ).isDead = true;
		}

		this.parent.userInterface.fillBlock( target );
	}

	public update(delta){
		if( this.isFighting ){
			this.fight( delta );
		}
	}

	private prepareFight(){
		var fullNamePlayer = this.teamOne[0].getComponent("Name").getFullName();
		var fullNameEnemy = this.teamTwo[0].getComponent("Name").getFullName();
		var enemyHp = this.teamTwo[0].getComponent("FightingStats").getCurrentStat("HP");
		var damage = this.teamTwo[0].getComponent("FightingStats").getCurrentStat("STR");
		var stringDamage = Math.round( damage/2 ) + " - " + Math.round( damage*2 );
		var string = fullNamePlayer + " found new troubles. " + fullNameEnemy + " on the road! It have: " + enemyHp + " Health Points, and can attack on: " + stringDamage + " phisical damage! Prepare to battle!";
		this.parent.userInterface.addLineToJournal( string );
		this.parent.userInterface.fillBlock( this.teamTwo[0] );
		this.parent.userInterface.removeFromEnemyList( this.teamTwo[0] );
	}

	private killEntity( entity ){
		var entityType = entity.type;
		var index;
		if( entityType == "Player" ){
			index = this.teamOne.indexOf( entity );
			this.teamOne.splice( index, 1 );
			// do something with mob, who killed player, clear interface, popup tooltip, start respwn function;
		}else{
			index = this.teamTwo.indexOf( entity );
			this.teamTwo.splice( index, 1 );
			this.parent.entityRoot.removeEntity( entity );
		}



	}

	private gainExperience( entity, value ){
		if( entity.type == "Player" ){
			entity.getComponent( "ExperienceStats" ).gainExperience( value );
			var entityFullname = entity.getComponent( "Name" ).getFullName();
			this.parent.userInterface.addLineToJournal( entityFullname + " gained " + value + " experience." );
			this.parent.userInterface.fillBlock( entity );
		}
		
	}

}