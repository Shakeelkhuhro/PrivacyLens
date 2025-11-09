export const parsePolicy = (text) => {
  const collectedData = [];

  const patterns = [
    { keyword: /name/i, label: 'Name' },
    { keyword: /email/i, label: 'Email Address' },
    { keyword: /phone/i, label: 'Phone Number' },
    { keyword: /location/i, label: 'Location' },
    { keyword: /device/i, label: 'Device Information' },
    { keyword: /usage data|analytics/i, label: 'Usage/Analytics Data' },
    { keyword: /third[- ]party/i, label: 'Shared with Third Parties' },
    { keyword: /ip address/i, label: 'IP Address' },
    { keyword: /cookies?/i, label: 'Cookies' },
  ];

  for (const item of patterns) {
    if (item.keyword.test(text)) {
      collectedData.push(item.label);
    }
  }

  return {
    collectedData,
    originalText: text,
  };
};
