export const calculateScore = (parsedData) => {
  const { collectedData } = parsedData;

  const penalties = {
    'Name': 5,
    'Email Address': 10,
    'Phone Number': 15,
    'Location': 10,
    'Device Information': 5,
    'Usage/Analytics Data': 5,
    'Shared with Third Parties': 20,
    'IP Address': 5,
    'Cookies': 5,
  };

  let score = 100;

  collectedData.forEach((item) => {
    if (penalties[item]) {
      score -= penalties[item];
    }
  });
  return Math.max(0, Math.min(100, score));
};
