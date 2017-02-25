class Name extends Component{
	public name:string;
	public surname:string;

	constructor( parent ){
		super( "Name", parent );
	}

	public init( params ){
		this.generateName( params[0] );
		this.generateSurname( params[1] );
	}

	private generateName( namesArray ){
		this.name = namesArray;
	}

	private generateSurname( surnamesArray ){
		this.surname = surnamesArray;
	}

	public getFullName():string{
		return this.name + " " + this.surname;
	}
}

