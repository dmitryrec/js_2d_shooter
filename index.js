let ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

let HEIGHT = 500;
let WIDTH = 500;
let timeWhenGameStarted = Date.now();   

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
};

let enemyList = {};


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
    };
    enemyList[id] = enemy3;

};

document.onmousemove = function (mouse) {
    let mouseX = mouse.clientX;
    let mouseY = mouse.clientY;

    player.x = mouseX;
    player.y = mouseY;
};


let updateEntity = function (something) {
    updateEntityPosition(something);
    drawEntity(something);
};

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

Enemy('E1', 150, 350, 10, 15, 30, 30);
Enemy('E2', 250, 350, 10, -15, 20, 20);
Enemy('E3', 250, 150, 10, -8, 40, 10);


let update = function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (let key in enemyList) {
        updateEntity(enemyList[key]);

        let isColliding = testCollisionEntity(player, enemyList[key]);
        if (isColliding) {
            player.hp = player.hp - 1;
            if (player.hp <= 0) {
                let timeSurvived = Date.now() - timeWhenGameStarted;

                console.log("You lost! You survived for " + timeSurvived/1000 + " sec.");
                timeWhenGameStarted = Date.now();
                player.hp = 10;
            }
        }

    }

    drawEntity(player);
    ctx.fillText(player.hp + " Hp", 0, 30);
};

setInterval(update, 40);