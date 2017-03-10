class FightingStats extends Component{
	public killedBy:any; // заменить на killedBy, поставиить в занчение ссылку на entity, по ней ориентироватся - умерла ли entity или нет.

	public currentStats:any;
	public staticStats:any;
	public levelUpStats:any;
	public levelUpClassStats:any;

	private timeToNextAttack:number;
	private attackCoolDawn:number;

	constructor( parent ){
		super( "FightingStats", parent );
		this.timeToNextAttack = 0;
		this.killedBy = null;
		this.currentStats = {
			HP:0,
			SP:0,
			STR:0,
			AGI:0,
			INT:0,
			ASPD:0,
			DDG:0,
			BLK:0,
			PDEF:0,
			MDEF:0
		}

		this.staticStats = {
			HP:0,
			SP:0,
			STR:0,
			AGI:0,
			INT:0,
			ASPD:0,
			DDG:0,
			BLK:0,
			PDEF:0,
			MDEF:0
		}

		this.levelUpStats = {
			HP:0,
			SP:0,
			STR:0,
			AGI:0,
			INT:0,
			ASPD:0,
			DDG:0,
			BLK:0,
			PDEF:0,
			MDEF:0
		}

		this.levelUpClassStats = {
			STR:0,
			AGI:0,
			INT:0
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
			else if( key == "staticStats" ){
				for( var newKey in container ){
					if ( !( this.staticStats[newKey] === undefined) ){
						this.staticStats[newKey] = container[newKey];
					}else
						console.log( "Error, no key with name: " + newKey + ". Error in FightingStats/init." );
				}
			}
			else if( key == "lvlUpStats" ){
				for( var newKey in container ){
					if ( !( this.levelUpStats[newKey] === undefined) ){
						this.levelUpStats[newKey] = container[newKey];
					}else
						console.log( "Error, no key with name: " + newKey + ". Error in FightingStats/init." );
				}
			}
			else if( key == "levelUpClassStats" ){
				for( var elseKey in container ){
					if ( !( this.levelUpClassStats[elseKey] === undefined) ){
						this.levelUpClassStats[elseKey] = container[elseKey];
					}else
						console.log( "Error, no key with name: " + elseKey + ". Error in FightingStats/init." );
				}
			}
		}

		this.updateAttackCoolDawn();
	}

	public getCurrentStat( stat ){
		return this.currentStats[stat];
	}

	public getStaticStat( stat ){
		return this.staticStats[stat];
	}

	public getLevelUpStat( stat ){
		return this.levelUpStats[stat];
	}

	public getLevelUpClassStats( stat ){
		return this.levelUpClassStats[stat];
	}

	public setStats( to, stat ){
		var container = this.staticStats;
		if( to == "current" )
			container = this.currentStats;
		else if( to == "lvlUpStats" )
			container = this.levelUpStats;
		else if( to == "levelUpClassStats" )
			container = this.levelUpClassStats;
		else{
			console.log( "Error, no container with name: " + to + ". Error in FightingStats/setStats.");
			return;
		}

		for( var key in stat ){
			if( !( container[key] === undefined ) )
				container[key] = stat[key];
		}
	}

	public checkAttack( time ):boolean{
		var result = this.checkTimeToAttack( time );
		return result;		
	}

	private checkTimeToAttack( time ):boolean{
		this.timeToNextAttack += time;
		if ( this.timeToNextAttack >= this.attackCoolDawn ){
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
				var lvlupClassStat = 0;
				if( !( this.levelUpClassStats[key] === undefined ) )
					lvlupClassStat = this.levelUpClassStats[key];

				var stat = this.levelUpStats[key] * value.lvl + this.staticStats[key] + lvlupClassStat * value.lvl;
				this.currentStats[key] = stat;
			}
		}else
			console.log( "Error with Level up stats, level = " + value + ". Error in FightingStats/updateStatsWithLevelUp" );
	}

	public exportDataToObject():any{
		var result = { "currentStats": this.currentStats, "staticStats": this.staticStats, "levelUpStats": this.levelUpStats, "levelUpClassStats": this.levelUpClassStats };
		return result;
	}

	public resetStats(){
		this.timeToNextAttack = 0;
		this.updateStatsWithLevelUp();
		this.updateAttackCoolDawn();
	}

	private updateAttackCoolDawn(){
		var aspd = this.getCurrentStat( "ASPD" );
		var agi = this.getCurrentStat( "AGI" );
		var timeToNextAttack = aspd + aspd/100 * ( agi/100 );
		this.attackCoolDawn = Math.round(2000/timeToNextAttack)*1000;
	}

}