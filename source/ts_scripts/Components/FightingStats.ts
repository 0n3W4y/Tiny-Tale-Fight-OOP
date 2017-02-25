class FightingStats extends Component{
	public currentStats:any; 
	public staticStats:any;

	public timeToNextAttack:number;

	constructor( parent ){
		super( "FightingStats", parent );
		this.timeToNextAttack = 0;
		this.currentStats = {
			HP:0,
			SP:0,
			STR:0,
			AGI:0,
			END:0,
			INT:0,
			ASPD:0
		}

		this.staticStats = {
			HP:0,
			SP:0,
			STR:0,
			AGI:0,
			END:0,
			INT:0,
			ASPD:0
		}

	}

	public init( params ){
		for( var key in params ){
			if ( !( this.currentStats[key] === undefined) ){
				this.currentStats[key] = params[key];
				this.staticStats[key] = params[key];
			}
		}
	}

	public getCurrentStat( stat ){
		return this.currentStats[stat];
	}

	public getStaticStat( stat ){
		return this.staticStats[stat];
	}

	public setStats( to, stat ){
		var container = this.staticStats;
		if( to == "current" )
			container = this.currentStats;

		for( var key in stat ){
			if( !( container[key] === undefined ) )
				container[key] = stat[key];
		}
	}

	public checkAttack( time ):boolean{
		this.timeToNextAttack += time;
		var timeToNextAttack = this.getCurrentStat( "ASPD" );
		timeToNextAttack = 1000/timeToNextAttack;
		if ( this.timeToNextAttack >= timeToNextAttack ){
			this.timeToNextAttack = 0;
			return true;
		}
		else
			return false;
	}


}