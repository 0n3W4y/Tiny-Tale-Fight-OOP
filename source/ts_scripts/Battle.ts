class Battle {

	public teamOne:Array<any>;
	public teamTwo:Array<any>;

	public isFighting:boolean;

	private isFightPrepare:boolean;
	private isBattleEnd:boolean;

	private teamOneAlive:Array<any>;
	private teamTwoAlive:Array<any>;
	private teamOneReady:Array<any>;
	private teamTwoReady:Array<any>;

	private whoWin:any;

	private entitiesToUpdateInterface:Array<any>;

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
		this.entitiesToUpdateInterface = new Array();
		this.whoWin = null;
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

		var p2 = this.teamTwo[0]; // always select first mob in array;
		var fullNameEnemy = p2.getComponent( "Name" ).getFullName();
		var enemyHp = p2.getComponent( "FightingStats" ).getCurrentStat( "HP" );
		var pdamage = p2.getComponent( "FightingStats" ).getCurrentStat( "STR" );
		var mdamage = p2.getComponent( "FightingStats" ).getCurrentStat( "INT" );
		var stringDamage = Math.round( pdamage/2 ) + " - " + Math.round( pdamage*2 );
		var stringMDamage = Math.round( mdamage/2 ) + " - " + Math.round( mdamage*2 );
		this.parent.userInterface.removeFromEnemyList( 0 );
		this.parent.userInterface.fillBlock( p2 );

		this.parent.userInterface.journal.newContact( fullNameEnemy );

		if( this.teamTwo.length > 1 ){
			this.parent.userInterface.journal.newContactManyTargets( this.teamTwo.length );
			// TODO: сделать полнцю картину всех мобов, с которомы столкнулся игрок.
		}else
			this.parent.userInterface.journal.newContactSingleTarget( fullNameEnemy, enemyHp, stringDamage, stringMDamage );

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
		this.entitiesToUpdateInterface.length = 0;

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
		var phsysicalPlayerDamage = playerFightStats.getCurrentStat( "STR" );
		var playerMaxDamage = phsysicalPlayerDamage*2;
		var playerMinDamage = phsysicalPlayerDamage/2;
		var magicalPlayerDamage = playerFightStats.getCurrentStat( "INT" );
		var playerMaxDamageM = magicalPlayerDamage*2;
		var playerMinDamageM = magicalPlayerDamage/2;

		phsysicalPlayerDamage = Math.round( playerMinDamage + Math.random()*( playerMaxDamage - playerMinDamage ) );
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
			var targetChansePercent = targetDodgeChanse/100;
			this.parent.userInterface.journal.attack( playerName, targetName );

			var randomNum = Math.floor((Math.random()*101)*100); // 0 - 10000;
			if( targetDodgeChanse >= randomNum ){
				this.parent.userInterface.evade( targetName, targetChansePercent );
				return;
			}
			
			phsysicalPlayerDamage -= phsysicalPlayerDamage * ( targetPhysicsDefense / 100 ) / 100;
			magicalPlayerDamage -= magicalPlayerDamage * ( targetMagicalDefense / 100 ) / 100;
			var totalDamage = phsysicalPlayerDamage + magicalPlayerDamage;

			// вычислить, получилось ли заблокировать атаку
			// и отнять % от блокированного урона из общего урона.

			targetHP -= totalDamage;
			targetFightStats.setStats( "current", { "HP": targetHP } );
			this.parent.userInterface.journal.hit( targetName, totalDamage, phsysicalPlayerDamage, magicalPlayerDamage );


			if( targetHP <= 0 )
				targetFightStats.killedBy = player;

			this.entitiesToUpdateInterface.push( singleTarget );

		}else{
			//TODO: AOE attack to all entities in alive array;
		}
		
	}

	private endRound( time ){

		//обновляем UI для каждого актера, котоырй был под атакой.
		for( var k = 0; k < this.entitiesToUpdateInterface.length; k++ ){
			var entity = this.entitiesToUpdateInterface[k];
			var index = 0
			if( entity.type == "Mob" )
				index = this.teamTwo.indexOf( entity );

			this.parent.userInterface.updateUIForEntity( entity, index );
		}


		for( var i = 0; i < this.teamOneAlive.length; i++ ){
			var p1 = this.teamOneAlive[i];
			if( p1.getComponent( "FightingStats" ).killedBy != null ){ // is dead;
				if( p1.type == "Player" ){
					this.killPlayer( p1 );
					this.isBattleEnd = true;
					return; // only 1 player available, so if he dead - fighting is over;
				}else{
					this.killHelper( p1 );
					// player's mob is dead;
				}
			}
		}

		for( var j = 0; j < this.teamTwoAlive.length; j++ ){
			var p2 = this.teamTwoAlive[j];
			var p2FightingComponent = p2.getComponent( "FightingStats" );
			if( p2FightingComponent.killedBy != null ) // is dead;
				this.killMob( p2 );
		}

		//update interface or update it in battle.		

		if( this.teamOneAlive.length == 0 || this.teamTwoAlive.length == 0)
			this.isBattleEnd = true;

	}

	private battleEnd(){
		
		if( this.whoWin == "Player" )
			this.playerWin();
		else
			this.playerLose();

		//обнуляем массивы с мобами начисто, удаляя их насовсем и навсегда безвозвратно!!!!!!!!!!!;
		for( var i = 0; i < this.teamTwo.length; i++ ){
			var entity = this.teamTwo[i];
			this.killEntity( entity );
		}
		this.teamTwo.length = 0;

		//обнуляем массив с игроком, только если он умер, либо убираем только хелпера;
		for( var j = 0; j < this.teamOne.length; j++ ){
			var entity = this.teamOne[j];
			if( entity.type == "Helper" && entity.getComponent( "FightingStats" ).killedBy != null )
				this.teamOne.splice( j, 1 );

			if( entity.type == "Player" && entity.getComponent( "FightingStats" ).killedBy != null )
				this.teamOne.splice( j, 1 );
		}

		this.isFighting = false;
		this.isFightPrepare = false;
		this.parent.userInterface.journal.addLineToJournal( "Battle is end!" );


		//обнуляем массивы с живыми.
		this.teamOneAlive.length = 0;
		this.teamTwoAlive.length = 0;
	}	

	private gainExperience( entity, value ){
		if( entity.type == "Player" ){
			entity.getComponent( "ExperienceStats" ).gainExperience( value );
			var entityFullname = entity.getComponent( "Name" ).getFullName();
			this.parent.userInterface.journal.gainExp( entityFullname, value );
		}
		
	}

	public stopFight(){
		this.isFighting = false;
	}

	public startFight(){
		this.isFighting = true;
	}

	private checkAliveMobs():any{
		if( this.teamTwoAlive.length > 0 )
			return this.teamTwoAlive[0];
		else
			return null;
	}

	private playerWin(){
		var player = this.teamOne[0];
		player.getComponent( "FightingStats" ).resetStats();
		var playerName = player.getComponent( "Name" ).getFullName();
		this.parent.userInterface.journal.win( playerName );
	}

	private playerLose(){
		var player = this.teamOne[0];
		player.getComponent( "FightingStats" ).resetStats();
		var playerName = player.getComponent( "Name" ).getFullName();
		this.parent.userInterface.journal.win( playerName );
	}

	private killEntity( entity ){
		this.parent.entityRoot.removeEntity( entity );
	}

	private killMob( mob ){

		var player = mob.getComponent( "FightingStats" ).killedBy;
		var playerName = player.getComponent( "Name" ).getFullName();
		var bounty = mob.getComponent( "ExperienceStats" ).bounty;
		var mobName = mob.getComponent( "Name" ).getFullName();
		this.parent.userInterface.journal.kill( playerName, mobName );

		var index = this.teamTwoAlive.indexOf( mob );
		var mainIndex = this.teamTwo.indexOf( mob );
		this.teamTwoAlive.splice( index, 1 );
		if ( index == 0 ){ // если индекс 0 - значит мы убили моба, который находился в главном блоке - задача заменить на другого. Если нет мобов - конец игры.
			this.parent.userInterface.addMobFromMainBlockToEnemyList( mob, mainIndex );
			var newMob = this.checkAliveMobs();
			if( newMob == null ){
				this.isBattleEnd = true;
				this.whoWin = "Player";
			}else{
				var newMobIndex = this.teamTwo.indexOf( newMob );
				this.parent.userInterface.addMobFromEnemyListToMainBlock( newMob, newMobIndex );
			}
		}

		this.gainExperience( player, bounty );
	}

	private killHelper( helper ){
		var index = this.teamOneAlive.indexOf( helper )
		this.teamOneAlive.splice( index, 1 );
		var helperName = helper.getComponent( "Name" ).getFullName();
		var killerName = helper.getComponent( "FightingStats" ).killedBy.getComponent( "Name" ).getFullName();
		this.parent.userInterface.journal.kill( killerName, helperName );
	}

	private killPlayer( player ){
		this.whoWin = "Mob";
		var index = this.teamOneAlive.indexOf( player );
		this.teamOneAlive.splice( index, 1 );
		var playerName = player.getComponent( "Name" ).getFullName();
		var killerName = player.getComponent( "FightingStats" ).killedBy.getComponent( "Name" ).getFullName();
		this.parent.userInterface.journal.kill( killerName, playerName );
	}

}