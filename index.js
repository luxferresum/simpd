"use strict";
import "babel-polyfill";

import Mpd from './lib/Mpd.js';

async function run() {
	let mpd = new Mpd('labblaster', 6600);

	let curr = await mpd.currentsong();

	console.log("======DEBUG:=====");


	console.log(curr);
}

run();