#!/usr/bin/env node


const fs = require('fs');
const pathUtil = require('path');
const glob = require('glob');
const OSS = require('ali-oss');
const program = require('commander');
const { promisify, each } = require('bluebird');


// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const pkg = require('../package.json');


program
  .version(pkg.version)
  .arguments('<dir>')
  .option('-o, --output <dir>', 'remote directory')
  .option('-c, --config <file>', 'oss config file')
  .parse(process.argv);


main(program);


async function main({ args: [from], output, config }) {
  if (!from || output === undefined) {
    program.outputHelp();
    return;
  }

  from = pathUtil.resolve(from);
  const configPath = pathUtil.resolve(config || 'oss.config');
  const configObj = require(configPath);
  await upload(from, output, configObj);
}


async function upload(from, to, config) {
  const files = await promisify(glob)('**/*.*', { cwd: from });
  const store = new OSS(config);

  each(files, async file => {
    const path = pathUtil.join(from, file);
    p(`upload: ${file}`);
    const dist = pathUtil.join(to, file).replace(/^[/\\]/, '');
    const res = await store.put(dist, fs.createReadStream(path));
    p(`ok: ${res.url}`);
  });
}


function p(...args) {
  console.log(...args);  // eslint-disable-line
}
