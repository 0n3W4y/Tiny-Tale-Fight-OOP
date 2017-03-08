class EntityRoot {
	public entities:Array<any>;

	public entityParametersGenerator:any;

	private parent;
	
	constructor( parent ){
		this.entities = new Array();
		this.parent = parent;
	}

	public init( creaturesData, humanoidsData, humanoidsClassData ){
		this.entityParametersGenerator = new EntityParametersGenerator( creaturesData, humanoidsData, humanoidsClassData );
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

	public getListOfEntities():Array<any>{
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

	public collectDataFromEntity( entity ):any{
		var name = entity.getComponent( "Name" ).exportDataToObject();
		var type = entity.getComponent( "Type" ).exportDataToObject();
		var fightingStats = entity.getComponent( "FightingStats" ).exportDataToObject();
		var experienceStats = entity.getComponent( "ExperienceStats" ).exportDataToObject();
		var ageStats = entity.getComponent( "AgeStats" ).exportDataToObject();

		//if params == null, collect all data;
		var data = { "Name": name, "Type": type, "FightingStats": fightingStats, "ExperienceStats": experienceStats, "AgeStats": ageStats };

		return data;
	}
}