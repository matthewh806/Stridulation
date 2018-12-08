import Tone from "Tone";
import { DuoSynth } from "./instruments/synth";

console.log("eno-ugh!");

function makeSynth() {
	return new DuoSynth();
}

let leftSynth = makeSynth();
let rightSynth = makeSynth();

let leftPanner = new Tone.Panner(-0.5);
let rightPanner = new Tone.Panner(0.5);
let echo = new Tone.FeedbackDelay('16n', 0.2);
let delay = Tone.context.createDelay(6.0);
let delayFade = Tone.context.createGain();

delay.delayTime.value = 6.0;
delayFade.gain.value = 0.75;

leftSynth.synth.connect(leftPanner);
rightSynth.synth.connect(rightPanner);
leftPanner.connect(echo);
rightPanner.connect(echo);
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