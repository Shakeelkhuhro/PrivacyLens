import { colors } from '../styles/colors';

export const getScoreColor = (score) => {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.accent;
  if (score >= 40) return colors.warning;
  return colors.error;
};

export const getScoreDescription = (score) => {
  if (score >= 80) return 'Excellent privacy practices';
  if (score >= 60) return 'Good privacy practices';
  if (score >= 40) return 'Moderate privacy concerns';
  return 'Poor privacy practices';
};

export const getScoreLevel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
};

export const calculatePrivacyScore = (dataTypes, permissions, sharingPractices) => {
  let score = 100;
  score -= dataTypes.length * 5;
  const sensitiveTypes = ['location', 'contacts', 'camera', 'microphone'];
  const sensitiveCount = dataTypes.filter(type => sensitiveTypes.includes(type.toLowerCase())).length;
  score -= sensitiveCount * 10;
  return Math.max(0, Math.min(100, score));
};

export const formatDataTypes = (dataTypes) => {
  if (dataTypes.length === 0) return 'No data collected';
  if (dataTypes.length === 1) return dataTypes[0];
  if (dataTypes.length === 2) return dataTypes.join(' and ');
  return `${dataTypes.slice(0, -1).join(', ')}, and ${dataTypes[dataTypes.length - 1]}`;
};
