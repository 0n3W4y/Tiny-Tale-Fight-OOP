class Battle {

	public teamOne:Array<any>;
	public teamTwo:Array<any>;

	public isFighting:boolean;

	private isFightPrepare:boolean;
	private isBattleEnd:boolean;
	private updateInterface:boolean;

	private teamOneAlive:Array<any>;
	private teamTwoAlive:Array<any>;
	private teamOneReady:Array<any>;
	private teamTwoReady:Array<any>;

	private parent:any;

	constructor( parent ){
		this.parent = parent;
		this.isFighting = false;
		this.teamOne = new Array();
		this.teamTwo = new Array();
		this.teamOneAlive = new Array();
		this.teamTwoAlive = new Array();
		this.teamOneReady = new Array();
		this.teamTwoReady = new Array();
		this.isFightPrepare = false;
		this.isBattleEnd = false;
		this.updateInterface = false;
	}

	public update( delta ){
		if( this.isFighting ){
			this.fight( delta );
		}
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
			console.log( "Error in add entity in team, team = " + team + " not found. Error in Battle/addPlayerToFight" );

	}

	private fight( delta ){
		if( !this.isFightPrepare )
			this.prepareFight( delta );

		this.beginRound( delta );
		this.battle( delta );
		this.endRound( delta );

		if( this.isBattleEnd ){
			this.battleEnd();
		}
	}	

	private prepareFight( time ){
		var p1 = this.teamOne[0]; // 1 player right now;

		var fullNamePlayer = p1.getComponent( "Name" ).getFullName();
		this.parent.userInterface.fillBlock( p1 );

		var p2 = this.teamTwo[0];
		var fullNameEnemy = p2.getComponent( "Name" ).getFullName();
		var enemyHp = p2.getComponent( "FightingStats" ).getCurrentStat( "HP" );
		var pdamage = p2.getComponent( "FightingStats" ).getCurrentStat( "STR" );
		var mdamage = p2.getComponent( "FightingStats" ).getCurrentStat( "INT" );
		var stringDamage = Math.round( pdamage/2 ) + " - " + Math.round( pdamage*2 );
		var stringMDamage = Math.round( mdamage/2 ) + " - " + Math.round( mdamage*2 );
		this.parent.userInterface.removeFromEnemyList( 0 );
		this.parent.userInterface.fillBlock( p2 );

		var string = "<b>" + fullNamePlayer + "</b>" + " found new troubles. ";

		if( this.teamTwo.length > 1 ){
			string += "Horde of mobs... ";
		}else{
			string += "<b>" + fullNameEnemy + "</b>" + " attacking! It have: " + enemyHp + " Health Points, can attack on " + stringDamage + " phisical and " + stringMDamage + " magical damage!";
			
		}
		this.parent.userInterface.addLineToJournal( string );

		//обнуляем массивы с живыми.
		this.teamOneAlive.length = 0;
		this.teamTwoAlive.length = 0;

		//заполняем живых creature в массивы по командам.
		for( var j = 0; j < this.teamOne.length; j++ ){
			this.teamOneAlive.push( this.teamOne[j] );
		}

		for( var i = 0; i < this.teamTwo.length; i++ ){
			p2 = this.teamTwo[i];
			this.teamTwoAlive.push( p2 );
		}
		
		
		this.isFightPrepare = true;
	}

	private beginRound( time ){
		var p1 = null;
		var p2 = null;
		this.updateInterface = false;

		//обнуляем массивы, кто может атаковать.
		this.teamOneReady.length = 0;
		this.teamTwoReady.length = 0;

		// заполняем готовых атаковать.
		for( var j = 0; j < this.teamOneAlive.length; j++ ){
			p1 = this.teamOneAlive[j];
			var p1Component = p1.getComponent( "FightingStats" );
			if( p1Component.checkAttack( time ) )
				this.teamOneReady.push( p1 );
		}
		
		//  заполняем готовых атаковать.
		for( var i = 0; i < this.teamTwoAlive.length; i++ ){
			p2 = this.teamTwoAlive[i];
			var p2Component = p2.getComponent( "FightingStats" );
			if( p2Component.checkAttack( time ) )
				this.teamTwoReady.push( p2 );
		}

		/*
		получить информацию о выборе "ОРба" игроком.
		просчитать, какая будет атака, АОЕ или сингл,
		просчитать будет ли дополнительыне эффекты - лечение, замедление, ошеломление,  и прочие эффекты,
		возможно подключить ИИ, выбрать цели, либо сделать все  рандомно.
		*/

	}

	private battle( time ){
		var p1 = null;
		var p2 = null;

		/*
			пока очередность кто ходит первый будет определять Math.random();
			планирую сделать *инициативу* которая будет определять очередность хода каждого персонажа.
		*/

		var queueArray = new Array();
		for( var i = 0; i < this.teamOneReady.length; i++ ){
			queueArray.push( this.teamOneReady[i] );
		}

		for( var j = 0; j < this.teamTwoReady.length; j++ ){
			queueArray.push( this.teamTwoReady[j] );
		}

		queueArray.sort( function( a, b ){ return Math.floor( Math.random()*3 - 1) } );

		for( var k = 0; k < queueArray.length; k++ ){
			var p1 = queueArray[k];
			var p2;
			if( p1.type == "Player" ){
				p2 = this.teamTwoAlive;
			}else{
				p2 = this.teamOneAlive;
			}

			this.attack( p1, p2 );
		}
	}

	private attack( player, target ):void{ //target always Array; Player always entity
		var playerName = player.getComponent( "Name" ).getFullName();
		var playerFightStats = player.getComponent( "FightingStats" );
		var pshysicalPlayerDamage = playerFightStats.getCurrentStat( "STR" );
		var playerMaxDamage = pshysicalPlayerDamage*2;
		var playerMinDamage = pshysicalPlayerDamage/2;
		var magicalPlayerDamage = playerFightStats.getCurrentStat( "INT" );
		var playerMaxDamageM = magicalPlayerDamage*2;
		var playerMinDamageM = magicalPlayerDamage/2;

		pshysicalPlayerDamage = Math.round( playerMinDamage + Math.random()*( playerMaxDamage - playerMinDamage ) );
		magicalPlayerDamage = Math.round( playerMinDamage + Math.random()*( playerMaxDamageM - playerMinDamageM ) );

		// выберем рандомную атаку АОЕ или сингл. 
		var typeOfDamage = 0;// Math.floor( Math.random()*2 ); //0 , 1;

		if( typeOfDamage == 0 ){ //single target;
			var singleTarget = target[0]; // для игрока это будет тот, который стоит первым. Он же отображен в оснвоном интерфейсе в главном фрейме.
			if( player.type == "Mob" ){
				var rnum = Math.floor( Math.random()*target.length );
				singleTarget = target[rnum];
			}

			var targetName = singleTarget.getComponent( "Name" ).getFullName();
			var targetFightStats = singleTarget.getComponent( "FightingStats" );
			var targetPhysicsDefense = targetFightStats.getCurrentStat( "STR" ) + targetFightStats.getCurrentStat( "PDEF" );
			var targetMagicalDefense = targetFightStats.getCurrentStat( "INT" ) + targetFightStats.getCurrentStat( "MDEF" );
			var targetAgility = targetFightStats.getCurrentStat( "AGI" );
			var targetDodgeChanse = targetFightStats.getCurrentStat( "DDG" ) + targetAgility;
			var targetBlockChanse = targetFightStats.getCurrentStat( "BLK" );
			var targetHP = targetFightStats.getCurrentStat( "HP" );

			var randomNum = Math.floor((Math.random()*101)*100); // 0 - 10000;
			if( targetDodgeChanse >= randomNum ){
				this.parent.userInterface.addLineToJournal( "<b>" + playerName + "</b>" + " attacking, but " + "<b>" + targetName + "</b>" + " dodge the attack!" );
				return;
			}
			
			pshysicalPlayerDamage -= pshysicalPlayerDamage * ( targetPhysicsDefense / 100 ) / 100;
			magicalPlayerDamage -= magicalPlayerDamage * ( targetMagicalDefense / 100 ) / 100;
			var totalDamage = pshysicalPlayerDamage + magicalPlayerDamage;

			// вычислить, получилось ли заблокировать атаку
			// и отнять % от блокированного урона из общего урона.

			targetHP -= totalDamage;
			targetFightStats.setStats( "current", { "HP": targetHP } );
			this.parent.userInterface.addLineToJournal( "<b>" + playerName + "</b>" +" attacking " + "<b>" + targetName + "</b>" + " on " + '<font color="purple">' + totalDamage + "</font>" + ". Physics: " + '<font color="red">' + pshysicalPlayerDamage + "</font>" + ". Magical: " + '<font color="blue">' + magicalPlayerDamage + "</font>" + ". TargetResists: physics: " + targetPhysicsDefense + ", magical: " + targetMagicalDefense + "." );

			if( targetHP <= 0 )
				targetFightStats.killedBy = player;


		}else{
			//TODO: AOE attack to all entities in alive array;
		}

		this.updateInterface = true;	

		
	}

	private endRound( time ){
		var updateRightBlock = false;

		for( var i = 0; i < this.teamOneAlive.length; i++ ){
			var p1 = this.teamOneAlive[i];
			if( p1.getComponent( "FightingStats" ).killedBy != null ){ // is dead;
				if( p1.type == "Player" ){
					this.parent.userInterface.addLineToJournal( "You are dead!" );
					this.isBattleEnd = true;
					return;
				}else{
					// player's mob is dead;
					//remove player's mob from interface, remove from alive list, and remove entity if need;
				}
			}else{
				// player and player's mob survived in this round;
			}
		}

		for( var j = 0; j < this.teamTwoAlive.length; j++ ){
			var p2 = this.teamTwoAlive[j];
			var p2FightingComponent = p2.getComponent( "FightingStats" );
			if( p2FightingComponent.killedBy != null ){ // is dead;
				if( p2FightingComponent.killedBy.type == "Player" ){
					var player = p2FightingComponent.killedBy;
					var playerName = player.getComponent( "Name" ).getFullName();
					var bounty = p2.getComponent( "ExperienceStats" ).bounty;
					this.gainExperience( player, bounty );
					this.parent.userInterface.addLineToJournal( p2.getComponent( "Name" ).getFullName() + " - Killed by " + playerName );
					var index = this.teamTwoAlive.indexOf( p2 );
					if( index == 0 )
						updateRightBlock = true; // need to update main right block;
					else{
						//this.parent.userInterface.killMob( p2 );
						this.teamTwoAlive.splice( index, 1 );
					}
				}else{
					// player's mob add exp to Player;
				}
			}else{
				
			}
		}

		if( this.updateInterface )
			this.parent.userInterface.updateInterface();

		if( updateRightBlock ){
			var p2 = this.teamTwoAlive[0];
			//this.parent.userInterface.removeFromMainBlock( p2 );
			//this.parent.userInterface.killMob( p2 );
			//var index = this.teamTwo.indexOf( p2 );
			//this.parent.userInterface.addToEnemyList( p2, index );
			this.teamTwoAlive.splice( 0, 1 );

			if( this.teamTwoAlive.length == 0 ){ //all dead;
				this.parent.userInterface.addLineToJournal( "No one mob survived!" );
				this.isBattleEnd = true;
				return;
			}

			var newP2 = this.teamTwoAlive[0];
			//this.parent.userInterface.removeFromEnemyList( newP2 );
			//this.parent.userInterface.fillBlock( newP2 );			
		}		

		if( this.teamOneAlive.length == 0 || this.teamTwoAlive.length == 0)
			this.battleEnd();

	}

	private battleEnd(){
		this.isFighting = false;
		this.isFightPrepare = false;
	}

	private resetStats(){
		if( this.teamTwo.length == 0 ){
			this.teamOne[0].getComponent( "FightingStats" ).resetStats();
			this.parent.userInterface.fillBlock( this.teamOne[0] );
			this.parent.userInterface.addLineToJournal("Grats, u kill them all" );
		}
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

	public stopFight(){
		this.isFighting = false;
	}

	public startFight(){
		this.isFighting = true;
	}

}