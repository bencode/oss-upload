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
oss-upload dist -o /collab-static -c config/oss.secret.json

 upload to backet root dir
oss-upload priv/static -o / -c config/oss.secret.json

# you can omit arg `-c` if put config file in default location: $project/oss.secret.json
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
