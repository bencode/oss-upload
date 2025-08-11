# Ali OSS Upload CLI

A simple and robust CLI for uploading files or directories to Alibaba Cloud OSS.

## Features

- Upload entire directories or specific files.
- Filter files using glob patterns.
- Configure via CLI flags or ".env" file.
- **Atomic uploads** for entry files (like `index.html`) to prevent deployment inconsistencies.
- Adjustable request timeout for large files.

## Installation

Install locally as a development dependency:

```bash
npm install --save-dev ali-oss-upload-cli
```

Or install globally to use from anywhere:

```bash
npm install -g ali-oss-upload-cli
```

## Configuration

Create a `.env` file in your project root:

```ini
# .env
OSS_REGION=your-oss-region
OSS_BUCKET=your-bucket-name
OSS_KEY=your-access-key-id
OSS_SECRET=your-access-key-secret
```
*Remember to add `.env` to your `.gitignore` file.*

## Usage

```bash
oss-upload <local-path> -o <remote-path> [options]
```

-   `<local-path>`: The local file or directory to upload.
-   `-o, --output <remote-path>`: **Required.** The destination path (prefix) in your OSS bucket.

---

## Options

| Flag | Description | Default |
|---|---|---|
| `-o, --output <path>` | **Required.** Remote destination path (prefix). | — |
| `--atomic-entry <glob>` | Glob pattern for entry files to upload atomically. | `null` |
| `--filter <pattern>` | Glob pattern to filter which files to upload. | `**/*` |
| `--region <region>` | OSS region. Overrides `.env`. | `OSS_REGION` |
| `--bucket <name>` | OSS bucket name. Overrides `.env`. | `OSS_BUCKET` |
| `--key <id>` | Access Key ID. Overrides `.env`. | `OSS_KEY` |
| `--secret <secret>` | Access Key Secret. Overrides `.env`. | `OSS_SECRET` |
| `--timeout <ms>` | Request timeout in milliseconds. | `60000` |
| `--envfile <path>` | Path to a custom environment file. | `.env` |
| `-h, --help` | Display the help menu. | — |
| `-v, --version` | Display the tool version. | — |

---

## Examples

**1. Upload a build directory**

```bash
# Uploads the entire 'dist' directory to the '/static' folder in your bucket
oss-upload dist -o /static
```

**2. Upload only specific file types**

```bash
# Upload only .js files from the 'dist' directory
oss-upload dist -o /assets/js --filter "**/*.js"
```

**3. Atomic Upload for a Single-Page App (SPA)**

To prevent users from experiencing a broken site during deployment, you can use atomic uploads. This ensures that your `index.html` is only updated after all its new JS and CSS assets have been successfully uploaded.

```bash
# All assets are uploaded first, then index.html is updated atomically.
oss-upload dist -o / --atomic-entry "index.html"
```
This is the recommended way to deploy web applications.

**4. Use with CI/CD**

Provide credentials directly as flags, ignoring any `.env` file.

```bash
oss-upload dist -o / \
  --region oss-cn-hangzhou \
  --bucket my-app-bucket \
  --key $OSS_ACCESS_KEY_ID \
  --secret $OSS_ACCESS_KEY_SECRET
```

## Environment Variables

The tool will automatically use the following variables from your `.env` file:

-   `OSS_REGION`
-   `OSS_BUCKET`
-   `OSS_KEY`
-   `OSS_SECRET`

CLI flags always take precedence over environment variables.

## License

[MIT](./LICENSE)