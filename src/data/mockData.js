export const mockApps = [
  {
    id: '1',
    name: 'App App',
    icon: 'app',
    privacyScore: 45,
    dataTypes: ['Location', 'Contacts'],
    shortDescription: 'Collects Location',
    developer: 'App Developer Inc.',
    category: 'Productivity',
    privacyDescription: 'This app collects location data to provide location-based services and may share this information with third-party partners for advertising purposes.',
  },
  {
    id: '2',
    name: 'App Lexey',
    icon: 'lexey',
    privacyScore: 85,
    dataTypes: [],
    shortDescription: 'No Data-Shared',
    developer: 'Lexey Technologies',
    category: 'Utilities',
    privacyDescription: 'This app respects user privacy and does not collect or share personal data with third parties.',
  },
  {
    id: '3',
    name: 'App Carry',
    icon: 'carry',
    privacyScore: 65,
    dataTypes: ['Storage', 'Photos'],
    shortDescription: 'Fromnes Verification',
    developer: 'Carry Solutions',
    category: 'Business',
    privacyDescription: 'This app accesses device storage and photos for document verification purposes. Data is processed locally and not shared externally.',
  },
  {
    id: '4',
    name: 'Application',
    icon: 'app',
    privacyScore: 25,
    dataTypes: ['Location', 'Contacts', 'Camera', 'Microphone'],
    shortDescription: '4 data types',
    developer: 'Generic App Co.',
    category: 'Social',
    privacyDescription: 'This app collects extensive user data including location, contacts, and media access for enhanced social features and targeted advertising.',
  },
  {
    id: '5',
    name: 'App Name',
    icon: 'app',
    privacyScore: 72,
    dataTypes: ['Email', 'Storage'],
    shortDescription: '2 data types',
    developer: 'Privacy First Ltd.',
    category: 'Productivity',
    privacyDescription: 'This app only collects essential data required for functionality and follows strict privacy guidelines.',
  },
  {
    id: '6',
    name: 'App App 1',
    icon: 'app',
    privacyScore: 38,
    dataTypes: ['Location', 'Contacts', 'Phone'],
    shortDescription: '3 data types',
    developer: 'Data Corp',
    category: 'Navigation',
    privacyDescription: 'This app requires location access for navigation services and may collect contact information for social features.',
  },
  {
    id: '7',
    name: 'App App 2',
    icon: 'app',
    privacyScore: 91,
    dataTypes: ['Storage'],
    shortDescription: '1 data type',
    developer: 'Secure Apps Inc.',
    category: 'Utilities',
    privacyDescription: 'This app minimizes data collection and only accesses device storage for essential app functionality.',
  },
];

export const getRecentAnalysis = () => {
  return mockApps.slice(0, 3);
};

export const getTopDataHungryApps = () => {
  return mockApps
    .filter(app => app.privacyScore < 50)
    .sort((a, b) => a.privacyScore - b.privacyScore)
    .slice(0, 10);
};

export const getPrivacyRespectingApps = () => {
  return mockApps
    .filter(app => app.privacyScore >= 70)
    .sort((a, b) => b.privacyScore - a.privacyScore);
};
