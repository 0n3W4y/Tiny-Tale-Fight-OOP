class Name extends Component{
	public name:string;
	public surname:string;

	constructor( parent ){
		super( "Name", parent );
	}

	public init( params ){
		for( var key in params ){
			if( key == "name" )
				this.name = params[key];
			else if( key == "surname" )
				this.surname = params[key];
			else
				console.log( "Error, no key with name: " + key + ". Error in Name/init." );
		}
	}

	public getFullName():string{
		return this.name + " " + this.surname;
	}
}

