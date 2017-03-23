class Game {

	public fps;
	public commonTick:any;
	public entityRoot:any;
	public battle:any;
	public userInterface:any;

	private preStartDone:boolean;
	private player:any;
	private helper:any;

	constructor( fps ){
		this.fps = fps;
		this.preStartDone = false;
	}

	public init( creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData, leftBlock, rightBlock, journal, helperBlock, enemylist, orbsBlock ){
		this.commonTick = new CommonTick( this, this.fps );
		this.entityRoot = new EntityRoot( this );
		this.entityRoot.init( creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData );
		this.battle = new Battle( this );
		this.userInterface = new UserInterface( this );
		this.userInterface.init( leftBlock, rightBlock, journal, helperBlock, enemylist, orbsBlock );
	}

	public start(){
		this.commonTick.startLoop();
	}

	public stop(){
		this.commonTick.stopLoop();
	}

	public pause(){
		this.commonTick.togglePause();
	}

	public update( delta ){

		this.battle.update( delta );

		if( this.preStartDone ){
			if( !this.battle.isFighting ){
				this.askForNextBattle();
			}
		}
	}

	public generatePlayer(){
		var player = this.entityRoot.generateEntity( "Player", null );
		this.battle.addPlayerToFight( 1,  player );
		var fullName = player.getComponent( "Name" ).getFullName();
		var playerClass = player.getComponent( "Type" ).class;

		var string = fullName + " created! Class: " + playerClass;
		this.userInterface.journal.addLineToJournal( string );
		this.player = player;
	}

	public generateMob(){
		var entityList = this.entityRoot.getListOfEntities();
		var lvl = 1;

		lvl = this.player.getComponent( "ExperienceStats" ).lvl;

		var min = lvl - 2;
		var max = lvl + 2;

		if( min < 1 )
			min = 1;

		if( max > 100 )
			max = 100;

		var mobLevel = Math.floor( Math.random()*(max - min + 1) + min );
		var mob = this.entityRoot.generateEntity( "Mob", "Creature" );
		mob.getComponent( "ExperienceStats" ).lvl = mobLevel;
		mob.getComponent( "ExperienceStats" ).updateComponent();
		this.battle.addPlayerToFight( 2, mob );
	}

	private generateHelper(){
		var helper = this.entityRoot.generateEntity( "Helper", null );
		this.battle.addPlayerToFight( 1,  helper );
		var fullName = helper.getComponent( "Name" ).getFullName();
		var playerClass = helper.getComponent( "Type" ).class;

		var string = fullName + " created! Class: " + playerClass;
		this.userInterface.journal.addLineToJournal( string );
		this.helper = helper;
	}








	//must be deleted!!!

	public preStart(){
		//TODO: create player - > generate Mobs -> start fight;
		this.generatePlayer();
		this.generateHelper();
		var playerLvl = this.player.getComponent( "ExperienceStats" ).lvl;
		var max = Math.round( 4 + playerLvl/5 );
		var min = Math.round( 1 + playerLvl/5 );
		this.generateSomeMobs( min, max );
		this.preStartDone = true;
		this.battle.startFight();
	}

	public reset(){
		location.reload(true);
	}

	private askForNextBattle(){
		if( this.player.getComponent( "FightingStats" ).killedBy != null )
			this.generatePlayer();

		this.battle.addPlayerToFight( 1,  this.player );

		if( this.helper.getComponent( "FightingStats" ).killedBy != null )
			this.generateHelper();

		this.battle.addPlayerToFight( 1,  this.helper );

		var playerLvl = this.player.getComponent( "ExperienceStats" ).lvl;
		var max = Math.round( 4 + playerLvl/5 );
		var min = Math.round( 1 + playerLvl/5 );
		this.generateSomeMobs( min, max );
		this.preStartDone = true;
		this.battle.startFight();

	}

	private generateSomeMobs( min, max ){
		var randomNum = Math.floor( min + Math.random() * ( max - min + 1 ) );
		for( var i = 0; i < randomNum; i++ ){
			this.generateMob();
		}
	}


}