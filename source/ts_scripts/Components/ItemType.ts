class ItemType extends Component{

	public type:string;
	public subType:string;
	private rarity:number; // 0 - common;
	private equipSlot:string; // equip, belt. // equip & inventory, belt & inventory, all others only inventory;

	constructor( parent ){
		super( "ItemType", parent );
	}

	public init( params ){
		for( var key in params ){
			if( key == "type" || key == "subType" || key == "rarity" || key == "equipSlot" )
				this[key] = params[key];
			else
				console.log( "Error, no key with name: " + key + ". Error in TypeName/init." );
		}	}

	public getRarity(){
		return this.rarity;
	}

	public getEquipdSlot(){
		return this.equipSlot;
	}
}