let ctx = document.getElementById('ctx').getContext('2d');
ctx.font = '30px Arial';

let x=50;
let y=40;
let spdX=30;
let spdY=6;

function update(){
    x+=spdX;    
    y+=spdY;    
    ctx.fillRect(50, 50, x, y);
    if(x>500){
        console.log('boom!')
    }
    
}

setInterval(update, 500)

