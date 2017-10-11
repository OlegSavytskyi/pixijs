var model = {
	width: 640,
	height: 480,
	gravity: 1,
	colors: [0xFFFF0B, 0xFF700B, 0x4286f4, 0x4286f4, 0xf441e8, 0x8dff6d, 0x41ccc9, 0xe03375, 0x95e032, 0x77c687, 0x43ba5b, 0x0ea3ba],
	interval: 1000,
	numberPerSec: 1,
	figuresAmount: -1,
	figure: []
}

var view = {
	init: function(){
		this.shapesCurrentNumberBox= $('#displayCurrentShapesNumber');
		this.shapesNumberBoxPerSec= $('#displayNumberShapesPerSec');
		this.gravityBox= $('#displayGravity');
		this.numberShapesLessButton= $('#numberShapesLess');
		this.numberShapesMoreButton= $('#numberShapesMore');
		this.gravityLessButton= $('#gravityLess');
		this.gravityMoreButton= $('#gravityMore');
		this.gravityBox.text(model.gravity);
		this.shapesNumberBoxPerSec.text(model.numberPerSec);
		this.numberShapesLessButton.on('click', controller.decreaseNumberOfShapes);
		this.numberShapesMoreButton.on('click', controller.increaseNumberOfShapes);
		this.gravityLessButton.on('click', controller.decreaseGravity);
		this.gravityMoreButton.on('click', controller.increaseGravity);
	},
	shapesCurrentNumberBox:null, 
	shapesNumberBoxPerSec: null,
	gravityBox: null,
	numberShapesLessButton: null,
	numberShapesMoreButton: null,
	gravityLessButton: null,
	gravityMoreButton: null
}

var controller = {
	app: null,
	createShapeIntervalId: 0,
	loadGame: function() {
        controller.createCanvas();
        controller.drawshape();
        controller.createShapeIntervalId = setInterval(controller.drawshape, model.interval);
        controller.app.ticker.add(controller.updateFiguresYPosition);
    },
	createCanvas: function() {
        controller.app = new PIXI.Application(model.width, model.height);
        document.body.appendChild(controller.app.view);
		controller.app.stage.interactive = true;
		controller.app.stage.hitArea = new PIXI.Rectangle(0, 0, model.width, model.height);
        controller.app.stage.on('mousedown', controller.stageClick);
    },
	stageClick: function(e) {
		controller.drawshape(e.data.global.x, e.data.global.y);
	},
    clearFigure: function(shape) {
        shape.clear();
        model.figure[shape.num].live = false;
    },
	drawshape: function(shapeX, shapeY) {
        var inAreaX = model.width - 100;
		if (shapeX === undefined) {
			shapeX = Math.floor(Math.random() * inAreaX);
		}
		if (shapeY === undefined) {
			shapeY = -50;
		}
        randColor = Math.floor(Math.random() * model.colors.length);
		randShape = Math.floor(Math.random() * 6);
        var radius = 50;
		var shape = new PIXI.Graphics();
		shape.lineStyle(0);
		shape.beginFill(model.colors[randColor], 1);
		shape.position.x = shapeX
		if (randShape == 0){shape.drawCircle(0, shapeY, radius)
		} else if (randShape == 1){
			shape.drawEllipse(0, shapeY, 25, 50)
		} else if (randShape == 2){
			shape.drawRect(0, shapeY, 100, 50)
		} else if (randShape == 3){
			shape.drawPolygon([0, shapeY+50, 200, shapeY+50, 100, shapeY+0])
		} else if (randShape == 4){
			shape.drawPolygon([25, shapeY+0, 75, shapeY+0, 100, shapeY+25, 75, shapeY+50, 25, shapeY+50, 0, shapeY+25])
		} else if (randShape == 5){
			shape.drawPolygon([25, shapeY+0, 75, shapeY+0, 75, shapeY+50, 25, shapeY+50, 0, shapeY+25])
		}
		shape.endFill();
		shape.interactive = true;
		shape.buttonMode = true;
		shape.live = true;
		model.figuresAmount++;
		shape.num = model.figuresAmount;
		view.shapesCurrentNumberBox.text(model.figuresAmount);
		model.figure.push(shape);
		controller.app.stage.addChild(shape);
		shape.on('pointerdown', function(e){
			controller.clearFigure(shape); e.stopPropagation();
		});
    },
	updateFiguresYPosition: function(){
		for (var i = 0; i < model.figuresAmount; i++) {
			model.figure[i].position.y += model.gravity;
			if (model.figure[i].position.y > model.height+50 && model.figure[i].live == true) {
				controller.clearFigure(model.figure[i]);
				return false;
			}
		}
	},
	decreaseGravity: function(){
		if (model.gravity > 0.5){
			model.gravity -= 0.5;
		} 
		view.gravityBox.text(model.gravity);
	},
	increaseGravity: function(){
		if (model.gravity > 0){
			model.gravity += 0.5;
		} 
		view.gravityBox.text(model.gravity);
	},
	decreaseNumberOfShapes: function(){
		if (model.numberPerSec > 1){
			model.numberPerSec -= 1;
			clearInterval(controller.createShapeIntervalId);
			controller.createShapeIntervalId = setInterval(controller.drawshape, model.interval/model.numberPerSec);
		} 
		view.shapesNumberBoxPerSec.text(model.numberPerSec);
	},
	increaseNumberOfShapes: function(){
		if (model.numberPerSec >= 1){
			model.numberPerSec += 1;
			clearInterval(controller.createShapeIntervalId);
			controller.createShapeIntervalId = setInterval(controller.drawshape, model.interval/model.numberPerSec);
		} 
		view.shapesNumberBoxPerSec.text(model.numberPerSec);
	},
	
}

view.init();
controller.loadGame();