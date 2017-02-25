class EntityRoot {
	public entities:Array<any>;

	constructor(){
		this.entities = new Array();
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