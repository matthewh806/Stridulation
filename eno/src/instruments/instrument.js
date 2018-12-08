export default class Instrument {
	constructor(synth, volume) {
		this.synth = synth;
		this.synth.volume.value = volume;
	}

	triggerAttackRelease(note, duration, time) {
		this.synth.triggerAttackRelease(note, duration, time);
	}

	setNote(note, time) {
		this.synth.setNote(note, time);
	}
}