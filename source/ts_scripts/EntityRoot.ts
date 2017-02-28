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
		var entityType = null;
		if( type == "Humanoid" || "Creature" )
			entityType = "Character";

		var entity = this.createEntity( entityType );
		var params = this.entityParametersGenerator.generate( type );
		entity.createComponentsWithParams( params );
		return entity;
	}

	public createEntity( newType ):any{
		var id = this.createId();
		var type = newType;

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