"use strict"

import "babel-polyfill"

import Mpd from './lib/Mpd.js'
import {start} from './lib/static.js'

async function run() {
	// let mpd = new Mpd('labblaster', 6600);

	// try {
	// 	//let curr = await mpd.lsinfo('00_music/autosort')

	// 	let t = await mpd.test();

	// 	console.log("======DEBUG OK:=====");

	// 	console.log(t);
	// } catch (e) {
	// 	console.log("======DEBUG ERROR:=====");
	// 	console.log(e);
	// }
}

start()
run()