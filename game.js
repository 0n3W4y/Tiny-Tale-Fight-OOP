var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game = (function () {
    function Game(fps) {
        this.fps = fps;
        this.preStartDone = false;
    }
    Game.prototype.init = function (creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData, leftBlock, rightBlock, journal, helperBlock, enemylist, orbsBlock) {
        this.commonTick = new CommonTick(this, this.fps);
        this.entityRoot = new EntityRoot(this, creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData);
        this.battle = new Battle(this);
        this.userInterface = new UserInterface(this, leftBlock, rightBlock, journal, helperBlock, enemylist, orbsBlock);
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
        if (this.preStartDone) {
            if (!this.battle.isFighting) {
                this.askForNextBattle();
            }
        }
    };
    Game.prototype.generatePlayer = function () {
        var player = this.entityRoot.generateEntity("Player", null, null, { Name: { name: "Ostin", surname: "Powers" } });
        this.battle.addPlayerToFight(1, player);
        var fullName = player.getComponent("Name").getFullName();
        var playerClass = player.getComponent("Type")["class"];
        var string = fullName + " created! Class: " + playerClass;
        this.userInterface.journal.addLineToJournal(string);
        this.player = player;
    };
    Game.prototype.generateMob = function () {
        //var entityList = this.entityRoot.getListOfEntities();
        var lvl = 1;
        lvl = this.player.getComponent("ExperienceStats").lvl;
        var min = lvl - 2;
        var max = lvl + 2;
        if (min < 1)
            min = 1;
        if (max > 100)
            max = 100;
        var mobLevel = Math.floor(Math.random() * (max - min + 1) + min);
        var mob = this.entityRoot.generateEntity("Mob", null, null, null);
        mob.getComponent("ExperienceStats").lvl = mobLevel;
        mob.getComponent("ExperienceStats").updateComponent();
        this.battle.addPlayerToFight(2, mob);
    };
    Game.prototype.generateHelper = function () {
        var helper = this.entityRoot.generateEntity("Helper", null, null, { Name: { name: "Super", surname: "Helper" } });
        this.battle.addPlayerToFight(1, helper);
        var fullName = helper.getComponent("Name").getFullName();
        var playerClass = helper.getComponent("Type")["class"];
        var string = fullName + " created! Class: " + playerClass;
        this.userInterface.journal.addLineToJournal(string);
        this.helper = helper;
    };
    //must be deleted!!!
    Game.prototype.preStart = function () {
        //TODO: create player - > generate Mobs -> start fight;
        this.generatePlayer();
        this.generateHelper();
        var playerLvl = this.player.getComponent("ExperienceStats").lvl;
        var max = Math.round(4 + playerLvl / 5);
        var min = Math.round(1 + playerLvl / 5);
        this.generateSomeMobs(min, max);
        this.preStartDone = true;
        this.battle.startFight();
    };
    Game.prototype.reset = function () {
        location.reload(true);
    };
    Game.prototype.askForNextBattle = function () {
        if (this.player.getComponent("FightingStats").killedBy != null)
            this.generatePlayer();
        this.battle.addPlayerToFight(1, this.player);
        if (this.helper.getComponent("FightingStats").killedBy != null)
            this.generateHelper();
        this.battle.addPlayerToFight(1, this.helper);
        var playerLvl = this.player.getComponent("ExperienceStats").lvl;
        var max = Math.round(4 + playerLvl / 5);
        var min = Math.round(1 + playerLvl / 5);
        this.generateSomeMobs(min, max);
        this.preStartDone = true;
        this.battle.startFight();
    };
    Game.prototype.generateSomeMobs = function (min, max) {
        var randomNum = Math.floor(min + Math.random() * (max - min + 1));
        for (var i = 0; i < randomNum; i++) {
            this.generateMob();
        }
    };
    return Game;
}());
var Journal = (function () {
    function Journal(block) {
        this.jorunalBlock = document.getElementById(block);
    }
    Journal.prototype.init = function () {
    };
    Journal.prototype.addLineToJournal = function (string) {
        var container = this.jorunalBlock;
        var li = document.createElement("li");
        li.innerHTML = string;
        container.insertBefore(li, container.firstChild);
    };
    Journal.prototype.newContactManyTargets = function (number) {
        var string = number + " creatures are coming!";
        this.addLineToJournal(string);
    };
    Journal.prototype.newContactSingleTarget = function (target, hp, pdamage, mdamage) {
        var string = "<b>" + target + "</b>" + " ( HP: " + "<b>" + hp + "</b>" + ", Pdmg: " + '<font color="red"><b>' + pdamage + "</b></font>" + ", Mdmg: " + '<font color="blue"><b>' + mdamage + "</b></font>" + " ) attacking!";
        this.addLineToJournal(string);
    };
    Journal.prototype.newContact = function (player) {
        var string = "<b>" + player + "</b>" + " found new troubles. Prepare to fight!";
        this.addLineToJournal(string);
    };
    Journal.prototype.hit = function (player, target, damage, pdamage, mdamage) {
        var string = "<b>" + player + "</b>" + " is attacking " + "<b>" + target + "</b>" + " hitted on " + '<font color="purple"><b>' + Math.round(damage) + "</b></font>" + " ( "
            + '<font color="red"><b>' + Math.round(pdamage) + "</b></font>" + " + " + '<font color="blue"><b>' + Math.round(mdamage) + "</b></font>" + " ).";
        this.addLineToJournal(string);
    };
    Journal.prototype.crit = function (player, target, damage, pdamage, mdamage) {
        var string = "<b>" + player + "</b>" + " is attacking " + "<b>" + target + "</b>" + " critically hitted on " + '<font color="purple" style="font-size:24px;"><b>' + Math.round(damage) + "</b></font>" + " ( "
            + '<font color="red" style="font-size:24px;"><b>' + Math.round(pdamage) + "</b></font>" + " + " + '<font color="blue" style="font-size:24px;"><b>' + Math.round(mdamage) + "</b></font>" + " ).";
        this.addLineToJournal(string);
    };
    Journal.prototype.evade = function (player, target, chanse) {
        var string = "<b>" + target + "</b>" + " dodge the attack with chanse: " + "<b>" + chanse + "</b>.";
        this.addLineToJournal(string);
    };
    Journal.prototype.block = function (target, blocked, chanse) {
        var string = "<b>" + target + "</b>" + " blocked on " + '<font color="purple">' + blocked + "</font>" + "damage with " + chanse + "% chanse.";
        this.addLineToJournal(string);
    };
    Journal.prototype.kill = function (player, target) {
        var string = "<b>" + target + "</b>" + " killed by " + "<b>" + player + "</b>.";
        this.addLineToJournal(string);
    };
    Journal.prototype.gainExp = function (player, exp) {
        var string = "<b>" + player + "</b>" + " obtain " + exp + " experience.";
        this.addLineToJournal(string);
    };
    Journal.prototype.win = function (player) {
        var string = "Congratulation! " + "<b>" + player + "</b>" + " WIN this battle!";
        this.addLineToJournal(string);
    };
    Journal.prototype.lose = function (player) {
        var string = "So sad! " + "<b>" + player + "</b>" + " LOSE this battle!";
        this.addLineToJournal(string);
    };
    return Journal;
}());
var UserInterface = (function () {
    function UserInterface(parent, leftBlock, rightBlock, journal, helperBlock, enemyList, orbsBlock) {
        this.parent = parent;
        this.init(leftBlock, rightBlock, journal, helperBlock, enemyList, orbsBlock);
    }
    UserInterface.prototype.init = function (leftBlock, rightBlock, journal, helperBlock, enemyList, orbsBlock) {
        this.leftCharacterBlock = document.getElementById(leftBlock);
        this.rightCharacterBlock = document.getElementById(rightBlock);
        this.leftHelperBlock = document.getElementById(helperBlock);
        this.enemyList = document.getElementById(enemyList);
        this.journal = new Journal(journal);
        this.orbsBlock = document.getElementById(orbsBlock);
        //this.journal.init();
    };
    UserInterface.prototype.fillLeftCharacterBlock = function (entity) {
        //data =  { name:"full name", hp:100, sp:100, exp:[0,100], lvl: str:1, end:1, int:1 };
        var data = this.parent.entityRoot.collectDataFromEntity(entity);
        var container = this.leftCharacterBlock;
        var nameContainer = data["Name"];
        var fullName = nameContainer["fullname"];
        var fightingStatsContainer = data["FightingStats"];
        var currentStatsContainer = fightingStatsContainer["currentStats"];
        var hp = Math.round(currentStatsContainer["HP"]);
        var str = currentStatsContainer["STR"];
        var end = currentStatsContainer["AGI"];
        var int = currentStatsContainer["INT"];
        var staticStatsContainer = fightingStatsContainer["staticStats"];
        var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
        var lvlUpClassStatsContainer = fightingStatsContainer["levelUpClassStats"];
        var experienceStats = data["ExperienceStats"];
        var exp = experienceStats["exp"];
        var expToNextLvl = experienceStats["expToNextLvl"];
        var lvl = experienceStats["lvl"];
        var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"] * lvl;
        container.getElementsByClassName("name")[0].innerHTML = fullName;
        container.getElementsByClassName("red")[0].innerHTML = Math.round(hp) + "/" + staticHp;
        var hpBar = Math.round((hp / staticHp) * 100);
        if (hpBar < 0)
            hpBar = 0;
        container.getElementsByClassName("red")[0].style.width = hpBar + "%";
        container.getElementsByClassName("violet")[0].innerHTML = exp + "/" + expToNextLvl;
        var percent = Math.floor((exp / expToNextLvl) * 100);
        var stringPercent = percent + "%";
        container.getElementsByClassName("violet")[0].style.width = stringPercent;
        container.getElementsByClassName("level")[0].innerHTML = lvl;
    };
    UserInterface.prototype.fillRightCharacterBlock = function (entity) {
        var data = this.parent.entityRoot.collectDataFromEntity(entity);
        var container = this.rightCharacterBlock;
        var nameContainer = data["Name"];
        var fullName = nameContainer["fullname"];
        var fightingStatsContainer = data["FightingStats"];
        var currentStatsContainer = fightingStatsContainer["currentStats"];
        var hp = currentStatsContainer["HP"];
        var str = currentStatsContainer["STR"];
        var int = currentStatsContainer["INT"];
        var staticStatsContainer = fightingStatsContainer["staticStats"];
        var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
        var experienceStats = data["ExperienceStats"];
        var bounty = experienceStats["bounty"];
        var lvl = experienceStats["lvl"];
        var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"] * lvl;
        container.getElementsByClassName("name")[0].innerHTML = fullName;
        container.getElementsByClassName("red")[0].innerHTML = Math.round(hp) + "/" + staticHp;
        var hpBar = Math.round((hp / staticHp) * 100);
        if (hpBar < 0)
            hpBar = 0;
        container.getElementsByClassName("red")[0].style.width = hpBar + "%";
        container.getElementsByClassName("level")[0].innerHTML = lvl;
    };
    UserInterface.prototype.fillLeftHelperBlock = function (entity) {
        var data = this.parent.entityRoot.collectDataFromEntity(entity);
        var container = this.leftHelperBlock;
        var fightingStatsContainer = data["FightingStats"];
        var currentStatsContainer = fightingStatsContainer["currentStats"];
        var hp = Math.round(currentStatsContainer["HP"]);
        var str = currentStatsContainer["STR"];
        var end = currentStatsContainer["AGI"];
        var int = currentStatsContainer["INT"];
        var staticStatsContainer = fightingStatsContainer["staticStats"];
        var lvlUpStatsContainer = fightingStatsContainer["levelUpStats"];
        var lvlUpClassStatsContainer = fightingStatsContainer["levelUpClassStats"];
        var experienceStats = data["ExperienceStats"];
        var exp = experienceStats["exp"];
        var expToNextLvl = experienceStats["expToNextLvl"];
        var lvl = experienceStats["lvl"];
        var staticHp = staticStatsContainer["HP"] + lvlUpStatsContainer["HP"] * lvl;
        container.getElementsByClassName("red")[0].innerHTML = Math.round(hp) + "/" + staticHp;
        var hpBar = Math.round((hp / staticHp) * 100);
        if (hpBar < 0)
            hpBar = 0;
        container.getElementsByClassName("red")[0].style.width = hpBar + "%";
        container.getElementsByClassName("violet")[0].innerHTML = exp + "/" + expToNextLvl;
        var percent = Math.floor((exp / expToNextLvl) * 100);
        var stringPercent = percent + "%";
        container.getElementsByClassName("violet")[0].style.width = stringPercent;
        container.getElementsByClassName("level")[0].innerHTML = lvl;
    };
    UserInterface.prototype.fillBlock = function (entity) {
        if (entity.type == "Player")
            this.fillLeftCharacterBlock(entity);
        else if (entity.type == "Mob")
            this.fillRightCharacterBlock(entity);
        else if (entity.type == "Helper")
            this.fillLeftHelperBlock(entity);
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
    UserInterface.prototype.removeFromEnemyList = function (index) {
        var child = document.getElementById(index);
        var container = this.enemyList;
        container.removeChild(child);
    };
    UserInterface.prototype.addMobFromEnemyListToMainBlock = function (mob, index) {
        this.removeFromEnemyList(index);
        this.fillBlock(mob);
    };
    UserInterface.prototype.addMobFromMainBlockToEnemyList = function (mob, index) {
        this.addToEnemyList(mob, index);
        this.clearRightBlock();
    };
    UserInterface.prototype.addToEnemyList = function (entity, id) {
        var race = entity.getComponent("Type").race; // for image ( avatar );
        var level = entity.getComponent("ExperienceStats").lvl;
        var fightingComponent = entity.getComponent("FightingStats");
        var currentHPStat = Math.round(fightingComponent.getCurrentStat("HP"));
        var staticHPStat = fightingComponent.getStaticStat("HP");
        var lvlUpHPStat = fightingComponent.getLevelUpStat("HP");
        var staticHP = staticHPStat + lvlUpHPStat * level;
        var hpWidth = Math.round((currentHPStat / staticHP) * 100);
        var li = document.createElement("li");
        li.id = "" + id;
        var enemyBlock = document.createElement("div");
        enemyBlock.id = "enemy-block";
        var divAvatar = document.createElement("div");
        divAvatar.id = "avatar-small";
        //divAvatar.style.background-image = 
        var divLevel = document.createElement("div");
        divLevel.className = "level";
        divLevel.innerHTML = level;
        var divBar = document.createElement("div");
        divBar.className = "bar-li";
        var spanBar = document.createElement("span");
        spanBar.className = "red";
        spanBar.innerHTML = currentHPStat + "/" + staticHP;
        spanBar.style.width = hpWidth + "%";
        li.appendChild(enemyBlock);
        enemyBlock.appendChild(divAvatar);
        divAvatar.appendChild(divLevel);
        enemyBlock.appendChild(divBar);
        divBar.appendChild(spanBar);
        var container = this.enemyList;
        container.appendChild(li);
        //create tooltip;
    };
    UserInterface.prototype.clearBlock = function (blockName) {
        if (blockName == "Left")
            this.clearLeftBlock();
        else if (blockName == "Right")
            this.clearRightBlock();
        else if (blockName == "Helper")
            this.clearLeftHelperBlock();
        else if (blockName == "EnemyList")
            this.clearEnemyList();
        else
            console.log("Error, block name : " + blockName + " not found. Error in UserInterface/clearBlock.");
    };
    UserInterface.prototype.clearAllBlocks = function () {
        this.clearLeftBlock();
        this.clearRightBlock();
        this.clearLeftHelperBlock();
        this.clearEnemyList();
    };
    UserInterface.prototype.clearRightBlock = function () {
        var container = this.rightCharacterBlock;
        container.getElementsByClassName("name")[0].innerHTML = "";
        container.getElementsByClassName("red")[0].innerHTML = "0/0";
        container.getElementsByClassName("red")[0].style.width = "0%";
        container.getElementsByClassName("level")[0].innerHTML = "0";
    };
    UserInterface.prototype.clearLeftBlock = function () {
        var container = this.leftCharacterBlock;
        container.getElementsByClassName("name")[0].innerHTML = "";
        container.getElementsByClassName("red")[0].innerHTML = "0/0";
        container.getElementsByClassName("red")[0].style.width = "0%";
        container.getElementsByClassName("violet")[0].innerHTML = "0/0";
        container.getElementsByClassName("violet")[0].style.width = "0%";
        container.getElementsByClassName("level")[0].innerHTML = "0";
    };
    UserInterface.prototype.clearLeftHelperBlock = function () {
        var container = this.leftHelperBlock;
        container.getElementsByClassName("red")[0].innerHTML = "0/0";
        container.getElementsByClassName("red")[0].style.width = "0%";
        container.getElementsByClassName("violet")[0].innerHTML = "0/0";
        container.getElementsByClassName("violet")[0].style.width = "0%";
        container.getElementsByClassName("level")[0].innerHTML = "0";
    };
    UserInterface.prototype.clearEnemyList = function () {
        var container = this.enemyList;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    };
    UserInterface.prototype.updateUIForEntity = function (entity, index) {
        if (entity.type == "Player" || entity.type == "Helper")
            this.fillBlock(entity);
        else if (entity.type == "Mob") {
            var result = this.checkMobInEnemyList(index);
            if (result != null)
                this.updateMobInEnemyList(entity, result);
            else
                this.fillBlock(entity);
        }
    };
    UserInterface.prototype.checkMobInEnemyList = function (index) {
        var container = this.enemyList;
        var list = container.getElementsByTagName("li");
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == index)
                return list[i];
        }
        return null;
    };
    UserInterface.prototype.updateMobInEnemyList = function (entity, container) {
        var currentHPStat = Math.round(entity.getComponent("FightingStats").getCurrentStat("HP"));
        var lvl = entity.getComponent("ExperienceStats").lvl;
        var staticHp = entity.getComponent("FightingStats").getStaticStat("HP");
        var lvlUpHp = entity.getComponent("FightingStats").getLevelUpStat("HP");
        staticHp = staticHp + lvlUpHp * lvl;
        var hpWidth = Math.round((currentHPStat / staticHp) * 100);
        if (hpWidth < 0)
            hpWidth = 0;
        var hpBar = container.getElementsByClassName("red")[0];
        hpBar.innerHTML = currentHPStat + "/" + staticHp;
        hpBar.style.width = hpWidth + "%";
    };
    UserInterface.prototype.addOrbToBlock = function (id) {
        var container = this.orbsBlock;
        var child = document.createElement("li");
        child.id = id;
        container.appendChild(child);
    };
    UserInterface.prototype.removeOrbFromBlock = function (id) {
        var container = this.orbsBlock;
        var orb;
        var list = container.getElementsByTagName("li");
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                orb = list[i];
                list.removeChild(list[i]);
                break;
            }
        }
        return orb;
    };
    UserInterface.prototype.createToolTip = function (entity) {
    };
    UserInterface.prototype.updateTollTip = function (entity) {
    };
    UserInterface.prototype.updateInterface = function () {
    };
    return UserInterface;
}());
var Battle = (function () {
    function Battle(parent) {
        this.parent = parent;
        this.isFighting = false;
        this.teamOne = new Array();
        this.teamTwo = new Array();
        this.teamOneAlive = new Array();
        this.teamTwoAlive = new Array();
        this.teamOneReady = new Array();
        this.teamTwoReady = new Array();
        this.isFightPrepare = false;
        this.isBattleEnd = false;
        this.entitiesToUpdateInterface = new Array();
        this.whoWin = null;
        this.currentOrb = null;
    }
    Battle.prototype.update = function (delta) {
        if (this.isFighting) {
            this.fight(delta);
        }
    };
    Battle.prototype.addPlayerToFight = function (team, entity) {
        if (team == 1)
            this.teamOne.push(entity);
        else if (team == 2) {
            var id = this.teamTwo.length;
            this.parent.userInterface.addToEnemyList(entity, id);
            this.teamTwo.push(entity);
        }
        else
            console.log("Error in add entity in team, team = " + team + " not found. Error in Battle/addPlayerToFight");
    };
    Battle.prototype.fight = function (delta) {
        if (!this.isFightPrepare)
            this.prepareFight(delta);
        this.beginRound(delta);
        this.battle(delta);
        this.endRound(delta);
        if (this.isBattleEnd) {
            this.battleEnd();
        }
    };
    Battle.prototype.prepareFight = function (time) {
        var p1;
        var h1;
        for (var i = 0; i < this.teamOne.length; i++) {
            var actor = this.teamOne[i];
            if (actor.type == "Player")
                p1 = actor; // only 1 player available rght now;
            else if (actor.type == "Helper")
                h1 = actor; // only1  helper available right now;
        }
        var fullNamePlayer = p1.getComponent("Name").getFullName();
        this.parent.userInterface.fillBlock(p1);
        if (h1 != null)
            this.parent.userInterface.fillBlock(h1);
        var p2 = this.teamTwo[0];
        var fullNameEnemy = p2.getComponent("Name").getFullName();
        var enemyHp = p2.getComponent("FightingStats").getCurrentStat("HP");
        var pdamage = p2.getComponent("FightingStats").getCurrentStat("STR");
        var mdamage = p2.getComponent("FightingStats").getCurrentStat("INT");
        this.parent.userInterface.removeFromEnemyList(0);
        this.parent.userInterface.fillBlock(p2);
        this.parent.userInterface.journal.newContact(fullNamePlayer);
        if (this.teamTwo.length > 1) {
            this.parent.userInterface.journal.newContactManyTargets(this.teamTwo.length);
        }
        else
            this.parent.userInterface.journal.newContactSingleTarget(fullNameEnemy, enemyHp, pdamage, mdamage);
        //заполняем живых creature в массивы по командам.
        for (var j = 0; j < this.teamOne.length; j++) {
            this.teamOneAlive.push(this.teamOne[j]);
        }
        for (var i = 0; i < this.teamTwo.length; i++) {
            p2 = this.teamTwo[i];
            this.teamTwoAlive.push(p2);
        }
        this.isFightPrepare = true;
    };
    Battle.prototype.beginRound = function (time) {
        var p1 = null;
        var p2 = null;
        this.entitiesToUpdateInterface.length = 0;
        //обнуляем массивы, кто может атаковать.
        this.teamOneReady.length = 0;
        this.teamTwoReady.length = 0;
        // заполняем готовых атаковать.
        for (var j = 0; j < this.teamOneAlive.length; j++) {
            p1 = this.teamOneAlive[j];
            var p1Component = p1.getComponent("FightingStats");
            if (p1Component.checkAttack(time))
                this.teamOneReady.push(p1);
        }
        //  заполняем готовых атаковать.
        for (var i = 0; i < this.teamTwoAlive.length; i++) {
            p2 = this.teamTwoAlive[i];
            var p2Component = p2.getComponent("FightingStats");
            if (p2Component.checkAttack(time))
                this.teamTwoReady.push(p2);
        }
        /*
        получить информацию о выборе "ОРба" игроком.
        просчитать, какая будет атака, АОЕ или сингл,
        просчитать будет ли дополнительыне эффекты - лечение, замедление, ошеломление,  и прочие эффекты,
        возможно подключить ИИ, выбрать цели, либо сделать все  рандомно.
        */
    };
    Battle.prototype.battle = function (time) {
        var p1 = null;
        var p2 = null;
        /*
            пока очередность кто ходит первый будет определять Math.random();
            планирую сделать *инициативу* которая будет определять очередность хода каждого персонажа.
        */
        var queueArray = new Array();
        for (var i = 0; i < this.teamOneReady.length; i++) {
            queueArray.push(this.teamOneReady[i]);
        }
        for (var j = 0; j < this.teamTwoReady.length; j++) {
            queueArray.push(this.teamTwoReady[j]);
        }
        queueArray.sort(function (a, b) { return Math.floor(Math.random() * 3 - 1); });
        for (var k = 0; k < queueArray.length; k++) {
            var p1 = queueArray[k];
            var p2;
            if (p1.type == "Player" || p1.type == "Helper") {
                p2 = this.teamTwoAlive;
            }
            else {
                p2 = this.teamOneAlive;
            }
            this.attack(p1, p2);
        }
    };
    Battle.prototype.attack = function (player, target) {
        var playerName = player.getComponent("Name").getFullName();
        var playerFightStats = player.getComponent("FightingStats");
        var phsysicalPlayerDamage = playerFightStats.getCurrentStat("STR");
        var magicalPlayerDamage = playerFightStats.getCurrentStat("INT");
        // выберем рандомную атаку АОЕ или сингл. 
        // для ИИ рандом останется пока-что.
        var typeOfDamage = Math.floor(Math.random() * 2); //0 , 1;
        var timesToAttack = 1;
        //если атакующий - игрок, сомтрим. выбрал ли он орб для атаки.
        if (player.type == "Player" && this.currentOrb != null) {
        }
        else {
            typeOfDamage = 1;
        }
        if (typeOfDamage == 0)
            timesToAttack = target.length;
        for (var i = 0; i < timesToAttack; i++) {
            var newTarget = target[i];
            if (timesToAttack == 1) {
                if (player.type == "Mob") {
                    var rnum = Math.floor(Math.random() * target.length);
                    newTarget = target[rnum];
                }
            }
            // просчитаем крит. в данный момент, критшанс будет 5%
            var criticalHit = Math.floor(Math.random() * 100); //0 - 99;
            var crit = 0;
            if (criticalHit < 5) {
                phsysicalPlayerDamage *= 2;
                magicalPlayerDamage *= 2;
                crit = 1;
            }
            var targetName = newTarget.getComponent("Name").getFullName();
            var targetFightStats = newTarget.getComponent("FightingStats");
            var targetPhysicsDefense = targetFightStats.getCurrentStat("STR") + targetFightStats.getCurrentStat("PDEF");
            var targetMagicalDefense = targetFightStats.getCurrentStat("INT") + targetFightStats.getCurrentStat("MDEF");
            var targetAgility = targetFightStats.getCurrentStat("AGI");
            var targetDodgeChanse = targetFightStats.getCurrentStat("DDG") + targetAgility;
            var targetBlockChanse = targetFightStats.getCurrentStat("BLK");
            var targetHP = targetFightStats.getCurrentStat("HP");
            var targetChansePercent = targetDodgeChanse / 100;
            var randomNum = Math.floor((Math.random() * 101) * 100); // 0 - 10000;
            if (targetDodgeChanse >= randomNum) {
                this.parent.userInterface.journal.evade(targetName, targetChansePercent);
                return;
            }
            phsysicalPlayerDamage -= phsysicalPlayerDamage * (targetPhysicsDefense / 100) / 100;
            magicalPlayerDamage -= magicalPlayerDamage * (targetMagicalDefense / 100) / 100;
            var totalDamage = phsysicalPlayerDamage + magicalPlayerDamage;
            // вычислить, получилось ли заблокировать атаку
            // и отнять % от блокированного урона из общего урона.
            targetHP -= totalDamage;
            targetFightStats.setStats("current", { "HP": targetHP });
            if (crit == 0)
                this.parent.userInterface.journal.hit(playerName, targetName, totalDamage, phsysicalPlayerDamage, magicalPlayerDamage);
            else
                this.parent.userInterface.journal.crit(playerName, targetName, totalDamage, phsysicalPlayerDamage, magicalPlayerDamage);
            if (targetHP <= 0)
                targetFightStats.killedBy = player;
            //обновляем UI для каждого актера, котоырй был под атакой.
            var index;
            if (newTarget.type == "Mob")
                index = this.teamTwo.indexOf(newTarget);
            else
                index == this.teamOne.indexOf(newTarget);
            this.parent.userInterface.updateUIForEntity(newTarget, index);
        }
    };
    Battle.prototype.endRound = function (time) {
        for (var i = 0; i < this.teamOneAlive.length; i++) {
            var p1 = this.teamOneAlive[i];
            if (p1.getComponent("FightingStats").killedBy != null) {
                if (p1.type == "Player") {
                    this.killPlayer(p1);
                    this.isBattleEnd = true;
                    return; // only 1 player available, so if he dead - fighting is over;
                }
                else {
                    this.killHelper(p1);
                }
            }
        }
        for (var j = 0; j < this.teamTwoAlive.length; j++) {
            var p2 = this.teamTwoAlive[j];
            var p2FightingComponent = p2.getComponent("FightingStats");
            if (p2FightingComponent.killedBy != null)
                this.killMob(p2);
        }
        //update interface or update it in battle.		
        if (this.teamOneAlive.length == 0 || this.teamTwoAlive.length == 0)
            this.isBattleEnd = true;
    };
    Battle.prototype.battleEnd = function () {
        if (this.whoWin == "Player")
            this.playerWin();
        else
            this.playerLose();
        //обнуляем массивы с мобами начисто, складывая их в массив с трупами.;
        for (var i = 0; i < this.teamTwo.length; i++) {
            var entity = this.teamTwo[i];
            this.killEntity(entity);
        }
        this.isFighting = false;
        this.parent.userInterface.journal.addLineToJournal("Battle is end!");
        this.clearBattleGround();
    };
    Battle.prototype.clearBattleGround = function () {
        //обнуляем массив с игроком.
        this.teamOne.length = 0;
        this.teamTwo.length = 0;
        this.isFightPrepare = false;
        //обнуляем массивы с живыми.
        this.teamOneAlive.length = 0;
        this.teamTwoAlive.length = 0;
        this.parent.userInterface.clearAllBlocks();
    };
    Battle.prototype.gainExperience = function (entityArray, value) {
        var players = entityArray.length;
        var bounty = Math.round(value / players);
        if (bounty < 1)
            bounty = 1;
        for (var i = 0; i < players; i++) {
            var entity = entityArray[i];
            entity.getComponent("ExperienceStats").gainExperience(bounty);
            var entityFullname = entity.getComponent("Name").getFullName();
            this.parent.userInterface.journal.gainExp(entityFullname, bounty);
            this.parent.userInterface.updateUIForEntity(entity, 0);
        }
    };
    Battle.prototype.stopFight = function () {
        this.isFighting = false;
    };
    Battle.prototype.startFight = function () {
        this.isFighting = true;
        this.isBattleEnd = false;
    };
    Battle.prototype.checkAliveMobs = function () {
        if (this.teamTwoAlive.length > 0)
            return this.teamTwoAlive[0];
        else
            return null;
    };
    Battle.prototype.playerWin = function () {
        var player;
        var helper;
        for (var i = 0; i < this.teamOneAlive.length; i++) {
            var entity = this.teamOneAlive[i];
            if (entity.type == "Player")
                player = entity;
            else
                helper = entity;
        }
        player.getComponent("FightingStats").resetStats();
        if (helper != null)
            helper.getComponent("FightingStats").resetStats();
        var playerName = player.getComponent("Name").getFullName();
        this.parent.userInterface.journal.win(playerName);
    };
    Battle.prototype.playerLose = function () {
        var player = this.teamOne[0];
        //player.getComponent( "FightingStats" ).resetStats();
        var playerName = player.getComponent("Name").getFullName();
        this.parent.userInterface.journal.lose(playerName);
    };
    Battle.prototype.killEntity = function (entity) {
        this.parent.entityRoot.removeEntity(entity);
    };
    Battle.prototype.killMob = function (mob) {
        var player = mob.getComponent("FightingStats").killedBy;
        var playerName = player.getComponent("Name").getFullName();
        var bounty = mob.getComponent("ExperienceStats").bounty;
        var mobName = mob.getComponent("Name").getFullName();
        this.parent.userInterface.journal.kill(playerName, mobName);
        var index = this.teamTwoAlive.indexOf(mob);
        var mainIndex = this.teamTwo.indexOf(mob);
        this.teamTwoAlive.splice(index, 1);
        if (index == 0) {
            this.parent.userInterface.addMobFromMainBlockToEnemyList(mob, mainIndex);
            var newMob = this.checkAliveMobs();
            if (newMob == null) {
                this.isBattleEnd = true;
                this.whoWin = "Player";
            }
            else {
                var newMobIndex = this.teamTwo.indexOf(newMob);
                this.parent.userInterface.addMobFromEnemyListToMainBlock(newMob, newMobIndex);
            }
        }
        // опыт получают только живые.
        this.gainExperience(this.teamOneAlive, bounty);
    };
    Battle.prototype.killHelper = function (helper) {
        var index = this.teamOneAlive.indexOf(helper);
        this.teamOneAlive.splice(index, 1);
        var helperName = helper.getComponent("Name").getFullName();
        var killerName = helper.getComponent("FightingStats").killedBy.getComponent("Name").getFullName();
        this.parent.userInterface.journal.kill(killerName, helperName);
    };
    Battle.prototype.killPlayer = function (player) {
        this.whoWin = "Mob";
        var index = this.teamOneAlive.indexOf(player);
        this.teamOneAlive.splice(index, 1);
        var playerName = player.getComponent("Name").getFullName();
        var killerName = player.getComponent("FightingStats").killedBy.getComponent("Name").getFullName();
        this.parent.userInterface.journal.kill(killerName, playerName);
    };
    Battle.prototype.addOrbToBattle = function (orb) {
        if (this.currentOrb == null) {
            this.currentOrb = orb;
            return true;
        }
        return false;
    };
    return Battle;
}());
var EntityRoot = (function () {
    function EntityRoot(parent, creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData) {
        this.entities = new Array();
        this.parent = parent;
        this.entityIdNumber = 0;
        this.deadEntities = new Array();
        this.init(creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData);
    }
    EntityRoot.prototype.init = function (creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData) {
        this.entityParametersGenerator = new EntityParametersGenerator(creaturesData, creatureClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData);
    };
    EntityRoot.prototype.generateEntity = function (entityType, type, subtype, params) {
        var entity = this.createEntity(entityType);
        var newParams = this.entityParametersGenerator.generate(entityType, type, subtype, params);
        entity.createComponentsWithParams(newParams);
        return entity;
    };
    EntityRoot.prototype.createEntity = function (type) {
        if (type != "Player" && type != "Mob" && type != "Helper" && type != "Item")
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
        var string = "" + this.entityIdNumber;
        this.entityIdNumber++;
        return string;
    };
    EntityRoot.prototype.removeEntity = function (entity) {
        for (var i = 0; i < this.entities.length; i++) {
            if (entity.id == this.entities[i].id) {
                this.deadEntities.push(this.entities[i]);
                this.entities.splice(i, 1);
            }
        }
    };
    EntityRoot.prototype.collectDataFromEntity = function (entity) {
        var name = entity.getComponent("Name").exportDataToObject();
        var type = entity.getComponent("Type").exportDataToObject();
        var fightingStats = entity.getComponent("FightingStats").exportDataToObject();
        var experienceStats = entity.getComponent("ExperienceStats").exportDataToObject();
        var ageStats = entity.getComponent("AgeStats").exportDataToObject();
        //if params == null, collect all data;
        var data = { "Name": name, "Type": type, "FightingStats": fightingStats, "ExperienceStats": experienceStats, "AgeStats": ageStats };
        return data;
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
    function EntityParametersGenerator(creaturesData, creaturesClassData, humanoidsData, humanoidsClassData, humanoidsHelperData, orbsData) {
        this.creaturesData = creaturesData;
        this.creaturesClassData = creaturesClassData;
        this.humanoidsData = humanoidsData;
        this.humanoidsClassData = humanoidsClassData;
        this.humanoidsHelperData = humanoidsHelperData;
        this.orbsData = orbsData;
        this.creaturesDataArray = new Array();
        this.creaturesClassDataArray = new Array();
        this.humanoidsDataArray = new Array();
        this.humanoidsClassDataArray = new Array();
        this.humanoidsHelperDataArray = new Array();
        this.orbsDataArray = new Array();
        this.storeObjKeysInArray();
    }
    EntityParametersGenerator.prototype.generate = function (entityType, type, subtype, params) {
        var newParams;
        if (entityType == "Player" || entityType == "Helper" || entityType == "Mob")
            newParams = this.generateCreature(entityType, type, subtype, params);
        else if (entityType == "Item")
            newParams = this.generateItem(type, subtype, params);
        else
            console.log("Errorm no Entity Type : " + entityType + ". Error in EntityParametersGenerator/generate.");
        return newParams;
    };
    EntityParametersGenerator.prototype.generateItem = function (type, subtype, params) {
    };
    EntityParametersGenerator.prototype.generateCreature = function (entityType, type, subtype, params) {
        var creatureRaceContainer; //names
        var creatureRaceData; // data from names
        var creaturesClassData; //data from names
        var creatureClassContainer; //names
        var creatureClass;
        var creatureRace;
        if (entityType == "Player") {
            creatureRaceContainer = this.humanoidsDataArray;
            creatureRaceData = this.humanoidsData;
            creaturesClassData = this.humanoidsClassData;
            creatureClassContainer = this.humanoidsClassDataArray;
        }
        else if (entityType == "Helper") {
            creatureRaceContainer = this.humanoidsHelperDataArray;
            creatureRaceData = this.humanoidsHelperData;
            creaturesClassData = this.humanoidsClassData;
            creatureClassContainer = this.humanoidsClassDataArray;
        }
        else if (entityType == "Mob") {
            creatureRaceContainer = this.creaturesDataArray;
            creatureRaceData = this.creaturesData;
            creaturesClassData = this.creaturesClassData;
            creatureClassContainer = this.creaturesClassDataArray;
        }
        else {
            console.log("Error, entity type " + entityType + " not found. Error in EntityParametersGenerator/generateCreature.");
        }
        if (subtype == null) {
            var rIndex = Math.floor(Math.random() * (creatureClassContainer.length));
            var creatureClassName = creatureClassContainer[rIndex];
            creatureClass = creaturesClassData[creatureClassName];
        }
        else {
            creatureClass = creaturesClassData[type];
        }
        if (type == null) {
            var randomIndex = Math.floor(Math.random() * (creatureRaceContainer.length));
            var creatureRaceName = creatureRaceContainer[randomIndex];
            creatureRace = creatureRaceData[creatureRaceName];
        }
        else {
            creatureRace = creatureRaceData[subtype];
        }
        var newParams = {
            Name: {},
            Type: {},
            AgeStats: {},
            FightingStats: {},
            ExperienceStats: {},
            InventoryEquip: {},
            InventoryBag: {}
        };
        //делаем присвоение параметров в текущие параметры, для дальнейшей генерации.
        if (params != null) {
            for (var num in params) {
                if (newParams[num] !== undefined)
                    newParams[num] = params[num];
            }
        }
        for (var key in newParams) {
            var value;
            var creatureRaceObject = {};
            var creatureClassObject = {};
            var creatureParamsObject = {};
            if (creatureRace[key] !== undefined)
                creatureRaceObject = creatureRace[key];
            if (creatureClass[key] !== undefined)
                creatureClassObject = creatureClass[key];
            if (newParams[key] !== undefined)
                creatureParamsObject = newParams[key];
            if (key == "Name")
                value = this.generateName(creatureRaceObject, creatureClassObject, creatureParamsObject);
            else if (key == "Type")
                value = this.generateType(creatureRaceObject, creatureClassObject, creatureParamsObject);
            else if (key == "AgeStats")
                value = this.generateAgeStats(creatureRaceObject, creatureClassObject, creatureParamsObject);
            else if (key == "FightingStats")
                value = this.generateFightingStats(creatureRaceObject, creatureClassObject, creatureParamsObject);
            else if (key == "ExperienceStats")
                value = this.generateExperienceStats(creatureRaceObject, creatureClassObject, creatureParamsObject);
            else if (key == "InventoryEquip")
                value = this.generateInventoryEquip(creatureRaceObject, creatureClassObject, creatureParamsObject);
            else if (key == "InventoryBag")
                value = this.generateInventoryBag(creatureRaceObject, creatureClassObject, creatureParamsObject);
            else
                console.log("Error key with name: " + key + " not found. Error in EntityParametersGenerator/generate.");
            newParams[key] = value;
        }
        return newParams;
    };
    EntityParametersGenerator.prototype.generateName = function (raceObject, classObject, params) {
        // Генерируем имя entity, оно состоит из объекта несущего информацию об имени и фамилии, в процессе может придти как стринг, так и аррей.
        var name = "NoName";
        var surname = "NoSurname";
        // приоритет отдам race, если там не находится необходимый параметр, применяю class.
        var nameObject;
        var skipGenerateName = false;
        if (params["name"] !== undefined) {
            name = params["name"];
            skipGenerateName = true;
        }
        else if (raceObject["name"] !== undefined)
            nameObject = raceObject["name"];
        else if (classObject["name"] !== undefined)
            nameObject = classObject["name"];
        else
            console.log("Error, no name. Error in EntityParametersGenerator/generateName.");
        if (!skipGenerateName) {
            if (typeof nameObject === "string")
                name = nameObject;
            else {
                var rnum = Math.floor(Math.random() * nameObject.length); // выбираем рандомное значение из массива.
                name = nameObject[rnum];
            }
        }
        var surnameObject;
        var skipGenerateSurname = false;
        if (params["surname"] !== undefined) {
            surname = params["surname"];
            skipGenerateSurname = true;
        }
        else if (raceObject["surname"] !== undefined)
            surnameObject = raceObject["surname"];
        else if (classObject["surname"] !== undefined)
            surnameObject = classObject["surname"];
        else
            console.log("Error, no surname. Error in EntityParametersGenerator/generateName.");
        if (!skipGenerateSurname) {
            if (typeof surnameObject === "string")
                surname = surnameObject;
            else {
                var rnum = Math.floor(Math.random() * surnameObject.length);
                surname = surnameObject[rnum];
            }
        }
        var result = { "name": name, "surname": surname };
        return result;
    };
    EntityParametersGenerator.prototype.generateType = function (raceObject, classObject, params) {
        var sex = "NoSex";
        var race = "NoRace";
        var creatureClass = "NoClass";
        var sexObject;
        var skipGenerateSex = false;
        if (params["sex"] !== undefined) {
            sex = params["sex"];
            skipGenerateSex = true;
        }
        else if (raceObject["sex"] !== undefined)
            sexObject = raceObject["sex"];
        else if (classObject["sex"] !== undefined)
            sexObject = classObject["sex"];
        else
            console.log("Error, no sex. Error in EntityParametersGenerator/generateType.");
        if (!skipGenerateSex) {
            if (typeof sexObject === "string")
                sex = sexObject;
            else {
                var rnum = Math.floor(Math.random() * sexObject.length); // выбираем рандомное значение из массива.
                sex = sexObject[rnum];
            }
        }
        var raceNameObject;
        var skipGenerateRace = false;
        if (params["race"] !== undefined) {
            race = params["race"];
            skipGenerateRace = true;
        }
        else if (raceObject["race"] !== undefined)
            raceNameObject = raceObject["race"];
        else if (classObject["race"] !== undefined)
            raceNameObject = classObject["race"];
        else
            console.log("Error, no race. Error in EntityParametersGenerator/generateType.");
        if (!skipGenerateRace) {
            if (typeof raceNameObject === "string")
                race = raceNameObject;
            else {
                var rnum = Math.floor(Math.random() * raceNameObject.length); // выбираем рандомное значение из массива.
                race = raceNameObject[rnum];
            }
        }
        var classNameObject;
        var skipGenerateClass = false;
        if (params["class"] !== undefined) {
            creatureClass = params["class"];
            skipGenerateClass = true;
        }
        else if (raceObject["class"] !== undefined)
            classNameObject = raceObject["class"];
        else if (classObject["class"] !== undefined)
            classNameObject = classObject["class"];
        else
            console.log("Error, no class. Error in EntityParametersGenerator/generateType.");
        if (!skipGenerateClass) {
            if (typeof classNameObject === "string")
                creatureClass = classNameObject;
            else {
                var rnum = Math.floor(Math.random() * classNameObject.length); // выбираем рандомное значение из массива.
                creatureClass = classNameObject[rnum];
            }
        }
        var result = { "sex": sex, "race": race, "class": creatureClass };
        return result;
    };
    EntityParametersGenerator.prototype.generateAgeStats = function (raceObject, classObject, params) {
        var min;
        var max;
        var age = 0;
        var month = 0;
        var day = 1;
        var ageObject;
        var skipGenerateAge = false;
        if (params["age"] !== undefined) {
            age = params["age"];
            skipGenerateAge = true;
        }
        else if (raceObject["age"] !== undefined)
            ageObject = raceObject["age"];
        else if (classObject["age"] !== undefined)
            ageObject = classObject["age"];
        else
            console.log("Error, no age. Error in EntityParametersGenerator/generateAgeStats.");
        if (!skipGenerateAge) {
            if (typeof ageObject === "number")
                age = ageObject;
            else {
                min = ageObject[0];
                max = ageObject[1];
                var rnum = Math.floor(min + Math.random() * (max - min + 1)); // выбираем рандомное значение из массива.
                age = rnum;
            }
        }
        var monthObject;
        var skipGenerateMonth = false;
        if (params["month"] !== undefined) {
            month = params["month"];
            skipGenerateMonth = true;
        }
        else if (raceObject["month"] !== undefined)
            monthObject = raceObject["month"];
        else if (classObject["month"] !== undefined)
            monthObject = classObject["month"];
        else
            console.log("Error, no month. Error in EntityParametersGenerator/generateAgeStats.");
        if (!skipGenerateMonth) {
            if (typeof monthObject === "number")
                month = monthObject;
            else {
                min = monthObject[0];
                max = monthObject[1];
                var rnum = Math.floor(min + Math.random() * (max - min + 1)); // выбираем рандомное значение из массива.
                month = rnum;
            }
        }
        var dayObject;
        var skipGenerateDay = false;
        if (params["day"] !== undefined) {
            day = params["day"];
            skipGenerateDay = true;
        }
        else if (raceObject["day"] !== undefined)
            dayObject = raceObject["day"];
        else if (classObject["day"] !== undefined)
            dayObject = classObject["day"];
        else
            console.log("Error, no day. Error in EntityParametersGenerator/generateAgeStats.");
        if (!skipGenerateDay) {
            if (typeof dayObject === "number")
                day = dayObject;
            else {
                min = dayObject[0];
                max = dayObject[1];
                var rnum = Math.floor(min + Math.random() * (max - min + 1)); // выбираем рандомное значение из массива.
                day = rnum;
            }
        }
        var result = { "age": age, "month": month, "day": day };
        return result;
    };
    EntityParametersGenerator.prototype.generateFightingStats = function (raceObject, classObject, params) {
        var stats = { HP: 0, STR: 0, AGI: 0, INT: 0, ASPD: 0, DDG: 0, BLK: 0, PDEF: 0, MDEF: 0 };
        var staticStats = { HP: 0, STR: 0, AGI: 0, INT: 0, ASPD: 0, DDG: 0, BLK: 0, PDEF: 0, MDEF: 0 };
        var lvlup = { HP: 0, STR: 0, AGI: 0, INT: 0, ASPD: 0, DDG: 0, BLK: 0, PDEF: 0, MDEF: 0 };
        var paramsStats;
        var paramsLvlup;
        var paramsStaticStats;
        var raceObjectStats = raceObject["stats"];
        var classObjectStats = classObject["stats"];
        var raceObjectLvlup = raceObject["lvlup"];
        var classObjectStats = classObject["lvlup"];
        if (params != null) {
            paramsStats = params["stats"];
            paramsLvlup = params["lvlup"];
            paramsStaticStats = params["staticStats"];
        }
        for (var key in stats) {
            if (raceObjectStats[key] !== undefined) {
                stats[key] = raceObjectStats[key];
            }
            if (classObjectStats[key] !== undefined) {
                stats[key] += classObjectStats[key];
            }
            if (paramsStats != null) {
                if (params[key] !== undefined)
                    stats[key] = params[key];
            }
        }
        for (var key in staticStats) {
            if (raceObjectStats[key] !== undefined) {
                staticStats[key] = raceObjectStats[key];
            }
            if (classObjectStats[key] !== undefined) {
                staticStats[key] += classObjectStats[key];
            }
            if (paramsStats != null) {
                if (params[key] !== undefined)
                    staticStats[key] = params[key];
            }
        }
        for (var key in lvlup) {
            if (raceObjectStats[key] !== undefined) {
                lvlup[key] = raceObjectStats[key];
            }
            if (classObjectStats[key] !== undefined) {
                lvlup[key] += classObjectStats[key];
            }
            if (paramsStats != null) {
                if (params[key] !== undefined)
                    lvlup[key] = params[key];
            }
        }
        var result = { "stats": stats, "staticStats": staticStats, "lvlup": lvlup };
        return result;
    };
    EntityParametersGenerator.prototype.generateExperienceStats = function (raceObject, classObject, params) {
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
        if (params["lvl"] !== undefined) {
            lvl = params["lvl"];
            skipGenerateLvl = true;
        }
        if (raceObject["lvl"] !== undefined)
            lvlObject = raceObject["lvl"];
        else if (classObject["lvl"] !== undefined)
            lvlObject = classObject["lvl"];
        else
            console.log("Error, no lvl. Error in EntityParametersGenerator/generateExperienceStats.");
        if (!skipGenerateLvl) {
            if (typeof lvlObject === "number")
                lvl = lvlObject;
            else {
                min = lvlObject[0];
                max = lvlObject[1];
                var rnum = Math.floor(min + Math.random() * (max - min + 1)); // выбираем рандомное значение из массива.
                lvl = rnum;
            }
        }
        var expObject;
        var skipGenerateExp = false;
        if (params["exp"] !== undefined) {
            exp = params["exp"];
            skipGenerateExp = true;
        }
        if (raceObject["exp"] !== undefined)
            expObject = raceObject["exp"];
        else if (classObject["exp"] !== undefined)
            expObject = classObject["exp"];
        else
            console.log("Error, no exp. Error in EntityParametersGenerator/generateExperienceStats.");
        if (!skipGenerateExp) {
            if (typeof expObject === "number")
                exp = expObject;
            else {
                min = expObject[0];
                max = expObject[1];
                var rnum = Math.floor(min + Math.random() * (max - min + 1)); // выбираем рандомное значение из массива.
                exp = rnum;
            }
        }
        var bountyObject;
        var skipGenerateBounty = false;
        if (params["bounty"] !== undefined) {
            bounty = params["bounty"];
            skipGenerateBounty = true;
        }
        if (raceObject["bounty"] !== undefined)
            bountyObject = raceObject["bounty"];
        else if (classObject["bounty"] !== undefined)
            bountyObject = classObject["bounty"];
        else
            console.log("Error, no bounty. Error in EntityParametersGenerator/generateExperienceStats.");
        if (!skipGenerateBounty) {
            if (typeof bountyObject === "number")
                bounty = bountyObject;
            else {
                min = bountyObject[0];
                max = bountyObject[1];
                var rnum = Math.floor(min + Math.random() * (max - min + 1)); // выбираем рандомное значение из массива.
                bounty = rnum;
            }
        }
        var result = { "lvl": lvl, "exp": exp, "bounty": bounty };
        return result;
    };
    EntityParametersGenerator.prototype.generateInventoryEquip = function (raceObject, classObject, params) {
        var result;
        return result;
    };
    EntityParametersGenerator.prototype.generateInventoryBag = function (raceObject, classObject, params) {
        var result;
        return result;
    };
    EntityParametersGenerator.prototype.storeObjKeysInArray = function () {
        for (var key in this.creaturesData) {
            this.creaturesDataArray.push(key);
        }
        for (var key in this.humanoidsData) {
            this.humanoidsDataArray.push(key);
        }
        for (var key in this.humanoidsClassData) {
            this.humanoidsClassDataArray.push(key);
        }
        for (var key in this.humanoidsHelperData) {
            this.humanoidsHelperDataArray.push(key);
        }
        for (var key in this.orbsData) {
            this.orbsDataArray.push(key);
        }
        for (var key in this.creaturesClassData) {
            this.creaturesClassDataArray.push(key);
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
        else if (name == "InventoryBag")
            component = new InventoryBag(this);
        else if (name == "InventoryEquip")
            component = new InventoryEquip(this);
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
        _this.killedBy = null;
        _this.currentStats = {
            HP: 0,
            STR: 0,
            AGI: 0,
            INT: 0,
            ASPD: 0,
            DDG: 0,
            BLK: 0,
            PDEF: 0,
            MDEF: 0
        };
        _this.staticStats = {
            HP: 0,
            STR: 0,
            AGI: 0,
            INT: 0,
            ASPD: 0,
            DDG: 0,
            BLK: 0,
            PDEF: 0,
            MDEF: 0
        };
        _this.levelUpStats = {
            HP: 0,
            STR: 0,
            AGI: 0,
            INT: 0,
            ASPD: 0,
            DDG: 0,
            BLK: 0,
            PDEF: 0,
            MDEF: 0
        };
        return _this;
    }
    FightingStats.prototype.init = function (params) {
        for (var key in params) {
            var container = params[key];
            if (key == "stats") {
                for (var newKey in container) {
                    if (!(this.currentStats[newKey] === undefined))
                        this.currentStats[newKey] = container[newKey];
                    else
                        console.log("Error, no key with name: " + newKey + ". Error in FightingStats/init.");
                }
            }
            else if (key == "staticStats") {
                for (var newKey in container) {
                    if (!(this.staticStats[newKey] === undefined)) {
                        this.staticStats[newKey] = container[newKey];
                    }
                    else
                        console.log("Error, no key with name: " + newKey + ". Error in FightingStats/init.");
                }
            }
            else if (key == "lvlup") {
                for (var newKey in container) {
                    if (!(this.levelUpStats[newKey] === undefined)) {
                        this.levelUpStats[newKey] = container[newKey];
                    }
                    else
                        console.log("Error, no key with name: " + newKey + ". Error in FightingStats/init.");
                }
            }
            else
                console.log("Error, no key with name: " + key + ". Error in FightingStats/init.");
        }
        this.updateAttackCoolDawn();
    };
    FightingStats.prototype.getCurrentStat = function (stat) {
        return this.currentStats[stat];
    };
    FightingStats.prototype.getStaticStat = function (stat) {
        return this.staticStats[stat];
    };
    FightingStats.prototype.getLevelUpStat = function (stat) {
        return this.levelUpStats[stat];
    };
    FightingStats.prototype.setStats = function (to, stat) {
        var container = this.staticStats;
        if (to == "current")
            container = this.currentStats;
        else if (to == "lvlUpStats")
            container = this.levelUpStats;
        else {
            console.log("Error, no container with name: " + to + ". Error in FightingStats/setStats.");
            return;
        }
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
        if (this.timeToNextAttack >= this.attackCoolDawn) {
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
        this.updateAttackCoolDawn();
    };
    FightingStats.prototype.updateAttackCoolDawn = function () {
        var aspd = this.getCurrentStat("ASPD");
        var agi = this.getCurrentStat("AGI");
        var timeToNextAttack = aspd + aspd / 100 * (agi / 100);
        this.attackCoolDawn = Math.round(2000 / timeToNextAttack) * 1000;
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
            if (key == "name" || key == "surname")
                this[key] = params[key];
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
            if (key == "sex" || key == "race" || key == "class")
                this[key] = params[key];
            else
                console.log("Error, no key with name: " + key + ". Error in Type/init.");
        }
    };
    Type.prototype.exportDataToObject = function () {
        var result = { "sex": this.sex, "race": this.race, "class": this["class"] };
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
            if (key == "exp" || key == "lvl" || key == "bounty")
                this[key] = params[key];
            else
                console.log("Error, no key with name: " + key + ". Error in ExperienceStats/init.");
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
var InventoryBag = (function (_super) {
    __extends(InventoryBag, _super);
    function InventoryBag(parent) {
        var _this = _super.call(this, "InventoryBag", parent) || this;
        _this.bagItems = {
            "slot1": null,
            "slot2": null,
            "slot3": null,
            "slot4": null,
            "slot5": null,
            "slot6": null,
            "slot7": null,
            "slot8": null,
            "slot9": null,
            "slot10": null
        };
        _this.bagSlots = 10;
        _this.freeBagSlots = 10;
        return _this;
    }
    InventoryBag.prototype.init = function (params) {
    };
    InventoryBag.prototype.addNewBagSlot = function () {
        this.bagSlots++;
        this.bagItems["slot" + this.bagSlots] = null;
        this.freeBagSlots++;
    };
    InventoryBag.prototype.stockItemInBag = function (item) {
        if (this.freeBagSlots == 0)
            return false;
        for (var key in this.bagItems) {
            if (this.bagItems[key] === null)
                this.bagItems[key] = item;
        }
        this.freeBagSlots--;
    };
    InventoryBag.prototype.exportDataToObject = function () {
        return { "bagItems": this.bagItems, "bagSlots": this.bagSlots, "freeBagSlots": this.freeBagSlots };
    };
    return InventoryBag;
}(Component));
var InventoryEquip = (function (_super) {
    __extends(InventoryEquip, _super);
    function InventoryEquip(parent) {
        var _this = _super.call(this, "InventoryEquip", parent) || this;
        _this.equipItems = {
            "slotHead": null,
            "slotTorso": null,
            "slotGloves": null,
            "slotShoulders": null,
            "slotBracers": null,
            "slotPants": null,
            "slotBelt": null,
            "slotBoots": null,
            "slotAmulet": null,
            "slotLeftRing": null,
            "slotRightRing": null,
            "slotLeftHand": null,
            "slotRightHand": null
        };
        return _this;
    }
    InventoryEquip.prototype.init = function (params) {
        for (var key in params) {
            if (this.equipItems[key] !== undefined)
                this.equipItems[key] = params[key];
            else
                console.log("Error, no name with key: " + key + " in equip inventory. Error in inventoryEquip/init.");
        }
    };
    InventoryEquip.prototype.equipItem = function (item) {
        var itemSlot = item.getComponent("").equipPlace;
        if (itemSlot == null)
            return false;
        var oldItem = this.getItemInSlot(itemSlot);
        this.equipItems[itemSlot] = item;
        return oldItem;
    };
    InventoryEquip.prototype.getItemInSlot = function (slot) {
        return this.equipItems[slot];
    };
    InventoryEquip.prototype.exportDataToObject = function () {
        return { "equipItems": this.equipItems };
    };
    return InventoryEquip;
}(Component));
