/*jshint node:true*/
"use strict";

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const buildServer = require('./build-server');
const path = require('path');
const detectChanges = require('./detect-changes');
const fs = require('fs');
const fork = require('child_process').fork;
const rimraf = require('rimraf');
// const walkSync = require('walk-sync');
const copyDereferenceSync = require('copy-dereference').sync;
const portfinder = require('portfinder');

let changed = false;
let server = null;
let proxy = null;

function startServer(sourceDir, cwd) {
  return new Promise(resolve => {
    portfinder.getPort((err, port) => {
      rimraf.sync(cwd);
      copyDereferenceSync(sourceDir, cwd)

      server = fork(path.join('index.js'), {
        cwd,
        env: {
          PORT: port
        },
      });

      proxy = require('http-proxy').createProxyServer({
        target: 'http://127.0.0.1:'+port,
        ws: true,
        secure: false,
        changeOrigin: true,
        xfwd: true
      });

      proxy.on('error', function (e) {
        console.log('Error proxying ', e);
      });

      let srv = server;
      server.on('exit', () => {
        if(server === srv) {
          server = null
        }
      });

      server.on('message', msg => {
        if(msg === 'READY') {
          resolve();
        }
      });
    })
  })
}

module.exports = {
  name: 'ember-black',

  postprocessTree(type, tree) {
  	if(type === 'all') {
	  	console.log('provide tree');
	  	let blackServer = new detectChanges([new Funnel(buildServer(new Funnel('black-server')), {
	  		destDir: 'black-server'
	  	})], {
        onChange: c => changed = c
      });

      let packageJson = JSON.parse(fs.readFileSync('package.json'));
      let deps = new MergeTrees(Object.keys(packageJson.dependencies).map(d => {
        return new Funnel('node_modules/'+d, {
          destDir: 'node_modules/'+d
        });
      }));

	  	let output = new Funnel(path.join(__dirname, 'output'));

	  	return new MergeTrees([tree, blackServer, output, deps]);
  	}

  	return tree;
  },

  postBuild(result) {
    if(changed) {
      console.log('notice server change...', changed)
      if(server) {
        console.log('kill server...')
        server.kill()

        console.log('restart server...', changed)
        return startServer(result.directory, changed).then(() => {
          changed = false;
        });
      } else {
        console.log('start server...', changed)
        return startServer(result.directory, changed).then(() => {
          changed = false
        })
      }
    }
  },

  serverMiddleware(options) {
    console.log('setup proxy...');
    var app = options.app, server = options.options.httpServer;
    options = options.options;

    var morgan = require('morgan');

    options.ui.writeLine('Proxying to backend... ');

    server.on('upgrade', function (req, socket, head) {
      options.ui.writeLine('Proxying websocket to ' + req.url);
      proxy.ws(req, socket, head);
    });

    app.use(morgan('dev'));
    app.use(function(req, res) {
      console.log('==========');
      return proxy.web(req, res);
    });
  },

  isDevelopingAddon: function() {
    return true;
  }
};