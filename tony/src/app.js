import Tone from "Tone";

var _ = require('underscore');

var default_kit = require('../static/assets/kits/default_kit.json');
var hip_hop_kit = require('../static/assets/kits/hip_hop_kit.json');

Nexus.context = Tone.context;

var keys = initialize_sampler(default_kit);

var sequencer = new Nexus.Sequencer('#sequencer', {
	'size': [400, 100],
	'mode': 'toggle',
	'rows': 4,
	'columns': 16
});

var clear_pattern_btn = new Nexus.Button('#clear-pattern', {
	'size': [20, 20],
	'mode': 'aftertouch',
	'state': false
});

var random_pattern_btn = new Nexus.Button('#random-pattern', {
	'size': [20, 20],
	'mode': 'aftertouch',
	'state': false
});

var hip_hop_pattern_btn = new Nexus.TextButton("#hip-hop-pattern", {
	'size': [150, 50],
	'state': false,
	'text': 'HipHop!'
});

var bpm_slider = new Nexus.Slider('#bpm-slider', {
	'size': [120, 20],
	'mode': 'relative',
	'min': 60,
	'max': 140,
	'step': 0,
	'value': 60000 / (Tone.Transport.bpm.value*4)
});

bpm_slider.on('change', function(v) {
	console.log(v);

	Tone.Transport.bpm.value = v;

	let ms = 60000 / (v * 4);
	sequencer.interval.ms(ms);
})

clear_pattern_btn.on('change', function(v) {
	sequencer.matrix.populate.all(0);
});

random_pattern_btn.on('change', function(v) {
	sequencer.matrix.populate.all( [0.2, 0.5, 0.2, 0.8] );
})

hip_hop_pattern_btn.on('change', function(v) {
	if(v)
		return;

	sequencer.stop();
	keys.dispose();
	keys = initialize_sampler(hip_hop_kit);
});

sequencer.on('step', function(v) {
	for(var i = 0; i < v.length; i++) {
		if(v[i] == 1) {
			// cell is alive!
			keys.get(i).start();
		}
	}
});

Tone.Transport.start();

function initialize_sampler(json_kit) {
	return new Tone.Players(
		to_url_map(json_kit.samples),
		{
			"onload": function() {
				// TODO: Activate UI!
				sequencer.start();
			},
			"volume": -10
		}
	).toMaster();
}

function initialize_synth(synth) {
	var synth = new Tone.FMSynth();

	return synth.toMaster();
}

function to_url_map(array) {
	let idx = 0;
	let map = []

	while(idx < array.length) {
		map[idx] = array[idx];
		idx++;
	}

	return map;
}

