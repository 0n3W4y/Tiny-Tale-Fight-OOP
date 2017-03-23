class EntityParametersGenerator {

	private creaturesData:Array<any>;
	private humanoidsData:Array<any>;
	private humanoidsClassData:Array<any>;
	private humanoidsHelperData:Array<any>;
	private orbsData:Array<any>;

	private creaturesDataArray:Array<any>;
	private humanoidsDataArray:Array<any>;
	private humanoidsClassDataArray:Array<any>;
	private humanoidsHelperDataArray:Array<any>;
	private orbsDataArray:Array<any>;

	constructor( creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData ){
		this.creaturesData = creaturesData;
		this.humanoidsData = humanoidsData;
		this.humanoidsClassData = humanoidsClassData;
		this.humanoidsHelperData = humanoidsHelperData;
		this.orbsData = orbsData;
		this.creaturesDataArray = new Array();
		this.humanoidsDataArray = new Array();
		this.humanoidsClassDataArray = new Array();
		this.humanoidsHelperDataArray = new Array();
		this.orbsDataArray = new Array();
		this.storeObjKeysInArray();
	}

	public generate( entityType, type, subtype ):any{
		var params;

		if( entityType == "Player" || entityType == "Helper" )
			params = this.generatePlayer( type, subtype );
		else if( entityType == "Item" )
			params = this.generateItem( type, subtype );
		else if( entityType == "Mob" )
			params = this.generateMob( type, subtype );
		else
			console.log( "Errorm no Entity Type : " + entityType + ". Error in EntityParametersGenerator/generate." );

		return params;
	}

	private generateItem( type, subtype ){

	}

	private generateMob( type, subtype ){
		
	}

	private generatePlayer( type, subtype ):any{
		var PlayerRaceContainer = this.humanoidsDataArray;
		var playerRacedata = this.humanoidsData;
		var playerClassData = this.humanoidsClassData;
		var playerClassContainer = this.humanoidsClassDataArray;
		var playerClass;
		var playerRace;

		if( subtype == null ){
			var rIndex = Math.floor( Math.random()*( playerClassContainer.length ) );
			playerClass = playerClassContainer[rIndex];
		}else{
			playerClass = playerClassContainer[type];
		}

		if( type == null ){
			var randomIndex = Math.floor( Math.random()*( PlayerRaceContainer.length ) );
			playerRace = PlayerRaceContainer[randomIndex];
		}else{
			playerRace = PlayerRaceContainer[subtype];
		}

		var params = {
			Name:null,
			Type:null,
			AgeStats:null,
			FightingStats:null,
			ExperienceStats:null,
			InventoryEquip:null,
			InventoryBag:null
		}
		
		var creatureParams = PlayerRaceContainer[playerRace];

		for( var key in params ){
			var value;
			if( key == "Name" )
				value = this.generateName( creatureParams[key] );
			else if( key == "Type" )
				value = this.generateType( creatureParams[key], playerClass );
			else if( key == "AgeStats" )
				value = this.generateAgeStats( creatureParams[key] );
			else if( key == "FightingStats" )
				value = this.generateFightingStats( creatureParams[key], playerClass );
			else if( key == "ExperienceStats" )
				value = this.generateExperienceStats( creatureParams[key] );
			else if( key == "InventoryEquip" )
				value = this.generateInventoryEquip( creatureParams[key] );
			else if( key == "InventoryBag" )
				value = this.generateInventoryBag( creatureParams[key] );
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

		lvlup["STR"] += lvlupClass["STR"];
		lvlup["AGI"] += lvlupClass["AGI"];
		lvlup["INT"] += lvlupClass["INT"];

		var result = { "stats": stats, "levelUpStats": lvlup };
		return result;
	}

	private generateExperienceStats( object ):any{
		var lvl = 1; //default;
		var exp = 0; //default;
		var bounty = 0; //default;
		var min;
		var max;

		/*
		TODO: 
		Сделать bounty как {}, разместив в нем наименования предметов экспы, и прочего лута.
		Сделать правильную функцию, которая сможет это правильно сгенерировать
		По умолчанию, Посл егенерации моба, лут будет уже внутри сгенерирован,
		получение лута будет функция перебора внутреннего инвентаря и сопосталвение шанса + шанс игрока на получение предмета.
		*/

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

	private generateInventoryEquip( object ):any{
		var result;
		for( var key in object ){

		}
		return result;
	}

	private generateInventoryBag( object ):any{
		var result;
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

		for( var newKey in this.humanoidsHelperData ){
			this.humanoidsHelperDataArray.push( newKey );
		}

		for( var newInt in this.orbsData ){
			this.orbsDataArray.push( newInt );
		}
	}
}