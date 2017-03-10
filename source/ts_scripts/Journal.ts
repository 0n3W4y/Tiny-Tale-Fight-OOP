class Journal {
	private jorunalBlock:any;

	constructor( block ){
		this.jorunalBlock = document.getElementById( block );
	}

	public init(){

	}

	public addLineToJournal( string ){
		var container = this.jorunalBlock;
		var li = document.createElement( "li" );
		li.innerHTML = string;
		container.insertBefore(li, container.firstChild);
	}

	public newContactManyTargets(){
		var string = "Horde of enemies attacking!";
		this.addLineToJournal( string );
	}

	public newContactSingleTarget( target, hp, pdamage, mdamage ){
		var string = "<b>" + target + "</b>" + " ( HP: " + hp + ", " + pdamage + ", " + mdamage + " ) attacking!" ;
		this.addLineToJournal( string );
	}

	public newContact( player ){
		var string = "<b>" + player + "</b>" + " found new troubles. Prepare to fight!";
		this.addLineToJournal( string );
	}

	public hit( player, target, damage, pdamage, mdamage ){
		var string = "<b>" + player + "</b>" +" attacking " + "<b>" + target + "</b>" + " on " + '<font color="purple"><b>' + Math.round( damage ) + "</b></font>" + " ( "
					 + '<font color="red"><b>' + Math.round( pdamage ) + "</b></font>" + " + " + '<font color="blue"><b>' + Math.round( mdamage ) + "</b></font>" + " ).";
		this.addLineToJournal( string );
	}

	public evade( player, target, chanse ){
		var string = "<b>" + player + "</b>" + " attacking, but " + "<b>" + target + "</b>" + " dodge the attack with chanse: " + "<b>" + chanse + "</b>.";
		this.addLineToJournal( string );
	}

	public block( player, target, blocked, chanse ){
		var string =  "<b>" + target + "</b>" + " blocked " + "<b>" + player + "</b>" + "attack on " + '<font color="purple">' + blocked + "</font>" + "damage with " + chanse + "% chanse.";
		this.addLineToJournal( string );
	}

	public kill( player, target ){
		var string = "<b>" + player + "</b>" + " kill " + "<b>" + target + "</b>.";
		this.addLineToJournal( string );
	}

	public gainExp( player, exp ){
		var string = "<b>" + player + "</b>" + " obtain " + exp + " experience.";
		this.addLineToJournal( string );
	}

	public win( player ){
		var string = "Congratulation! " + "<b>" + player + "</b>" + " WIN this battle!";
		this.addLineToJournal( string );
	}

	public lose( player ){
		var string = "So sad! " + "<b>" + player + "</b>" + " LOSE this battle!";
		this.addLineToJournal( string );
	}
}