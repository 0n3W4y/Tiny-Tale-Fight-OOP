class EntityParametersGenerator {

	private creaturesData:Array<any>;
	private humanoidsData:Array<any>;

	private creaturesDataArray:Array<any>;
	private humanoidsDataArray:Array<any>;

	constructor( creaturesData, humanoidsData ){
		this.creaturesData = creaturesData;
		this.humanoidsData = humanoidsData;
		this.creaturesDataArray = new Array();
		this.humanoidsDataArray = new Array();
		this.storeObjKeysInArray();
	}

	public generate( type ):any{
		var container = this.creaturesDataArray;
		var data = this.creaturesData;

		if ( type == "Humanoid" ){
			container = this.humanoidsDataArray;
			data = this.humanoidsData
		}

		var params = {
			Name:null,
			Type:null,
			AgeStats:null,
			FightingStats:null,
			ExperienceStats:null
		}
		
		var randomIndex = Math.floor( Math.random()*( container.length ) );
		var creature = container[randomIndex];

		var creatureParams = data[creature];

		for( var key in params ){
			var value;
			if( key == "Name" )
				value = this.generateName( creatureParams[key] );
			else if( key == "Type" )
				value = this.generateType( creatureParams[key] );
			else if( key == "AgeStats" )
				value = this.generateAgeStats( creatureParams[key] );
			else if( key == "FightingStats" )
				value = this.generateFightingStats( creatureParams[key] );
			else if( key == "ExperienceStats" )
				value = this.generateExperienceStats( creatureParams[key] );
			else
				console.log( "Error key with name: " + key + " not found. Error in EntityParametersGenerator/generate." );

			params[key] = value;
		}

		return params;
	}

	private generateName( object ):any{
		// Генерируем имя entity, оно состоит из объекта несущего информацию об имени и фамилии, в процессе может придти как стринг, так и аррей.
		var name = "NoName";
		var surname = "NoSurname";

		for( var key in object ){
			var container = object[key];
			if( key == "name" ){
				if( typeof container === "string" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
					name = container;
				else{
					var rnum = Math.floor( Math.random()*container.length ); // выбираем рандомное значение из массива.
					name = container[rnum];
				}
			}
			else if( key == "surname" ){
				if( typeof container === "string" )
					surname = container;
				else{
					var rnum = Math.floor( Math.random()*container.length );
					surname = container[rnum];
				}
			}
			else
				console.log( "Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateName." );
		}
		var result = { "name": name, "surname": surname };
		return result;
	}

	private generateType( object ):any{
		var sex = "NoSex";
		var race = "NoRace";

		for( var key in object ){
			var container = object[key];
			if( key == "sex" ){
				if( typeof container === "string" )
					sex = container;
				else{
					var rnum = Math.floor( Math.random()*container.length );
					sex = container[rnum];
				}
			}
			else if( key == "race" ){
				if( typeof container === "string" )
					race = container;
				else{
					var rnum = Math.floor( Math.random()*container.length );
					race = container[rnum];
				}
			}
			else
				console.log( "Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateType." );
		}
		var result = { "sex": sex, "race": race };
		return result;
	}

	private generateAgeStats( object ):any{
		var min;
		var max;
		var age = 0;
		var month = 0;
		var day = 1;

		for( var key in object ){
			var container = object[key];
			if( key == "age" ){
				if( typeof container === "number" )
					age = container;
				else{
					min = container[0];
					max = container[1];
					var rnum = Math.floor( min + Math.random()*(max - min + 1) );
					age = rnum;
				}
			}
			else if( key == "month" ){
				if( typeof container === "number" )
					month = container;
				else{
					min = container[0];
					max = container[1];
					var rnum = Math.floor( min + Math.random()*(max - min + 1) );
					month = rnum;
				}
			}
			else if( key == "day" ){
				if( typeof container === "number" )
					day = container;
				else{
					min = container[0];
					max = container[1];
					var rnum = Math.floor( min + Math.random()*(max - min + 1) );
					day = rnum;
				}
			}
			else
				console.log( "Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateAgeStats." );
		}
		var result = { "age": age, "month": month, "day": day };
		return result;
	}

	private generateFightingStats( object ):any{
		var stats = {};
		var lvlup = {};
		var min;
		var max;

		for( var key in object ){
			var container = object[key];
			if( key == "stats" ){
				for( var newKey in container ){
					var innerContainer = container[newKey];
					if( typeof container[key] === "number" )
						stats[newKey] = container[key];
					else{
						min = innerContainer[0];
						max = innerContainer[1];
						var rnum = Math.floor( min + Math.random()*( max - min + 1 ) );
						stats[newKey] = rnum;
					}
				}
			}
			else if( key == "lvlup" ){
				for( var newKey in container ){
					var innerContainer = container[newKey];
					if( typeof container[newKey] === "number" )
						lvlup[newKey] = container[newKey];
					else{
						min = innerContainer[0];
						max = innerContainer[1];
						var rnum = Math.floor( min + Math.random()*( max - min + 1 ) );
						lvlup[newKey] = rnum;
					}
				}
			}
			else
				console.log( "Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateFightingStats." );
		}

		var result = { "stats": stats, "lvlup": lvlup };
		return result;
	}

	private generateExperienceStats( object ):any{
		var lvl = 1; //default;
		var exp = 0; //default;
		var bounty = 0; //default;
		var min;
		var max;

		for( var key in object ){
			var container = object[key];
			if( key == "exp" ){
				if( typeof container === "number" )
					exp = container;
				else{
					min = container[0];
					max = container[1];
					var rnum = Math.floor( min + Math.random()*(max - min + 1) );
					exp = rnum;
				}
			}
			else if( key == "lvl" ){
				if( typeof container === "number" )
					lvl = container;
				else{
					min = container[0];
					max = container[1];
					var rnum = Math.floor( min + Math.random()*(max - min + 1) );
					lvl = rnum;
				}
			}
			else if( key == "bounty" ){
				if( typeof container === "number" )
					bounty = container;
				else{
					min = container[0];
					max = container[1];
					var rnum = Math.floor( min + Math.random()*(max - min + 1) );
					bounty = rnum;
				}
			}
			else
				console.log( "Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateExperienceStats." );
		}
		var result = { "lvl": lvl, "exp": exp, "bounty": bounty };
		return result;
	}

	private storeObjKeysInArray(){
		for( var key in this.creaturesData ){
			this.creaturesDataArray.push( key );
		}

		for( var int in this.humanoidsData ){
			this.humanoidsDataArray.push( int );
		}
	}
}