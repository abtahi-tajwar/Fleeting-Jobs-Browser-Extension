# Fleeting Jobs Browser Extension

The browser extension for Fleeting Jobs.

It assists users with job applications by detecting application form fields, mapping them to the user's Fleeting Jobs profile, and eventually autofilling application forms.

## Tech Stack

- TypeScript
- React
- Vite
- Chrome Extensions Manifest V3
- Chrome Extension APIs

## Architecture

The extension is divided into several parts:

```text
src/
├── background/
│   └── Extension service worker
│
├── content/
│   ├── DOM interaction
│   ├── Form field detection
│   └── Form autofill
│
├── popup/
│   └── Extension user interface
│
└── shared/
    ├── Shared types
    └── Extension messages