class ItemName extends Component{

	public name:string;
	public rarityName:string;

	constructor( parent ){
		super( "ItemName", parent );
	}

	public init( params ){
		for( var key in params ){
			if( this[key] !== undefined )
				this[key] = params[key];
		} 
	}

	public getFullName():string{
		return this.rarityName + " " + this.name;
	}
}