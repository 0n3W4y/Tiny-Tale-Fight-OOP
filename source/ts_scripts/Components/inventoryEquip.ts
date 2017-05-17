class InventoryEquip extends Component{

	private equipItems:any;

	constructor( parent ){
	 	super( "InventoryEquip", parent );
	 	this.equipItems = {
	 		"slotHead": null,
	 		"slotTorso": null,
	 		"slotGloves": null,
	 		"slotShoulders": null,
	 		"slotBracers": null,
	 		"slotPants": null,
	 		"slotBelt": null,
	 		"slotBoots": null,
	 		"slotAmulet": null,
	 		"slotLeftRing": null,
	 		"slotRightRing": null,
	 		"slotLeftHand": null,
	 		"slotRightHand": null
	 	}
	}

	public init( params ){
		for( var key in params ){
			if( this.equipItems[key] !== undefined )
				this.equipItems[key] = params[key];
			else
				console.log( "Error, no name with key: " + key + " in equip inventory. Error in inventoryEquip/init.");
		}
	}

	public equipItem( item ){
		var itemSlot = item.getComponent( "" ).equipPlace;
		if( itemSlot == null )
			return false;

		var oldItem = this.getItemInSlot( itemSlot );
		this.equipItems[itemSlot] = item;
		return oldItem;
	}

	private getItemInSlot( slot ){
		return this.equipItems[slot];
	}

	public exportDataToObject(){
		return { "equipItems": this.equipItems };
	}

}