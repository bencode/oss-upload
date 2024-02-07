#!/usr/bin/env node

require('dotenv').config()

const fs = require('fs')
const pathUtil = require('path')
const glob = require('glob')
const OSS = require('ali-oss')

process.on('unhandledRejection', err => {
  throw err
})

const pkg = require('../package.json')

async function upload(files, from, to, config) {
  const store = new OSS(config)
  // eslint-disable-next-line
  for (const file of files) {
    p(`upload: ${file}`)
    const path = pathUtil.join(from, file)
    const dist = pathUtil.join(to, file).replace(/^[/\\]/, '')
    // eslint-disable-next-line
    const res = await store.put(dist, fs.createReadStream(path))
    p(res.url)
  }
}

function p(...args) {
  global.console.log(...args)
}
