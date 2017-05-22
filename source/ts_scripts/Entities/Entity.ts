class Entity {

	public id:string;
	public type:string;

	private components:any;

	constructor( id, type ){
		this.id = id;
		this.type = type;
		this.components = {};
	}

	public createComponent( name ):any{
		var component = null;
		if( name == "FightingStats" )
			component = new FightingStats( this );
		else if( name == "Name" )
			component = new Name( this );
		else if( name == "AgeStats" )
			component = new AgeStats( this );
		else if( name == "Type" )
			component = new Type( this );
		else if( name == "ExperienceStats" )
			component = new ExperienceStats( this );
		else if( name == "InventoryBag" )
			component = new InventoryBag( this );
		else if( name == "InventoryEquip" )
			component = new InventoryEquip( this );
		else if( name == "ItemName" )
			component = new ItemName( this );
		else if( name == "ItemType" )
			component = new ItemType( this );
		else if( name == "ItemFightingStats" )
			component = new ItemFightingStats( this );
		else
			console.log( "Error with add components, component with name: " + name + " not found. Erorr in Entity/createComponent." );

		return component;
	}

	public addComponent( component ):void{
		this.components[component.componentName] = component;
	}

	public removeComponent( name ):any{
		var component = this.components[name];
		delete this.components[name];
		return component;
	}

	public createComponentsWithParams( params ){
		var component;
		for( var key in params ){
			component = this.createComponent( key );
			if( component != null ){
				this.addComponent( component );
				component.init( params[key] );				
			}
			else
				console.log( "Error component = null! Error in Entity/createComponentsWithParams" );
		}


	}

	public getComponent( name ){
		return this.components[name];
	}

	public getListOfComponents(){
		return this.components;
	}
}