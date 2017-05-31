class FightingStats extends Component{
	public killedBy:any;

	public currentStats:any;

	private timeToNextAttack:number;
	private attackCoolDawn:number;

	constructor( parent ){
		super( "FightingStats", parent );
		this.timeToNextAttack = 0;
		this.killedBy = null;
		this.attackCoolDawn = 0;
		this.currentStats = {
			HP:0,
			STR:0,
			AGI:0,
			INT:0,
			ASPD:0,
			DDG:0,
			BLK:0,
			PDEF:0,
			MDEF:0
		}
	}

	public init( params ){
		for( var key in params ){
			var container = params[key];
			if( key == "stats" ){
				for( var newKey in container ){
					if ( !( this.currentStats[newKey] === undefined) )
						this.currentStats[newKey] = container[newKey];
					else
						console.log( "Error, no key with name: " + newKey + ". Error in FightingStats/init." );
				}
			}
			else
				console.log( "Error, no key with name: " + key + ". Error in FightingStats/init." );
		}

		this.updateAttackCoolDawn();
	}

	public getCurrentStat( stat ){
		return this.currentStats[stat];
	}

	public getStat( stat ):number{
		var deploy = this.parent.entityParametersGenerator;
		var result;
		var lvl;
		var type = this.parent.type;
		var entityType = this.parent.getComponent("Type").race;
		var entityClass = this.parent.getComponent("Type").class;

		if( this.parent.getComponent("ExperienceStats") != null )
			lvl = this.parent.getComponent("ExperienceStats").lvl || 0; //default;

		result = deploy.getDeployStat( type, entityType, entityClass, lvl, stat );

		return result;
		//TODO: collect data from all equip;
	}

	public setStat( stat, value ){
		if( stat == "HP" || stat == "STR" || stat == "AGI" || stat == "INT" || stat == "ASPD" || stat == "DDG" || stat == "BLK" || stat == "PDEF" || stat == "MDEF" ){
			this.currentStats[stat] = value;
		}else{
			console.log( "Error, no stat with name: " + stat + ". Error in FightingStats/setStats." );
			return;
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
		var lvl = 0; // default;

		if( value != null ){
			lvl = value.lvl;
			for( var key in this.currentStats ){
				//TODO: get stat;
			}

		}else
			console.log( "Error with Level up stats, level = " + value + ". Error in FightingStats/updateStatsWithLevelUp" );
	}

	public exportDataToObject():any{
		var result = { "currentStats": this.currentStats, "timeToNextAttack": this.timeToNextAttack, "attackCoolDawn": this.attackCoolDawn };
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