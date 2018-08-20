# ali-oss-uploader


## Usage

1. install package

```shell
npm install --save ali-oss-uploader
```

2. add an oss config file `oss.secret.json` in your project.

```json
{
  "region": "oss-cn-shanghai",
  "bucket": "demo-static",
  "accessKeyId": "LBAIYlDPfrk6reuW",
  "accessKeySecret": "avfkJIKe0L5tayleyjBmT8wlRKBmZd"
}
``**

**you should add this secret file to project `.gitignore` for preventing commit.**


```
*.secret.*
```

3. run upload command

```shell
ali-oss-uploader pirv/static -o / -c config/oss.secret.json
```

```shell
ali-oss-uploader -h  # for help
```
