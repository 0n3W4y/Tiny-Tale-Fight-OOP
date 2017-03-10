class Game {

	public fps;
	public commonTick:any;
	public entityRoot:any;
	public battle:any;
	public userInterface:any;

	private player:any;

	constructor( fps ){
		this.fps = fps;
	}

	public init( creaturesData, humanoidsData, humanoidsClassData, leftBlock, rightBlock, journal, helperBlock, enemylist ){
		this.commonTick = new CommonTick( this, this.fps );
		this.entityRoot = new EntityRoot( this );
		this.entityRoot.init( creaturesData, humanoidsData, humanoidsClassData );
		this.battle = new Battle( this );
		this.userInterface = new UserInterface( this );
		this.userInterface.init( leftBlock, rightBlock, journal, helperBlock, enemylist );
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
	}

	public generatePlayer(){
		var player = this.entityRoot.generatePlayer( null );
		this.battle.addPlayerToFight( 1,  player );
		var fullName = player.getComponent( "Name" ).getFullName();
		var string = fullName + " created and added to fight!";
		this.userInterface.journal.addLineToJournal( string );
		this.player = player;
	}

	public generateMob(){
		var entityList = this.entityRoot.getListOfEntities();
		var lvl = 1;
		for( var i = 0; i < entityList.length; i++ ){
			if( entityList[i].type == "Player" ){
				lvl =  entityList[i].getComponent( "ExperienceStats" ).lvl;
				break;
			}
			
		}

		var min = lvl - 2;
		var max = lvl + 2;

		if( min < 1 )
			min = 1;

		if( max > 100 )
			max = 100;

		var mobLevel = Math.floor( Math.random()*(max - min + 1) + min );
		var mob = this.entityRoot.generateMob( "Mob", "Creature" );
		mob.getComponent( "ExperienceStats" ).lvl = mobLevel;
		mob.getComponent( "ExperienceStats" ).updateComponent();
		this.battle.addPlayerToFight( 2, mob );
	}


	//must be deleted!!!
	private loop( delta ){
		var currentHp = this.player.getComponent( "FightingStats" ).getCurrentStat( "HP" );
	}

	public preStart(){
		//TODO: create player - > generate Mobs -> start fight;
	}

	public reset(){
		location.reload(true);
	}
}