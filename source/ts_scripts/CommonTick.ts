class CommonTick {

	public fps:number;
	public loopId:any;
	public loopStarted:number;
	public paused:boolean;
	public lastTick:number;
	public timeRatio:number;
	public tickFps:number;

	private parent:any;

	constructor( parent, fps ){
		this.fps = fps;
		this.paused = false;
		this.lastTick = 0;
		this.timeRatio = 1;
		this.tickFps = 1000/fps;
		this.parent = parent;

	}

	public startLoop() {
		if (this.loopId) {
			clearInterval(this.loopId);
		}
		this.loopId = window.setInterval( this.tick.bind(this), this.tickFps );
		this.loopStarted = Date.now();	
		return this;
	}

	public stopLoop() {
		if (this.loopId) {
			clearInterval(this.loopId);
			this.loopId = null;
			console.log( "Game stopped" );
		}
	}

	public togglePause() {
		this.paused = !this.paused;
	}

	public tick() {
		if (this.paused){
			return;
		}
		var time = Date.now();
		var delta = time - this.lastTick;
		// protection for jumping in time;
		if ( delta > this.tickFps*2 || delta <= 0 )
		{
			delta = this.tickFps;
		}


		if (delta >= this.tickFps)
		{
			delta *= this.timeRatio;
			this.parent.update( delta );

			this.lastTick = time;
			
		}
	}
}