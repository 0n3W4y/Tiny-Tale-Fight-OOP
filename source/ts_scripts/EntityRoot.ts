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

	public generateEntity( entityType, type ):any{

		var entity = this.createEntity( entityType );
		var params = this.entityParametersGenerator.generate( type );
		entity.createComponentsWithParams( params );
		return entity;
	}

	public createEntity( type ):any{
		if( type != "Player" && type != "Mob" )
			console.log( "Error, no type with name: " + type + ". Error in EntityRoot/createEntity" );

		var id = this.createId();

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

	public removeEntity( entity ){
		for( var i = 0; i < this.entities.length; i++ ){
			if( entity.getComponent( "Name" ).getFullName() == this.entities[i].getComponent( "Name" ).getFullName() )
				this.entities.splice(i, 1);
		}
	}
}