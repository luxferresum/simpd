"use strict";

require('./black-server/index').default()

process.send('READY');