import Tone from "Tone";
import Instrument from "./instrument";

export class KickDrum extends Instrument {
    constructor() {
        super(new Tone.MembraneSynth(), -20);
    }
}