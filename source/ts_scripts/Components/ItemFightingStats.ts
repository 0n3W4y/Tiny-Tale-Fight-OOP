class ItemFightingStats extends Component{

	public damageType:string; // flat, heal, vampirizme, armor penetration, and other other otherl
	public damageTarget:string; // "single", "aoe";

	public durability:number;
	private staticDurability:number;
	private extraStats:any;
	private selfStats:any;
	private typeDamageStats:any;
	

	constructor( parent ){
		super( "ItemFightingStats", parent );
		this.extraStats = {
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

		this.selfStats = {
			PDMG:0,
			MDMG:0,
			PDEF:0,
			MDEF:0,
			BLK:0,
			DDG:0
		}

		this.typeDamageStats = {

		}

		this.durability = 0;
		this.staticDurability = 0;
		this.damageType = "m/a";
		this.damageTarget = "n/a";
	}

	public init( params ){
		for( var key in params ){
			var container = params[key];
			if( key == "extraStats" ){
				for( var newKey in container ){
					this.extraStats[newKey] = container[newKey];
				}
			}
			else if( key == "selfStats" ){
				for( var newKey in container ){
					this.selfStats[newKey] = container[newKey];
				}
			}
			else if( key == "typeDamageStats" ){
				for( var newKey in container ){
					this.typeDamageStats = container[newKey];
				}
			}
			else if( key == "damageType" ){
				this[key] = container;
			}
			else if( key == "damageTarget" ){
				this[key] = container;
			}
			else if( key == "durability" ){
				this.durability = container;
				this.staticDurability = container;
			}
			else if( key == "currentDurability" ){
				this.durability = container;
			}
			else
				console.log("Error, no key with name: " + key + ". Error in ItemFightingStats/init.");
		}
	}

	public getStaticDurability(){
		return this.staticDurability;
	}

	public getStatFrom( from, stat ){
		var container = this.selfStats;
		if( from == "extraStats" )
			container = this.extraStats;

		return container[stat];
	}

	public exportDataToObject():any{
		return { 
			"extraStats": this.extraStats, 
			"selfStats": this.selfStats, 
			"typeDamageStats": this.typeDamageStats, 
			"currentDurability": this.durability, 
			"staticDurability": this.staticDurability, 
			"damageType": this.damageType, 
			"damageTarget": this.damageTarget 
		};
	}
}