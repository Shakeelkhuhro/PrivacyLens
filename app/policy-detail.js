import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { parsePolicy } from '../src/utils/policyParser';
import { calculateScore } from '../src/utils/rankCalculator';

export default function PolicyDetail() {
  const { url } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [policyData, setPolicyData] = useState(null);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzePolicy = async () => {
      try {
        const text = await fetchPolicyText(url);
        const parsed = parsePolicy(text);
        const privacyScore = calculateScore(parsed);
        setPolicyData(parsed);
        setScore(privacyScore);
      } catch (err) {
        setError('Failed to fetch or parse policy.');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      analyzePolicy();
    }
  }, [url]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Analyzing policy...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Privacy Analysis</Text>
      <Text style={styles.score}>Privacy Score: {score}/100</Text>
      <Text style={styles.subheading}>Collected Data Types:</Text>
      {policyData.collectedData?.length > 0 ? (
        policyData.collectedData.map((item, idx) => (
          <Text key={idx} style={styles.item}>• {item}</Text>
        ))
      ) : (
        <Text>No sensitive data identified.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  score: {
    fontSize: 20,
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 8,
  },
  item: {
    fontSize: 16,
    marginVertical: 2,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
