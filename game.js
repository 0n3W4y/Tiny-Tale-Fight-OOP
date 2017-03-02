var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game = (function () {
    function Game(fps) {
        this.fps = fps;
    }
    Game.prototype.init = function (creaturesData, humanoidsData, leftBlock, rightBlock, journal) {
        this.commonTick = new CommonTick(this, this.fps);
        this.entityRoot = new EntityRoot(this);
        this.entityRoot.init(creaturesData, humanoidsData);
        this.battle = new Battle(this);
        this.userInterface = new UserInterface(this);
        this.userInterface.init(leftBlock, rightBlock, journal);
    };
    Game.prototype.start = function () {
        this.commonTick.startLoop();
    };
    Game.prototype.stop = function () {
        this.commonTick.stopLoop();
    };
    Game.prototype.pause = function () {
        this.commonTick.togglePause();
    };
    Game.prototype.update = function (delta) {
        this.battle.update(delta);
    };
    Game.prototype.addMob = function () {
        if (!this.battle.isFighting) {
            var mob = this.entityRoot.generateEntity("Creature");
        }
    };
    Game.prototype.generatePlayer = function () {
        var player = this.entityRoot.generateEntity("Player", "Humanoid");
        this.userInterface.fillBlock(player);
        this.battle.addPlayerToFight(1, player);
    };
    Game.prototype.generateMob = function () {
        var entityList = this.entityRoot.getListOfEntities();
        var lvl;
        for (var i = 0; i < entityList.length; i++) {
            if (entityList[i].type == "Player") {
                lvl = entityList[i].getComponent("ExperienceStats").lvl;
                break;
            }
        }
        var min = lvl - 2;
        var max = lvl + 2;
        if (min < 1)
            min = 1;
        if (max > 100)
            max = 100;
        var mobLevel = Math.floor(Math.random() * (max - min + 1) + min);
        var mob = this.entityRoot.generateEntity("Mob", "Creature");
        mob.getComponent("ExperienceStats").lvl = mobLevel;
        mob.getComponent("ExperienceStats").updateComponent();
        this.userInterface.fillBlock(mob);
        this.battle.addPlayerToFight(2, mob);
    };
    return Game;
}());
var UserInterface = (function () {
    function UserInterface(parent) {
        this.parent = parent;
    }
    UserInterface.prototype.init = function (leftBlock, rightBlock, journal) {
        this.leftCharacterBlock = document.getElementById(leftBlock);
        this.rightCharacterBlock = document.getElementById(rightBlock);
        this.journal = document.getElementById(journal);
    };
    UserInterface.prototype.fillLeftCharacterBlock = function (entity) {
        //params { name:"full name", hp:100, sp:100, exp:[0,100], lvl: str:1, end:1, int:1 };
        var data = this.collectDataFromEntity(entity);
        var container = this.leftCharacterBlock;
        var fightingStatsContainer = data["FightingStats"];
        var currentStatsContainer = fightingStatsContainer["currentStats"];
        var hp = currentStatsContainer["HP"];
        var sp = currentStatsContainer["SP"];
        var str = currentStatsContainer["STR"];
        var end = currentStatsContainer["END"];
        var int = currentStatsContainer["INT"];
        var staticStatsContainer = fightingStatsContainer["staticStats"];
        var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
        var experienceStats = data["ExperienceStats"];
        var exp = experienceStats["exp"];
        var expToNextLvl = experienceStats["expToNextLvl"];
        var lvl = experienceStats["lvl"];
        var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"] * lvl;
        var staticSp = staticStatsContainer["SP"] + lvlUpStatsContainer["SP"] * lvl;
        container.getElementsByClassName("red")[0].innerHTML = hp + "/" + staticHp;
        var hpBar = Math.round((hp / staticHp) * 100);
        if (hpBar < 0)
            hpBar = 0;
        container.getElementsByClassName("red")[0].style.width = hpBar + "%";
        container.getElementsByClassName("green")[0].innerHTML = sp + "/" + staticSp;
        var spBar = Math.round((sp / staticSp) * 100);
        if (spBar < 0)
            spBar = 0;
        container.getElementsByClassName("green")[0].style.width = spBar + "%";
        container.getElementsByClassName("violet")[0].innerHTML = exp + "/" + expToNextLvl;
        var percent = Math.floor((exp / expToNextLvl) * 100);
        var stringPercent = percent + "%";
        container.getElementsByClassName("violet")[0].style.width = stringPercent;
        container.getElementsByClassName("level")[0].innerHTML = lvl;
        container.getElementsByClassName("phisic-attack")[0].innerHTML = str;
        container.getElementsByClassName("defense")[0].innerHTML = end;
        container.getElementsByClassName("magic-attack")[0].innerHTML = int;
    };
    UserInterface.prototype.fillRightCharacterBlock = function (entity) {
        var data = this.collectDataFromEntity(entity);
        var container = this.rightCharacterBlock;
        var fightingStatsContainer = data["FightingStats"];
        var currentStatsContainer = fightingStatsContainer["currentStats"];
        var hp = currentStatsContainer["HP"];
        var sp = currentStatsContainer["SP"];
        var str = currentStatsContainer["STR"];
        var end = currentStatsContainer["END"];
        var int = currentStatsContainer["INT"];
        var staticStatsContainer = fightingStatsContainer["staticStats"];
        var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
        var experienceStats = data["ExperienceStats"];
        var bounty = experienceStats["bounty"];
        var lvl = experienceStats["lvl"];
        var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"] * lvl;
        var staticSp = staticStatsContainer["SP"] + lvlUpStatsContainer["SP"] * lvl;
        container.getElementsByClassName("red")[0].innerHTML = hp + "/" + staticHp;
        var hpBar = Math.round((hp / staticHp) * 100);
        if (hpBar < 0)
            hpBar = 0;
        container.getElementsByClassName("red")[0].style.width = hpBar + "%";
        container.getElementsByClassName("green")[0].innerHTML = sp + "/" + staticSp;
        var spBar = Math.round((sp / staticSp) * 100);
        if (spBar < 0)
            spBar = 0;
        container.getElementsByClassName("green")[0].style.width = spBar + "%";
        container.getElementsByClassName("level")[0].innerHTML = lvl;
        container.getElementsByClassName("phisic-attack")[0].innerHTML = str;
        container.getElementsByClassName("defense")[0].innerHTML = end;
        container.getElementsByClassName("magic-attack")[0].innerHTML = int;
        container.getElementsByClassName("bounty")[0].innerHTML = bounty + " Exp";
    };
    UserInterface.prototype.addLineToJournal = function (string) {
        var container = this.journal;
        var li = document.createElement("li");
        li.innerHTML = string;
        container.insertBefore(li, container.firstChild);
    };
    UserInterface.prototype.fillBlock = function (entity) {
        if (entity.type == "Player")
            this.fillLeftCharacterBlock(entity);
        else if (entity.type == "Mob")
            this.fillRightCharacterBlock(entity);
        else
            console.log("Error no key with name: " + entity.type + ". Error in UserInterface/fillBlock");
    };
    UserInterface.prototype.drawAvatar = function (blockName, params) {
        var container = this.rightCharacterBlock;
        if (blockName == "Left")
            container = this.leftCharacterBlock;
        var avatar = container.getElementsByClassName("avatar");
        //img.src= params;
    };
    UserInterface.prototype.collectDataFromEntity = function (entity) {
        var name = entity.getComponent("Name").exportDataToObject();
        var type = entity.getComponent("Type").exportDataToObject();
        var fightingStats = entity.getComponent("FightingStats").exportDataToObject();
        var experienceStats = entity.getComponent("ExperienceStats").exportDataToObject();
        var ageStats = entity.getComponent("AgeStats").exportDataToObject();
        //if params == null, collect all data;
        var data = { "Name": name, "Type": type, "FightingStats": fightingStats, "ExperienceStats": experienceStats, "AgeStats": ageStats };
        return data;
    };
    return UserInterface;
}());
var Battle = (function () {
    function Battle(parent) {
        this.parent = parent;
        this.isFighting = false;
        this.isFightEnd = true;
        this.teamOne = new Array();
        this.teamTwo = new Array();
    }
    Battle.prototype.addPlayerToFight = function (team, entity) {
        if (team == 1)
            this.teamOne.push(entity);
        else if (team == 2)
            this.teamTwo.push(entity);
        else
            console.log("Error in add entity in team, team = " + team + " not found. Error in Battle/addPlayerToGight");
    };
    Battle.prototype.beginFight = function () {
        this.prepareFight();
        this.isFighting = true;
        this.isFightEnd = false;
    };
    Battle.prototype.stopFight = function () {
        this.isFighting = false;
    };
    Battle.prototype.fight = function (delta) {
        var p1Attack = this.teamOne[0].getComponent("FightingStats");
        var p2Attack = this.teamTwo[0].getComponent("FightingStats");
        var dead;
        if (p1Attack.checkAttack(delta))
            dead = this.attack(this.teamOne[0], this.teamTwo[0]);
        if (p2Attack.checkAttack(delta))
            dead = this.attack(this.teamTwo[0], this.teamOne[0]);
        if (dead != null)
            this.killEntity(dead);
        if (this.isFightEnd && (this.teamTwo.length == 0 || this.teamOne.length == 0)) {
            this.isFighting = false;
            this.resetStats();
        }
        else
            this.isFightEnd = false;
    };
    Battle.prototype.resetStats = function () {
        if (this.teamTwo.length == 0) {
            this.teamOne[0].getComponent("FightingStats").resetStats();
            this.parent.userInterface.fillBlock(this.teamOne[0]);
            this.parent.userInterface.addLineToJournal("Grats, u kill them all");
        }
    };
    Battle.prototype.attack = function (player, target) {
        var targetFightStats = target.getComponent("FightingStats");
        var targetDefense = targetFightStats.getCurrentStat("END");
        var targetChanceToEvade = targetFightStats.getCurrentStat("AGI") / 100;
        var randomNum = Math.random();
        if (targetChanceToEvade >= randomNum) {
            this.parent.userInterface.addLineToJournal(player.getComponent("Name").getFullName() + " attacking " + target.getComponent("Name").getFullName() + " dodge the attack!");
            return null;
        }
        var playerFightStats = player.getComponent("FightingStats");
        var playerDamage = playerFightStats.getCurrentStat("STR");
        var playerMaxDamage = playerDamage * 2;
        var playerMinDamage = playerDamage / 2;
        playerDamage = Math.round(playerMinDamage + Math.random() * (playerMaxDamage - playerMinDamage));
        var damage = playerDamage - targetDefense;
        var hp = targetFightStats.getCurrentStat("HP");
        if (damage > 0) {
            hp -= damage;
            targetFightStats.setStats("current", { "HP": hp });
            this.parent.userInterface.addLineToJournal(player.getComponent("Name").getFullName() + " attacking " + target.getComponent("Name").getFullName() + " on " + damage + "; Attack: " + playerDamage + "; TargetDefense: " + targetDefense);
        }
        else {
            this.parent.userInterface.addLineToJournal(player.getComponent("Name").getFullName() + " attacking " + target.getComponent("Name").getFullName() + ", but can't avoid the defense");
        }
        if (hp <= 0) {
            this.parent.userInterface.addLineToJournal(target.getComponent("Name").getFullName() + " - Dead!");
            this.isFightEnd = true;
            this.parent.userInterface.fillBlock(target);
            var exp = target.getComponent("ExperienceStats").bounty;
            this.gainExperience(player, exp);
            return target;
        }
        this.parent.userInterface.fillBlock(target);
        return null;
    };
    Battle.prototype.update = function (delta) {
        if (this.isFighting) {
            this.fight(delta);
        }
    };
    Battle.prototype.prepareFight = function () {
        var fullNamePlayer = this.teamOne[0].getComponent("Name").getFullName();
        var fullNameEnemy = this.teamTwo[0].getComponent("Name").getFullName();
        var enemyHp = this.teamTwo[0].getComponent("FightingStats").getCurrentStat("HP");
        var damage = this.teamTwo[0].getComponent("FightingStats").getCurrentStat("STR");
        var stringDamage = Math.round(damage / 2) + " - " + Math.round(damage * 2);
        var string = fullNamePlayer + " found new troubles. " + fullNameEnemy + " on the road! It have: " + enemyHp + " Health Points, and can attack on: " + stringDamage + " phisical damage! Prepare to battle!";
        this.parent.userInterface.addLineToJournal(string);
    };
    Battle.prototype.killEntity = function (entity) {
        var entityType = entity.type;
        var index;
        if (entityType == "Player") {
            index = this.teamOne.indexOf(entity);
            this.teamOne.splice(index, 1);
        }
        else {
            index = this.teamTwo.indexOf(entity);
            this.teamTwo.splice(index, 1);
            this.parent.entityRoot.removeEntity(entity);
        }
    };
    Battle.prototype.gainExperience = function (entity, value) {
        if (entity.type == "Player") {
            entity.getComponent("ExperienceStats").gainExperience(value);
            var entityFullname = entity.getComponent("Name").getFullName();
            this.parent.userInterface.addLineToJournal(entityFullname + " gained " + value + " experience.");
            this.parent.userInterface.fillBlock(entity);
        }
    };
    return Battle;
}());
var EntityRoot = (function () {
    function EntityRoot(parent) {
        this.entities = new Array();
        this.parent = parent;
    }
    EntityRoot.prototype.init = function (creaturesData, humanoidsData) {
        this.entityParametersGenerator = new EntityParametersGenerator(creaturesData, humanoidsData);
    };
    EntityRoot.prototype.generateEntity = function (entityType, type) {
        var entity = this.createEntity(entityType);
        var params = this.entityParametersGenerator.generate(type);
        entity.createComponentsWithParams(params);
        return entity;
    };
    EntityRoot.prototype.createEntity = function (type) {
        if (type != "Player" && type != "Mob")
            console.log("Error, no type with name: " + type + ". Error in EntityRoot/createEntity");
        var id = this.createId();
        var entity = new Entity(id, type);
        this.entities.push(entity);
        return entity;
    };
    EntityRoot.prototype.getListOfEntities = function () {
        return this.entities;
    };
    EntityRoot.prototype.createId = function () {
        return "0";
    };
    EntityRoot.prototype.removeEntity = function (entity) {
        for (var i = 0; i < this.entities.length; i++) {
            if (entity.getComponent("Name").getFullName() == this.entities[i].getComponent("Name").getFullName())
                this.entities.splice(i, 1);
        }
    };
    return EntityRoot;
}());
var CommonTick = (function () {
    function CommonTick(parent, fps) {
        this.fps = fps;
        this.paused = false;
        this.lastTick = 0;
        this.timeRatio = 1;
        this.tickFps = 1000 / fps;
        this.parent = parent;
    }
    CommonTick.prototype.startLoop = function () {
        if (this.loopId) {
            clearInterval(this.loopId);
        }
        this.loopId = window.setInterval(this.tick.bind(this), this.tickFps);
        this.loopStarted = Date.now();
        return this;
    };
    CommonTick.prototype.stopLoop = function () {
        if (this.loopId) {
            clearInterval(this.loopId);
            this.loopId = null;
            console.log("Game stopped");
        }
    };
    CommonTick.prototype.togglePause = function () {
        this.paused = !this.paused;
    };
    CommonTick.prototype.tick = function () {
        if (this.paused) {
            return;
        }
        var time = Date.now();
        var delta = time - this.lastTick;
        // protection for jumping in time;
        if (delta > this.tickFps * 2 || delta <= 0) {
            delta = this.tickFps;
        }
        if (delta >= this.tickFps) {
            delta *= this.timeRatio;
            this.parent.update(delta);
            this.lastTick = time;
        }
    };
    return CommonTick;
}());
var EntityParametersGenerator = (function () {
    function EntityParametersGenerator(creaturesData, humanoidsData) {
        this.creaturesData = creaturesData;
        this.humanoidsData = humanoidsData;
        this.creaturesDataArray = new Array();
        this.humanoidsDataArray = new Array();
        this.storeObjKeysInArray();
    }
    EntityParametersGenerator.prototype.generate = function (type) {
        var container = this.creaturesDataArray;
        var data = this.creaturesData;
        if (type == "Humanoid") {
            container = this.humanoidsDataArray;
            data = this.humanoidsData;
        }
        var params = {
            Name: null,
            Type: null,
            AgeStats: null,
            FightingStats: null,
            ExperienceStats: null
        };
        var randomIndex = Math.floor(Math.random() * (container.length));
        var creature = container[randomIndex];
        var creatureParams = data[creature];
        for (var key in params) {
            var value;
            if (key == "Name")
                value = this.generateName(creatureParams[key]);
            else if (key == "Type")
                value = this.generateType(creatureParams[key]);
            else if (key == "AgeStats")
                value = this.generateAgeStats(creatureParams[key]);
            else if (key == "FightingStats")
                value = this.generateFightingStats(creatureParams[key]);
            else if (key == "ExperienceStats")
                value = this.generateExperienceStats(creatureParams[key]);
            else
                console.log("Error key with name: " + key + " not found. Error in EntityParametersGenerator/generate.");
            params[key] = value;
        }
        return params;
    };
    EntityParametersGenerator.prototype.generateName = function (object) {
        // Генерируем имя entity, оно состоит из объекта несущего информацию об имени и фамилии, в процессе может придти как стринг, так и аррей.
        var name = "NoName";
        var surname = "NoSurname";
        for (var key in object) {
            var container = object[key];
            if (key == "name") {
                if (typeof container === "string")
                    name = container;
                else {
                    var rnum = Math.floor(Math.random() * container.length); // выбираем рандомное значение из массива.
                    name = container[rnum];
                }
            }
            else if (key == "surname") {
                if (typeof container === "string")
                    surname = container;
                else {
                    var rnum = Math.floor(Math.random() * container.length);
                    surname = container[rnum];
                }
            }
            else
                console.log("Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateName.");
        }
        var result = { "name": name, "surname": surname };
        return result;
    };
    EntityParametersGenerator.prototype.generateType = function (object) {
        var sex = "NoSex";
        var race = "NoRace";
        for (var key in object) {
            var container = object[key];
            if (key == "sex") {
                if (typeof container === "string")
                    sex = container;
                else {
                    var rnum = Math.floor(Math.random() * container.length);
                    sex = container[rnum];
                }
            }
            else if (key == "race") {
                if (typeof container === "string")
                    race = container;
                else {
                    var rnum = Math.floor(Math.random() * container.length);
                    race = container[rnum];
                }
            }
            else
                console.log("Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateType.");
        }
        var result = { "sex": sex, "race": race };
        return result;
    };
    EntityParametersGenerator.prototype.generateAgeStats = function (object) {
        var min;
        var max;
        var age = 0;
        var month = 0;
        var day = 1;
        for (var key in object) {
            var container = object[key];
            if (key == "age") {
                if (typeof container === "number")
                    age = container;
                else {
                    min = container[0];
                    max = container[1];
                    var rnum = Math.floor(min + Math.random() * (max - min + 1));
                    age = rnum;
                }
            }
            else if (key == "month") {
                if (typeof container === "number")
                    month = container;
                else {
                    min = container[0];
                    max = container[1];
                    var rnum = Math.floor(min + Math.random() * (max - min + 1));
                    month = rnum;
                }
            }
            else if (key == "day") {
                if (typeof container === "number")
                    day = container;
                else {
                    min = container[0];
                    max = container[1];
                    var rnum = Math.floor(min + Math.random() * (max - min + 1));
                    day = rnum;
                }
            }
            else
                console.log("Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateAgeStats.");
        }
        var result = { "age": age, "month": month, "day": day };
        return result;
    };
    EntityParametersGenerator.prototype.generateFightingStats = function (object) {
        var stats = {};
        var lvlup = {};
        var min;
        var max;
        for (var key in object) {
            var container = object[key];
            if (key == "stats") {
                for (var newKey in container) {
                    var innerContainer = container[newKey];
                    if (typeof container[key] === "number")
                        stats[newKey] = container[key];
                    else {
                        min = innerContainer[0];
                        max = innerContainer[1];
                        var rnum = Math.floor(min + Math.random() * (max - min + 1));
                        stats[newKey] = rnum;
                    }
                }
            }
            else if (key == "lvlup") {
                for (var newKey in container) {
                    var innerContainer = container[newKey];
                    if (typeof container[newKey] === "number")
                        lvlup[newKey] = container[newKey];
                    else {
                        min = innerContainer[0];
                        max = innerContainer[1];
                        var rnum = Math.floor(min + Math.random() * (max - min + 1));
                        lvlup[newKey] = rnum;
                    }
                }
            }
            else
                console.log("Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateFightingStats.");
        }
        var result = { "stats": stats, "lvlup": lvlup };
        return result;
    };
    EntityParametersGenerator.prototype.generateExperienceStats = function (object) {
        var lvl = 1; //default;
        var exp = 0; //default;
        var bounty = 0; //default;
        var min;
        var max;
        for (var key in object) {
            var container = object[key];
            if (key == "exp") {
                if (typeof container === "number")
                    exp = container;
                else {
                    min = container[0];
                    max = container[1];
                    var rnum = Math.floor(min + Math.random() * (max - min + 1));
                    exp = rnum;
                }
            }
            else if (key == "lvl") {
                if (typeof container === "number")
                    lvl = container;
                else {
                    min = container[0];
                    max = container[1];
                    var rnum = Math.floor(min + Math.random() * (max - min + 1));
                    lvl = rnum;
                }
            }
            else if (key == "bounty") {
                if (typeof container === "number")
                    bounty = container;
                else {
                    min = container[0];
                    max = container[1];
                    var rnum = Math.floor(min + Math.random() * (max - min + 1));
                    bounty = rnum;
                }
            }
            else
                console.log("Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateExperienceStats.");
        }
        var result = { "lvl": lvl, "exp": exp, "bounty": bounty };
        return result;
    };
    EntityParametersGenerator.prototype.storeObjKeysInArray = function () {
        for (var key in this.creaturesData) {
            this.creaturesDataArray.push(key);
        }
        for (var int in this.humanoidsData) {
            this.humanoidsDataArray.push(int);
        }
    };
    return EntityParametersGenerator;
}());
var Entity = (function () {
    function Entity(id, type) {
        this.id = id;
        this.type = type;
        this.components = {};
    }
    Entity.prototype.createComponent = function (name) {
        var component = null;
        if (name == "FightingStats")
            component = new FightingStats(this);
        else if (name == "Name")
            component = new Name(this);
        else if (name == "AgeStats")
            component = new AgeStats(this);
        else if (name == "Type")
            component = new Type(this);
        else if (name == "ExperienceStats")
            component = new ExperienceStats(this);
        else
            console.log("Error with add components, component with name: " + name + " not found. Erorr in Entity/createComponent.");
        return component;
    };
    Entity.prototype.addComponent = function (component) {
        this.components[component.componentName] = component;
    };
    Entity.prototype.removeComponent = function (name) {
        var component = this.components[name];
        delete this.components[name];
        return component;
    };
    Entity.prototype.createComponentsWithParams = function (params) {
        var component;
        for (var key in params) {
            component = this.createComponent(key);
            if (component != null) {
                this.addComponent(component);
                component.init(params[key]);
            }
            else
                console.log("Error in Entity/createComponentsWithParams");
        }
    };
    Entity.prototype.getComponent = function (name) {
        return this.components[name];
    };
    Entity.prototype.getListOfComponents = function () {
        return this.components;
    };
    return Entity;
}());
var Component = (function () {
    function Component(name, parent) {
        this.componentName = name;
        this.parent = parent;
    }
    return Component;
}());
var FightingStats = (function (_super) {
    __extends(FightingStats, _super);
    function FightingStats(parent) {
        var _this = _super.call(this, "FightingStats", parent) || this;
        _this.timeToNextAttack = 0;
        _this.currentStats = {
            HP: 0,
            SP: 0,
            STR: 0,
            AGI: 0,
            END: 0,
            INT: 0,
            ASPD: 0
        };
        _this.staticStats = {
            HP: 0,
            SP: 0,
            STR: 0,
            AGI: 0,
            END: 0,
            INT: 0,
            ASPD: 0
        };
        _this.levelUpStats = {
            HP: 0,
            SP: 0,
            STR: 0,
            AGI: 0,
            END: 0,
            INT: 0,
            ASPD: 0
        };
        return _this;
    }
    FightingStats.prototype.init = function (params) {
        for (var key in params) {
            var container = params[key];
            if (key == "stats") {
                for (var newKey in container) {
                    if (!(this.currentStats[newKey] === undefined)) {
                        this.currentStats[newKey] = container[newKey];
                        this.staticStats[newKey] = container[newKey];
                    }
                    else
                        console.log("Error, no key with name: " + newKey + ". Error in FightingStats/init.");
                }
            }
            else {
                for (var newKey in container) {
                    if (!(this.levelUpStats[newKey] === undefined)) {
                        this.levelUpStats[newKey] = container[newKey];
                    }
                    else
                        console.log("Error, no key with name: " + newKey + ". Error in FightingStats/init.");
                }
            }
        }
    };
    FightingStats.prototype.getCurrentStat = function (stat) {
        return this.currentStats[stat];
    };
    FightingStats.prototype.getStaticStat = function (stat) {
        return this.staticStats[stat];
    };
    FightingStats.prototype.setStats = function (to, stat) {
        var container = this.staticStats;
        if (to == "current")
            container = this.currentStats;
        for (var key in stat) {
            if (!(container[key] === undefined))
                container[key] = stat[key];
        }
    };
    FightingStats.prototype.checkAttack = function (time) {
        var result = this.checkTimeToAttack(time);
        return result;
    };
    FightingStats.prototype.checkTimeToAttack = function (time) {
        this.timeToNextAttack += time;
        var timeToNextAttack = this.getCurrentStat("ASPD");
        timeToNextAttack = (1000 / timeToNextAttack) * 100;
        if (this.timeToNextAttack >= timeToNextAttack) {
            this.timeToNextAttack = 0;
            return true;
        }
        else
            return false;
    };
    FightingStats.prototype.updateStatsWithLevelUp = function () {
        var value = this.parent.getComponent("ExperienceStats");
        if (value != null) {
            for (var key in this.levelUpStats) {
                var stat = this.levelUpStats[key] * value.lvl + this.staticStats[key];
                this.currentStats[key] = stat;
            }
        }
        else
            console.log("Error with Level up stats, level = " + value + ". Error in FightingStats/updateStatsWithLevelUp");
    };
    FightingStats.prototype.exportDataToObject = function () {
        var result = { "currentStats": this.currentStats, "staticStats": this.staticStats, "levelUpStats": this.levelUpStats };
        return result;
    };
    FightingStats.prototype.resetStats = function () {
        this.timeToNextAttack = 0;
        this.updateStatsWithLevelUp();
    };
    return FightingStats;
}(Component));
var Name = (function (_super) {
    __extends(Name, _super);
    function Name(parent) {
        return _super.call(this, "Name", parent) || this;
    }
    Name.prototype.init = function (params) {
        for (var key in params) {
            if (key == "name")
                this.name = params[key];
            else if (key == "surname")
                this.surname = params[key];
            else
                console.log("Error, no key with name: " + key + ". Error in Name/init.");
        }
    };
    Name.prototype.getFullName = function () {
        return this.name + " " + this.surname;
    };
    Name.prototype.exportDataToObject = function () {
        var fullName = this.getFullName();
        var result = { "name": this.name, "surname": this.surname, "fullname": fullName };
        return result;
    };
    return Name;
}(Component));
var AgeStats = (function (_super) {
    __extends(AgeStats, _super);
    function AgeStats(parent) {
        var _this = _super.call(this, "AgeStats", parent) || this;
        _this.time = 0;
        return _this;
    }
    AgeStats.prototype.init = function (params) {
        for (var key in params) {
            if (key == "age" || key == "month" || key == "days")
                this[key] = params[key];
        }
    };
    AgeStats.prototype.getFullTime = function () {
        var string = this.age + " age, " + this.month + " month, " + this.day + " days.";
        return string;
    };
    AgeStats.prototype.update = function (time) {
        this.time += time;
    };
    AgeStats.prototype.exportDataToObject = function () {
        var result = { "age": this.age, "month": this.month, "day": this.day, "time": this.time };
        return result;
    };
    return AgeStats;
}(Component));
var Type = (function (_super) {
    __extends(Type, _super);
    function Type(paprent) {
        return _super.call(this, "Type", parent) || this;
    }
    Type.prototype.init = function (params) {
        for (var key in params) {
            if (key == "sex" || key == "race")
                this[key] = params[key];
        }
    };
    Type.prototype.exportDataToObject = function () {
        var result = { "sex": this.sex, "race": this.race };
        return result;
    };
    return Type;
}(Component));
var ExperienceStats = (function (_super) {
    __extends(ExperienceStats, _super);
    function ExperienceStats(parent) {
        var _this = _super.call(this, "ExperienceStats", parent) || this;
        _this.exp = 0;
        _this.lvl = 1;
        _this.bounty = 0;
        _this.isLevelUpped = false;
        return _this;
    }
    ExperienceStats.prototype.init = function (params) {
        for (var key in params) {
            if (key == "exp")
                this.exp = params[key];
            else if (key == "lvl")
                this.lvl = params[key];
            else if (key == "bounty")
                this.bounty = params[key];
        }
        this.updateComponent();
    };
    ExperienceStats.prototype.updateExpToNextLvl = function () {
        this.expToNextLvl = (this.lvl - 1) * 25 + this.lvl * 25;
    };
    ExperienceStats.prototype.gainExperience = function (value) {
        if (this.lvl == 100)
            return;
        this.exp += value;
        if (this.exp >= this.expToNextLvl) {
            this.lvl++;
            if (this.lvl < 100) {
                this.exp -= this.expToNextLvl;
                this.updateComponent();
            }
            else {
                this.exp = this.expToNextLvl;
                this.updateBounty();
                this.updateFightingStats();
            }
            this.isLevelUpped = true;
        }
    };
    ExperienceStats.prototype.exportDataToObject = function () {
        var result = { "exp": this.exp, "lvl": this.lvl, "expToNextLvl": this.expToNextLvl, "bounty": this.bounty };
        return result;
    };
    ExperienceStats.prototype.updateBounty = function () {
        this.bounty *= this.lvl;
    };
    ExperienceStats.prototype.updateFightingStats = function () {
        var component = this.parent.getComponent("FightingStats");
        if (component != null)
            component.updateStatsWithLevelUp();
    };
    ExperienceStats.prototype.updateComponent = function () {
        this.updateExpToNextLvl();
        this.updateBounty();
        this.updateFightingStats();
    };
    return ExperienceStats;
}(Component));
