/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var path = require('path');
var child_process = require('child_process');
var async = require('async');
var copy = require('directory-copy');
var fs = require('fs');


function copy_files(target, done){
  var source = path.normalize(__dirname + '/../template');
  console.log('copy files: ' + source + ' -> ' + target);
  copy(
    { src: source
    , dest: target
    , excludes: []
    }
  , function () {
    console.log('files copied');
    done && done();
  })
  .on('log', function (msg, level) {
    // Level is debug, info, warn or error
    console.log(level + ': ' + msg)
  })
}

function run_command(command, args, options, done){
  var command = child_process.spawn(command, args, options);

  command.on('close', function (code) {
    done && done();
  });
}


function QuickNPM(){
	EventEmitter.call(this);

}

util.inherits(QuickNPM, EventEmitter);

module.exports = QuickNPM;

QuickNPM.prototype.init = function(folder, done){
	var self = this;

	if(done){
		self.on('complete', done);
	}

  async.series([
    function(next){
      copy_files(folder, next);
    },

    function(next){
      run_command('npm', ['init'], {
        cwd:folder,
        stdio: 'inherit'
      }, next);
    },

    function(next){
      run_command('npm', ['install', 'mocha', 'should', '--save'], {
        cwd:folder,
        stdio: 'inherit'
      }, next);
    }
  ], function(error){
    console.log('module created');
    self.emit('complete');
  })
}		