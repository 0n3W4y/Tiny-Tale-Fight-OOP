class Stats extends Component{

	 public age:number;
	 public month:number;
	 public day:number;

	 constructor( parent ){
	 	super( "Stats", parent );

	 }

	 public init( params ):void{
	 	for( var key in params ){
	 		if( key == "age" || key == "month" || key == "days" )
	 			this[key] = params[key];
	 	}
	 }

	 public getFullTime():string{
	 	var string = this.age + " age, " + this.month + " month, " + this.day + " days.";
	 	return string;
	 }
}