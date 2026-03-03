# 🎓 Vantage Hall Chatbot Server – Production Ready 🚀

An AI-powered chatbot backend built for Vantage Hall.
This system provides intelligent responses using Google Gemini Pro, structured FAQ navigation, emotional support handling, callback requests, and email notifications.

---

## 📁 Project Structure

```
vantage-hall-chatbot/
│
├── public/
│   └── index.html        # Frontend chatbot interface
│
├── server.js             # Main Express server
├── package.json
├── package-lock.json
└── README.md
```

---

## 🌟 Features

* 🤖 Google Gemini Pro AI Integration
* 📚 Dynamic Knowledge Base (Topic-Based)
* ✅ Structured FAQ Navigation
* 💚 Emotional Support with Keyword Detection
* 👧 Single Child Support Module
* 📞 Callback Request System
* 📧 Email Notification Integration
* 🔗 Hyperlinks Included in Responses
* ⬅️ Back-to-Menu Navigation
* 🧪 API Test Endpoint
* 🔧 Production Ready Configuration

---

## 🛠 Tech Stack

* Node.js
* Express.js
* Google Gemini Pro API
* Nodemailer
* HTML Frontend (served from `/public`)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

⚠️ Important:

* Do NOT commit your `.env` file.
* Add `.env` to your `.gitignore`.

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/vantage-hall-chatbot.git
cd vantage-hall-chatbot
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file and add your credentials.

### 4️⃣ Start the Server

```
node server.js
```

If using nodemon:

```
npx nodemon server.js
```

---

## 🌐 Access the Application

After starting the server:

Main Application:

```
http://localhost:5000
```

API Test Endpoint:

```
http://localhost:5000/api/test
```

---

## 📧 Email Configuration Logic

The email system is considered configured when:

```js
EMAIL_CONFIG.auth.user !== 'your-email@gmail.com'
```

If using Gmail:

* Enable 2-Step Verification
* Generate an App Password
* Use the App Password inside `.env`

---

## 🔐 Security Best Practices

* Never commit `.env`
* Protect your Gemini API key
* Use HTTPS in production
* Add rate limiting middleware
* Validate user input

---

## 📦 Production Status

```
🎓 Vantage Hall Chatbot Server - PRODUCTION

✅ AI Model Integrated
✅ Knowledge Base Active
✅ FAQ Navigation Working
✅ Emotional Support Complete
✅ Single Child Support Added
✅ Hyperlinks Enabled
✅ Back to Menu Enabled
✅ Callback System Active
🚀 Ready for GitHub Push
```

---

## 🏗 Deployment Options

You can deploy this project on:

* Render
* Railway
* AWS EC2
* DigitalOcean
* Any VPS supporting Node.js

Remember to configure environment variables on your hosting platform.

---

## 📄 License

MIT License

---
