QUnit.test( "Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.", function( assert ) {
	grid = [
	        [new Point(false), new Point(false), new Point(false) ],
	        [new Point(false), new Point(true),  new Point(false) ],
	        [new Point(false), new Point(false), new Point(false) ]
	        ]
	model = new Model(grid);
	dotoflife = new LifeService();
	
	dotoflife.calculate(model);
	
	assert.ok(!model.array[1][1].life, "Cell is dead");
});

QUnit.test( "Any live cell with more than three live neighbours dies, as if by overcrowding.", function( assert ) {
	grid = [
	        [new Point(true), new Point(false), new Point(false) ],
	        [new Point(false), new Point(true),  new Point(true) ],
	        [new Point(false), new Point(true), new Point(true) ]
	        ]
	model = new Model(grid);
	dotoflife = new LifeService();
	
	dotoflife.calculate(model);
	
	assert.ok(!model.array[1][1].life, "Cell is dead");
});

QUnit.test( "Any live cell with two live neighbours lives, on to the next generation", function( assert ) {
	grid = [
	        [new Point(true), new Point(false), new Point(false) ],
	        [new Point(false), new Point(true),  new Point(true) ],
	        [new Point(false), new Point(false), new Point(false) ]
	        ]
	model = new Model(grid);
	dotoflife = new LifeService();
	
	dotoflife.calculate(model);
	
	assert.ok(model.array[1][1].life, "Cell is life");
});

QUnit.test( "Any live cell with three live neighbours lives, on to the next generation", function( assert ) {
	grid = [
	        [new Point(true), new Point(false), new Point(false) ],
	        [new Point(false), new Point(true),  new Point(true) ],
	        [new Point(false), new Point(true), new Point(false) ]
	        ]
	model = new Model(grid);
	dotoflife = new LifeService();
	
	dotoflife.calculate(model);
	
	assert.ok(model.array[1][1].life, "Cell is life");
});

QUnit.test( "Any dead cell with exactly three live neighbours becomes a live cell.", function( assert ) {
	grid = [
	        [new Point(true), new Point(false), new Point(false) ],
	        [new Point(false), new Point(false),  new Point(true) ],
	        [new Point(false), new Point(true), new Point(false) ]
	        ]
	model = new Model(grid);
	dotoflife = new LifeService();
	
	dotoflife.calculate(model);
	
	assert.ok(model.array[1][1].life, "Cell is life");
});
