import Tone from "Tone";
import Instrument from "./instrument";

export class DuoSynth extends Instrument {
	constructor() {
		let envelope = {
			attack: 0.1,
			release: 4,
			releaseCurve: 'linear'
		};
		let filterEnvelope = {
			baseFrequency: 200,
			octaves: 2,
			attack: 0,
			decay: 0,
			release: 1000,
		};

		super(new Tone.DuoSynth({
			harmonicity: 2,
			voice0: {
				oscillator: {type: 'sawtooth'},
				envelope,
				filterEnvelope
			},
			voice1: {
				oscillator: {type: 'sine'},
				envelope,
				filterEnvelope
			},
			vibratoRate: 0.5,
			vibratoAmount: 0.1
		}), -20);
	}
}