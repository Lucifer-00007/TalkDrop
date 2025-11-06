# TalkDrop 💬

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

A modern, real-time chat application built with Next.js. Create or join chat rooms instantly with no registration required.

## ✨ Features

- 🚀 **Instant Setup** - Create or join rooms in seconds
- 💬 **Real-time Chat** - Messages appear instantly with typing indicators
- 🔒 **Anonymous & Safe** - No registration required, automatic message cleanup
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌙 **Dark Mode** - Built-in theme switching
- 📦 **Static Export** - Deploy anywhere with static hosting

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build**: Static export for universal deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lucifer-00007/TalkDrop.git
   cd TalkDrop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

This generates a static `out/` folder that can be deployed to any static hosting service.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Firebase Hosting

```bash
npm run deploy
```

## 🎯 Usage

1. **Enter your display name** on the homepage
2. **Create a new room** or **join an existing one**
3. **Start chatting** - messages appear in real-time
4. **Share the room ID** with others to invite them

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── room/[id]/      # Dynamic room pages
│   └── page.tsx        # Homepage
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (shadcn/ui)
│   └── ...            # Feature components
├── constants/         # App constants and configuration
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── styles/           # Global styles
```

## 🔧 Configuration

### Environment Variables

No environment variables required for basic functionality.

### Next.js Config

The app is configured for static export in `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for beautiful icons

---

<div align="center">
  <p>Made with ❤️ for seamless communication</p>
  <p>
    <a href="https://github.com/Lucifer-00007/TalkDrop/issues">Report Bug</a>
    ·
    <a href="https://github.com/Lucifer-00007/TalkDrop/issues">Request Feature</a>
  </p>
</div>