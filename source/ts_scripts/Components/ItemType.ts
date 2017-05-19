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
			if( this[key] !== undefined )
				this[key] = params[key];
		} 
	}

	public getRarity(){
		return this.rarity;
	}

	public getEquipdSlot(){
		return this.equipSlot;
	}
}