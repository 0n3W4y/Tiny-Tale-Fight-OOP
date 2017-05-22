class ItemName extends Component{

	public name:string;
	public rarityName:string;

	constructor( parent ){
		super( "ItemName", parent );
	}

	public init( params ){
		for( var key in params ){
			if( key == "name" || key == "rarityName" )
				this[key] = params[key];
			else
				console.log( "Error, no key with name: " + key + ". Error in ItemName/init." );
		}
	}

	public getFullName():string{
		return this.rarityName + " " + this.name;
	}
}