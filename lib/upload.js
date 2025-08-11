#!/usr/bin/env node

const dotenv = require('dotenv')
const fs = require('fs')
const pathUtil = require('path')
const { Command } = require('commander')
const { glob } = require('glob')
const micromatch = require('micromatch')
const OSS = require('ali-oss')

const debug = require('debug')('oss-upload')

const pkg = require('../package.json')

/* eslint-disable no-await-in-loop, no-restricted-syntax */

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
    .option('--filter <pattern>', 'Filter the files to upload', '**/*.*')
    .option('--envfile <envfile>', '.env file', '.env')
    .option('--region <region>', 'oss region')
    .option('--bucket <bucket>', 'oss bucket')
    .option('--key <key>', 'oss access key id')
    .option('--secret <secret>', 'oss access key secret')
    .option('--timeout <timeout>', 'upload timeout', '60000')
    .option('--atomic-entry <glob>', 'the entry file to be uploaded atomically')

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
  const allFiles = await glob(args.filter, { cwd: dir, nodir: true })

  const entryFiles = args.atomicEntry ? micromatch(allFiles, args.atomicEntry) : []
  const resourceFiles = allFiles.filter(file => !entryFiles.includes(file))

  debug('entryFiles: %o', entryFiles)
  debug('resourceFiles: %o', resourceFiles)

  const config = {
    accessKeyId: args.key,
    accessKeySecret: args.secret,
    bucket: args.bucket,
    region: args.region,
  }
  debug('oss config: %o', config)
  const timeout = +args.timeout
  await upload({ resourceFiles, entryFiles }, dir, args.output, config, { timeout })
}

async function upload({ resourceFiles, entryFiles }, from, to, config, opts) {
  const store = new OSS(config)

  p('--- Phase 1/4: Uploading resource files ---')
  for (const file of resourceFiles) {
    p(`  uploading: ${file}`)
    const localPath = pathUtil.join(from, file)
    const remotePath = pathUtil.join(to, file).replace(/^[/\\]/, '')
    const res = await store.put(remotePath, fs.createReadStream(localPath), {
      timeout: opts.timeout,
    })
    p(`    success: ${res.url}`)
  }

  if (entryFiles.length === 0) {
    p('\nNo entry files to upload atomically. Done.')
    return
  }

  p('\n--- Phase 2/4: Preparing entry files ---')
  const pendingFiles = []
  const uploadId = Date.now()
  try {
    for (const file of entryFiles) {
      const localPath = pathUtil.join(from, file)
      const remotePath = pathUtil.join(to, file).replace(/^[/\\]/, '')
      const tempRemotePath = `${remotePath}.pending-${uploadId}`
      p(`  uploading to temp: ${file} -> ${tempRemotePath}`)
      const res = await store.put(tempRemotePath, fs.createReadStream(localPath), {
        timeout: opts.timeout,
      })
      pendingFiles.push({ remotePath, tempRemotePath })
      p(`    success: ${res.url}`)
    }
  } catch (e) {
    p('\n--- Upload failed during preparation phase. Cleaning up temp files... ---')
    await cleanup(
      store,
      pendingFiles.map(f => f.tempRemotePath),
    )
    throw e
  }

  // --- Phase 3: Atomically copy/rename entry files to final destinations ---
  p('\n--- Phase 3/4: Atomically switching entry files ---')
  try {
    for (const { remotePath, tempRemotePath } of pendingFiles) {
      p(`  switching: ${tempRemotePath} -> ${remotePath}`)
      await store.copy(remotePath, tempRemotePath)
      p('    success: switched')
    }
  } catch (e) {
    p('\n--- Critical error during atomic switch. Manual intervention may be required. ---')
    // At this point, the system may be in an inconsistent state.
    // We don't clean up temp files to allow for manual recovery.
    throw e
  }

  // --- Phase 4: Clean up temporary files ---
  p('\n--- Phase 4/4: Cleaning up temporary files ---')
  await cleanup(
    store,
    pendingFiles.map(f => f.tempRemotePath),
  )

  p('\nUpload complete!')
}

async function cleanup(store, tempFiles) {
  for (const file of tempFiles) {
    try {
      p(`  deleting: ${file}`)
      await store.delete(file)
      p('    success: deleted')
    } catch (e) {
      p(`    warning: failed to delete temp file ${file}. Manual cleanup may be needed.`)
    }
  }
}

function p(...args) {
  global.console.log(...args)
}
