class Game {

	public fps;
	public commonTick:any;
	public entityRoot:any;
	public battle:any;
	public userInterface:any;

	constructor( fps ){
		this.fps = fps;
	}

	public init( creaturesData, humanoidsData, leftBlock, rightBlock, journal ){
		this.commonTick = new CommonTick( this, this.fps );
		this.entityRoot = new EntityRoot( this );
		this.entityRoot.init( creaturesData, humanoidsData );
		this.battle = new Battle( this );
		this.userInterface = new UserInterface( this );
		this.userInterface.init( leftBlock, rightBlock, journal );
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
}