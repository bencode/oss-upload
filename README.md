# ali-oss-upload-cli

A simple, zero-config CLI tool to upload files or directories to Alibaba Cloud OSS.

---

## Features

- Upload entire directories or individual files  
- Support glob patterns to filter uploads  
- Configure via environment variables or CLI flags  
- Adjustable timeout for large uploads  

---

## Table of Contents

- [Installation](#installation)  
- [Configuration](#configuration)  
- [Usage](#usage)  
- [Options](#options)  
- [Examples](#examples)  
- [Environment Variables](#environment-variables)  
- [License](#license)  

---

## Installation

Install as a dev-dependency:

```bash
npm install --save-dev ali-oss-upload-cli
```

Or install globally:

```bash
npm install -g ali-oss-upload-cli
```

---

## Configuration

Create a `.env` file in your project root (and add it to `.gitignore`):

```ini
OSS_REGION=oss-cn-hangzhou
OSS_BUCKET=lesscap
OSS_KEY=your-access-key-id
OSS_SECRET=your-access-key-secret
```

---

## Usage

```bash
oss-upload <local-path> -o <remote-prefix> [options]
```

- `<local-path>`: File or directory to upload.  
- `-o, --output <remote-prefix>`: **Required.** Remote folder (prefix) in your bucket.

---

## Options

| Flag                    | Description                                            | Default     |
| ----------------------- | ------------------------------------------------------ | ----------- |
| `-o, --output <path>`   | Remote path prefix (required)                          | —           |
| `--region <region>`     | OSS region                                             | from `.env` |
| `--bucket <name>`       | OSS bucket name                                        | from `.env` |
| `--key <id>`            | Access key ID                                          | from `.env` |
| `--secret <secret>`     | Access key secret                                      | from `.env` |
| `--filter <pattern>`    | [Glob](https://github.com/isaacs/node-glob) filter     | `**/*`      |
| `--envfile <file>`      | Path to environment file                               | `.env`      |
| `--timeout <ms>`        | Request timeout in milliseconds                        | `60000`     |
| `-h, --help`            | Display help                                          | —           |
| `-v, --version`         | Display version                                       | —           |

---

## Examples

Upload the entire `dist/` directory to `/static`:

```bash
oss-upload dist -o /static
```

Upload only JavaScript files:

```bash
oss-upload dist -o /static --filter "**/*.js"
```

Upload to bucket root (`/`) with a longer timeout:

```bash
oss-upload dist -o / --timeout 120000
```

Provide credentials inline (ideal for CI):

```bash
oss-upload dist -o / \
  --region oss-cn-hangzhou \
  --bucket lesscap \
  --key your-access-key-id \
  --secret your-access-key-secret
```

Use a custom env file:

```bash
oss-upload dist -o /static --envfile .env.test
```

---

## Environment Variables

| Variable      | Description                               |
| ------------- | ----------------------------------------- |
| `OSS_REGION`  | OSS region (e.g. `oss-cn-hangzhou`)       |
| `OSS_BUCKET`  | Bucket name                               |
| `OSS_KEY`     | Access Key ID                             |
| `OSS_SECRET`  | Access Key Secret                         |

---

## License

[MIT](./LICENSE)
