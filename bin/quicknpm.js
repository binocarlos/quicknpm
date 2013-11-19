#!/usr/bin/env node

/**
 * Module dependencies.
 */
var version = require(__dirname + '/../package.json').version;
var program = require("commander");
var path = require('path');

var QuickNPM = require('../src');

program
  .version(version)

program
  .command('init [folder]')
  .description('create a new npm module in the current folder')
  .action(function(folder){
    
    folder = folder || path.normalize(process.cwd());

    var job = new QuickNPM();
    
    job.init(folder, function(){
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