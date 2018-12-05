const AudioContext = window.AudioContext || window.webkitAudioContext;

let audioContext = new AudioContext();
let oscList = []
let masterGainNode = null;

let keyboard = document.querySelector(".keyboard");
let wavePicker = document.querySelector("select[name='waveform']");
let volumeControl = document.querySelector("input[name='volume']");

let noteFreq = null;

let sample_rate = 44100;

setup();

function setup() {
	noteFreq = createNoteTable();

	console.log(noteFreq);

	volumeControl.addEventListener("change", changeVolume, false);

	masterGainNode = audioContext.createGain();
	masterGainNode.connect(audioContext.destination);
	masterGainNode.gain.value = volumeControl.value;

	let keyList = Object.entries(noteFreq);
	let octaveElem = document.createElement("div");
	octaveElem.className = "octave";

	keyList.forEach(function(key) {
		if(key[0].length == 1) // Skip sharps / flats for now
			octaveElem.appendChild(createKey(key[0], 0, key[1]));
	});

	keyboard.appendChild(octaveElem);

	oscList = [];
}

function createNoteTable() {
	let noteFreq = [];

	noteFreq["A"] = 440;
	noteFreq["A#"] = 440 * Math.pow(2, 1/12);
	noteFreq["B"] = 440 * Math.pow(2, 2/12);
	noteFreq["C"] = 440 * Math.pow(2, 3/12);
	noteFreq["C#"] = 440 * Math.pow(2, 4/12);
	noteFreq["D"] = 440 * Math.pow(2, 5/12);
	noteFreq["D#"] = 440 * Math.pow(2, 6/12);
	noteFreq["E"] = 440 * Math.pow(2, 7/12);
	noteFreq["F"] = 440 * Math.pow(2, 8/12);
	noteFreq["F#"] = 440 * Math.pow(2, 9/12);
	noteFreq["G"] = 440 * Math.pow(2, 10/12);
	noteFreq["G#"] = 440 * Math.pow(2, 11/12);

	return noteFreq;
}

function createKey(note, octave, freq) {
	let keyElement = document.createElement("div");
	let labelElement = document.createElement("div");

	keyElement.className = "key";
	keyElement.dataset["octave"] = octave;
	keyElement.dataset["note"] = note;
	keyElement.dataset["frequency"] = freq;

	labelElement.innerHTML = note + "<sub>" + octave + "</sub>";
	keyElement.appendChild(labelElement);

	keyElement.addEventListener("mousedown", notePressed, false);
	keyElement.addEventListener("mouseup", noteReleased, false);
	keyElement.addEventListener("mouseover", notePressed, false);
	keyElement.addEventListener("mouseleave", noteReleased, false);

	return keyElement;
}

function notePressed(event) {
	if(event.buttons === 1) {
		let dataset = event.currentTarget.dataset;

		if(!dataset["pressed"]) {
			oscList[dataset["note"]] = playTone(dataset["frequency"]);
			dataset["pressed"] = "yes";
		}
	} 
}

function noteReleased(event) {
	let dataset = event.currentTarget.dataset;

	if(dataset && dataset["pressed"]) {
		oscList[dataset["note"]].stop();
		oscList[dataset["note"]] = null;
		delete dataset["pressed"];
	}
}

function changeVolume(event) {
	masterGainNode.gain.value = volumeControl.value;
}

function playTone(freq) {
	let osc = audioContext.createOscillator();
	osc.connect(masterGainNode);
	osc.type = wavePicker.options[wavePicker.selectedIndex].value;
	osc.frequency.value = freq;

	osc.start();

	return osc;
}