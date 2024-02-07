#!/usr/bin/env node

const dotenv = require('dotenv')
const fs = require('fs')
const pathUtil = require('path')
const { Command } = require('commander')
const { glob } = require('glob')
const OSS = require('ali-oss')

const debug = require('debug')('oss-upload')

const pkg = require('../package.json')

if (require.main === module) {
  const args = parseArgs(process.argv)
  debug('args: %o', args)
  run(args).catch(e => {
    global.console.error(e)
    process.exit(-1)
  })
}

function parseArgs(argv) {
  const program = new Command()
  program
    .name('oss-upload')
    .description('CLI to upload files to Ali OSS')
    .version(pkg.version)
    .argument('<dir>', 'Directory containing files to be uploaded')
    .option('-o, --output <dir>', 'remote directory')
    .option('--filter <pattern>', 'Filter the files to upload', '**.*')
    .option('--envfile <envfile>', '.env file', '.env')
    .option('--region <region>', 'oss region')
    .option('--bucket <bucket>', 'oss bucket')
    .option('--key <key>', 'oss access key id')
    .option('--secret <secret>', 'oss access key secret')

  program.parse(argv)

  const opts = program.opts()
  const envpath = pathUtil.resolve(process.cwd(), opts.envfile)
  const env = fs.existsSync(envpath) ? dotenv.config({ path: envpath }).parsed : {}

  const oss = {
    region: opts.region || env.OSS_REGION,
    bucket: opts.bucket || env.OSS_BUCKET,
    key: opts.key || env.OSS_KEY || env.OSS_ACCESS_KEY_ID,
    secret: opts.secret || env.OSS_SECRET || env.OSS_ACCESS_KEY_SECRET,
  }

  const from = program.args[0]
  return { from, ...opts, ...oss }
}

async function run(args) {
  const dir = pathUtil.resolve(process.cwd(), args.from)
  const files = await glob(args.filter, { cwd: dir, nodir: true })
  const config = {
    accessKeyId: args.key,
    accessKeySecret: args.secret,
    bucket: args.bucket,
    region: args.region,
  }
  debug('oss config: %o', config)
  await upload(files, dir, args.output, config)
}

async function upload(files, from, to, config) {
  const store = new OSS(config)
  // eslint-disable-next-line
  for (const file of files) {
    p(`upload: ${file}`)
    const path = pathUtil.join(from, file)
    const dist = pathUtil.join(to, file).replace(/^[/\\]/, '')
    // eslint-disable-next-line
    const res = await store.put(dist, fs.createReadStream(path))
    p('upload success: %s', res.url)
  }
}

function p(...args) {
  global.console.log(...args)
}
