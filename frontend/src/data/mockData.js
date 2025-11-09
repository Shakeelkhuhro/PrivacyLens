export const mockApps = [
  {
    id: '1',
    name: 'App 01',
    category: 'Social Media',
    privacyScore: 85,
    description: 'A privacy-focused social media platform with end-to-end encryption',
    icon: 'account-group',
    dataTypes: ['Personal Info', 'Usage Data'],
    permissions: ['Camera', 'Microphone', 'Contacts'],
    lastUpdated: '2024-01-15',
    dataSharing: 'None',
    encryption: 'End-to-End',
    dataRetention: '30 days',
    thirdPartyTrackers: 0,
  },
  {
    id: '2',
    name: 'App 02',
    category: 'Messaging',
    privacyScore: 92,
    description: 'Secure messaging app with strong privacy protections',
    icon: 'message',
    dataTypes: ['Messages', 'Contacts'],
    permissions: ['Contacts', 'Storage'],
    lastUpdated: '2024-01-14',
    dataSharing: 'None',
    encryption: 'End-to-End',
    dataRetention: '7 days',
    thirdPartyTrackers: 0,
  },
  {
    id: '3',
    name: 'App 03',
    category: 'Shopping',
    privacyScore: 78,
    description: 'E-commerce app with good privacy practices',
    icon: 'shopping',
    dataTypes: ['Purchase History', 'Location', 'Personal Info'],
    permissions: ['Location', 'Camera', 'Storage'],
    lastUpdated: '2024-01-13',
    dataSharing: 'Limited to partners',
    encryption: 'In Transit',
    dataRetention: '90 days',
    thirdPartyTrackers: 2,
  },
  {
    id: '4',
    name: 'App 04',
    category: 'Finance',
    privacyScore: 88,
    description: 'Banking app with excellent security measures',
    icon: 'bank',
    dataTypes: ['Financial Data', 'Personal Info', 'Device Info'],
    permissions: ['Biometrics', 'Camera', 'Location'],
    lastUpdated: '2024-01-12',
    dataSharing: 'None',
    encryption: 'End-to-End',
    dataRetention: '365 days',
    thirdPartyTrackers: 0,
  },
  {
    id: '5',
    name: 'App 05',
    category: 'Health',
    privacyScore: 81,
    description: 'Health tracking app with privacy controls',
    icon: 'heart',
    dataTypes: ['Health Data', 'Usage Data', 'Device Info'],
    permissions: ['Health', 'Location', 'Notifications'],
    lastUpdated: '2024-01-11',
    dataSharing: 'Anonymous only',
    encryption: 'At Rest',
    dataRetention: '60 days',
    thirdPartyTrackers: 1,
  },
  {
    id: '6',
    name: 'App 06',
    category: 'Productivity',
    privacyScore: 76,
    description: 'Note-taking app with cloud sync capabilities',
    icon: 'notebook',
    dataTypes: ['Documents', 'Usage Data', 'Account Info'],
    permissions: ['Storage', 'Camera', 'Microphone'],
    lastUpdated: '2024-01-10',
    dataSharing: 'With cloud providers',
    encryption: 'In Transit',
    dataRetention: '180 days',
    thirdPartyTrackers: 3,
  },
  {
    id: '7',
    name: 'App 07',
    category: 'Entertainment',
    privacyScore: 72,
    description: 'Streaming app with moderate privacy practices',
    icon: 'play-circle',
    dataTypes: ['Viewing History', 'Personal Info', 'Usage Data'],
    permissions: ['Storage', 'Microphone', 'Location'],
    lastUpdated: '2024-01-09',
    dataSharing: 'With advertisers',
    encryption: 'Basic',
    dataRetention: '120 days',
    thirdPartyTrackers: 5,
  },
  {
    id: '8',
    name: 'App 08',
    category: 'News',
    privacyScore: 69,
    description: 'News aggregator with personalized content',
    icon: 'newspaper',
    dataTypes: ['Reading History', 'Location', 'Device Info'],
    permissions: ['Location', 'Storage', 'Notifications'],
    lastUpdated: '2024-01-08',
    dataSharing: 'With content partners',
    encryption: 'Basic',
    dataRetention: '90 days',
    thirdPartyTrackers: 4,
  },
  {
    id: '9',
    name: 'App 09',
    category: 'Education',
    privacyScore: 74,
    description: 'Learning platform with student privacy focus',
    icon: 'school',
    dataTypes: ['Progress Data', 'Personal Info', 'Usage Data'],
    permissions: ['Camera', 'Microphone', 'Storage'],
    lastUpdated: '2024-01-07',
    dataSharing: 'With educators only',
    encryption: 'Standard',
    dataRetention: '365 days',
    thirdPartyTrackers: 2,
  },
  {
    id: '10',
    name: 'App 10',
    category: 'Travel',
    privacyScore: 71,
    description: 'Travel booking app with location services',
    icon: 'airplane',
    dataTypes: ['Travel History', 'Location', 'Payment Info'],
    permissions: ['Location', 'Camera', 'Contacts'],
    lastUpdated: '2024-01-06',
    dataSharing: 'With travel partners',
    encryption: 'Standard',
    dataRetention: '180 days',
    thirdPartyTrackers: 6,
  },

  
  {
    id: '11',
    name: 'DataHungry Social',
    category: 'Social Media',
    privacyScore: 25,
    description: 'Social media app with extensive data collection',
    icon: 'account-group',
    dataTypes: ['Personal Info', 'Location', 'Contacts', 'Messages', 'Photos', 'Browsing History'],
    permissions: ['Camera', 'Microphone', 'Contacts', 'Location', 'Storage', 'Phone'],
    lastUpdated: '2024-01-05',
    dataSharing: 'Extensive sharing with third parties',
    encryption: 'Limited',
    dataRetention: 'Indefinite',
    thirdPartyTrackers: 25,
  },
  {
    id: '12',
    name: 'TrackMe Plus',
    category: 'Entertainment',
    privacyScore: 18,
    description: 'Entertainment app with aggressive tracking',
    icon: 'play-circle',
    dataTypes: ['Personal Info', 'Location', 'Browsing History', 'Device Info', 'Usage Data'],
    permissions: ['Location', 'Camera', 'Microphone', 'Storage', 'Contacts'],
    lastUpdated: '2024-01-04',
    dataSharing: 'Sold to data brokers',
    encryption: 'None',
    dataRetention: 'Permanent',
    thirdPartyTrackers: 30,
  },
  {
    id: '13',
    name: 'AdTracker Pro',
    category: 'Shopping',
    privacyScore: 32,
    description: 'Shopping app with heavy advertising focus',
    icon: 'shopping',
    dataTypes: ['Purchase History', 'Browsing History', 'Location', 'Personal Info'],
    permissions: ['Location', 'Camera', 'Storage', 'Contacts'],
    lastUpdated: '2024-01-03',
    dataSharing: 'Shared with advertisers',
    encryption: 'Basic',
    dataRetention: '5 years',
    thirdPartyTrackers: 20,
  },
  {
    id: '14',
    name: 'SpyGame Mobile',
    category: 'Gaming',
    privacyScore: 15,
    description: 'Mobile game with excessive data collection',
    icon: 'gamepad-variant',
    dataTypes: ['Personal Info', 'Location', 'Contacts', 'Device Info', 'Gaming Data'],
    permissions: ['Location', 'Camera', 'Microphone', 'Storage', 'Contacts', 'Phone'],
    lastUpdated: '2024-01-02',
    dataSharing: 'Extensive third-party sharing',
    encryption: 'None',
    dataRetention: 'Indefinite',
    thirdPartyTrackers: 35,
  },
  {
    id: '15',
    name: 'DataMiner App',
    category: 'Productivity',
    privacyScore: 28,
    description: 'Productivity app with concerning privacy practices',
    icon: 'notebook',
    dataTypes: ['Documents', 'Personal Info', 'Location', 'Usage Data', 'Contacts'],
    permissions: ['Storage', 'Location', 'Camera', 'Microphone', 'Contacts'],
    lastUpdated: '2024-01-01',
    dataSharing: 'Shared with multiple partners',
    encryption: 'Limited',
    dataRetention: '10 years',
    thirdPartyTrackers: 18,
  },

  
  {
    id: '16',
    name: 'SecureVault',
    category: 'Security',
    privacyScore: 95,
    description: 'Password manager with zero-knowledge architecture',
    icon: 'shield-lock',
    dataTypes: ['Encrypted Passwords'],
    permissions: ['Biometrics'],
    lastUpdated: '2023-12-30',
    dataSharing: 'None',
    encryption: 'Zero-Knowledge',
    dataRetention: 'User controlled',
    thirdPartyTrackers: 0,
  },
  {
    id: '17',
    name: 'PrivatePhoto',
    category: 'Photography',
    privacyScore: 89,
    description: 'Photo editing app that processes images locally',
    icon: 'camera',
    dataTypes: ['Photos'],
    permissions: ['Camera', 'Storage'],
    lastUpdated: '2023-12-28',
    dataSharing: 'None',
    encryption: 'Local processing',
    dataRetention: 'User controlled',
    thirdPartyTrackers: 0,
  },
];

// Function to get recent analysis (first 10 apps)
export const getRecentAnalysis = () => {
  return mockApps.slice(0, 10);
};
export const getDataHungryApps = () => {
  return mockApps.filter(app => app.privacyScore < 50);
};


// Function to get top privacy apps (apps with privacy score >= 80)
export const getTopPrivacyApps = () => {
  return mockApps.filter(app => app.privacyScore >= 80);
};
export const getAppsByCategory = (category) => {
  if (category === 'all') return mockApps;
  return mockApps.filter(app => app.category.toLowerCase().includes(category.toLowerCase()));
};

// Function to search apps

export const searchApps = (query) => {
  if (!query) return mockApps;
  
  const lowercaseQuery = query.toLowerCase();
  return mockApps.filter(app => 
    app.name.toLowerCase().includes(lowercaseQuery) ||
    app.category.toLowerCase().includes(lowercaseQuery) ||
    app.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const getPrivacyStats = () => {
  const totalApps = mockApps.length;
  const excellentApps = mockApps.filter(app => app.privacyScore >= 80).length;
  const goodApps = mockApps.filter(app => app.privacyScore >= 60 && app.privacyScore < 80).length;
  const poorApps = mockApps.filter(app => app.privacyScore < 50).length;
  const averageScore = Math.round(mockApps.reduce((sum, app) => sum + app.privacyScore, 0) / totalApps);

  return {
    totalApps,
    excellentApps,
    goodApps,
    poorApps,
    averageScore,
  };
};