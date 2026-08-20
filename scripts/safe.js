let container = document.querySelector('#youare-container');
let micon = document.querySelector('#youare-micon');

/*
 * [Aug 2023] Finally, after 3 years have passed, I made the overlapping mechanism.
 * [Aug 2026] Rebuilt it on the Web Audio API.
 *
 * Audio overlapping is necessary for historic accuracy. The original flash version overlapped the song over itself.
 * youare.swf had a 56-frame 12fps timeline playing sound on frame 1. I also think it sounds funnier and less respectful when overlapped.
 */
const OVERLAP = 56 / 12;

let ctx = null;
let gain = null;
let buffer = null;
let loading = null;

let voices = [];
let timer = null;

// iOS 17 and lower won't hear this piece of media because Safari sucks.
// https://twitter.com/endermanch/status/2084584431763812546
let result = fetch('/media/youare.ogg')
	.then(res => res.arrayBuffer())
	.catch(() => {});

function audioLoad() {
	if (loading) return loading;

	loading = (async () => {
		ctx = new AudioContext();

		gain = ctx.createGain();
		gain.connect(ctx.destination);

		buffer = await ctx.decodeAudioData(await result);
	})();

	return loading;
}

function audioVoice(when) {
	if (when < ctx.currentTime) when = ctx.currentTime;

	let voice = ctx.createBufferSource();

	voice.buffer = buffer;
	voice.connect(gain);
	voice.onended = () => voices = voices.filter(v => v !== voice);
	voice.start(when);

	voices.push(voice);

	let next = when + OVERLAP;
	timer = setTimeout(() => audioVoice(next), (next - ctx.currentTime - .25) * 1000);
}

async function audioPlay() {
	try {
		await audioLoad();
		await ctx.resume();
	}
	catch {
		return;
	}

	// Autoplay was blocked.
	if (ctx.state !== 'running') return;
	if (!timer) audioVoice(ctx.currentTime);

	container.removeEventListener('click', audioPlay);
	container.classList.remove('clicky');

	audioIcon(false);
}

function audioStop() {
	clearTimeout(timer);
	timer = null;

	while (voices.length) voices.pop().stop();

	container.addEventListener('click', audioPlay);
	container.classList.add('clicky');

	audioIcon(true);
}

function audioSwitch() {
	if (timer) audioStop();
	else audioPlay();
}

function audioIcon(muted) {
	if (!micon) return;

	micon.src = muted ? "/images/speakerm.avif" : "/images/speaker.avif";
}

container.addEventListener('click', audioPlay);
container.addEventListener('click', () => {
	container.classList.remove('clicky');
});

if (micon) micon.addEventListener('click', audioSwitch);
if (container.hasAttribute('data-autoplay')) audioPlay();
