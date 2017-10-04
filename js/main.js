var width = 640;
var height = 480;
var app;
var colors = [0xFFFF0B, 0xFF700B, 0x4286f4, 0x4286f4, 0xf441e8, 0x8dff6d, 0x41ccc9, 0xe03375, 0x95e032, 0x77c687, 0x43ba5b, 0x0ea3ba];
var gravity = 1;
var interval = 1000;
var numberPerSec = 1;
var figuresAmount = -1;
var figure = [];
$('#displayGravity').text(gravity);
$('#displayNumberShapes').text(numberPerSec);
var createShapeIntervalId;

var model = {
    createCanvas: function() {
        app = new PIXI.Application(width, height);
        document.body.appendChild(app.view);
		app.stage.interactive = true;
		app.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);
        app.stage.on('mousedown', stageClick);
    },
	
    drawshape: function(shapeX, shapeY) {
        var inAreaX = width - 100;
		if (shapeX === undefined) {
			shapeX = Math.floor(Math.random() * inAreaX);
		}
		if (shapeY === undefined) {
			shapeY = -50;
		}
        randColor = Math.floor(Math.random() * colors.length);
		randShape = Math.floor(Math.random() * 6);
        var radius = 50;
		var shape = new PIXI.Graphics();
		shape.lineStyle(0);
		shape.beginFill(colors[randColor], 1);
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
		figuresAmount++;
		shape.num = figuresAmount;
		$('#displayShapesNumber').text(figuresAmount);
		figure.push(shape);
		app.stage.addChild(shape);
		shape.on('pointerdown', function(e) {controller.clearFigure(shape); e.stopPropagation();});
    }
}

var view = {
    loadGame: function() {
        model.createCanvas();
        model.drawshape();
        createShapeIntervalId = setInterval(model.drawshape, interval);
        app.ticker.add(function() { 
            for (var i = 0; i < figuresAmount; i++) {
                figure[i].position.y += gravity;
                if (figure[i].position.y > height+50 && figure[i].live == true) {
                    controller.clearFigure(figure[i]);
                    return false;
                }
            }
        });
    }
}

function stageClick(e) {
	model.drawshape(e.data.global.x, e.data.global.y);
}

$('#numberShapesLess').on('click', function() {
	if (numberPerSec > 1){
		numberPerSec = numberPerSec - 1;
		clearInterval(createShapeIntervalId);
		createShapeIntervalId = setInterval(model.drawshape, interval/numberPerSec);
	} 
	$('#displayNumberShapes').text(numberPerSec);
	
});

$('#numberShapesMore').on('click', function() {
	if (numberPerSec >= 1){
		numberPerSec = numberPerSec + 1;
		clearInterval(createShapeIntervalId);
		createShapeIntervalId = setInterval(model.drawshape, interval/numberPerSec);
	} 
	$('#displayNumberShapes').text(numberPerSec);
});

$('#gravityLess').on('click', function() {
	if (gravity > 0.5){
		gravity = gravity - 0.5;
	} 
	$('#displayGravity').text(gravity);
});

$('#gravityMore').on('click', function() {
	if (gravity > 0){
		gravity = gravity + 0.5;
	} 
	$('#displayGravity').text(gravity);
});

var controller = {
    clearFigure: function(shape) {
        shape.clear();
        figure[shape.num].live = false;

    }
}

view.loadGame();