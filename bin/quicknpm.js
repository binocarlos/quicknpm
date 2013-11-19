#!/usr/bin/env node

/**
 * Module dependencies.
 */
var version = require(__dirname + '/../package.json').version;
var program = require("commander");
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

program
  .version(version)

program
  .command('init [folder]')
  .description('create a new npm module in the current folder')
  .action(function(folder){
    
    folder = folder || path.normalize(process.cwd());

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
    })
    

  })

// run help if the command is not known or they just type 'digger'
program
  .command('*')
  .action(function(command){
    console.log('quicknpm version ' + version + ' - \'quicknpm --help\' for more info');
  });

if(process.argv.length<=2){
  process.argv.push(['--help']);
}

program.parse(process.argv);