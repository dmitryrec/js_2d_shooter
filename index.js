let ctx = document.getElementById('ctx').getContext('2d');
ctx.font = '30px Arial';

let x = 50;
let spdX = 30;
let y = 40;
let spdY = 5;

let height = 500;
let width = 500;

function update() {
    x += spdX;
    y += spdY;
    ctx.fillText('d', x, y);

    if (x < 0 || x > width) {
        spdX = -spdX
    }
    if (y < 0 || y > height) {
        spdY = -spdY
    }

}

setInterval(update, 40)

