let ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

let HEIGHT = 500;
let WIDTH = 500;
let timeWhenGameStarted = Date.now();

let frameCount = 0;

let score = 0;

let player = {
    x: 50,
    spdX: 30,
    y: 40,
    spdY: 5,
    name: 'P',
    hp: 10,
    width: 20,
    height: 20,
    color: 'green',
    atkSpd: 1,
    attackCounter: 0,

    pressingDown: false,
    pressingUp: false,
    pressingLeft: false,
    pressingRight: false,

    aimAngle: 0,
};

let enemyList = {};
let upgradeList = {};
let bulletList = {};

let getDistanceBetweenEntity = function (entity1, entity2) {
    let vx = entity1.x - entity2.x;
    let vy = entity1.y - entity2.y;
    return Math.sqrt(vx * vx + vy * vy);
};

let testCollisionRectRect = function (rect1, rect2) {
    return rect1.x <= rect2.x + rect2.width
        && rect2.x <= rect1.x + rect1.width
        && rect1.y <= rect2.y + rect2.height
        && rect2.y <= rect1.y + rect1.height;
};

let testCollisionEntity = function (entity1, entity2) {
    let rect1 = {
        x: entity1.x - entity1.width / 2,
        y: entity1.y - entity1.height / 2,
        width: entity1.width,
        height: entity1.height,
    }
    let rect2 = {
        x: entity2.x - entity2.width / 2,
        y: entity2.y - entity2.height / 2,
        width: entity2.width,
        height: entity2.height,
    }
    return testCollisionRectRect(rect1, rect2);

};

let Enemy = function (id, x, y, spdX, spdY, width, height) {
    let enemy3 = {
        x: x,
        spdX: spdX,
        y: y,
        spdY: spdY,
        name: 'E',
        id: id,
        width: width,
        height: height,
        color: 'red',

        aimAngle: 0,
    };
    enemyList[id] = enemy3;

};

let Upgrade = function (id, x, y, spdX, spdY, width, height, category, color) {
    let upgrade = {
        x: x,
        spdX: spdX,
        y: y,
        spdY: spdY,
        name: 'E',
        id: id,
        width: width,
        height: height,
        color: color,
        category: category,
    };
    upgradeList[id] = upgrade;

};

let randomGenerateUpgrade = function () {
    let x = Math.random() * WIDTH;
    let y = Math.random() * HEIGHT;
    let height = 10;
    let width = 10;
    let id = Math.random();
    let spdX = 0;
    let spdY = 0;

    if (Math.random() < .5) {
        var category = 'score';
        var color = 'orange';
    } else {
        var category = 'atkSpd';
        var color = 'purple';
    }

    Upgrade(id, x, y, spdX, spdY, width, height, category, color);
};

let Bullet = function (id, x, y, spdX, spdY, width, height) {
    let bullet = {
        x: x,
        spdX: spdX,
        y: y,
        spdY: spdY,
        name: 'E',
        id: id,
        width: width,
        height: height,
        color: 'black',
        timer: 0,
    };
    bulletList[id] = bullet;

};

let randomGenerateBullet = function (actor, overwriteAngle) {
    let x = actor.x;
    let y = actor.y;
    let height = 10;
    let width = 10;
    let id = Math.random();

    let angle = actor.aimAngle;
    if (overwriteAngle !== undefined) {
        angle = overwriteAngle;
    }
    let spdX = Math.cos(angle / 180 * Math.PI) * 5;
    let spdY = Math.sin(angle / 180 * Math.PI) * 5;
    Bullet(id, x, y, spdX, spdY, width, height)
};

document.onmousemove = function (mouse) {
    var mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
    var mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;

    mouseX -= player.x;
    mouseY -= player.y;

    player.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
};

document.onkeydown = function (event) {
    if (event.keyCode === 68)
        player.pressingRight = true;
    else if (event.keyCode === 83)
        player.pressingDown = true;
    else if (event.keyCode === 65)
        player.pressingLeft = true;
    else if (event.keyCode === 87)
        player.pressingUp = true;
};
document.onkeyup = function (event) {
    if (event.keyCode === 68)
        player.pressingRight = false;
    else if (event.keyCode === 83)
        player.pressingDown = false;
    else if (event.keyCode === 65)
        player.pressingLeft = false;
    else if (event.keyCode === 87)
        player.pressingUp = false;
};

let updatePlayerPosition = function () {
    if (player.pressingRight) player.x += 10;
    if (player.pressingLeft) player.x -= 10;
    if (player.pressingDown) player.y += 10;
    if (player.pressingUp) player.y -= 10;

    if (player.x < player.width / 2)
        player.x = player.width / 2;
    if (player.x > WIDTH - player.width / 2)
        player.x = WIDTH - player.width / 2;
    if (player.y < player.height / 2)
        player.y = player.height / 2;
    if (player.y > HEIGHT - player.height / 2)
        player.y = HEIGHT - player.height / 2;
}

let updateEntityPosition = function (something) {
    something.x += something.spdX;
    something.y += something.spdY;

    if (something.x < 0 || something.x > WIDTH) {
        something.spdX = -something.spdX;
    }
    if (something.y < 0 || something.y > HEIGHT) {
        something.spdY = -something.spdY;
    }
};


let drawEntity = function (something) {
    ctx.save();
    ctx.fillStyle = something.color;
    ctx.fillRect(something.x - something.width / 2, something.y - something.height / 2, something.width, something.height);
    ctx.restore();
};


let updateEntity = function (something) {
    updateEntityPosition(something);
    drawEntity(something);
};


let randomGenerateEnemy = function () {
    let x = Math.random() * WIDTH;
    let y = Math.random() * HEIGHT;
    let height = 10 + Math.random() * 30;
    let width = 10 + Math.random() * 30;
    let id = Math.random();
    let spdX = 5 + Math.random() * 5;
    let spdY = 5 + Math.random() * 5;
    Enemy(id, x, y, spdX, spdY, width, height)
};

let startNewGame = function () {
    player.hp = 10;
    timeWhenGameStarted = Date.now();
    frameCount = 0;
    score = 0;
    enemyList = {};
    upgradeList = {};
    bulletList = {};
    randomGenerateEnemy();
    randomGenerateEnemy();
    randomGenerateEnemy();
};

document.onclick = function (mouse) {
    if (player.attackCounter > 25) {
        randomGenerateBullet(player);
        player.attackCounter = 0;
    };
};

document.oncontextmenu = function (e) {
    if (player.attackCounter > 50) {
       
            randomGenerateBullet(player, player.aimAngle-5);
            randomGenerateBullet(player, player.aimAngle);
            randomGenerateBullet(player, player.aimAngle+5);
        
        player.attackCounter = 0;
    };
    e.preventDefault();
};

let update = function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    frameCount++;
    score++;

    if (frameCount % 100 === 0) {
        randomGenerateEnemy()
    };

    if (frameCount % 75 === 0) {
        randomGenerateUpgrade();
    };

    player.attackCounter += player.atkSpd;


    for (let key in bulletList) {
        updateEntity(bulletList[key]);

        let toRemove = false;
        bulletList[key].timer++;
        if (bulletList[key].timer > 100) {
            toRemove = true;
        }

        for (let key2 in enemyList) {
            let isColliding = testCollisionEntity(bulletList[key], enemyList[key2]);
            if (isColliding) {
                toRemove = true;
                delete enemyList[key2];
                break;
            }
        }
        if (toRemove) {
            delete bulletList[key];
        }
    };

    for (let key in upgradeList) {
        updateEntity(upgradeList[key]);
        let isColliding = testCollisionEntity(player, upgradeList[key]);
        if (isColliding) {
            if (upgradeList[key].category === 'score')
                score += 1000;
            if (upgradeList[key].category === 'atkSpd')
                player.atkSpd += 7;
            delete upgradeList[key];
        }
    };

    for (let key in enemyList) {
        updateEntity(enemyList[key]);

        let isColliding = testCollisionEntity(player, enemyList[key]);
        if (isColliding) {
            player.hp = player.hp - 1;

        }

    };
    if (player.hp <= 0) {
        let timeSurvived = Date.now() - timeWhenGameStarted;
        console.log("You lost! You survived for " + timeSurvived / 1000 + " sec.");
        startNewGame();
    }
    updatePlayerPosition();
    drawEntity(player);
    ctx.fillText(player.hp + " Hp", 0, 30);
    ctx.fillText('scores: ' + score, 200, 30);
};

startNewGame();

setInterval(update, 40);