import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '../src/styles/colors';
import { typography } from '../src/styles/typography';

export default function PrivacyDashboardScreen() {
	const { app } = useLocalSearchParams();

	let parsed = {};
	try { parsed = app ? JSON.parse(app) : {}; } catch { parsed = {}; }

	const score = parsed.privacyScore;
	const label = parsed.privacyLabel || (typeof score === 'number' ? (score <= 50 ? 'Data Hungry' : 'Privacy Respecting') : 'Unknown');

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Privacy Dashboard</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.appName}>{parsed.appName || parsed.name || 'App'}</Text>
				<Text style={styles.developer}>{parsed.developer || ''}</Text>

				<View style={styles.row}>
					<Text style={styles.label}>Privacy Score</Text>
					<Text style={styles.value}>{typeof score === 'number' ? `${score}/100` : 'N/A'}</Text>
				</View>

				<View style={styles.row}>
					<Text style={styles.label}>Classification</Text>
					<Text style={styles.value}>{label}</Text>
				</View>

				<Text style={styles.note}>
					This summary is automatically generated from the app's public information and privacy policy.
				</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: colors.background, padding: 16 },
	header: { marginBottom: 12 },
	title: { ...typography.heading2, color: colors.text },
	card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16 },
	appName: { ...typography.heading3, color: colors.text, marginBottom: 4 },
	developer: { ...typography.body, color: colors.textSecondary, marginBottom: 12 },
	row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
	label: { ...typography.caption, color: colors.textSecondary },
	value: { ...typography.body, color: colors.text, fontWeight: '700' },
	note: { marginTop: 12, ...typography.caption, color: colors.textSecondary }
});