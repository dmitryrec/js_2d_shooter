let ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

let HEIGHT = 500;
let WIDTH = 500;
let timeWhenGameStarted = Date.now()

let player = {
    x: 50,
    spdX: 30,
    y: 40,
    spdY: 5,
    name: 'P',
    hp: 10,
};

let enemyList = {};

document.onmousemove = function (mouse) {
    let mouseX = mouse.clientX;
    let mouseY = mouse.clientY;

    player.x = mouseX;
    player.y = mouseY;
}

let getDistanceBetweenEntity = function (entity1, entity2) {
    var vx = entity1.x - entity2.x;
    var vy = entity1.y - entity2.y;
    return Math.sqrt(vx * vx + vy * vy);
};

function testCollisionEntity(entity1, entity2) {
    var distance = getDistanceBetweenEntity(entity1, entity2);
    return distance < 30;
};

let Enemy = function (id, x, y, spdX, spdY) {
    let enemy3 = {
        x: x,
        spdX: spdX,
        y: y,
        spdY: spdY,
        name: 'E',
        id: id,
    };
    enemyList[id] = enemy3;
};

let drawEntity = function (something) {
    ctx.fillText(something.name, something.x, something.y);
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

let updateEntity = function (something) {
    updateEntityPosition(something);
    drawEntity(something);
};

let update = function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (let key in enemyList) {
        updateEntity(enemyList[key])

        let isColliding = testCollisionEntity(player, enemyList[key]);
        if (isColliding) {
            player.hp -= 1;
            if (player.hp <= 0) {
                let timeSurvived = Date.now() -timeWhenGameStarted;
                console.log('you lost! time survived is ' + timeSurvived/1000 + ' sec');
                timeWhenGameStarted= Date.now();
                player.hp = 10;
            }
        }
    };

    drawEntity(player);
    ctx.fillText(player.hp + ' hp', 0, 25);
};


Enemy('E1', 150, 150, 10, -18);
Enemy('E2', 50, 150, 20, -8);
Enemy('E3', 250, 150, 10, -8);

setInterval(update, 40);
