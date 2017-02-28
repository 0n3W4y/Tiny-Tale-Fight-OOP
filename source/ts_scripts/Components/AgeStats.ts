class AgeStats extends Component{

	 public age:number;
	 public month:number;
	 public day:number;

	 private time:number;

	 constructor( parent ){
	 	super( "AgeStats", parent );
	 	this.time = 0;
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

	 update( time ){
	 	this.time += time;
	 }

	 public exportDataToObject():any{
		var result = { "age": this.age, "month": this.month, "day": this.day, "time" : this.time };
		return result;
	}
}