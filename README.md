# oss-upload

## Usage

### 1. Installation

To install, run the following command:

```shell
npm install --save-dev ali-oss-upload-cli
```

### 2. Update the .env File

Configure your environment variables as follows:

```
OSS_REGION=oss-cn-hangzhou
OSS_BUCKET=lesscap
OSS_ACCESS_KEY_ID=xxx
OSS_ACCESS_KEY_SECRET=xxx
```

**Important: Ensure the .env file is added to your .gitignore to protect your credentials.**

### 3. Upload Files

To upload the dist directory to the remote /static directory, use:

```
oss-upload dist -o /static
```

To upload to the bucket's root directory:

```
oss-upload dist -o /
```

To filter files using glob patterns (e.g., only .js files):

```
oss-upload dist -o /static --filter=**/*.js
```

For CI environments, you can specify all parameters directly in the command line for convenience:

```
oss-upload dist -o /static --region=oss-cn-hangzhou --bucket=lesscap --key=xxx --secret=xxx
```

To specify a different .env file:

```
oss-upload dist -o /static --envfile=.env.test
```

### 4. Display Help

To view all available commands and options, run:

```
oss-upload -h
```
