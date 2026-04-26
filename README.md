# SecureFile - Military-Grade Client-Side File Encryption 
 
Live Demo: https://furqankhan1504.github.io/SecureFile/ 
 
--- 
 
## Overview 
 
SecureFile is a fully client-side file encryption web application. 
Your files never leave your device. All encryption and decryption 
happens locally using the Web Crypto API. 
 
No backend. No cloud. No compromise. 
 
--- 
 
## Features 
 
- AES-256-GCM Encryption - Industry-standard authenticated encryption 
- PBKDF2 Key Derivation - Password stretching with 100,000 iterations 
- 100 Percent Client-Side - Your files never touch a server 
- Any File Type - Encrypt documents images archives and more 
- Beautiful Dark UI - Glassmorphism design with particle background 
- Zero Dependencies - No backend no accounts no registration 
- Open Source - Fully auditable code no hidden logic 
- Responsive Design - Works on desktop and mobile browsers 
- Tamper Detection - GCM tag detects any file modification 
 
--- 
 
## Tech Stack 
 
- HTML5 - Structure and File API 
- Tailwind CSS - Utility-first styling 
- Vanilla JavaScript - Core application logic 
- jQuery - DOM manipulation and events 
- Web Crypto API - AES-256-GCM and PBKDF2 native browser 
 
--- 
 
 
## How To Use 
 
### Encrypting a File 
1. Open "SecureFile" in any modern browser 
2. Click the Encrypt tab 
3. Drag and drop your file or click to browse 
4. Enter a strong password 
5. Click Encrypt File and your .enc file downloads automatically 
 
### Decrypting a File 
 
1. Click the Decrypt tab 
2. Upload your .enc file 
3. Enter the exact same password used during encryption 
4. Click Decrypt File and your original file is restored 
 
--- 
 
## Security 
 
- Cipher: AES-256-GCM Authenticated Encryption 
- Key Derivation: PBKDF2-SHA256 100,000 iterations 
- Salt: 16 bytes cryptographically random per file 
- IV Nonce: 12 bytes cryptographically random per encryption 
- Authentication: GCM tag prevents silent tampering 
- Entropy Source: crypto.getRandomValues() browser native 
 
Important Security Notes: 
- Password strength matters. Use a long random passphrase. 
- Never share your password through the same channel as the file. 
- No password recovery. Forgotten passwords cannot be recovered. 
- For maximum security run SecureFile completely offline. 
 
--- 
 
 
## Project Structure 
 
SecureFile/ 
- index.html 
- script.js 
- README.md 
- LICENSE  - SECURITY.md 
- CONTRIBUTING.md 
- .gitignore 
- screenshots 
 
--- 
 
## License 
 
This project is licensed under the MIT License. 
 
--- 
 
## Author 
 
Furqan-Muneeb-Umer
 
If SecureFile helped you please consider giving it a star! 
