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
	
	constructor( parent, creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData, orbsClassData ){
		this.entities = new Array();
		this.parent = parent;
		this.entityIdNumber = 0;
		this.deadEntities = new Array();
		this.init( creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData, orbsClassData );
	}

	private init( creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData, orbsClassData ){
		this.entityParametersGenerator = new EntityParametersGenerator( creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData, orbsClassData );
	}

	public generateEntity( entityType, type, subtype, params ):any{

		var entity = this.createEntity( entityType );
		var newParams = this.entityParametersGenerator.generate( entityType, type, subtype, params );
		entity.createComponentsWithParams( newParams );

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
		var name;
		var type;
		var fightingStats;
		var experienceStats;
		var ageStats;
		var inventoryBag;
		var inventoryEquip;
		var data;

		if( entity.type == "Player" || entity.type == "Helper" || entity.type == "Mob"){
			name = entity.getComponent( "Name" ).exportDataToObject();
			type = entity.getComponent( "Type" ).exportDataToObject();
			fightingStats = entity.getComponent( "FightingStats" ).exportDataToObject();
			experienceStats = entity.getComponent( "ExperienceStats" ).exportDataToObject();
			ageStats = entity.getComponent( "AgeStats" ).exportDataToObject();
			inventoryBag = entity.getComponent( "InventoryBag" ).exportDataToObject();
			inventoryEquip = entity.getComponent( "InventoryEquip" ).exportDataToObject();
			data = { "Name": name, "Type": type, "FightingStats": fightingStats, "ExperienceStats": experienceStats, "AgeStats": ageStats, "InventoryBag": inventoryBag, "InventoryEquip": inventoryEquip };
		}else if( entity.type == "Orb" ){
			name = entity.getComponent( "ItemName" ).exportDataToObject();
			type = entity.getComponent( "ItemType" ).exportDataToObject();
			fightingStats = entity.getComponent( "ItemFightingStats" ).exportDataToObject();
			data = { "ItemName": name, "ItemType": type, "ItemFightingStats": fightingStats };
		}

		return data;
	}
}