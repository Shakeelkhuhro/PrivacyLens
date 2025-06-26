# PrivacyLens

PrivacyLens is a React Native app that helps users evaluate and compare the privacy practices of different mobile applications. It provides privacy scores, rankings, and detailed breakdowns to empower users to make informed decisions about the apps they use.

## Features

- **Search** for apps and view privacy scores
- **Ranking** of apps by privacy-respecting and data-hungry categories
- **Detailed app cards** with privacy breakdowns
- **Modern UI** using custom styles and icons

## Folder Structure

```
PrivacyLens/
├── app/
│   ├── _layout.js
│   ├── app-details.js
│   ├── index.js
│   ├── privacy-dashboard.js
│   └── (tabs)/
│       └── ranking.js
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/
│   ├── components/
│   │   ├── AppCard.js
│   │   └── SearchBar.js
│   ├── data/
│   │   └── mockData.js
│   ├── styles/
│   │   ├── colors.js
│   │   └── typography.js
│   └── utils/
│       └── privacyUtils.js
├── App.js
├── app.json
├── index.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) or npm

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/PrivacyLens.git
    cd PrivacyLens
    ```

2. Install dependencies:
    ```sh
    yarn install
    # or
    npm install
    ```

3. Start the Expo development server:
    ```sh
    npx expo start
    ```

4. Use the Expo Go app or an emulator to run the project.

## Project Structure

- `app/` - App entry points and navigation
- `src/components/` - Reusable UI components (e.g., `AppCard`, `SearchBar`)
- `src/data/` - Mock data for app listings
- `src/styles/` - Color and typography definitions
- `src/utils/` - Utility functions for privacy scoring

## Customization

- To add new apps or modify privacy data, edit `src/data/mockData.js`.
- To adjust scoring logic, see `src/utils/privacyUtils.js`.
- To change colors or fonts, update files in `src/styles/`.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


