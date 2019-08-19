let ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

let HEIGHT = 500;
let WIDTH = 500;
let message = 'Bouncing';

let player = {
    x: 50,
    spdX: 30,
    y: 40,
    spdY: 5,
    name: 'P',
};

let enemy = {
    x: 150,
    spdX: 10,
    y: 350,
    spdY: 15,
    name: 'E',
};

let enemy2 = {
    x: 150,
    spdX: 10,
    y: 350,
    spdY: 15,
    name: 'E',
};


function updateEntity(something) {
    something.x += something.spdX;
    something.y += something.spdY;
    ctx.fillText(something.name, something.x, something.y);


    if (something.x < 0 || something.x > WIDTH) {
        console.log(message);
        something.spdX = -something.spdX;
    }
    if (something.y < 0 || something.y > HEIGHT) {
        console.log(message);
        something.spdY = -something.spdY;
    }
};

function update(){
    updateEntity(enemy);
    updateEntity(enemy2);
    updateEntity(player);
}

setInterval(update,40);
