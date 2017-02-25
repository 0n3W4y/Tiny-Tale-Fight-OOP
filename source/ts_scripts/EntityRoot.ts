class EntityRoot {
	public entities:Array<any>;

	private parent;
	
	constructor( parent ){
		this.entities = new Array();
		this.parent = parent;
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