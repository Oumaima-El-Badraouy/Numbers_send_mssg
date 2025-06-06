

# 📤 WhatsApp Bulk Message Sender (via Excel Upload)

This project allows users to upload an Excel file containing phone numbers, then automatically sends WhatsApp messages to those numbers.

## 🚀 Features

* Upload Excel files (`.xlsx`)
* Automatically extract phone numbers
* Connect to WhatsApp Web using `whatsapp-web.js`
* Send custom messages
* Real-time feedback via `Socket.io` (QR code, connection, status)

## 🛠️ Tech Stack

* **Node.js** + **Express.js**
* **whatsapp-web.js** – WhatsApp automation
* **xlsx** – Read and parse Excel files
* **multer** – Handle file uploads
* **puppeteer** – Headless browser support
* **socket.io** – Real-time communication
* **fs-extra** – File system management

## 📦 Installation

```bash
git clone https://github.com/your-username/project-name.git
cd project-name
npm install
```

## ▶️ Run the server

```bash
npm start
```

## 📁 Project Structure

```
├── server.js
├── /uploads         # Uploaded Excel files
├── /controllers     # Logic for Excel parsing & WhatsApp sending
├── /utils           # Helper functions
└── /public          # Front-end assets (upload form, QR display, etc.)
```

## 📋 Excel File Format

The uploaded `.xlsx` file must contain a single column of phone numbers in international format:

| Number        |
| ------------- |
| +212612345678 |
| +212612345679 |

## ✅ How it Works

1. Client uploads an Excel file through the web UI.
2. Server extracts phone numbers from the file.
3. WhatsApp Web opens and displays a QR code to scan.
4. Once connected, messages are sent to the listed numbers.

## ⚠️ Limitations

* Requires WhatsApp QR code scan every time the server restarts.
* This is not an official WhatsApp API and may be limited or blocked by WhatsApp if abused.
* Message volume should be managed to avoid detection.


