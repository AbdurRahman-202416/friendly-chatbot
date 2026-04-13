# Friendly Chatbot — AI Assistant

A modern, real-time AI chatbot powered by **Groq + Llama 3.3**. This application features a clean, professional light-blue theme, custom image-based avatars, and a fully persistent message history.

![Design Preview](https://github.com/user-attachments/assets/ae2de9a1-0260-496e-9875-108746961914)

## ✨ Features

- ⚡ **Groq Acceleration**: Ultra-fast AI responses using Groq's high-performance inference.
- 🎨 **Modern UI**: Custom branded theme in `#DDE6ED` (Light Blue) and `#0C2C55` (Navy).
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop.
- 💾 **Persistent Chat**: Conversations are saved to `localStorage` so you never lose your history.
- 🖼️ **Image Avatars**: Personalized AI and User avatars using custom image assets.
- 📝 **Markdown Support**: Beautiful rendering for code blocks, lists, and tables.

## 🚀 Getting Started

### 1. Prerequisite: API Key
You need a Groq API key to use this chatbot. You can get one for free at [console.groq.com](https://console.groq.com/).

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your key:
```env
GROQ_API_KEY=your_key_here
```

> [!CAUTION]
> **IMPORTANT**: Never upload your `.env.local` file to GitHub. It contains your private API key. The project's `.gitignore` should already be configured to prevent this.

### 3. Installation
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)

## 📄 License
This project is for educational and personal use.
# friendly-chatbot
