class Game {

	public fps;
	public commonTick:any;
	public entityRoot:any;
	public battleRoot:any;

	constructor( fps ){
		this.fps = fps;
	}

	public init(){
		this.commonTick = new CommonTick( this, this.fps );
		this.entityRoot = new EntityRoot( this );
		this.battleRoot = new BattleRoot( this );
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
		this.battleRoot.update( delta );
	}
}