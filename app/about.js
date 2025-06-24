// app/about.js
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function About() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About PolicyLens</Text>
      <Text style={styles.paragraph}>
        PolicyLens is a privacy-focused mobile application designed to help users analyze and understand the privacy policies of mobile apps and websites.
      </Text>
      <Text style={styles.paragraph}>
        It extracts key information such as the types of user data collected, how it is shared, and how compliant the policy is with data protection regulations like GDPR and CCPA.
      </Text>
      <Text style={styles.paragraph}>
        Our ranking system gives each app or website a privacy score from 0 to 100, helping users make informed decisions about which apps to trust.
      </Text>
      <Text style={styles.subheading}>Key Features:</Text>
      <Text style={styles.bullet}>• Analyze privacy policies from any public URL</Text>
      <Text style={styles.bullet}>• Understand what data is collected</Text>
      <Text style={styles.bullet}>• Get a privacy score based on compliance</Text>
      <Text style={styles.bullet}>• Simple and intuitive interface</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'justify',
  },
  subheading: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  bullet: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 6,
  },
});
