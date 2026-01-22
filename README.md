# 🦁 LionScript Network

Full-stack chat application with WebSocket real-time communication.

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- Anthropic API Key

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/lionscript.git
cd lionscript
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:
```env
ANTHROPIC_API_KEY=your_actual_key_here
PORT=3000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

## 🔑 Getting API Keys

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create an account
3. Generate an API key
4. Add it to your `.env` file

## 📁 Project Structure
```
├── public/          # Static files
├── routes/          # API routes
├── src/             # Frontend source
├── controllers/     # Backend controllers
├── config/          # Configuration files
└── server.js        # Express server
```

## 🛠️ Built With

- React + Vite
- Express.js
- WebSocket
- Material-UI
- Anthropic Claude API

## 📝 License

MIT

## 👤 Author
Omar ahmad