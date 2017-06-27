function GameMap (rows, columns) {
	var self = this;
	this.rows = rows;
	this.columns = columns;
	this.data = new Array(this.rows * this.columns);
	setTimeout(function() {
		self.start(snack, food, gui);
	}, 0, snack, food, gui);
}

GameMap.prototype.start = function(snack, food, gui) {
	var self = this;
	self.bindEvent(snack, gui);
	this.timeCount = setInterval(function() {
		self.clear();
		self.refresh(snack, food);
		gui.refresh(self);
		snack.move();
		snack.eat(gamemap, food, snack);
		snack.die(self);
	}, 200);
}

GameMap.prototype.bindEvent = function(snack, gui) {
	document.onkeydown = function(e) {
		if (e.keyCode === 87 || e.keyCode === 38) {
			snack.changeDirection('W');
		}
		if (e.keyCode === 65 || e.keyCode === 37) {
			snack.changeDirection('A');
		}
		if (e.keyCode === 83 || e.keyCode === 40) {
			snack.changeDirection('S');
		}
		if (e.keyCode === 68 || e.keyCode === 39) {
			snack.changeDirection('D');
		}
	}
}
GameMap.prototype.stop = function() {
	clearInterval(this.timeCount);
}

GameMap.prototype.clear = function() {
	for (var i = 0; i < this.rows * this.columns; i++) {
		this.data[i] = 0;
	}
}

GameMap.prototype.insert = function(x, y) {
	this.data[x + y * this.columns] = 1;
}

GameMap.prototype.refresh = function(snack, food) {
	var self = this;
	snack.body.forEach(function(item) {
		self.insert(item.x, item.y);
	});
	this.insert(food.x, food.y);
}


function GameNode (x, y) {
	this.x = x;
	this.y = y;
}

function Snack () {
	this.direction = 'D';
	this.body = [new GameNode(1,1), new GameNode(2,1), new GameNode(3,1)];
	this.isItHungry = true;
}

Snack.prototype.changeDirection = function(d) {
	if (this.direction === 'W' && d === 'S') {
		return;
	}
	if (this.direction === 'S' && d === 'W') {
		return;
	}
	if (this.direction === 'A' && d === 'D') {
		return;
	}
	if (this.direction === 'D' && d === 'A') {
		return;
	}
	this.direction = d;
}

Snack.prototype.getHead = function() {
	return this.body[this.body.length - 1];
}

Snack.prototype.eat = function(gamemap, food, snack) {
	var head = this.getHead();
	var self = this;
	if (head.x === food.x && head.y === food.y) {
		this.isItHungry = false;
		food.newFood(gamemap, snack);
	}
}

Snack.prototype.toBeHungry = function() {
	this.isItHungry = true;
}


Snack.prototype.move = function() {
	var head = this.getHead();
	if (this.direction === 'W') {
		this.body.push(new GameNode(head.x, head.y - 1));
		if (this.isItHungry) this.body.shift();
	}
	if (this.direction === 'S') {
		this.body.push(new GameNode(head.x, head.y + 1));
		if (this.isItHungry) this.body.shift();
	}
	if (this.direction === 'A') {
		this.body.push(new GameNode(head.x - 1, head.y));
		if (this.isItHungry) this.body.shift();
	}
	if (this.direction === 'D') {
		this.body.push(new GameNode(head.x + 1, head.y));
		if (this.isItHungry) this.body.shift();
	}
	this.toBeHungry();
}

Snack.prototype.die = function(gamemap) {
	var head = this.getHead();
	if (head.x < 0 || head.x > gamemap.columns - 1 || head.y < 0 || head.y > gamemap.rows - 1) {
		gamemap.stop();
		return;
	}
	this.body.forEach(function(item, index, array) {
		if (index === array.length - 1) return;
		if (item.x === head.x && item.y === head.y) {
			gamemap.stop();
			return;
		}
	});
}

function Food(gamemap, snack) {
	this.newFood(gamemap, snack);
}

Food.prototype.newFood = function (gamemap, snack) {
	while (true) {
		this.x = Math.floor(Math.random() * gamemap.columns);
		this.y = Math.floor(Math.random() * gamemap.rows);
		for (var i = 0; i < snack.body.length; i++) {
			if (this.x === snack.body[i].x && this.y === snack.body[i].y) {
				break;
			}
		}
		if (i === snack.body.length) {
			break;
		}
	}
}

function GUI () {
	this.init();
}
GUI.prototype.init = function() {
	this.rows = gamemap.rows;
	this.columns = gamemap.columns;
	this.t = document.createElement('table');
	for (var r = 0; r < this.rows; r++) {
		var tr = document.createElement('tr');
		for (var c = 0; c < this.columns; c++) {
			var td = document.createElement('td');
			tr.appendChild(td);
			td.style.width = '20px';
			td.style.height = '20px';
			td.style.backgroundColor = '#a1a1a1';
		}
		this.t.appendChild(tr);
	}
	document.body.appendChild(this.t);
}

GUI.prototype.refresh = function(gamemap) {
	var self = this;
	self.clean();
	gamemap.data.forEach(function(item, index) {
		if (item === 1) {
			self.gray(index);
		}
	});
}

GUI.prototype.gray = function(n) {
	this.t.querySelectorAll('td')[n].style.backgroundColor = '#2b2b2b';
}

GUI.prototype.clean = function() {
	this.t.querySelectorAll('td').forEach(function(item) {
		item.style.backgroundColor = '#a1a1a1';
	});
}

var gamemap = new GameMap(20, 20);
var snack = new Snack();
var food = new Food(gamemap, snack);
var gui = new GUI(gamemap);