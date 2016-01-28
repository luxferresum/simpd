"use strict";

const nodemon = require('nodemon');

nodemon({
  script: 'build.js',
  args: ['run'],
  ignore: [
  	".git",
  	"bundle.js",
  	"client"
  ]
});

nodemon.on('start', function () {
  console.log('App has started');
}).on('quit', function () {
  console.log('App has quit');
}).on('restart', function (files) {
  console.log('App restarted due to: ', files);
});