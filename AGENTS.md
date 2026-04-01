# 🤖 AGENTS.md

Welcome to the **R2 Bro** repository! As an AI agent working on this codebase, please follow these instructions for maintaining the project.

## 🧪 Test Environment

To install and set up the test environment, use:
```bash
npm install --save-dev jest
```
Ensure that `package.json` includes the following script:
```json
"scripts": {
  "test": "jest"
}
```

## 📦 Package Updates

To check for outdated packages, run:
```bash
npm outdated
```

## 🛡️ Security Verification

To perform a security audit on the dependencies, run:
```bash
npm audit
```
If vulnerabilities are found, you can attempt to fix them with `npm audit fix`.
