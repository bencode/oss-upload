# ali-oss-upload-cli

A command line tool for transferring files to Ali OSS。

## Usage

### 1. install

```shell
npm install --save-dev ali-oss-upload-cli
```

### 2. update .env file

```shell
OSS_REGION=oss-cn-hangzhou
OSS_BUCKET=lesscap
OSS_KEY=xxx
OSS_SECRET=xxx
```

** Don't forget to add the .env file to .gitignore. **

### 3. upload

upload dist dir to remote `/static`

```shell
oss-upload dist -o /static

# upload to bucket root dir
oss-upload dist -o /
```

filter with [glob](https://github.com/isaacs/node-glob)

```shell
oss-upload dist -o /static --glob=**/*.js
```

You can specify all parameters in the command line, which is convenient for use in CI environments.

```shell
oss-upload dist -o /static --region=oss-cn-hangzhou --bucket=lesscap --key=xxx --srcret=xxx
```

### 5. show help

```shell
oss-upload -h
```
