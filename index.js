let ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

let HEIGHT = 500;
let WIDTH = 500;

let player = {
    x: 50,
    spdX: 30,
    y: 40,
    spdY: 5,
    name: 'P',
};

let enemyList = {};

function getDistanceBetweenEntity(entity1, entity2) {
    var vx = entity1.x - entity2.x;
    var vy = entity1.y - entity2.y;
    return Math.sqrt(vx * vx + vy * vy);
};

function testCollisionEntity(entity1, entity2) {
    var distance = getDistanceBetweenEntity(entity1, entity2);
    return distance < 30;
};

function Enemy(id, x, y, spdX, spdY) {
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

Enemy('E1', 150, 150, 10, -18);
Enemy('E2', 50, 150, 20, -8);
Enemy('E3', 250, 150, 10, -8);

function updateEntity(something) {
    something.x += something.spdX;
    something.y += something.spdY;
    ctx.fillText(something.name, something.x, something.y);


    if (something.x < 0 || something.x > WIDTH) {
        something.spdX = -something.spdX;
    }
    if (something.y < 0 || something.y > HEIGHT) {
        something.spdY = -something.spdY;
    }
};

function update() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (let key in enemyList) {
        updateEntity(enemyList[key])

        let isColliding = testCollisionEntity(player, enemyList[key]);
        if(isColliding){
            console.log('colliding!')
        }
    };

    updateEntity(player);
}

setInterval(update, 40);
