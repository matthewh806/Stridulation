import { wavetable } from './wavetable.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let wave = audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);
let dtmf = undefined;

let sweepBtn = document.querySelector('#sweep');
sweepBtn.addEventListener('click', function() {
	playSweep();
}, false);

let pulseBtn = document.querySelector('#pulse');
pulseBtn.addEventListener('click', function() {
	playPulse();
}, false);

let noiseBtn = document.querySelector('#noise');
noiseBtn.addEventListener('click', function() {
	playNoise();
}, false)

let sampleBtn = document.querySelector('#sample');
sampleBtn.addEventListener('click', function() {
	playSample(dtmf);
}, false)

let attackTime = 0.2;
const attackControl = document.querySelector('#attack');
attackControl.addEventListener('input', function() {
	attackTime = Number(this.value);
}, false);

let releaseTime = 0.5;
const releaseControl = document.querySelector('#release');
releaseControl.addEventListener('input', function() {
	releaseTime = Number(this.value);
}, false);

let pulseHz = 880;
const hzControl = document.querySelector('#hz');
hzControl.addEventListener('input', function() {
	pulseHz = Number(this.value);
}, false);

let lfoHz = 30;
const lfoControl = document.querySelector('#lfo');
lfoControl.addEventListener('input', function() {
	lfoHz = Number(this.value);
}, false);

let noiseDuration = 1;
const durControl = document.querySelector('#duration');
durControl.addEventListener('input', function() {
	noiseDuration = Number(this.value);
}, false);

let bandHz = 1000;
const bandControl = document.querySelector('#band');
bandControl.addEventListener('input', function() {
	bandHz = Number(this.value);
}, false);

let playbackRate = 1;
const rateControl = document.querySelector('#rate');
rateControl.addEventListener('input', function() {
	playbackRate = Number(this.value);
}, false);

setupSample()
	.then((sample) => {
		dtmf = sample; // to be used in our playSample function
});

let sweepLength = 2;
function playSweep() {
	let osc = audioCtx.createOscillator();
	osc.setPeriodicWave(wave);
	osc.frequency.value = 440;

	let sweepEnv = audioCtx.createGain();
	sweepEnv.gain.cancelScheduledValues(audioCtx.currentTime);
	sweepEnv.gain.setValueAtTime(0, audioCtx.currentTime);
	sweepEnv.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attackTime);
	sweepEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + sweepLength - releaseTime);

	osc.connect(sweepEnv).connect(audioCtx.destination);
	osc.start();
	osc.stop(audioCtx.currentTime + sweepLength);
}

let pulseTime = 1;
function playPulse() {
	let osc = audioCtx.createOscillator();
	osc.type = 'sine';
	osc.frequency.setValueAtTime(pulseHz, audioCtx.currentTime);

	let amp = audioCtx.createGain();
	amp.gain.setValueAtTime(1, audioCtx.currentTime);

	let lfo = audioCtx.createOscillator();
	lfo.type = 'square';
	lfo.frequency.setValueAtTime(lfoHz, audioCtx.currentTime);

	lfo.connect(amp.gain);
	osc.connect(amp).connect(audioCtx.destination);
	lfo.start();
	osc.start();
	osc.stop(audioCtx.currentTime + pulseTime);
}

function playNoise() {
	const bufferSize = audioCtx.sampleRate * noiseDuration;
	const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);

	let data = buffer.getChannelData(0);

	for(let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}

	let noise = audioCtx.createBufferSource();
	noise.buffer = buffer;

	let bandpass = audioCtx.createBiquadFilter();
	bandpass.type = "bandpass";
	bandpass.frequency.value = bandHz;

	noise.connect(bandpass).connect(audioCtx.destination);
	noise.start();
}

function playSample(audioBuffer) {
	const sampleSource = audioCtx.createBufferSource();
	sampleSource.buffer = audioBuffer;
	sampleSource.playbackRate.setValueAtTime(playbackRate, audioCtx.currentTime);
	sampleSource.connect(audioCtx.destination);
	sampleSource.start();

	return sampleSource;
}

async function getFile(audioContext, filePath) {
	const response = await fetch(filePath);
	const arrayBuffer = await response.arrayBuffer();
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

	return audioBuffer;
}

async function setupSample() {
	const filePath = 'static/dtmf.mp3';
	const sample = await getFile(audioCtx, filePath);

	return sample;
}
