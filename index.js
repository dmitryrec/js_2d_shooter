let ctx = document.getElementById("ctx").getContext("2d"); 
ctx.font = '30px Arial';

let HEIGHT = 500;
let WIDTH = 500;
let timeWhenGameStarted = Date.now();

let frameCount = 0;

let score = 0;
let player;

let createPlayer = function(){
	player = {
		type:'player',
		x:50,
		spdX:30,
		y:40,
		spdY:5,
		width:20,
		height:20,
		color:'green',
		
		hp:10,
		atkSpd:1,
		attackCounter:0,
		aimAngle:0,
	
		pressingDown:false,
		pressingUp:false,
		pressingLeft:false,
		pressingRight:false,
	};
}


let enemyList = {};
let upgradeList = {};
let bulletList = {};

let getDistanceBetweenEntity = function (entity1,entity2){	
	let vx = entity1.x - entity2.x;
	let vy = entity1.y - entity2.y;
	return Math.sqrt(vx*vx+vy*vy);
}

let testCollisionEntity = function (entity1,entity2){	
	let rect1 = {
		x:entity1.x-entity1.width/2,
		y:entity1.y-entity1.height/2,
		width:entity1.width,
		height:entity1.height,
	}
	let rect2 = {
		x:entity2.x-entity2.width/2,
		y:entity2.y-entity2.height/2,
		width:entity2.width,
		height:entity2.height,
	}
	return testCollisionRectRect(rect1,rect2);
	
}

let Enemy = function(id,x,y,spdX,spdY,width,height){
	let enemy3 = {
		type:'enemy',
		x:x,
		spdX:spdX,
		y:y,
		spdY:spdY,
		id:id,
		width:width,
		height:height,
		color:'red',
		//
		aimAngle:0,
		atkSpd:1,
		attackCounter:0,
	};
	enemyList[id] = enemy3;
	
}

let randomlyGenerateEnemy = function(){
	
	let x = Math.random()*WIDTH;
	let y = Math.random()*HEIGHT;
	let height = 10 + Math.random()*30;	
	let width = 10 + Math.random()*30;
	let id = Math.random();
	let spdX = 5 + Math.random() * 5;
	let spdY = 5 + Math.random() * 5;
	Enemy(id,x,y,spdX,spdY,width,height);
	
}

let Upgrade = function (id,x,y,spdX,spdY,width,height,category,color){
	let asd = {
		type:'upgrade',
		x:x,
		spdX:spdX,
		y:y,
		spdY:spdY,
		name:'E',
		id:id,
		width:width,
		height:height,
		color:color,
		
		category:category,
	};
	upgradeList[id] = asd;
}

let randomlyGenerateUpgrade = function(){
	
	let x = Math.random()*WIDTH;
	let y = Math.random()*HEIGHT;
	let height = 10;
	let width = 10;
	let id = Math.random();
	let spdX = 0;
	let spdY = 0;
	
	if(Math.random()<0.5){
		var category = 'score';
		var color = 'orange';
	} else {
		var category = 'atkSpd';
		var color = 'purple';
	}
	
	Upgrade(id,x,y,spdX,spdY,width,height,category,color);
}

let Bullet = function (id,x,y,spdX,spdY,width,height){
	let asd = {
		type:'bullet',
		x:x,
		spdX:spdX,
		y:y,
		spdY:spdY,
		name:'E',
		id:id,
		width:width,
		height:height,
		color:'black',
		
		timer:0,
	};
	bulletList[id] = asd;
}

let generateBullet = function(actor,aimOverwrite){
	
	let x = player.x;
	let y = player.y;
	let height = 10;
	let width = 10;
	let id = Math.random();
	
	let angle;
	if(aimOverwrite !== undefined)
		angle = aimOverwrite;
	else angle = actor.aimAngle;
	
	let spdX = Math.cos(angle/180*Math.PI)*5;
	let spdY = Math.sin(angle/180*Math.PI)*5;
	Bullet(id,x,y,spdX,spdY,width,height);
}

let updateEntity = function(entity){
	updateEntityPosition(entity);
	drawEntity(entity);
}

let updateEntityPosition = function(entity){
	if(entity.type === 'player'){
		if(player.pressingRight)
			player.x += 10;
		if(player.pressingLeft)
			player.x -= 10;	
		if(player.pressingDown)
			player.y += 10;	
		if(player.pressingUp)
			player.y -= 10;	
		
	
		if(player.x < player.width/2)
			player.x = player.width/2;
		if(player.x > WIDTH-player.width/2)
			player.x = WIDTH - player.width/2;
		if(player.y < player.height/2)
			player.y = player.height/2;
		if(player.y > HEIGHT - player.height/2)
			player.y = HEIGHT - player.height/2;
	
	} else {
		entity.x += entity.spdX;
		entity.y += entity.spdY;
				
		if(entity.x < 0 || entity.x > WIDTH){
			entity.spdX = -entity.spdX;
		}
		if(entity.y < 0 || entity.y > HEIGHT){
			entity.spdY = -entity.spdY;
		}
	}
}

let testCollisionRectRect = function(rect1,rect2){
	return rect1.x <= rect2.x+rect2.width 
		&& rect2.x <= rect1.x+rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height;
}

let drawEntity = function(entity){
	ctx.save();
	ctx.fillStyle = entity.color;
	ctx.fillRect(entity.x-entity.width/2,entity.y-entity.height/2,entity.width,entity.height);
	ctx.restore();
}

document.onclick = function(mouse){
	performAttack(player);
}

let performAttack = function(actor){
	if(actor.attackCounter > 25){	
		actor.attackCounter = 0;
		generateBullet(actor);
	}
}


document.oncontextmenu = function(mouse){
	performSpecialAttack(player);
	mouse.preventDefault();
}

let performSpecialAttack = function(actor){
	if(actor.attackCounter > 50){	
		actor.attackCounter = 0;
		/*
		for(let i = 0 ; i < 360; i++){
			generateBullet(actor,i);
		}
		*/
		generateBullet(actor,actor.aimAngle - 5);
		generateBullet(actor,actor.aimAngle);
		generateBullet(actor,actor.aimAngle + 5);
	}
}

document.onmousemove = function(mouse){
	let mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
	let mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;
	
	mouseX -= player.x;
	mouseY -= player.y;
	
	player.aimAngle = Math.atan2(mouseY,mouseX) / Math.PI * 180;
}

document.onkeydown = function(event){
	if(event.keyCode === 68)	
		player.pressingRight = true;
	else if(event.keyCode === 83)	
		player.pressingDown = true;
	else if(event.keyCode === 65) 
		player.pressingLeft = true;
	else if(event.keyCode === 87) 
		player.pressingUp = true;
}

document.onkeyup = function(event){
	if(event.keyCode === 68)	
		player.pressingRight = false;
	else if(event.keyCode === 83)	
		player.pressingDown = false;
	else if(event.keyCode === 65) 
		player.pressingLeft = false;
	else if(event.keyCode === 87) 
		player.pressingUp = false;
}


let update = function(){
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	frameCount++;
	score++;
	
	if(frameCount % 100 === 0)	
		randomlyGenerateEnemy();

	if(frameCount % 75 === 0)	
		randomlyGenerateUpgrade();
	
	player.attackCounter += player.atkSpd;
	
	
	for(let key in bulletList){
		updateEntity(bulletList[key]);
		
		let toRemove = false;
		bulletList[key].timer++;
		if(bulletList[key].timer > 75){
			toRemove = true;
		}
		
		for(let key2 in enemyList){
			let isColliding = testCollisionEntity(bulletList[key],enemyList[key2]);
			if(isColliding){
				toRemove = true;
				delete enemyList[key2];
				break;
			}			
		}
		if(toRemove){
			delete bulletList[key];
		}
	}
	
	for(let key in upgradeList){
		updateEntity(upgradeList[key]);
		let isColliding = testCollisionEntity(player,upgradeList[key]);
		if(isColliding){
			if(upgradeList[key].category === 'score')
				score += 1000;
			if(upgradeList[key].category === 'atkSpd')
				player.atkSpd += 3;
			delete upgradeList[key];
		}
	}
	
	for(let key in enemyList){
		updateEntity(enemyList[key]);
		
		let isColliding = testCollisionEntity(player,enemyList[key]);
		if(isColliding){
			player.hp = player.hp - 1;
		}
	}
	if(player.hp <= 0){
		let timeSurvived = Date.now() - timeWhenGameStarted;		
		console.log("You lost! You survived for " + timeSurvived + " ms.");		
		startNewGame();
	}
	updateEntity(player);
	ctx.fillText(player.hp + " Hp",0,30);
	ctx.fillText('Score: ' + score,200,30);
}

let startNewGame = function(){
	player.hp = 10;
	timeWhenGameStarted = Date.now();
	frameCount = 0;
	score = 0;
	enemyList = {};
	upgradeList = {};
	bulletList = {};
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
	
}

createPlayer();
startNewGame();

setInterval(update,40);