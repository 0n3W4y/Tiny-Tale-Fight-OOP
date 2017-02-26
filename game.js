var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game = (function () {
    function Game(fps) {
        this.fps = fps;
    }
    Game.prototype.init = function (creaturesData, humanoidsData) {
        this.commonTick = new CommonTick(this, this.fps);
        this.entityRoot = new EntityRoot(this);
        this.entityRoot.init(creaturesData, humanoidsData);
        this.battleRoot = new BattleRoot(this);
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
        this.battleRoot.update(delta);
    };
    return Game;
}());
var BattleRoot = (function () {
    function BattleRoot(parent) {
        this.parent = parent;
        this.isFighting = false;
        this.isFightEnd = true;
    }
    BattleRoot.prototype.addPlayersToFight = function (team1, team2) {
        this.teamOne = team1;
        this.teamTwo = team2;
    };
    BattleRoot.prototype.beginFight = function () {
        this.isFighting = true;
        this.isFightEnd = false;
    };
    BattleRoot.prototype.stopFight = function () {
        this.isFighting = false;
    };
    BattleRoot.prototype.fight = function (delta) {
        var p1Attack = this.teamOne.getComponent("FightingStats");
        var p2Attack = this.teamTwo.getComponent("FightingStats");
        if (p1Attack.checkAttack(delta))
            this.attack(this.teamOne, this.teamTwo);
        if (p2Attack.checkAttack(delta))
            this.attack(this.teamTwo, this.teamOne);
        if (this.isFightEnd)
            this.isFighting = false;
    };
    BattleRoot.prototype.attack = function (player, target) {
        var targetFightStats = target.getComponent("FightingStats");
        var targetDefense = targetFightStats.getCurrentStat("END");
        var targetChanceToEvade = targetFightStats.getCurrentStat("AGI") / 100;
        var randomNum = Math.random();
        if (targetChanceToEvade >= randomNum) {
            console.log(target.getComponent("Name").name + " dodge the attack!");
            return;
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
            console.log(player.getComponent("Name").name + " attacking " + target.getComponent("Name").name + " on " + damage + "; Attack: " + playerDamage + "; TargetDefense: " + targetDefense);
        }
        else {
            console.log(player.getComponent("Name").name + " attacking " + target.getComponent("Name").name + ", but can't avoid the defense");
        }
        if (hp <= 0) {
            console.log(target.getComponent("Name").name + " - Dead!");
            this.isFightEnd = true;
            ;
        }
        console.log(target.getComponent("Name").name + " now have " + hp + " HP");
    };
    BattleRoot.prototype.update = function (delta) {
        if (this.isFighting) {
            this.fight(delta);
        }
    };
    return BattleRoot;
}());
var EntityRoot = (function () {
    function EntityRoot(parent) {
        this.entities = new Array();
        this.parent = parent;
    }
    EntityRoot.prototype.init = function (creaturesData, humanoidsData) {
        this.entityParametersGenerator = new EntityParametersGenerator(creaturesData, humanoidsData);
    };
    EntityRoot.prototype.generateEntity = function (type) {
        var entity = this.createEntity("Mob");
        var params = this.entityParametersGenerator.generate(type);
        entity.createComponentsWithParams(params);
        return entity;
    };
    EntityRoot.prototype.createEntity = function (type) {
        var id = this.createId();
        var type;
        if (type == "Player")
            type = "Player";
        else if (type == "Mob")
            type = "Mob";
        var entity = new Entity(id, type);
        this.entities.push(entity);
        return entity;
    };
    EntityRoot.prototype.getListofEntites = function () {
        return this.entities;
    };
    EntityRoot.prototype.createId = function () {
        return "0";
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
        if (type == "Humaniod") {
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
                    var rnum = Math.floor(Math.random() * container.length);
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
        var month = 1;
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
                    if (typeof container[key] === "number")
                        lvlup[newKey] = container[key];
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
        var lvl = 1;
        var exp = 0;
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
            else
                console.log("Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateExperienceStats.");
        }
        var result = { "lvl": lvl, "exp": exp };
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
                component.init(params[key]);
                this.addComponent(component);
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
        var level = this.parent.getComponent("ExperienceStats").lvl;
        if (level != null) {
            for (var key in this.levelUpStats) {
                var stat = this.levelUpStats[key] * level + this.staticStats[key];
                this.currentStats[key] = stat;
            }
        }
        else
            console.log("Error with Level up stats, level = " + level + ". Error in FightingStats/updateStatsWithLevelUp");
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
    return Name;
}(Component));
var AgeStats = (function (_super) {
    __extends(AgeStats, _super);
    function AgeStats(parent) {
        return _super.call(this, "AgeStats", parent) || this;
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
    return Type;
}(Component));
var ExperienceStats = (function (_super) {
    __extends(ExperienceStats, _super);
    function ExperienceStats(parent) {
        var _this = _super.call(this, "ExperienceStats", parent) || this;
        _this.exp = 0;
        _this.lvl = 1;
        _this.updateExpToNextLvl();
        _this.isLevelUpped = false;
        return _this;
    }
    ExperienceStats.prototype.init = function (params) {
        for (var key in params) {
            if (key == "exp")
                this.exp = params[key];
            else if (key == "lvl")
                this.lvl = params[key];
        }
    };
    ExperienceStats.prototype.updateExpToNextLvl = function () {
        this.expToNextLvl = (this.lvl - 1) * 25 + this.lvl * 25;
    };
    ExperienceStats.prototype.gainExperiance = function (value) {
        this.exp += value;
        if (this.exp >= this.expToNextLvl) {
            this.lvl++;
            this.exp -= this.expToNextLvl;
            this.updateExpToNextLvl();
            this.isLevelUpped = true;
        }
    };
    return ExperienceStats;
}(Component));
var creaturesData = {
    "Scorpion": {
        Name: { name: ["Raged", "Bloody", "Sand", "Some"], surname: "Scorpion" },
        Type: { sex: ["Man", "Woman"], race: "Scorpicores" },
        AgeStats: { age: [10, 100], month: [1, 12], day: [1, 30] },
        FightingStats: {
            stats: { HP: [30, 60], SP: [10, 40], STR: [8, 16], AGI: [4, 8], END: [4, 6], INT: [4, 5], ASPD: [100, 100] },
            lvlup: { HP: [5, 6], SP: [1, 2], STR: [1, 2], AGI: [1, 2], END: [1, 2], INT: [1, 2], ASPD: [0, 0] }
        },
        ExperienceStats: { exp: [10, 12] } // [ min, max ];
    }
};
var humanoidsData = {
    "Human": {
        Name: {
            name: "Ostin",
            surname: "Powers"
        },
        Type: {
            sex: ["Man", "Woman"],
            race: "Human"
        },
        AgeStats: {
            age: [16, 100],
            month: [1, 12],
            day: [1, 30]
        },
        FightingStats: {
            stats: { HP: 50, SP: 50, STR: 10, AGI: 10, END: 10, INT: 10, ASPD: 50 },
            lvlUp: { HP: 5, SP: 5, STR: 1, AGI: 1, END: 1, INT: 1, ASPD: 0 }
        },
        ExperienceStats: {
            exp: [8, 10]
        }
    },
    "Elf": { HP: 45,
        SP: 55,
        STR: 9,
        AGI: 11,
        END: 9,
        INT: 11,
        ASPD: 100
    },
    "Dwarf": { HP: 0,
        SP: 0,
        STR: 0,
        AGI: 0,
        END: 0,
        INT: 0,
        ASPD: 0
    },
    "Troll": { HP: 0,
        SP: 0,
        STR: 0,
        AGI: 0,
        END: 0,
        INT: 0,
        ASPD: 0
    },
    "Gnome": { HP: 0,
        SP: 0,
        STR: 0,
        AGI: 0,
        END: 0,
        INT: 0,
        ASPD: 0
    },
    "Orc": { HP: 0,
        SP: 0,
        STR: 0,
        AGI: 0,
        END: 0,
        INT: 0,
        ASPD: 0
    },
    "Goblin": { HP: 0,
        SP: 0,
        STR: 0,
        AGI: 0,
        END: 0,
        INT: 0,
        ASPD: 0
    },
    "Udead": { HP: 0,
        SP: 0,
        STR: 0,
        AGI: 0,
        END: 0,
        INT: 0,
        ASPD: 0
    },
    "Ogre": { HP: 0,
        SP: 0,
        STR: 0,
        AGI: 0,
        END: 0,
        INT: 0,
        ASPD: 0
    }
};
