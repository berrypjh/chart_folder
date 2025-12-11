import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SALES_DATA } from '@berry-test-chart/shared-data';
import { BarChart } from '@berry-test-chart/react-native';

export default function App() {
  const { width: screenWidth } = useWindowDimensions();

  const chartWidth = screenWidth - 40;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Mobile Chart Demo</Text>
          <Text style={styles.subtitle}>Powered by NX & Shared Core</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Revenue</Text>

          <View style={styles.chartWrapper}>
            <BarChart width={chartWidth} height={250} data={SALES_DATA} />
          </View>

          <Text style={styles.description}>
            This chart is rendered using react-native-svg, calculating coordinates from the shared
            core library.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  description: {
    marginTop: 12,
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
