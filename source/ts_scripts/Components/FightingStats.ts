class FightingStats extends Component{
	private currentStats:any;
	private staticStats:any;
	private levelUpStats:any;

	private timeToNextAttack:number;

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

		this.levelUpStats = {
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
			var container = params[key];
			if( key == "stats" ){
				for( var newKey in container ){
					if ( !( this.currentStats[newKey] === undefined) ){
						this.currentStats[newKey] = container[newKey];
						this.staticStats[newKey] = container[newKey];
					}else
						console.log( "Error, no key with name: " + newKey + ". Error in FightingStats/init." );
				}
			}
			else{
				for( var newKey in container ){
					if ( !( this.levelUpStats[newKey] === undefined) ){
						this.levelUpStats[newKey] = container[newKey];
					}else
						console.log( "Error, no key with name: " + newKey + ". Error in FightingStats/init." );
				}
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
		var result = this.checkTimeToAttack( time );
		return result;		
	}

	private checkTimeToAttack( time ){
		this.timeToNextAttack += time;
		var timeToNextAttack = this.getCurrentStat( "ASPD" );
		timeToNextAttack = (1000/timeToNextAttack)*100;
		if ( this.timeToNextAttack >= timeToNextAttack ){
			this.timeToNextAttack = 0;
			return true;
		}
		else
			return false;
	}

	public updateStatsWithLevelUp(){

		var value = this.parent.getComponent( "ExperienceStats" );

		if( value != null ){
			for( var key in this.levelUpStats ){
				var stat = this.levelUpStats[key] * value.lvl + this.staticStats[key];
				this.currentStats[key] = stat;
			}
		}else
			console.log( "Error with Level up stats, level = " + value + ". Error in FightingStats/updateStatsWithLevelUp" );	
	}

	public exportDataToObject():any{
		var result = { "currentStats": this.currentStats, "staticStats": this.staticStats, "levelUpStats": this.levelUpStats };
		return result;
	}

	public resetStats(){
		this.timeToNextAttack = 0;
		this.updateStatsWithLevelUp();
	}	

}