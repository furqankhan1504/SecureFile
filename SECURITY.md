# Security Policy

## Supported Versions

Only the latest main branch is supported.

## Reporting a Vulnerability

If you discover a vulnerability do NOT open a public GitHub issue.

Email: furqankhan6294@gmail.com
Subject: SECURITY SecureFile Vulnerability Report
Include: Description, steps to reproduce, impact, suggested fix

We will respond within 48 hours and fix within 7 days.

## Security Design Principles

- All crypto uses Web Crypto API browser-native and audited
- No data is transmitted to any server at any point
- No analytics trackers or third-party scripts loaded at runtime
- Follows NIST recommendations for AES-256-GCM and PBKDF2
- Random values via crypto.getRandomValues() only

Thank you for helping keep SecureFile safe.
