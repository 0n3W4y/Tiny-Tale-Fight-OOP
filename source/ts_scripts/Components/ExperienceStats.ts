class ExperienceStats extends Component {

	public exp:number;
	public lvl:number;
	public expToNextLvl:number;
	public bounty:number;

	public isLevelUpped:boolean;

	constructor( parent ){
		super( "ExperienceStats", parent );
		this.exp = 0;
		this.lvl = 1;
		this.bounty = 0;
		this.isLevelUpped = false;

	}

	public init( params ){
		for( var key in params ){
			if( key == "exp" )
				this.exp = params[key];
			else if( key == "lvl" )
				this.lvl = params[key];
			else if( key == "bounty" )
				this.bounty = params[key];

		}

		this.updateExpToNextLvl();
		this.updateFightingStats();
		this.updateBounty();
	}

	private updateExpToNextLvl():void{
		this.expToNextLvl = (this.lvl-1)*25 + this.lvl*25;
	}

	public gainExperiance( value ){
		this.exp += value;
		if( this.exp >= this.expToNextLvl ){
			this.lvl++;
			this.exp -= this.expToNextLvl;
			this.updateExpToNextLvl();
			this.updateFightingStats();
			this.isLevelUpped = true;
		}
	}

	public exportDataToObject():any{
		var result = { "exp": this.exp, "lvl": this.lvl, "expToNextLvl": this.expToNextLvl, "bounty": this.bounty };
		return result;
	}

	public updateBounty(){
		this.bounty *= this.lvl;
	}

	private updateFightingStats(){
		var component = this.parent.getComponent( "FightingStats" );
			if( component != null )
				component.updateStatsWithLevelUp();
	}
}