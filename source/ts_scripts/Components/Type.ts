class Type extends Component {

	public sex:string;
	public race:string;

	constructor( paprent ){
		super( "Type", parent );
	}

	public init( params ){
		for( var key in params ){
			if( key == "sex" || key == "race" )
				this[key] = params[key];
		}
	}

	
}
