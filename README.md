# ali-oss-uploader


## Usage

1. install package

```shell
npm install --save ali-oss-uploader
```

2. add an oss config file `oss.secret.json` under your project directory.

```json
{
  "region": "oss-cn-shanghai",
  "bucket": "demo-static",
  "accessKeyId": "LBAIYlDPfrk6reuW",
  "accessKeySecret": "avfkJIKe0L5tayleyjBmT8wlRKBmZd"
}
```

**you should add this secret file to project's `.gitignore` file for preventing commit.**


```
*.secret.*
```

3. run upload command

```shell
ali-oss-uploader pirv/static -o / -c config/oss.secret.json
```

4. for help

```shell
ali-oss-uploader -h  # for help


Usage: ali-oss-uploader [options] <dir>

  Options:

    -V, --version        output the version number
    -o, --output <dir>   remote directory
    -c, --config <file>  oss config file
    -h, --help           output usage information
```
