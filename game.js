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
    Game.prototype.init = function (creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData, leftBlock, rightBlock, journal, helperBlock, enemylist) {
        this.commonTick = new CommonTick(this, this.fps);
        this.entityRoot = new EntityRoot(this);
        this.entityRoot.init(creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData);
        this.battle = new Battle(this);
        this.userInterface = new UserInterface(this);
        this.userInterface.init(leftBlock, rightBlock, journal, helperBlock, enemylist);
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
        var player = this.entityRoot.generateEntity("Player", null);
        this.battle.addPlayerToFight(1, player);
        var fullName = player.getComponent("Name").getFullName();
        var playerClass = player.getComponent("Type")["class"];
        var string = fullName + " created! Class: " + playerClass;
        this.userInterface.journal.addLineToJournal(string);
        this.player = player;
    };
    Game.prototype.generateMob = function () {
        var entityList = this.entityRoot.getListOfEntities();
        var lvl = 1;
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
        this.battle.addPlayerToFight(2, mob);
    };
    Game.prototype.generateHelper = function () {
        var helper = this.entityRoot.generateEntity("Helper", null);
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
    Journal.prototype.hit = function (target, damage, pdamage, mdamage) {
        var string = "<b>" + target + "</b>" + " hitted on " + '<font color="purple"><b>' + Math.round(damage) + "</b></font>" + " ( "
            + '<font color="red"><b>' + Math.round(pdamage) + "</b></font>" + " + " + '<font color="blue"><b>' + Math.round(mdamage) + "</b></font>" + " ).";
        this.addLineToJournal(string);
    };
    Journal.prototype.crit = function (target, damage, pdamage, mdamage) {
        var string = "<b>" + target + "</b>" + " critically hitted on " + '<font color="purple" style="font-size:24px;"><b>' + Math.round(damage) + "</b></font>" + " ( "
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
    Journal.prototype.attack = function (player, target) {
        var string = "<b>" + player + "</b>" + " is attacking " + "<b>" + target + "</b>.";
        this.addLineToJournal(string);
    };
    return Journal;
}());
var UserInterface = (function () {
    function UserInterface(parent) {
        this.parent = parent;
    }
    UserInterface.prototype.init = function (leftBlock, rightBlock, journal, helperBlock, enemyList) {
        this.leftCharacterBlock = document.getElementById(leftBlock);
        this.rightCharacterBlock = document.getElementById(rightBlock);
        this.leftHelperBlock = document.getElementById(helperBlock);
        this.enemyList = document.getElementById(enemyList);
        this.journal = new Journal(journal);
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
        var typeOfDamage = Math.floor(Math.random() * 2); //0 , 1;
        var timesToAttack = 1;
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
            this.parent.userInterface.journal.attack(playerName, targetName);
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
                this.parent.userInterface.journal.hit(targetName, totalDamage, phsysicalPlayerDamage, magicalPlayerDamage);
            else
                this.parent.userInterface.journal.crit(targetName, totalDamage, phsysicalPlayerDamage, magicalPlayerDamage);
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
    return Battle;
}());
var EntityRoot = (function () {
    function EntityRoot(parent) {
        this.entities = new Array();
        this.parent = parent;
        this.entityIdNumber = 0;
        this.deadEntities = new Array();
    }
    EntityRoot.prototype.init = function (creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData) {
        this.entityParametersGenerator = new EntityParametersGenerator(creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData);
    };
    EntityRoot.prototype.generateEntity = function (entityType, secondType) {
        var entity = this.createEntity(entityType);
        var params = this.entityParametersGenerator.generate(entityType, secondType);
        entity.createComponentsWithParams(params);
        return entity;
    };
    EntityRoot.prototype.createEntity = function (type) {
        if (type != "Player" && type != "Mob" && type != "Helper")
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
    function EntityParametersGenerator(creaturesData, humanoidsData, humanoidsClassData, humanoidsHelperData) {
        this.creaturesData = creaturesData;
        this.humanoidsData = humanoidsData;
        this.humanoidsClassData = humanoidsClassData;
        this.humanoidsHelperData = humanoidsHelperData;
        this.creaturesDataArray = new Array();
        this.humanoidsDataArray = new Array();
        this.humanoidsClassDataArray = new Array();
        this.humanoidsHelperDataArray = new Array();
        this.storeObjKeysInArray();
    }
    EntityParametersGenerator.prototype.generate = function (entityType, type) {
        var container = this.creaturesDataArray;
        var data = this.creaturesData;
        var playerClass;
        if (entityType == "Player") {
            container = this.humanoidsDataArray;
            data = this.humanoidsData;
            if (type == null) {
                var rIndex = Math.floor(Math.random() * (this.humanoidsClassDataArray.length));
                playerClass = this.humanoidsClassDataArray[rIndex];
            }
            else {
                playerClass = this.humanoidsClassDataArray[type];
            }
        }
        if (entityType == "Helper") {
            container = this.humanoidsHelperDataArray;
            data = this.humanoidsHelperData;
            if (type == null) {
                var rIndex = Math.floor(Math.random() * (this.humanoidsClassDataArray.length));
                playerClass = this.humanoidsClassDataArray[rIndex];
            }
            else {
                playerClass = this.humanoidsClassDataArray[type];
            }
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
                value = this.generateType(creatureParams[key], playerClass);
            else if (key == "AgeStats")
                value = this.generateAgeStats(creatureParams[key]);
            else if (key == "FightingStats")
                value = this.generateFightingStats(creatureParams[key], params.Type["class"]);
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
    EntityParametersGenerator.prototype.generateType = function (object, playerClass) {
        var sex = "NoSex";
        var race = "NoRace";
        var creatureClass = playerClass || "NoClass";
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
            else if (key == "class") {
                if (creatureClass == "NoClass") {
                    var rnum = Math.floor(Math.random() * container.length);
                    creatureClass = container[rnum];
                }
            }
            else
                console.log("Error, no key with name: " + key + ". Error in EntityParametersGenerator/generateType.");
        }
        var result = { "sex": sex, "race": race, "class": creatureClass };
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
    EntityParametersGenerator.prototype.generateFightingStats = function (object, playerClass) {
        var stats = {};
        var lvlup = {};
        var lvlupClass = { STR: 0, AGI: 0, INT: 0 };
        var creatureClassParams;
        var min;
        var max;
        if (playerClass != "NoClass") {
            creatureClassParams = this.humanoidsClassData[playerClass];
            for (var newKey in creatureClassParams) {
                var innerContainer = creatureClassParams[newKey];
                if (typeof creatureClassParams[newKey] === "number")
                    lvlupClass[newKey] = creatureClassParams[newKey];
                else {
                    min = innerContainer[0];
                    max = innerContainer[1];
                    var rnum = Math.floor(min + Math.random() * (max - min + 1));
                    lvlupClass[newKey] = rnum;
                }
            }
        }
        for (var key in object) {
            var container = object[key];
            if (key == "stats") {
                for (var newKey in container) {
                    var innerContainer = container[newKey];
                    if (typeof innerContainer === "number")
                        stats[newKey] = innerContainer;
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
                    if (typeof innerContainer === "number")
                        lvlup[newKey] = innerContainer;
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
        var result = { "stats": stats, "levelUpStats": lvlup, "levelUpClassStats": lvlupClass };
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
        for (var num in this.humanoidsClassData) {
            this.humanoidsClassDataArray.push(num);
        }
        for (var newKey in this.humanoidsHelperData) {
            this.humanoidsHelperDataArray.push(newKey);
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
        _this.levelUpClassStats = {
            STR: 0,
            AGI: 0,
            INT: 0
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
            else if (key == "staticStats") {
                for (var newKey in container) {
                    if (!(this.staticStats[newKey] === undefined)) {
                        this.staticStats[newKey] = container[newKey];
                    }
                    else
                        console.log("Error, no key with name: " + newKey + ". Error in FightingStats/init.");
                }
            }
            else if (key == "levelUpStats") {
                for (var newKey in container) {
                    if (!(this.levelUpStats[newKey] === undefined)) {
                        this.levelUpStats[newKey] = container[newKey];
                    }
                    else
                        console.log("Error, no key with name: " + newKey + ". Error in FightingStats/init.");
                }
            }
            else if (key == "levelUpClassStats") {
                for (var elseKey in container) {
                    if (!(this.levelUpClassStats[elseKey] === undefined)) {
                        this.levelUpClassStats[elseKey] = container[elseKey];
                    }
                    else
                        console.log("Error, no key with name: " + elseKey + ". Error in FightingStats/init.");
                }
            }
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
    FightingStats.prototype.getLevelUpClassStats = function (stat) {
        return this.levelUpClassStats[stat];
    };
    FightingStats.prototype.setStats = function (to, stat) {
        var container = this.staticStats;
        if (to == "current")
            container = this.currentStats;
        else if (to == "lvlUpStats")
            container = this.levelUpStats;
        else if (to == "levelUpClassStats")
            container = this.levelUpClassStats;
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
                var lvlupClassStat = 0;
                if (!(this.levelUpClassStats[key] === undefined))
                    lvlupClassStat = this.levelUpClassStats[key];
                var stat = this.levelUpStats[key] * value.lvl + this.staticStats[key] + lvlupClassStat * value.lvl;
                this.currentStats[key] = stat;
            }
        }
        else
            console.log("Error with Level up stats, level = " + value + ". Error in FightingStats/updateStatsWithLevelUp");
    };
    FightingStats.prototype.exportDataToObject = function () {
        var result = { "currentStats": this.currentStats, "staticStats": this.staticStats, "levelUpStats": this.levelUpStats, "levelUpClassStats": this.levelUpClassStats };
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
