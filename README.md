<div align="center">

<img src="public/logo.png" alt="OnlyYou | Club Logo" width="240" />

# OnlyYou | Club — Web Platform

**Modern, Creator-First Adult & Entertainment Media Platform built with Next.js 14, TypeScript & Tailwind CSS.**

[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Archived%20%2F%20Open%20Source-ff69b4?style=for-the-badge)](#-project-status)

<p align="center">
  <a href="#-about-the-project">About</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-license">License</a>
</p>

---

</div>

## 📢 Project Status

> [!NOTE]
> **This project has officially reached the end of its active production lifecycle and has been open-sourced for the community!**
> 
> You are free to fork, customize, learn from, or self-host this platform for your own community or media streaming service. All commercial services associated with `onlyyouhub.com` have concluded.

---

## 🌟 About The Project

**OnlyYou | Club** is a full-featured, high-performance media discovery and creator hub web platform designed to seamlessly connect content creators with their fans. 

Built with the modern **Next.js 14 App Router**, it provides a seamless user experience featuring a custom video streaming engine, chunked large file uploads, a creator dashboard, an administrative panel with live traffic stats, and Discord OAuth2 integration.

---

## ✨ Key Features

### 🎬 Custom High-Performance Video Player
- **Adaptive Multi-Quality Streaming**: Instant switching between 1080p HD, 720p HD, 480p, 360p, 240p, and 144p while preserving playback position.
- **Flawless Fullscreen Mode**: Auto-scaling across ultra-wide, 1080p, and 4K displays with zero letterbox distortion.
- **Controls & Shortcuts**:
  - `Space` / `K` — Play / Pause
  - `F` — Toggle Fullscreen
  - `M` — Mute / Unmute
  - Double-click on video to toggle fullscreen.
  - Interactive scrub bar with live time buffer indicators.

### 📦 Resilient Chunked File Upload Engine
- Built-in multi-part / chunked file uploader allowing users and creators to upload large video files without browser timeouts or proxy limits.
- Client-side slice management with auto-retry and real-time progress percentage bar.

### 🛡️ 18+ Age Verification Gate & Compliance
- Modern, bilingual 18+ age disclaimer modal on first visit.
- Persistent compliance tracking (cookie / localStorage).
- Strict separation of public metadata vs. adult content for search engines and social crawlers.

### 📊 Creator Dashboard & Community Features
- **Creator Studio**: Profile editor, banner and avatar personalization, social links, and Discord integration.
- **Post Management**: Video and image post creation, tag classification, and category filtering.
- **Analytics**: Overview of total views, likes, follower growth, and post interactions.

### 👑 Admin Control Panel (`/admin`)
- **Live Analytics**: Unique visitor tracking, registered member counter, verified creators counter, and total content statistics.
- **Official Platform Publishing**: Publish announcements and official videos directly under the verified `OnlyYou | Club` organization handle.
- **Creator Management & Content Moderation**: Instant badge management, verification toggling, and report moderation.

### 🌐 Internationalization & SEO
- **Bilingual Engine**: Native support for **Polish (PL)** and **English (EN)** with dynamic switching.
- **Search Engine Optimization**: Complete metadata suite, OpenGraph cards, Twitter cards, dynamic `sitemap.xml`, and `robots.txt`.
- **Discord OAuth2**: Single sign-on with Discord, synchronizing avatars, roles, and profiles.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict mode, full type-safety) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (Custom dark luxury aesthetic) |
| **Animation & UI** | [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Authentication** | Discord OAuth2 / Session Cookies |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **npm** or **pnpm** / **yarn**
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/UhcWolfe/OnlyYouHub.com.git
   cd OnlyYouHub.com
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   *(Fill in your Discord application credentials and API URLs in `.env.local`)*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## ⚙️ Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_DOMAIN=onlyyouhub.com

# Backend API Configuration
ONLYYOU_API_URL=http://localhost:3000/api/v1
ONLYYOU_API_SECRET=your_super_secret_key_here

# Discord OAuth2 Integration
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_GUILD_ID=your_discord_server_id
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/your_invite_code

# Session Security
SESSION_SECRET=your_session_encryption_secret_minimum_32_characters
```

---

## 📂 Project Structure

```text
src/
├── app/                          # Next.js 14 App Router routes
│   ├── page.tsx                  # Landing page (Discovery & Trending feeds)
│   ├── explore/                  # Content discovery with filter tags
│   ├── creators/                 # Creator index and rankings
│   ├── trending/                 # Trending content algorithm
│   ├── post/[id]/                # High-focus custom video player & post view
│   ├── creator/[username]/       # Creator profile & portfolio
│   ├── admin/                    # Admin Dashboard (Stats, Moderation, Official Posts)
│   ├── dashboard/                # Creator Studio (Uploads, Analytics, Settings)
│   ├── api/                      # Backend-For-Frontend Route Handlers
│   │   ├── auth/                 # Discord OAuth2 flow & session endpoints
│   │   ├── upload/chunk/         # Chunked video upload handler
│   │   ├── admin/                # Admin stats & official publications
│   │   └── posts/                # Posts CRUD & access control
├── components/                   # Modular React UI Components
│   ├── posts/                    # CustomVideoPlayer, PostCard, PostGrid
│   ├── creators/                 # CreatorCard, CreatorHeader, FollowButton
│   ├── navigation/               # Navbar, MobileNav, Footer, LanguageSwitcher
│   ├── auth/                     # AgeGateModal (18+ verification)
│   └── ui/                       # Buttons, Badges, Modals, Inputs, Skeletons
├── lib/                          # Utilities & Helpers
│   ├── api/                      # Strongly-typed API client
│   ├── auth/                     # Discord session manager
│   └── i18n/                     # Bilingual dictionary helpers (PL / EN)
├── locales/                      # Localization dictionaries
│   ├── pl.json                   # Polish translations
│   └── en.json                   # English translations
└── types/                        # TypeScript DTOs & Domain interfaces
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/UhcWolfe/OnlyYouHub.com/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Created with ❤️ by the OnlyYou Community. Released as open-source for developers everywhere.</sub>
</div>
