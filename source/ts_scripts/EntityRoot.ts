class EntityRoot {
	public entities:Array<any>;

	public entityParametersGenerator:any;

	private parent;
	
	constructor( parent ){
		this.entities = new Array();
		this.parent = parent;
	}

	public init( creaturesData, humanoidsData ){
		this.entityParametersGenerator = new EntityParametersGenerator( creaturesData, humanoidsData );
	}

	public generateEntity( type ):any{
		var entity = this.createEntity( "Mob" );
		var params = this.entityParametersGenerator.generate( type );
		entity.createComponentsWithParams( params );
		return entity;
	}

	public createEntity( type ):any{
		var id = this.createId();
		var type;
		if( type == "Player" )
			type = "Player";
		else if( type == "Mob" )
			type = "Mob";

		var entity = new Entity( id, type );
		this.entities.push( entity );
		return entity;
	}

	public getListofEntites():Array<any>{
		return this.entities;
	}

	public createId():string{
		return "0";
	}
}