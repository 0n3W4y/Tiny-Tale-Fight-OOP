class Component {

	public componentName:string;
	protected parent:any;

	constructor( name, parent ){
		this.componentName = name;
		this.parent = parent;
	}
}
