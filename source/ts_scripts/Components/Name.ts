class Name extends Component{
	public name:string;
	public surname:string;

	constructor( parent ){
		super( "Name", parent );
	}

	public init( params ){
		for( var key in params ){
			if( key == "name" || key == "surname" )
				this[key] = params[key];
			else
				console.log( "Error, no key with name: " + key + ". Error in Name/init." );
		}
	}

	public getFullName():string{
		return this.name + " " + this.surname;
	}

	public exportDataToObject():any{
		var fullName = this.getFullName();
		var result = { "name": this.name, "surname": this.surname, "fullname": fullName };
		return result;
	}
}

