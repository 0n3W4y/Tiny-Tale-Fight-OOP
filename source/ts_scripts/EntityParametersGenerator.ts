class EntityParametersGenerator {

	private creaturesData:Array<any>;
	private creaturesClassData:Array<any>;
	private humanoidsData:Array<any>;
	private humanoidsClassData:Array<any>;
	private humanoidsHelperData:Array<any>;
	private orbsData:Array<any>;
	private orbsClassData:Array<any>;

	private creaturesClassDataArray:Array<any>;
	private creaturesDataArray:Array<any>;
	private humanoidsDataArray:Array<any>;
	private humanoidsClassDataArray:Array<any>;
	private humanoidsHelperDataArray:Array<any>;
	private orbsDataArray:Array<any>;
	private orbsClassDataArray:Array<any>;

	constructor( creaturesData, creaturesClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData, orbsClassData ){
		this.creaturesData = creaturesData;
		this.creaturesClassData = creaturesClassData;
		this.humanoidsData = humanoidsData;
		this.humanoidsClassData = humanoidsClassData;
		this.humanoidsHelperData = humanoidsHelperData;
		this.orbsData = orbsData;
		this.orbsClassData = orbsClassData;
		this.creaturesDataArray = new Array();
		this.creaturesClassDataArray = new Array();
		this.humanoidsDataArray = new Array();
		this.humanoidsClassDataArray = new Array();
		this.humanoidsHelperDataArray = new Array();
		this.orbsDataArray = new Array();
		this.orbsClassDataArray = new Array();
		this.storeObjKeysInArray();
	}

	public generate( entityType, type, subtype, params ):any{
		var newParams;

		if( entityType == "Player" || entityType == "Helper" || entityType == "Mob" )
			newParams = this.generateCreature( entityType, type, subtype, params );
		else if( entityType == "Orb" )
			newParams = this.generateItem( entityType, type, subtype, params );
		else
			console.log( "Errorm no Entity Type : " + entityType + ". Error in EntityParametersGenerator/generate." );

		return newParams;
	}

	private generateItem( entityType, type, subtype, params ){
		var itemTypeData;
		var itemTypeDataContainer;
		var itemClassData;
		var itemClassDataContainer;
		var itemClass;
		var itemType;

		if( entityType == "Orb" ){
			itemTypeData = this.orbsData;
			itemTypeDataContainer = this.orbsDataArray;
			itemClassData = this.orbsClassData;
			itemClassDataContainer = this.orbsClassDataArray;
		}else{
			console.log( "Error, entity type " + entityType + " not found. Error in EntityParametersGenerator/generateItem." );
		}

		if( subtype == null ){
			var rIndex = Math.floor( Math.random()*( itemClassDataContainer.length ) );
			var itemClassName = itemClassDataContainer[rIndex];
			itemClass = itemClassData[itemClassName];
		}else{
			itemClass = itemClassData[subtype];
		}

		if( type == null ){
			var randomIndex = Math.floor( Math.random()*( itemTypeDataContainer.length ) );
			var itemTypeName = itemTypeDataContainer[randomIndex];
			itemType = itemTypeData[itemTypeName];
		}else{
			itemType = itemTypeData[type];
		}

		var newParams = {
			ItemName:{},
			ItemType:{},
			ItemFightingStats:{}
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
			var itemTypeObject = {};
			var itemClassObject = {};
			var itemParamsObject = {};

			if( itemType[key] !== undefined )
				itemTypeObject = itemType[key];

			if( itemClass[key] !== undefined )
				itemClassObject = itemClass[key];

			if( newParams[key] !== undefined )
				itemParamsObject = newParams[key];

			if( key == "ItemName" )
				value = this.generateItemName( itemTypeObject, itemClassObject, itemParamsObject );
			else if( key == "ItemType" )
				value = this.generateItemType( itemTypeObject, itemClassObject, itemParamsObject );
			else if( key == "ItemFightingStats" )
				value = this.generateItemFightingStats( itemTypeObject, itemClassObject, itemParamsObject );
			else
				console.log( "Error key with name: " + key + " not found. Error in EntityParametersGenerator/generateItem." );

			newParams[key] = value;
		}

		return newParams;
	}

	private generateItemName( typeObject, classObject, paramsObject ){
		// Генерируем имя entity, оно состоит из объекта несущего информацию об имени и фамилии, в процессе может придти как стринг, так и аррей.
		var name = "NoName";
		var rarityName = "n/a";

		// приоритет отдам race, если там не находится необходимый параметр, применяю class.
		var nameObject;
		var skipGenerateName = false;

		if( paramsObject["name"] !== undefined ){
			name = paramsObject["name"];
			skipGenerateName = true;
		}
		else if( typeObject["name"] !== undefined )
			nameObject = typeObject["name"];
		else if( classObject["name"] !== undefined )
			nameObject = classObject["name"];
		else
			console.log( "Error, no name. Error in EntityParametersGenerator/generateItemName." );

		if( !skipGenerateName ){
			if( typeof nameObject === "string" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				name = nameObject;
			else{
				var rnum = Math.floor( Math.random()*nameObject.length ); // выбираем рандомное значение из массива.
				name = nameObject[rnum];
			}
		}

		var rarityNameObject;
		var skipGenerateRarityName = false;

		if( paramsObject["rarityName"] !== undefined ){
			rarityName = paramsObject["rarityName"];
			skipGenerateRarityName = true;
		}
		else if( typeObject["rarityName"] !== undefined )
			rarityNameObject = typeObject["rarityName"];
		else if( classObject["rarityName"] !== undefined )
			rarityNameObject = classObject["rarityName"];
		else
			console.log( "Error, no rarity name. Error in EntityParametersGenerator/generateItemName." );

		if( !skipGenerateRarityName ){
			if( typeof rarityNameObject === "string" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				rarityName = rarityNameObject;
			else{
				var rnum = Math.floor( Math.random()*rarityNameObject.length ); // выбираем рандомное значение из массива.
				rarityName = rarityNameObject[rnum];
			}
		}

		var result = { "name": name, "rarityName": rarityName };
		return result;
	}

	private generateItemType( typeObject, classObject, paramsObject ){
		var type = "No Type";
		var subtype = "n/a";
		var rarity = 0;
		var equipSlot = "inventory";

		var typeStingObject;
		var skipGenerateType = false;

		if( paramsObject["type"] !== undefined ){
			type = paramsObject["type"];
			skipGenerateType = true;
		}
		else if( typeObject["type"] !== undefined )
			typeStingObject = typeObject["type"];
		else if( classObject["type"] !== undefined )
			typeStingObject = classObject["type"];
		else
			console.log( "Error, no type. Error in EntityParametersGenerator/generateItemType." );

		if( !skipGenerateType ){
			if( typeof typeStingObject === "string" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				type = typeStingObject;
			else{
				var rnum = Math.floor( Math.random()*typeStingObject.length ); // выбираем рандомное значение из массива.
				type = typeStingObject[rnum];
			}
		}

		var subTypeObject;
		var skipGenerateSubType = false;

		if( paramsObject["subtype"] !== undefined ){
			subtype = paramsObject["subtype"];
			skipGenerateType = true;
		}
		else if( typeObject["subtype"] !== undefined )
			subTypeObject = typeObject["subtype"];
		else if( classObject["subtype"] !== undefined )
			subTypeObject = classObject["subtype"];
		else
			console.log( "Error, no subtype. Error in EntityParametersGenerator/generateItemType." );

		if( !skipGenerateSubType ){
			if( typeof subTypeObject === "string" ) //проверяем, с каким типом данных мы работает, либо это строка. либо массив из строк.
				subtype = subTypeObject;
			else{
				var rnum = Math.floor( Math.random()*subTypeObject.length ); // выбираем рандомное значение из массива.
				subtype = subTypeObject[rnum];
			}
		}

		var rarityObject;

		if( paramsObject["rarity"] !== undefined )
			rarity = paramsObject["rarity"];
		else if( typeObject["rarity"] !== undefined )
			rarityObject = typeObject["rarity"];
		else if( classObject["rarity"] !== undefined )
			rarityObject = classObject["rarity"];
		else
			console.log( "Error, no rarity. Error in EntityParametersGenerator/generateItemType." );

		rarity = rarityObject;

		var equipSlotObject;

		if( paramsObject["equipSlot"] !== undefined )
			equipSlot = paramsObject["equipSlot"];
		else if( typeObject["equipSlot"] !== undefined )
			equipSlotObject = typeObject["equipSlot"];
		else if( classObject["equipSlot"] !== undefined )
			equipSlotObject = classObject["equipSlot"];
		else
			console.log( "Error, no equipSlot. Error in EntityParametersGenerator/generateItemType." );

		equipSlot = equipSlotObject;

		var result = { "type": type, "subType": subtype, "rarity": rarity, "equipSlot": equipSlot }
		return result;
	}

	private generateItemFightingStats( typeObject, classObject, paramsObject ){
		var damageType;
		var damageTarget;
		var currentDurability;
		var durability;
		var extraStats = { HP:0, STR:0, AGI:0, INT:0, ASPD:0, DDG:0, BLK:0, PDEF:0, MDEF:0, PDMG:0, MDMG:0 };
		var selfStats = { HP:0, STR:0, AGI:0, INT:0, ASPD:0, DDG:0, BLK:0, PDEF:0, MDEF:0, PDMG:0, MDMG:0 };
		var typeDamageStats = {};

		var result = {
			"damageType": damageType,
			"damageTarget": damageTarget,
			"durability": durability,
			"currentDurability": currentDurability,
			"extraStats": extraStats,
			"selfStats": selfStats,
			"typeDamageStats": typeDamageStats
		}

		for( var key in result ){
			var resultContainer = result[key];
			if( key == "damageType" ){
				if( paramsObject[key] !== undefined )
					result[key] = paramsObject[key];
				else if( typeObject[key] !== undefined )
					result[key] = typeObject[key];
				else if( classObject[key] !== undefined )
					result[key] = classObject[key];
				else
					console.log( "Error, no damage type, Error in EntityParametersGenerator/generateItemFightingStats." );
			}
			else if( key == "damageTarget" ){
				if( paramsObject[key] !== undefined )
					result[key] = paramsObject[key];
				else if( typeObject[key] !== undefined )
					result[key] = typeObject[key];
				else if( classObject[key] !== undefined )
					result[key] = classObject[key];
				else
					console.log( "Error, no damage target, Error in EntityParametersGenerator/generateItemFightingStats." );
			}
			else if( key == "durability" ){ //static durability;
				if( paramsObject[key] !== undefined )
					result[key] = paramsObject[key];
				else if( typeObject[key] !== undefined ){
					result[key] = typeObject[key];
					if( classObject[key] !== undefined )
					result[key] += classObject[key];
				}
				else
					console.log( "Error, no static durability, Error in EntityParametersGenerator/generateItemFightingStats" );
			}
			else if( key == "currentDurability" ){
				if( paramsObject[key] !== undefined )
					result[key] = paramsObject[key];
				else if( result["durability"] !== undefined )
					 result[key] = result["durability"];
				else
					console.log( "Error, no current durability, Error in EntityParametersGenerator/generateItemFightingStats." );
			}
			else if( key == "extraStats" ){
				var container;
				if( paramsObject[key] !== undefined ){
					container = paramsObject[key];
					resultContainer = result[key];
					for( var newKey in resultContainer ){
						resultContainer[newKey] = container[newKey];
					}
				}
				else{
					if( typeObject[key] !== undefined ){
						container = typeObject[key];
						for( var newKey in resultContainer ){
							if( container[newKey] !== undefined )
								resultContainer[newKey]  = container[newKey];
						}
					}else if( classObject[key] !== undefined ){
						container = classObject[key];
						for( var newKey in resultContainer ){
							if( container[newKey] !== undefined )
								resultContainer[newKey] += container[newKey];
						}
					}else
						console.log( "Error, no params in extra stats. Error in EntityParametersGenerator/generateItemFightingStats." );
				}
			}
			else if( key == "selfStats" ){
				var container;
				if( paramsObject[key] !== undefined ){
					container = paramsObject[key];
					for( var newKey in resultContainer ){
						resultContainer[newKey] = container[newKey];
					}
				}
				else{
					if( typeObject[key] !== undefined ){
						container = typeObject[key];
						for( var newKey in resultContainer ){
							if( container[newKey] !== undefined )
								resultContainer[newKey]  = container[newKey];
						}
					}else if( classObject[key] !== undefined ){
						container = classObject[key];
						for( var newKey in resultContainer ){
							if( container[newKey] !== undefined )
								resultContainer[newKey] += container[newKey];
						}
					}else
						console.log( "Error, no params in self stats. Error in EntityParametersGenerator/generateItemFightingStats." );
				}
			}else if( key == "typeDamageStats" ){

			}else{
				console.log( "Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateItemFightingStats." );
			}
			
		}

		return result;

	}

	private generateCreature( entityType, type, subtype, params ):any{

		var creatureRaceContainer; //names
		var creatureRaceData; // data from names
		var creaturesClassData; //data from names
		var creatureClassContainer; //names
		var creatureClass;
		var creatureRace;

		if( entityType == "Player" ){
			creatureRaceContainer = this.humanoidsDataArray;
			creatureRaceData = this.humanoidsData;
			creaturesClassData = this.humanoidsClassData;
			creatureClassContainer = this.humanoidsClassDataArray;
		}else if( entityType == "Helper" ){
			creatureRaceContainer =  this.humanoidsHelperDataArray;
			creatureRaceData =  this.humanoidsHelperData;
			creaturesClassData =  this.humanoidsClassData;
			creatureClassContainer =  this.humanoidsClassDataArray;
		}else if( entityType == "Mob" ){
			creatureRaceContainer = this.creaturesDataArray;
			creatureRaceData = this.creaturesData;
			creaturesClassData = this.creaturesClassData;
			creatureClassContainer = this.creaturesClassDataArray;
		}else{
			console.log( "Error, entity type " + entityType + " not found. Error in EntityParametersGenerator/generateCreature." );
		}

		if( subtype == null ){
			var rIndex = Math.floor( Math.random()*( creatureClassContainer.length ) );
			var creatureClassName = creatureClassContainer[rIndex];
			creatureClass = creaturesClassData[creatureClassName];
		}else{
			creatureClass = creaturesClassData[type];
		}

		if( type == null ){
			var randomIndex = Math.floor( Math.random()*( creatureRaceContainer.length ) );
			var creatureRaceName = creatureRaceContainer[randomIndex];
			creatureRace = creatureRaceData[creatureRaceName];
		}else{
			creatureRace = creatureRaceData[subtype];
		}

		var newParams = {
			Name:{},
			Type:{},
			AgeStats:{},
			FightingStats:{},
			ExperienceStats:{},
			InventoryEquip:{},
			InventoryBag:{}
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
			var creatureRaceObject = {};
			var creatureClassObject = {};
			var creatureParamsObject = {};

			if( creatureRace[key] !== undefined )
				creatureRaceObject = creatureRace[key];

			if( creatureClass[key] !== undefined )
				creatureClassObject = creatureClass[key];

			if( newParams[key] !== undefined )
				creatureParamsObject = newParams[key];

			if( key == "Name" )
				value = this.generateName( creatureRaceObject, creatureClassObject, creatureParamsObject );
			else if( key == "Type" )
				value = this.generateType( creatureRaceObject, creatureClassObject, creatureParamsObject );
			else if( key == "AgeStats" )
				value = this.generateAgeStats( creatureRaceObject, creatureClassObject, creatureParamsObject );
			else if( key == "FightingStats" )
				value = this.generateFightingStats( creatureRaceObject, creatureClassObject, creatureParamsObject );
			else if( key == "ExperienceStats" )
				value = this.generateExperienceStats( creatureRaceObject, creatureClassObject, creatureParamsObject );
			else if( key == "InventoryEquip" )
				value = this.generateInventoryEquip( creatureRaceObject, creatureClassObject, creatureParamsObject );
			else if( key == "InventoryBag" )
				value = this.generateInventoryBag( creatureRaceObject, creatureClassObject, creatureParamsObject );
			else
				console.log( "Error key with name: " + key + " not found. Error in EntityParametersGenerator/generateCreature." );

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
		var staticStats = { HP:0, STR:0, AGI:0, INT:0, ASPD:0, DDG:0, BLK:0, PDEF:0, MDEF:0 };
		var lvlup = { HP:0, STR:0, AGI:0, INT:0, ASPD:0, DDG:0, BLK:0, PDEF:0, MDEF:0 };
		var paramsStats;
		var paramsLvlup;
		var paramsStaticStats;

		var raceObjectStats = raceObject["stats"];
		var classObjectStats = classObject["stats"];
		
		var raceObjectLvlup = raceObject["lvlup"];
		var classObjectLvlup = classObject["lvlup"];

		if( params != null ){
			paramsStats = params["stats"];
			paramsLvlup = params["lvlup"];
			paramsStaticStats = params["staticStats"];
		}

		for( var key in stats ){
			if( raceObjectStats[key] !== undefined ){
				stats[key] = raceObjectStats[key];
			}

			if( classObjectStats != undefined ){
				if( classObjectStats[key] !== undefined )
					stats[key] += classObjectStats[key];
			}

			if( paramsStats != undefined ){
				if( paramsStats[key] !== undefined )
				stats[key] = paramsStats[key];
			}
		}

		for( var key in staticStats ){
			if( raceObjectStats[key] !== undefined ){
				staticStats[key] = raceObjectStats[key];
			}

			if( classObjectStats != undefined ){
				if( classObjectStats[key] !== undefined )
					stats[key] += classObjectStats[key];
			}

			if( paramsStaticStats != null ){
				if( paramsStaticStats[key] !== undefined )
				staticStats[key] = paramsStaticStats[key];
			}
		}

		for( var key in lvlup ){
			if( raceObjectLvlup[key] !== undefined ){
				lvlup[key] = raceObjectLvlup[key];
			}

			if( classObjectLvlup != undefined ){
				if( classObjectLvlup[key] !== undefined )
					lvlup[key] += classObjectLvlup[key];
			}

			if( paramsLvlup != null ){
				if( paramsLvlup[key] !== undefined )
				lvlup[key] = paramsLvlup[key];
			}
		}

		var result = { "stats": stats, "staticStats": staticStats, "lvlup": lvlup };
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

		for( var key in this.humanoidsData ){
			this.humanoidsDataArray.push( key );
		}

		for( var key in this.humanoidsClassData ){
			this.humanoidsClassDataArray.push( key );
		}

		for( var key in this.humanoidsHelperData ){
			this.humanoidsHelperDataArray.push( key );
		}

		for( var key in this.orbsData ){
			this.orbsDataArray.push( key );
		}

		for( var key in this.creaturesClassData ){
			this.creaturesClassDataArray.push( key );
		}

		for( var key in this.orbsClassData ){
			this.orbsClassDataArray.push( key );
		}
	}

	public getDeployStat( type, entityType, entityClass, lvl, stat ):number{
		var deployEntityType;
		var deployEntityClass;
		var componentName;
		var result;

		if( type == "Player" ){
			deployEntityType = this.humanoidsData[entityType];
			deployEntityClass = this.humanoidsClassData[entityClass];
			componentName = "FightingStats";
		}else if( type == "Helper" ){
			deployEntityType = this.humanoidsHelperData[entityType];
			deployEntityClass = this.humanoidsClassData[entityClass];
			componentName = "FightingStats";
		}else if( type == "Mob" ){
			deployEntityType = this.creaturesData[entityType];
			deployEntityClass = this.creaturesClassData[entityClass];
			componentName = "FightingStats";
		}else if( type == "Orb" ){
			deployEntityType = this.orbsData[entityType];
			deployEntityClass = this.orbsClassData[entityClass];
			componentName = "ItemFightingStats";
		}else{
			console.log( "Error, no type with name: " + type + ". Error in EntityParametersGenerator/getDeployStat." );
		}

		deployEntityType = deployEntityClass[componentName];
		deployEntityClass = deployEntityClass[componentName];

		var staticStatType = deployEntityType["stats"];
		var lvlupStatType = deployEntityType["lvlup"];

		var staticStatClass = deployEntityClass["stats"];
		var lvlupStatClass = deployEntityClass["lvlup"];

		var statTypeNumber = staticStatType[stat] || 0;
		var lvlupTypeNumber = lvlupStatType[stat] || 0;

		var statClassNumber = staticStatClass[stat] || 0;
		var lvlupClassNumber = lvlupStatClass[stat] || 0;

		var resultType = statTypeNumber + lvlupTypeNumber * lvl;
		var resultClass = statClassNumber + lvlupClassNumber * lvl;

		result = resultType + resultClass;
		return result;
	}
}