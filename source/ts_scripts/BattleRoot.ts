class BattleRoot {

	public teamOne;
	public teamTwo;

	public isFighting:boolean;
	private isFightEnd:boolean;

	private parent:any;

	constructor( parent ){
		this.parent = parent;
		this.isFighting = false;
		this.isFightEnd = true;
	}

	public addPlayersToFight( team1, team2 ){
		this.teamOne = team1;
		this.teamTwo = team2;
	}


	public beginFight(){
		this.isFighting = true;
		this.isFightEnd = false;
	}

	public stopFight(){
		this.isFighting = false;
	}

	private fight( delta ){
		var p1Attack = this.teamOne.getComponent( "FightingStats" );
		var p2Attack = this.teamTwo.getComponent( "FightingStats" );
		if( p1Attack.checkAttack( delta ))
			this.attack( this.teamOne, this.teamTwo );

		if( p2Attack.checkAttack( delta ) )
			this.attack( this.teamTwo, this.teamOne );

		if( this.isFightEnd )
			this.isFighting= false;
	}

	private attack( player, target ){
		var targetFightStats = target.getComponent( "FightingStats" );
		var targetDefense = targetFightStats.getCurrentStat( "END" );
		var targetChanceToEvade = targetFightStats.getCurrentStat( "AGI" ) / 100;
		var randomNum = Math.random();
		if( targetChanceToEvade >= randomNum ){
			console.log( target.getComponent("Name").getFullName() + " dodge the attack!" );
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
			console.log( player.getComponent( "Name" ).getFullName() + " attacking " + target.getComponent( "Name" ).getFullName() + " on " + damage + "; Attack: " + playerDamage + "; TargetDefense: " + targetDefense );
		}
		else{
			console.log( player.getComponent( "Name" ).getFullName() + " attacking " + target.getComponent( "Name" ).getFullName() + ", but can't avoid the defense" );
		}

		if( hp <= 0 ){
			console.log( target.getComponent( "Name" ).getFullName() + " - Dead!" );
			this.isFightEnd = true;;
			return;
		}

		console.log( target.getComponent( "Name" ).getFullName() + " now have " + hp + " HP" );

	}

	public update(delta){
		if( this.isFighting ){
			this.fight( delta );
		}
	}
}