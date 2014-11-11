/**
 * Main
 */
function main() {
	var d_canvas = document.getElementById('canvas');
	
	// Model
	var model = new Model(new Array());
	
	// View
	var canvasView = new CanvasView(d_canvas, 5, model);
	canvasView.initArray();
	canvasView.draw();
	
	// Controller
	var service = new LifeService();
	
	// Runner
	var play = false;
	var timer = 500;
	var nextFrame = function () {
		if (play) {
			service.calculate(model);
			canvasView.draw();
			setTimeout(nextFrame, timer);
		}
	};
	
	var stepButton = document.getElementById('step');
	stepButton.onclick = function(event) {
		service.calculate(model);
		canvasView.draw();
	};
	
	var playButton = document.getElementById('play');
	playButton.onclick = function(event) {
		play = true;
		nextFrame();
	};
	
	var pauseButton = document.getElementById('pause');
	pauseButton.onclick = function(event) {
		play = false;
	};
	
	var stopButton = document.getElementById('stop');
	stopButton.onclick = function(event) {
		play = false;
		service.reset(model);
		canvasView.draw();
	};
	
	var slider = document.getElementById('slider');
	slider.onchange = function(event) {
		timer = slider.value;
	};
}



/**
 * View
 */
function CanvasView(d_canvas, radius, model) {
	
	// private fields
	var _self = this;
	var d_canvas = d_canvas;
	var context = d_canvas.getContext('2d');
	var width = d_canvas.width;
	var height = d_canvas.height;
	var radius = radius;
	
	// private methods
	var drawCircle = function(x,y) {
		context.moveTo(x, y);
		context.arc(x-radius, y+radius, radius, 0, Math.PI*2);
	};
	
	// Attach event
	d_canvas.onclick = function(event) {
		var totalOffsetX = 0;
	    var totalOffsetY = 0;
	    var canvasX = 0;
	    var canvasY = 0;
	    var currentElement = d_canvas;

	    do{
	        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
	        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
	    }
	    while(currentElement = currentElement.offsetParent);
	    
	    canvasX = event.pageX - totalOffsetX;
	    canvasY = event.pageY - totalOffsetY;
	    
	     for (i = 0; i < model.array.length; i++) { 
	    	 for (j = 0; j < model.array[i].length; j++) {
	    		 var point = model.array[i][j];
	    		 if (Math.abs(canvasX-point.x) <= radius + 2 && Math.abs(canvasY-point.y) <= radius + 2) {
	    			 point.setLife(true);
	    		 }
	    	 }
	     }
	     
	     _self.draw();
	};

	// public fields
	var model = model;
	
	// public methods
	this.initArray = function () {
		var array = model.array;
		for (i = 0; i < width; i+=(radius*4)) {
			var arrayRow = new Array();
			for (j=radius; j<height; j+=(radius*4)) {
				arrayRow.push(new Point(false, i, j+radius));
			}
			array.push(arrayRow);
		}
	};
	
	var drawWithStyle = function(style, func) {
		context.beginPath();
		context.fillStyle = style;
		var pointX = 0;
		var pointY = 0;
		for (i = 0; i < width; i+=(radius*4)) {
			pointY = 0;
			for (j=radius; j<height; j+=(radius*4)) {
				var point = model.array[pointX][pointY];
				func(point);
				pointY++;
			}
			pointX++;
		}
		context.fill();
		context.closePath();
	};
	
	this.draw = function () {
		
		// draw dead dot
		drawWithStyle('rgb(240,200,40)', function(point) {
			if(!point.getLife()) {
				drawCircle(i,j);
			}
		});
		
		// draw trail effect dot
		drawWithStyle('rgb(240,166,40)', function(point) {
			if(point.trail > 2 ) {
				drawCircle(i,j);
				point.trail--;
			}
		});
		
		// draw trail effect dot
		drawWithStyle('rgb(240,133,40)', function(point) {
			if(point.trail > 0 && point.trail <= 2) {
				drawCircle(i,j);
				point.trail--;
			}
		});
		
		// draw life dot
		drawWithStyle('rgb(240,100,40)', function(point) {
			if(point.getLife()) {
				drawCircle(i,j);
			}
		});
		
		
	};
	
}

/**
 * Model 
 */
function Model(array) {
	this.array = array;
}

function Point(life,x,y) {
	this.x =x;
	this.y =y;
	this.life = life;
	this.trail = 0;
	
	this.setLife = function (life) {
		if(life) {
			this.trail = 5;
		}
		this.life = life;
	};
	
	this.getLife = function () {
		return this.life;
	};
}

/**
 * Service
 */
function LifeService() {
	
	var calculateAround = function (array, columnLength, rowLength, i, j) {
		startI = i>0 ? i-1 : i;
		startJ   = j>0 ? j-1 : j ;
		endI = i<columnLength-1 ? i+1 : i;
		endJ   = j<rowLength-1 ? j+1 :j;
		
		var counter = 0;
		for (newI = startI; newI <= endI; newI++) {
			for (newJ = startJ; newJ <= endJ; newJ++) {
				if (array[newI][newJ].getLife()) {
					if (!(newI == i && newJ == j)) {
						counter++;
					}
				}
			}
		}
		return counter;
	}
	
	this.reset = function (model) {
		for (i = 0; i < model.array.length; i++) { 
	    	for (j = 0; j < model.array[i].length; j++) {
	    		model.array[i][j].setLife(false);
	    		model.array[i][j].trail = 0;
	    	}
		}
	}
	
	this.calculate = function (model) {
		// init marker
		var marker = new Array();
		for (i = 0; i < model.array.length; i++) { 
			markerRow = new Array();
	    	for (j = 0; j < model.array[i].length; j++) {
	    		markerRow.push(model.array[i][j].getLife());
	    	}
	    	marker.push(markerRow);
		}
		
		// new marker
		for (i = 0; i < model.array.length; i++) { 
	    	for (j = 0; j < model.array[i].length; j++) {
	    		count = calculateAround(model.array, model.array.length, model.array[i].length, i,j);
	    		// life calculation
	    		if (model.array[i][j].getLife()) {
		    		if (count<2) {
		    			marker[i][j] =false;
		    		}
		    		else if(count>3) {
		    			marker[i][j] =false;
		    		}
	    		}
	    		else {
	    			if (count==3) {
		    			marker[i][j] =true;
		    		}
	    		}
	    	}
		}
		
		// copy marker
		for (i = 0; i < model.array.length; i++) { 
	    	for (j = 0; j < model.array[i].length; j++) {
	    		model.array[i][j].setLife(marker[i][j]);
	    	}
		}
		
	}
}
