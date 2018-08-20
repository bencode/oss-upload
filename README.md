# ali-oss-uploader


## Usage

### 1. Install package

```shell
npm install --save ali-oss-uploader
```

### 2. Add an oss config file `oss.secret.json` under your project's directory.

```json
{
  "region": "oss-cn-shanghai",
  "bucket": "demo-static",
  "accessKeyId": "LBAIYlDPfrk6reuW",
  "accessKeySecret": "avfkJIKe0L5tayleyjBmT8wlRKBmZd"
}
```

**you should add this secret file to `.gitignore` file for preventing commit.**


```
*.secret.*
```

### 3. Run upload command

```shell
ali-oss-uploader dist -o /collab-static -c config/oss.secret.json

# upload to backet root dir
ali-oss-uploader priv/static -o / -c config/oss.secret.json

# you can omit arg `-c` if put config file in default location: $project/oss.secret.json
ali-oss-uploader dist -o '/'
```

### 4. For help

```shell
ali-oss-uploader -h  # for help


Usage: ali-oss-uploader [options] <dir>

  Options:

    -V, --version        output the version number
    -o, --output <dir>   remote directory
    -c, --config <file>  oss config file
    -h, --help           output usage information
```
