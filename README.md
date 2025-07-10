# PrivacyLens

A comprehensive React Native mobile app that evaluates and compares the privacy practices of mobile applications. PrivacyLens provides detailed privacy scores, rankings, and actionable insights to help users make informed decisions about their digital privacy.

## 🚀 Features

### Core Functionality
- **🔍 Advanced Search** - Real-time search with category filtering and recent searches
- **📊 Privacy Rankings** - Compare apps by privacy scores with multiple sorting options
- **📱 Detailed App Analysis** - Comprehensive privacy breakdowns with visual indicators
- **🏠 Dashboard** - Clean home interface with statistics and recent analysis
- **ℹ️ About & Information** - App details, team info, and privacy guides

### User Experience
- **🎯 Intuitive Navigation** - Tab-based navigation with slide-out drawer menu
- **🎨 Modern UI/UX** - Consistent design system with smooth animations
- **📋 Interactive Components** - Touch-friendly cards, buttons, and modals
- **🔄 Real-time Updates** - Dynamic content loading and filtering

## 🏗️ Project Structure

```
PrivacyLens/
├── app/                          # Main app screens
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── _layout.js           # Tab layout configuration
│   │   ├── index.js             # Home screen
│   │   ├── ranking.js           # App rankings
│   │   └── about.js             # About screen
│   ├── _layout.js               # Root layout
│   ├── app-details.js           # App detail screen
│   ├── privacy-dashboard.js     # Privacy dashboard
│   └── search.js                # Search screen
├── src/                         # Source code
│   ├── components/              # Reusable UI components
│   │   ├── AppCard.js          # App display card
│   │   ├── SearchBar.js        # Search input component
│   │   └── DrawerMenu.js       # Slide-out navigation menu
│   ├── data/                   # Data management
│   │   └── mockData.js         # Mock app data and utilities
│   ├── styles/                 # Design system
│   │   ├── colors.js           # Color palette
│   │   └── typography.js       # Font styles
│   └── utils/                  # Utility functions
│       └── privacyUtils.js     # Privacy scoring logic
├── assets/                     # Static assets
│   ├── logo.png               # App logo
│   ├── icon.png               # App icon
│   ├── splash-icon.png        # Splash screen
│   └── adaptive-icon.png      # Adaptive icon
├── app.json                   # Expo configuration
├── package.json              # Dependencies
└── README.md                 # Project documentation
```

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shakeelkhuhro/PrivacyLens.git
   cd PrivacyLens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on device:**
   - **Mobile:** Scan QR code with Expo Go app
   - **Web:** Press `w` in terminal
   - **Android Emulator:** Press `a` in terminal
   - **iOS Simulator:** Press `i` in terminal

## 📊 App Data Structure

### Privacy Scoring System
Apps are evaluated based on multiple privacy factors:
- **Data Collection** - Types and amount of personal data collected
- **Data Sharing** - Third-party sharing practices
- **Encryption** - Data protection methods
- **Permissions** - Required device permissions
- **Trackers** - Number of third-party trackers

## 🎨 Design System

### Color Palette
- **Primary:** Modern blue tones for trust and security
- **Secondary:** Accent colors for highlights and actions
- **Status:** Green (good privacy), Red (poor privacy), Orange (moderate)

### Typography
- **Headings:** Bold, clear hierarchy
- **Body:** Readable, consistent sizing
- **Captions:** Subtle, informative text

## 📋 Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** Expo Router (file-based routing)
- **UI Components:** Custom components with React Native
- **Icons:** React Native Vector Icons
- **Styling:** StyleSheet with custom design system
- **State Management:** React useState/useEffect
- **Data:** Mock data with utility functions

## 🔒 Privacy Features

- **Zero Data Collection** - App doesn't collect user data
- **Local Processing** - All analysis done on device
- **Educational Focus** - Helps users understand privacy risks
- **Transparent Scoring** - Clear privacy evaluation criteria

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

**Made with ❤️ for digital privacy awareness**

## 🐛 Bug Reports

Found a bug? Please create an issue on our [GitHub repository](https://github.com/shakeelkhuhro/PrivacyLens/issues).

## 📊 Analytics

This app uses no analytics or tracking. Your privacy is our priority.