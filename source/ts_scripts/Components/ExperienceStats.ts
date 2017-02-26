class ExperienceStats extends Component {

	public exp:number;
	public lvl:number;
	public expToNextLvl:number;

	public isLevelUpped:boolean;

	constructor( parent ){
		super( "ExperienceStats", parent );
		this.exp = 0;
		this.lvl = 1;
		this.updateExpToNextLvl();
		this.isLevelUpped = false;
	}

	public init( params ){
		for( var key in params ){
			if( key == "exp" )
				this.exp = params[key];
			else if( key == "lvl" )
				this.lvl = params[key];

		}
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
			this.isLevelUpped = true;
		}
	}
}