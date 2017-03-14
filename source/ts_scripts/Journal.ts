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

	public newContactManyTargets( number ){
		var string = number + " creatures are coming!";
		this.addLineToJournal( string );
	}

	public newContactSingleTarget( target, hp, pdamage, mdamage ){
		var string = "<b>" + target + "</b>" + " ( HP: " + "<b>" + hp + "</b>" + ", Pdmg: " + '<font color="red"><b>' + pdamage + "</b></font>" +", Mdmg: " + '<font color="blue"><b>' + mdamage + "</b></font>" + " ) attacking!" ;
		this.addLineToJournal( string );
	}

	public newContact( player ){
		var string = "<b>" + player + "</b>" + " found new troubles. Prepare to fight!";
		this.addLineToJournal( string );
	}

	public hit( player, target, damage, pdamage, mdamage ){
		var string = "<b>" + player + "</b>" +" is attacking " + "<b>" + target + "</b>" + " hitted on " + '<font color="purple"><b>' + Math.round( damage ) + "</b></font>" + " ( "
					 + '<font color="red"><b>' + Math.round( pdamage ) + "</b></font>" + " + " + '<font color="blue"><b>' + Math.round( mdamage ) + "</b></font>" + " ).";
		this.addLineToJournal( string );
	}

	public crit( player, target, damage, pdamage, mdamage ){
		var string = "<b>" + player + "</b>" +" is attacking " + "<b>" + target + "</b>" + " critically hitted on " + '<font color="purple" style="font-size:24px;"><b>' + Math.round( damage ) + "</b></font>" + " ( "
					 + '<font color="red" style="font-size:24px;"><b>' + Math.round( pdamage ) + "</b></font>" + " + " + '<font color="blue" style="font-size:24px;"><b>' + Math.round( mdamage ) + "</b></font>" + " ).";
		this.addLineToJournal( string );
	}

	public evade( player, target, chanse ){
		var string = "<b>" + target + "</b>" + " dodge the attack with chanse: " + "<b>" + chanse + "</b>.";
		this.addLineToJournal( string );
	}

	public block( target, blocked, chanse ){
		var string =  "<b>" + target + "</b>" + " blocked on " + '<font color="purple">' + blocked + "</font>" + "damage with " + chanse + "% chanse.";
		this.addLineToJournal( string );
	}

	public kill( player, target ){
		var string = "<b>" + target + "</b>" + " killed by " + "<b>" + player + "</b>.";
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