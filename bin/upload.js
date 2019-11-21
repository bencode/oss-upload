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
  .option('-C, --clear', 'clear remote directory before uploading')
  .option('-c, --config <file>', 'oss config file')
  .parse(process.argv);


main(program);


async function main({ args: [from], output, clear, config }) {
  if (!from || output === undefined) {
    program.outputHelp();
    return;
  }

  from = pathUtil.resolve(from);
  const configPath = pathUtil.resolve(config || 'oss.config');
  const configObj = require(configPath);
  await upload(from, output, clear, configObj);
}


async function upload(from, to, clear, config) {
  const store = new OSS(config);

  if (clear) await deleteByPrefix(store, to);

  const files = await promisify(glob)('**/*.*', { cwd: from, nodir: true });
  each(files, async file => {
    const path = pathUtil.join(from, file);
    p(`upload: ${file}`);
    const dist = pathUtil.join(to, file).replace(/^[/\\]/, '');
    const res = await store.put(dist, fs.createReadStream(path));
    p(`ok: ${res.url}`);
  });
}


async function deleteByPrefix(store, prefix) {
  const MAX_KEYS = 1000;
  let allFiles = [];

  async function remove() {
    const result = await store.list({ prefix: prefix, 'max-keys': MAX_KEYS });
    if (result.objects) {
      const objects = result.objects.map(object => object.name);
      const deleted = await store.deleteMulti(objects);
      allFiles = allFiles.concat(deleted.deleted);
      if (result.objects.length === MAX_KEYS) await remove();
    }
  }

  await remove();
  p(`delete ${allFiles.length} files.`);
  allFiles.map(path => p(`  ${path}`));
}


function p(...args) {
  console.log(...args);  // eslint-disable-line
}
