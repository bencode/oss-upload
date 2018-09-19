# oss-upload


## Usage

### 1. Install package

```shell
npm install --save ali-oss-upload-cli
```

### 2. Add an oss config file `oss.secret.json` under your project's directory.

```json
{
  "region": "oss-cn-shanghai",
  "bucket": "demo-static",
  "accessKeyId": "xxxxxx",
  "accessKeySecret": "xxxxxx"
}
```

**you should add this secret file to `.gitignore` file for preventing commit.**

thie config file can be a node module, then you can read id and secret from env.

```js
module.exports = {
  region: 'oss-cn-qingdao',
  bucket: 'qgt-paper',
  accessKeyId: process.env.TEST_OSS_ID,
  accessKeySecret: process.env.TEST_OSS_SECRET,
};
```


### 3. Run upload command

```shell
oss-upload dist -o /collab-static -c config/oss.secret.json

# upload to backet root dir
oss-upload priv/static -o / -c config/oss.secret.json

# config can be a node module
oss-uplaod priv/static -o / -c config/oss.config.js

# you can omit arg `-c` if config file in thie default location: $project/oss.config.js
oss-upload dist -o '/'
```

### 4. For help

```shell
oss-upload -h  # for help


Usage: oss-upload [options] <dir>

  Options:

    -V, --version        output the version number
    -o, --output <dir>   remote directory
    -c, --config <file>  oss config file
    -h, --help           output usage information
```
