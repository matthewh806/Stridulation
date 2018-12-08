import Tone from "Tone";
import noUiSlider from "nouislider";
import { DuoSynth } from "./instruments/synth";

console.log("eno-ugh!");

const EQUALISER_CENTER_FREQUENCIES = [
	100, 125, 160, 200, 250, 315, 400, 500, 630, 800,
	1000, 1250, 1600, 2000, 2500, 3150, 4000, 500, 6300,
	8000, 10000
]

function makeSynth() {
	return new DuoSynth();
}

let leftSynth = makeSynth();
let rightSynth = makeSynth();

let leftPanner = new Tone.Panner(-0.5);
let rightPanner = new Tone.Panner(0.5);

let equalizer = EQUALISER_CENTER_FREQUENCIES.map(frequency => {
	let filter = new Tone.Filter(frequency, 'peaking');
	filter.Q.value = 4.31; // magic number!
	filter.gain.value = 0;
	return filter;
});

function initEqualizerUI(container, equalizer) {
	equalizer.forEach(eqBand => {
		let freq = eqBand.frequency.value;

		let wrapper = document.createElement('div');
		let slider = document.createElement('div');
		let label = document.createElement('label');

		wrapper.classList.add('slider-wrapper');
		slider.classList.add('slider');
		label.textContent = freq >= 1000? `${freq/1000}K` : freq;

		noUiSlider.create(slider, {
			start: 0,
			range: {min: -12, max: 12},
			step: 0.1,
			connect: true,
			orientation: 'vertical',
			direction: 'rtl',
		});
		slider.noUiSlider.on('update', ([value]) => {
			eqBand.gain.value = +value;
			console.log(eqBand.gain.value);
		});

		wrapper.appendChild(slider);
		wrapper.appendChild(label);
		container.appendChild(wrapper);
	});
}

let echo = new Tone.FeedbackDelay('16n', 0.2);
let delay = Tone.context.createDelay(6.0);
let delayFade = Tone.context.createGain();

delay.delayTime.value = 6.0;
delayFade.gain.value = 0.75;

leftSynth.synth.connect(leftPanner);
rightSynth.synth.connect(rightPanner);

leftPanner.connect(equalizer[0]);
rightPanner.connect(equalizer[0]);

equalizer.forEach((eqBand, idx) => {
	let nodeToConnect = (idx < equalizer.lenth-1) ? equalizer[idx+1] : echo;
	eqBand.connect(nodeToConnect);
})

echo.toMaster();
echo.connect(delay);
delay.connect(Tone.context.destination);
delay.connect(delayFade);
delayFade.connect(delay);

new Tone.Loop(time => {
	// Hold for 1m + 2 * 4n
	leftSynth.triggerAttackRelease('C5', '1:2', time);
	leftSynth.setNote('D5', '+0.2');

	leftSynth.triggerAttackRelease('E4', '0:2', "+6.0");
	// Trigger after 11 measures + 2 1/4 notes
	// hold for two 1/4 notes
	leftSynth.triggerAttackRelease('G4', '0:2', '+11:2');

	// Trigger after 19 measures, hold for 2 measures
	// Switch note with delay of 1/4 note + 2 1/16 notes
	leftSynth.triggerAttackRelease('E5', '2:0', '+19.0');
	leftSynth.setNote('G5', '+19:1:2');
	leftSynth.setNote('A5', '+19:3:0');
	leftSynth.setNote('G5', '+19:4:2');
}, '34m').start();

new Tone.Loop(time => {
	// Trigger after 5 measures, hold for 1 measure + two 1/4 notes
	rightSynth.triggerAttackRelease('D4', '1:2', '+5.0');
	rightSynth.triggerAttackRelease('E4', '+6.0');

	// Trigger after 11 measures + 2 1/4 notes + 2 1/16 notes, hold for 1 measure
	rightSynth.triggerAttackRelease('B3', '1m', '+11:2:2');
	rightSynth.setNote('G3', '+12:0:2');

	// Trigger after 23 measures + 2 1/4 notes, hold for 2 1/4 notes
	rightSynth.triggerAttackRelease('G4', '0:2', '+23:2');
}, '37m').start();

Tone.Transport.start();
initEqualizerUI(document.querySelector('.eq'), equalizer);