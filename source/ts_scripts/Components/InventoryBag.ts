class InventoryBag extends Component {

	private bagItems;
	private bagSlots;
	private freeBagSlots;

	constructor( parent ){
		super( "InventoryBag", parent );
		this.bagItems = {
			"slot1": null,
			"slot2": null,
			"slot3": null,
			"slot4": null,
			"slot5": null,
			"slot6": null,
			"slot7": null,
			"slot8": null,
			"slot9": null,
			"slot10": null
		}

		this.bagSlots = 10;
		this.freeBagSlots = 10;
	}

	public init( params ){

	}

	public addNewBagSlot(){
		this.bagSlots++;
		this.bagItems["slot" + this.bagSlots] = null;
		this.freeBagSlots++;
	}

	public stockItemInBag( item ){
		if( this.freeBagSlots == 0 )
			return false;

		for( var key in this.bagItems ){
			if( this.bagItems[key] === null )
				this.bagItems[key] = item;
		}

		this.freeBagSlots--;

	}

	public exportDataToObject(){
		return { "bagItems": this.bagItems, "bagSlots": this.bagSlots, "freeBagSlots": this.freeBagSlots };
	}

}