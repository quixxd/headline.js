var CHAR_SIZE = 5;
var PIXEL_SIZE = 22;
var PIXEL_COUNT = 0;
var FULL_MORPH = false;

var pixels = Array();
var positions = Array();
var velocities = Array();

var wordsCursor = 0;
var words = [];
var activeWord = '';

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x111111);
// create a renderer instance
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
renderer.view.className = "rendererView";
// center point
var centerPoint = new PIXI.Point(window.innerWidth / 2, window.innerHeight / 2);


function headline(document, initWords, fullMorph) {
	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);
	FULL_MORPH = fullMorph;
	// start rendering
	requestAnimFrame(animate);

	words = initWords;
	PIXEL_COUNT = countMaxPoints();
	createPixels();

	formWord(words[wordsCursor], true);
}

function createPixels() {

	var drawsize = PIXEL_SIZE - 1;
	// create a new Sprite using the texture
	for (var i = 0; i < PIXEL_COUNT; i++)
	{
		var bunny = new PIXI.Graphics();
		bunny.beginFill(0xffffff);
		bunny.lineStyle(1, 0xffffff, 1);
		bunny.moveTo(0,0);
		bunny.lineTo(drawsize,0);
		bunny.lineTo(drawsize,drawsize);
		bunny.lineTo(0,drawsize);
		bunny.lineTo(0,0);
		bunny.endFill();

		bunny.position.x = -20;
		bunny.position.y = -20;

		pixels.push(bunny);
		stage.addChild(bunny);

		positions.push(new PIXI.Point(0,0));
		velocities.push(new PIXI.Point(0,0));
	}
}

function countWordPoints(word) {
	var wordWeight = 0;
	for (l in word) {
		var letter = word[l];
		var symbols = letters[letter];
		var splitted = symbols.split('').sort().join('').split(' ');
		var dots = splitted[splitted.length-1];
		if (dots.length > 0 && dots[0] == '*')
			wordWeight += dots.length;
	}
	return wordWeight;
}

function countMaxPoints() {
	var maxWeight = 0;
	for(var i in words) {
		var word = words[i];
		var wordWeight = countWordPoints(word);

		if (wordWeight > maxWeight)
			maxWeight = wordWeight;
	}
	return maxWeight;
}

function adjustVisibility(wrd, immediate) {
	if (immediate)
		activeWord = wrd;

	// how many are visible now?
	var visibleA = countWordPoints(activeWord);
    var visibleB = countWordPoints(wrd);
    var maxVisible = Math.max(visibleA, visibleB);

    for (var i in pixels) {
    	pixels[i].visible =  (i < maxVisible);
    }

	activeWord = wrd;
}


function formWord(wrd, immediate) {
	if (FULL_MORPH)
		adjustVisibility(wrd, immediate);

	var ofsx = centerPoint.x - (CHAR_SIZE + 1) * PIXEL_SIZE * wrd.length / 2;
	var ofsy = centerPoint.y - CHAR_SIZE * PIXEL_SIZE / 2;

	var ltrx = 0;
	var pixelindex = 0;

	for (var letter_index in wrd) {
		ltrx = letter_index * (CHAR_SIZE + 1) * PIXEL_SIZE;
		var ltr = wrd[letter_index];

		var cx = 0;
		var cy = 0;

		for (var ch in letters[ltr]) {
			if (letters[ltr][ch] == '*') {

				setPos(pixelindex,
					cx * PIXEL_SIZE + ltrx + ofsx,
					cy * PIXEL_SIZE + ofsy,
					immediate);

				pixelindex++;
			}

			cx++;
			if (cx == CHAR_SIZE) {
				cx = 0;
				cy++;
			}
		}
	}

	// fill unused pixels
	var actuallength = pixelindex;
	for (pi = actuallength; pi < pixels.length; pi++) {
		var rolemodel = positions[pi % actuallength];
		if (FULL_MORPH)
			setPos(pi, rolemodel.x, rolemodel.y, immediate);
		else
			setPos(pi, rolemodel.x, window.innerHeight + 150, immediate);
	}

}

function setPos(index, x, y, immediate) {
	if (immediate) {
		pixels[index].position.x = x;
		pixels[index].position.y = y;
	}
	else {
		velocities[index].x = (-0.5 + Math.random()) * 1;
		velocities[index].y = (-0.5 + Math.random()) * 1;
	}
	positions[index].x = x;
	positions[index].y = y;
}

function vectorLength(point) {
	return Math.sqrt(point.x * point.x + point.y * point.y);
}
function vectorNormalized(point) {
	if (point.x == 0 && point.y == 0)
		return 0;
	var len = vectorLength(point);
	point.x /= len;
	point.y /= len;
	return point;
}
function vectorSubtract(a, b) {
	return new PIXI.Point(a.x - b.x, a.y - b.y);
}

function animate() {
    requestAnimFrame(animate);

    // just for fun, let's rotate mr rabbit a little
    //bunny.rotation += 0.1;
    for (var i in pixels) {
    	if (velocities[i].x != 0 || velocities[i].y != 0) {

	    	// correct velocities
	    	velocities[i].x += (positions[i].x - pixels[i].position.x) * 0.01;
	    	velocities[i].y += (positions[i].y - pixels[i].position.y) * 0.01;

	    	// normalize velocity
	    	var len = vectorLength(velocities[i]);
	    	if (len > 0.1) {
				velocities[i].x *= 0.95;
				velocities[i].y *= 0.95;
			}
	    	//velocities[i] = vectorNormalized(velocities[i]);

	    	// move according to velocities
	    	pixels[i].position.x += velocities[i].x;
	    	pixels[i].position.y += velocities[i].y;

	    	// are we there yet?
	    	// stop them movements
/*
	    	var direction = vectorSubtract(pixels[i].position, positions[i]);
	    	if (vectorLength(direction) < 2) {
	    		velocities[i].x = 0;
	    		velocities[i].y = 0;

	    		pixels[i].position = positions[i];
	    	}
*/
    	}
    }

    // render the stage
    renderer.render(stage);
}

function nextSlide() {
	wordsCursor = (wordsCursor + 1) % words.length;
	formWord(words[wordsCursor], false);
}
function prevSlide() {
	wordsCursor = (wordsCursor - 1) % words.length;
	formWord(words[wordsCursor], false);
}

window.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 37: // Left
		case 38: // Up
		case 33: // Page Up
			prevSlide();
		break;

		case 39: // Right
		case 40: // Down
		case 34: // Page Down
		case 32: // Space
			nextSlide();
		break;
	}
});



