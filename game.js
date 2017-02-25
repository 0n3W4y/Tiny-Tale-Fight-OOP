var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game = (function () {
    function Game(fps) {
        this.fps = fps;
    }
    Game.prototype.init = function () {
        this.commonTick = new CommonTick(this, this.fps);
        this.entityRoot = new EntityRoot(this);
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
        hp -= damage;
        targetFightStats.setStats("current", { "HP": hp });
        console.log(player.getComponent("Name").name + " attacking " + target.getComponent("Name").name + " on " + damage);
        if (hp <= 0) {
            console.log(target.getComponent("Name").name + " - Dead!");
            this.isFightEnd = true;
            ;
        }
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
        else if (name == "Stats")
            component = new Stats(this);
        else if (name == "Type")
            component = new Type(this);
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
        return _this;
    }
    FightingStats.prototype.init = function (params) {
        for (var key in params) {
            if (!(this.currentStats[key] === undefined)) {
                this.currentStats[key] = params[key];
                this.staticStats[key] = params[key];
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
        timeToNextAttack = 1000 / timeToNextAttack;
        if (this.timeToNextAttack >= timeToNextAttack) {
            this.timeToNextAttack = 0;
            return true;
        }
        else
            return false;
    };
    return FightingStats;
}(Component));
var Name = (function (_super) {
    __extends(Name, _super);
    function Name(parent) {
        return _super.call(this, "Name", parent) || this;
    }
    Name.prototype.init = function (params) {
        this.generateName(params[0]);
        this.generateSurname(params[1]);
    };
    Name.prototype.generateName = function (namesArray) {
        this.name = namesArray;
    };
    Name.prototype.generateSurname = function (surnamesArray) {
        this.surname = surnamesArray;
    };
    Name.prototype.getFullName = function () {
        return this.name + " " + this.surname;
    };
    return Name;
}(Component));
var Stats = (function (_super) {
    __extends(Stats, _super);
    function Stats(parent) {
        return _super.call(this, "Stats", parent) || this;
    }
    Stats.prototype.init = function (params) {
        for (var key in params) {
            if (key == "age" || key == "month" || key == "days")
                this[key] = params[key];
        }
    };
    Stats.prototype.getFullTime = function () {
        var string = this.age + " age, " + this.month + " month, " + this.day + " days.";
        return string;
    };
    return Stats;
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
