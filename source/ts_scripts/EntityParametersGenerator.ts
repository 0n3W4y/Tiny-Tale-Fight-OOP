class EntityParametersGenerator {

	private creaturesData:Array<any>;
	private humanoidsData:Array<any>;
	private humanoidsClassData:Array<any>;

	private creaturesDataArray:Array<any>;
	private humanoidsDataArray:Array<any>;
	private humanoidsClassDataArray:Array<any>;

	constructor( creaturesData, humanoidsData, humanoidsClassData ){
		this.creaturesData = creaturesData;
		this.humanoidsData = humanoidsData;
		this.humanoidsClassData = humanoidsClassData;
		this.creaturesDataArray = new Array();
		this.humanoidsDataArray = new Array();
		this.humanoidsClassDataArray = new Array();
		this.storeObjKeysInArray();
	}

	public generate( entityType, type ):any{
		var container = this.creaturesDataArray;
		var data = this.creaturesData;
		var playerClass;

		if ( entityType == "Player" ){
			container = this.humanoidsDataArray;
			data = this.humanoidsData;
			if( type == null ){
				var rIndex = Math.floor( Math.random()*( this.humanoidsClassDataArray.length ) );
				playerClass = this.humanoidsClassDataArray[rIndex];
			}else{
				playerClass = this.humanoidsClassDataArray[type];
			}
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
				value = this.generateType( creatureParams[key], playerClass );
			else if( key == "AgeStats" )
				value = this.generateAgeStats( creatureParams[key] );
			else if( key == "FightingStats" )
				value = this.generateFightingStats( creatureParams[key], params.Type["class"] );
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

	private generateType( object, playerClass ):any{
		var sex = "NoSex";
		var race = "NoRace";
		var creatureClass = playerClass || "NoClass";

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
			else if( key == "class" ){
				if( creatureClass == "NoClass" ){
					var rnum = Math.floor( Math.random()*container.length );
					creatureClass = container[rnum];
				}
			}
			else
				console.log( "Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateType." );
		}
		var result = { "sex": sex, "race": race, "class": creatureClass };
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

	private generateFightingStats( object, playerClass ):any{
		var stats = {};
		var lvlup = {};
		var lvlupClass = { STR:0, AGI:0, INT:0 };
		var creatureClassParams;
		var min;
		var max;

		if( playerClass != "NoClass" ){
			creatureClassParams = this.humanoidsClassData[playerClass];
			for( var newKey in creatureClassParams ){
				var innerContainer = creatureClassParams[newKey];
				if( typeof creatureClassParams[newKey] === "number" )
					lvlupClass[newKey] = creatureClassParams[newKey];
				else{
					min = innerContainer[0];
					max = innerContainer[1];
					var rnum = Math.floor( min + Math.random()*( max - min + 1 ) );
					lvlupClass[newKey] = rnum;
				}
			}
		}

		for( var key in object ){
			var container = object[key];
			if( key == "stats" ){
				for( var newKey in container ){
					var innerContainer = container[newKey];
					if( typeof innerContainer === "number" )
						stats[newKey] = innerContainer;
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
					if( typeof innerContainer === "number" )
						lvlup[newKey] = innerContainer;
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

		var result = { "stats": stats, "levelUpStats": lvlup, "levelUpClassStats": lvlupClass };
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

		for( var num in this.humanoidsClassData ){
			this.humanoidsClassDataArray.push( num );
		}
	}
}