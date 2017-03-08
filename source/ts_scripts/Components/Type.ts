class Type extends Component {

	public sex:string;
	public race:string;
	public class:string;

	constructor( paprent ){
		super( "Type", parent );
	}

	public init( params ){
		for( var key in params ){
			if( key == "sex" || key == "race" || key == "class" )
				this[key] = params[key];
			else
				console.log( "Error, no key with name: " + key + ". Error in Type/init." );
		}
	}

	public exportDataToObject():any{
		var result = { "sex": this.sex, "race": this.race, "class": this.class };
		return result;
	}
}
