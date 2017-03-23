class EntityRoot {
	public entities:Array<any>;

	//TODO:
	/*
		create actorEntities array, create itemsEntity array
		maybe create orbsEntity array.
	*/

	public entityParametersGenerator:any;

	private parent;
	private entityIdNumber:number;

	private deadEntities:Array<any>;
	
	constructor( parent ){
		this.entities = new Array();
		this.parent = parent;
		this.entityIdNumber = 0;
		this.deadEntities = new Array();
	}

	public init( creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData ){
		this.entityParametersGenerator = new EntityParametersGenerator( creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData );
	}

	public generateEntity( entityType, type, subtype ):any{

		var entity = this.createEntity( entityType );
		var params = this.entityParametersGenerator.generate( entityType, type, subtype );
		entity.createComponentsWithParams( params );

		return entity;
	}

	public createEntity( type ):any{
		if( type != "Player" && type != "Mob" && type != "Helper" && type != "Orb" )
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
		var string = "" + this.entityIdNumber;
		this.entityIdNumber++;

		return string;
	}

	public removeEntity( entity ){
		for( var i = 0; i < this.entities.length; i++ ){
			if( entity.id == this.entities[i].id ){
				this.deadEntities.push( this.entities[i] );
				this.entities.splice(i, 1);
			}
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