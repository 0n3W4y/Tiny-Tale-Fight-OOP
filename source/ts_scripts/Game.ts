class Game {
	public commonTick:any;
	public entityRoot:any;
	public battleRoot:any;

	constructor(){

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
}