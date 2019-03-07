var canvas = document.getElementById("x");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext("2d");
ctx.fillStyle='black';
ctx.fillRect(0,0,canvas.width,canvas.height);

function drawBirdLine(bird, time) {
	red = Math.sin(0.1*time + 0) * 127 + 128;
	green = Math.sin(0.1*time + 2) * 127 + 128;
	blue = Math.sin(0.1*time + 4) * 127 + 128;
	ctx.fillStyle = "rgba("+red+","+green+","+blue+",1)";
	ctx.fillRect(bird[0], bird[1], 1, 1);
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var birds = []
for (var i = 0; i < (canvas.width*canvas.height)/750; i++) {
	var x = getRandomInt(0, canvas.width);
	var y = getRandomInt(0, canvas.height);
	// bad random
	var xv = (0.5 - Math.random()) * 2;
	var yv = (0.5 - Math.random()) * 2;
	var l = Math.sqrt(xv*xv + yv*yv)
	birds.push([x, y, xv/l, yv/l, 3+Math.random()]);
}

var time = 0;
function drawBirds() {
	for (var i = 0; i < birds.length; i++) {
		drawBirdLine(birds[i], time);
	}
	time++;
}

function dist_torus(a, b, w, h) {
	var xd = Math.abs(a[0] - b[0])
	var yd = Math.abs(a[1] - b[1])
	var xdm = Math.min(xd, w - xd);
	var ydm = Math.min(yd, h - yd);
	return Math.sqrt(xdm*xdm + ydm*ydm);
}

function updateBirds() {
	for (var i = 0; i < birds.length; i++) {
		var ax = 0;
		var ay = 0;
		var as = 0;
		var xyn = 0;
		var sn = 0;
		var da = getRandomInt(50, 200);
		var db = getRandomInt(30, 180);
		for (var o = 0; o < birds.length; o++) {
			var d = dist_torus(birds[o], birds[i], canvas.width, canvas.height);
			if (d < da) {
				ax += birds[o][2];
				ay += birds[o][3];
				xyn++;
			}
			if (d < db) {
				as += birds[o][4];
				sn++;
			}
		}
		ax /= xyn;
		ay /= xyn;
		as /= sn;
		var mag = Math.sqrt(ax*ax + ay*ay)
		ax /= mag;
		ay /= mag;

		var cxv = birds[i][2];
		var cyv = birds[i][3];

		var axv = (ax*0.05 + cxv) / 1.05;
		var ayv = (ay*0.05 + cyv) / 1.05;

		birds[i][2] = axv;
		birds[i][3] = ayv;
		birds[i][4] = (as*0.1 + birds[i][4]) / 1.1;

		birds[i][0] += birds[i][2] * birds[i][4];
		birds[i][1] += birds[i][3] * birds[i][4];

		if (birds[i][0] > canvas.width) { birds[i][0] -= canvas.width; }
		if (birds[i][0] < 0) { birds[i][0] += canvas.width; }
		if (birds[i][1] > canvas.height) { birds[i][1] -= canvas.height; }
		if (birds[i][1] < 0) { birds[i][1] += canvas.height; }
	}
}

function update() {
	updateBirds();
	drawBirds();
}

setInterval(update, 32);
