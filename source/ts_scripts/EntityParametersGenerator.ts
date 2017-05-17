class EntityParametersGenerator {

	private creaturesData:Array<any>;
	private creatureClassData:Array<any>;
	private humanoidsData:Array<any>;
	private humanoidsClassData:Array<any>;
	private humanoidsHelperData:Array<any>;
	private orbsData:Array<any>;

	private creatureClassDataArray:Array<any>;
	private creaturesDataArray:Array<any>;
	private humanoidsDataArray:Array<any>;
	private humanoidsClassDataArray:Array<any>;
	private humanoidsHelperDataArray:Array<any>;
	private orbsDataArray:Array<any>;

	constructor( creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData ){
		this.creaturesData = creaturesData;
		this.creatureClassData = creatureClassData;
		this.humanoidsData = humanoidsData;
		this.humanoidsClassData = humanoidsClassData;
		this.humanoidsHelperData = humanoidsHelperData;
		this.orbsData = orbsData;
		this.creaturesDataArray = new Array();
		this.creatureClassDataArray = new Array();
		this.humanoidsDataArray = new Array();
		this.humanoidsClassDataArray = new Array();
		this.humanoidsHelperDataArray = new Array();
		this.orbsDataArray = new Array();
		this.storeObjKeysInArray();
	}

	public generate( entityType, type, subtype, params ):any{
		var newParams;

		if( entityType == "Player" || entityType == "Helper" || entityType == "Mob" )
			params = this.generateCreature( entityType, type, subtype, params );
		else if( entityType == "Item" )
			params = this.generateItem( type, subtype, params );
		else
			console.log( "Errorm no Entity Type : " + entityType + ". Error in EntityParametersGenerator/generate." );

		return newParams;
	}

	private generateItem( type, subtype, params ){

	}

	private generateCreature( entityType, type, subtype, params ):any{

		var creatureRaceContainer; //names
		var creatureRaceData; // data from names
		var creatureClassData; //data from names
		var creatureClassContainer; //names
		var creatureClass;
		var creatureRace;

		if( entityType == "Player" ){
			creatureRaceContainer = this.humanoidsDataArray;
			creatureRaceData = this.humanoidsData;
			creatureClassData = this.humanoidsClassData;
			creatureClassContainer = this.humanoidsClassDataArray;
		}else if( entityType == "Helper" ){
			creatureRaceContainer =  this.humanoidsHelperDataArray;
			creatureRaceData =  this.humanoidsHelperData;
			creatureClassData =  this.humanoidsClassData;
			creatureClassContainer =  this.humanoidsClassDataArray;
		}else if( entityType == "Mob" ){
			creatureRaceContainer = this.creaturesDataArray;
			creatureRaceData = this.creaturesData;
			creatureClassData = this.creatureClassData;
			creatureClassContainer = this.creatureClassDataArray;
		}else{
			console.log( "Error, entity type " + entityType + " not found. Error in EntityParametersGenerator/generateCreature." );
		}

		if( subtype == null ){
			var rIndex = Math.floor( Math.random()*( creatureClassContainer.length ) );
			var creatureClassName = creatureClassContainer[rIndex];
			creatureClass = creatureClassData[creatureClassName];
		}else{
			creatureClass = creatureClassData[type];
		}

		if( type == null ){
			var randomIndex = Math.floor( Math.random()*( creatureRaceContainer.length ) );
			var creatureRaceName = creatureRaceContainer[randomIndex];
			creatureRace = creatureClassData[creatureRaceName];
		}else{
			creatureRace = creatureClassData[subtype];
		}

		var newParams = {
			Name:null,
			Type:null,
			AgeStats:null,
			FightingStats:null,
			ExperienceStats:null,
			InventoryEquip:null,
			InventoryBag:null
		}

		//делаем присвоение параметров в текущие параметры, для дальнейшей генерации.
		if( params != null ){
			for( var num in params ){
				if( newParams[num] !== undefined )
					newParams[num] = params[num];
			}
		}

		for( var key in newParams ){
			var value;
			if( key == "Name" )
				value = this.generateName( creatureRace[key], creatureClass[key], newParams[key] );
			else if( key == "Type" )
				value = this.generateType( creatureRace[key], creatureClass[key], newParams[key] );
			else if( key == "AgeStats" )
				value = this.generateAgeStats( creatureRace[key], creatureClass[key], newParams[key] );
			else if( key == "FightingStats" )
				value = this.generateFightingStats( creatureRace[key], creatureClass[key], newParams[key] );
			else if( key == "ExperienceStats" )
				value = this.generateExperienceStats( creatureRace[key], creatureClass[key], newParams[key] );
			else if( key == "InventoryEquip" )
				value = this.generateInventoryEquip( creatureRace[key], creatureClass[key], newParams[key] );
			else if( key == "InventoryBag" )
				value = this.generateInventoryBag( creatureRace[key], creatureClass[key], newParams[key] );
			else
				console.log( "Error key with name: " + key + " not found. Error in EntityParametersGenerator/generate." );

			newParams[key] = value;
		}

		return newParams;
	}

	private generateName( raceObject, classObject, params ):any{
		// Генерируем имя entity, оно состоит из объекта несущего информацию об имени и фамилии, в процессе может придти как стринг, так и аррей.
		var name = "NoName";
		var surname = "NoSurname";

		// приоритет отдам race, если там не находится необходимый параметр, применяю class.
		var nameObject;
		var skipGenerateName = false;

		if( params["name"] !== undefined ){
			name = params["name"];
			skipGenerateName = true;
		}
		else if( raceObject["name"] !== undefined )
			nameObject = raceObject["name"];
		else if( classObject["name"] !== undefined )
			nameObject = classObject["name"];
		else
			console.log( "Error, no name. Error in EntityParametersGenerator/generateName." );

		if( !skipGenerateName ){
			if( typeof nameObject === "string" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				name = nameObject;
			else{
				var rnum = Math.floor( Math.random()*nameObject.length ); // выбираем рандомное значение из массива.
				name = nameObject[rnum];
			}
		}

		var surnameObject;
		var skipGenerateSurname = false;

		if( params["surname"] !== undefined ){
			surname = params["surname"];
			skipGenerateSurname = true;
		}
		else if( raceObject["surname"] !== undefined )
			surnameObject = raceObject["surname"];
		else if( classObject["surname"] !== undefined )
			surnameObject = classObject["surname"];
		else
			console.log( "Error, no surname. Error in EntityParametersGenerator/generateName." );
		
		if( !skipGenerateSurname ){
			if( typeof surnameObject === "string" )
				surname = surnameObject;
			else{
				var rnum = Math.floor( Math.random()*surnameObject.length );
				surname = surnameObject[rnum];
			}
		}

		var result = { "name": name, "surname": surname };
		return result;
	}

	private generateType( raceObject, classObject, params ):any{
		var sex = "NoSex";
		var race = "NoRace";
		var creatureClass = "NoClass";

		var sexObject;
		var skipGenerateSex = false;

		if( params["sex"] !== undefined ){
			sex = params["sex"];
			skipGenerateSex = true;
		}
		else if( raceObject["sex"] !== undefined )
			sexObject = raceObject["sex"];
		else if( classObject["sex"] !== undefined )
			sexObject = classObject["sex"];
		else
			console.log( "Error, no sex. Error in EntityParametersGenerator/generateType." );

		if( !skipGenerateSex ){
			if( typeof sexObject === "string" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				sex = sexObject;
			else{
				var rnum = Math.floor( Math.random()*sexObject.length ); // выбираем рандомное значение из массива.
				sex = sexObject[rnum];
			}
		}

		var raceNameObject;
		var skipGenerateRace = false;

		if( params["race"] !== undefined ){
			race = params["race"];
			skipGenerateRace = true;
		}
		else if( raceObject["race"] !== undefined )
			raceNameObject = raceObject["race"];
		else if( classObject["race"] !== undefined )
			raceNameObject = classObject["race"];
		else
			console.log( "Error, no race. Error in EntityParametersGenerator/generateType." );

		if( !skipGenerateRace ){
			if( typeof raceNameObject === "string" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				race = raceNameObject;
			else{
				var rnum = Math.floor( Math.random()*raceNameObject.length ); // выбираем рандомное значение из массива.
				race = raceNameObject[rnum];
			}
		}

		var classNameObject;
		var skipGenerateClass = false;

		if( params["class"] !== undefined ){
			creatureClass = params["class"];
			skipGenerateClass = true;
		}
		else if( raceObject["class"] !== undefined )
			classNameObject = raceObject["class"];
		else if( classObject["class"] !== undefined )
			classNameObject = classObject["class"];
		else
			console.log( "Error, no class. Error in EntityParametersGenerator/generateType." );

		if( !skipGenerateClass ){
			if( typeof classNameObject === "string" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				creatureClass = classNameObject;
			else{
				var rnum = Math.floor( Math.random()*classNameObject.length ); // выбираем рандомное значение из массива.
				creatureClass = classNameObject[rnum];
			}
		}

		var result = { "sex": sex, "race": race, "class": creatureClass };
		return result;
	}

	private generateAgeStats( raceObject, classObject, params ):any{
		var min;
		var max;
		var age = 0;
		var month = 0;
		var day = 1;

		var ageObject;
		var skipGenerateAge = false;

		if( params["age"] !== undefined ){
			age = params["age"];
			skipGenerateAge = true;
		}
		else if( raceObject["age"] !== undefined )
			ageObject = raceObject["age"];
		else if( classObject["age"] !== undefined )
			ageObject = classObject["age"];
		else
			console.log( "Error, no age. Error in EntityParametersGenerator/generateAgeStats." );

		if( !skipGenerateAge ){
			if( typeof ageObject === "number" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				age = ageObject;
			else{
				min = ageObject[0];
				max = ageObject[1];
				var rnum = Math.floor( min + Math.random()*(max - min + 1) ); // выбираем рандомное значение из массива.
				age = rnum; 
			}
		}

		var monthObject;
		var skipGenerateMonth = false;

		if( params["month"] !== undefined ){
			month = params["month"];
			skipGenerateMonth = true;
		}
		else if( raceObject["month"] !== undefined )
			monthObject = raceObject["month"];
		else if( classObject["month"] !== undefined )
			monthObject = classObject["month"];
		else
			console.log( "Error, no month. Error in EntityParametersGenerator/generateAgeStats." );

		if( !skipGenerateMonth ){
			if( typeof monthObject === "number" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				month = monthObject;
			else{
				min = monthObject[0];
				max = monthObject[1];
				var rnum = Math.floor( min + Math.random()*(max - min + 1) ); // выбираем рандомное значение из массива.
				month = rnum; 
			}
		}

		var dayObject;
		var skipGenerateDay = false;

		if( params["day"] !== undefined ){
			day = params["day"];
			skipGenerateDay = true;
		}
		else if( raceObject["day"] !== undefined )
			dayObject = raceObject["day"];
		else if( classObject["day"] !== undefined )
			dayObject = classObject["day"];
		else
			console.log( "Error, no day. Error in EntityParametersGenerator/generateAgeStats." );

		if( !skipGenerateDay ){
			if( typeof dayObject === "number" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				day = dayObject;
			else{
				min = dayObject[0];
				max = dayObject[1];
				var rnum = Math.floor( min + Math.random()*(max - min + 1) ); // выбираем рандомное значение из массива.
				day = rnum; 
			}
		}

		var result = { "age": age, "month": month, "day": day };
		return result;
	}

	private generateFightingStats( raceObject, classObject, params ):any{
		var stats = { HP:0, STR:0, AGI:0, INT:0, ASPD:0, DDG:0, BLK:0, PDEF:0, MDEF:0 };
		var lvlup = { HP:0, STR:0, AGI:0, INT:0, ASPD:0, DDG:0, BLK:0, PDEF:0, MDEF:0 };
		var paramsStats;
		var paramsStats;

		var raceObjectStats = raceObject["stats"];
		var classObjectStats = classObject["stats"];
		
		var raceObjectLvlup = raceObject["lvlup"];
		var classObjectStats = classObject["lvlup"];

		if( params != null ){
			paramsStats = params["stats"];
			paramsStats = params["lvlup"];
		}
		

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

	private generateExperienceStats( raceObject, classObject, params ):any{
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

		var lvlObject;
		var skipGenerateLvl = false;

		if( params["lvl"] !== undefined ){
			lvl = params["lvl"];
			skipGenerateLvl = true;
		}
		if( raceObject["lvl"] !== undefined )
			lvlObject = raceObject["lvl"];
		else if( classObject["lvl"] !== undefined )
			lvlObject = classObject["lvl"];
		else
			console.log( "Error, no lvl. Error in EntityParametersGenerator/generateExperienceStats." );

		if( !skipGenerateLvl ){
			if( typeof lvlObject === "number" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				lvl = lvlObject;
			else{
				min = lvlObject[0];
				max = lvlObject[1];
				var rnum = Math.floor( min + Math.random()*(max - min + 1) ); // выбираем рандомное значение из массива.
				lvl = rnum; 
			}
		}

		var expObject;
		var skipGenerateExp = false;

		if( params["exp"] !== undefined ){
			exp = params["exp"];
			skipGenerateExp = true;
		}
		if( raceObject["exp"] !== undefined )
			expObject = raceObject["exp"];
		else if( classObject["exp"] !== undefined )
			expObject = classObject["exp"];
		else
			console.log( "Error, no exp. Error in EntityParametersGenerator/generateExperienceStats." );

		if( !skipGenerateExp ){
			if( typeof expObject === "number" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				exp = expObject;
			else{
				min = expObject[0];
				max = expObject[1];
				var rnum = Math.floor( min + Math.random()*(max - min + 1) ); // выбираем рандомное значение из массива.
				exp = rnum; 
			}
		}

		var bountyObject;
		var skipGenerateBounty = false;

		if( params["bounty"] !== undefined ){
			bounty = params["bounty"];
			skipGenerateBounty = true;
		}
		if( raceObject["bounty"] !== undefined )
			bountyObject = raceObject["bounty"];
		else if( classObject["bounty"] !== undefined )
			bountyObject = classObject["bounty"];
		else
			console.log( "Error, no bounty. Error in EntityParametersGenerator/generateExperienceStats." );

		if( !skipGenerateBounty ){
			if( typeof bountyObject === "number" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				bounty = bountyObject;
			else{
				min = bountyObject[0];
				max = bountyObject[1];
				var rnum = Math.floor( min + Math.random()*(max - min + 1) ); // выбираем рандомное значение из массива.
				bounty = rnum; 
			}
		}

		var result = { "lvl": lvl, "exp": exp, "bounty": bounty };
		return result;
	}

	private generateInventoryEquip(raceObject, classObject, params ):any{
		var result;
		return result;
	}

	private generateInventoryBag( raceObject, classObject, params ):any{
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