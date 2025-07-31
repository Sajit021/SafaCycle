import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";

const { width, height } = Dimensions.get("window");

export default function CameraScannerScreen({ navigation }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const wasteTypes = [
    {
      id: 1,
      name: "Plastic Bottles",
      description: "Recyclable plastic containers",
      color: COLORS.info,
    },
    {
      id: 2,
      name: "Paper/Cardboard",
      description: "Recyclable paper products",
      color: COLORS.success,
    },
    {
      id: 3,
      name: "Organic Waste",
      description: "Compostable food waste",
      color: COLORS.customer,
    },
    {
      id: 4,
      name: "Glass",
      description: "Recyclable glass containers",
      color: COLORS.warning,
    },
    {
      id: 5,
      name: "Electronics",
      description: "E-waste requiring special disposal",
      color: COLORS.error,
    },
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Mock scan result
      const randomWaste =
        wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
      setScanResult(randomWaste);
    }, 3000);
  };

  const handleRetakePhoto = () => {
    setScanResult(null);
    handleStartScan();
  };

  const handleSaveResult = () => {
    if (scanResult) {
      Alert.alert(
        "Waste Classified",
        `${scanResult.name} has been logged to your waste tracking history.`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleManualClassification = () => {
    Alert.alert(
      "Manual Classification",
      "Choose waste type manually:",
      wasteTypes
        .map((type) => ({
          text: type.name,
          onPress: () => {
            setScanResult(type);
          },
        }))
        .concat([{ text: "Cancel", style: "cancel" }])
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Waste Scanner</Text>
          <Text style={styles.subtitle}>
            Point your camera at waste items to identify and classify them
          </Text>
        </View>

        {/* Camera View Placeholder */}
        <View style={styles.cameraContainer}>
          {isScanning ? (
            <View style={styles.scanningView}>
              <Text style={styles.scanningText}>🔍</Text>
              <Text style={styles.scanningLabel}>Scanning...</Text>
              <Text style={styles.scanningDescription}>
                Analyzing waste type using AI
              </Text>
            </View>
          ) : scanResult ? (
            <View style={styles.resultView}>
              <Text style={styles.resultIcon}>✅</Text>
              <Text style={styles.resultTitle}>Scan Complete!</Text>
              <View
                style={[styles.resultCard, { borderColor: scanResult.color }]}
              >
                <Text style={[styles.resultName, { color: scanResult.color }]}>
                  {scanResult.name}
                </Text>
                <Text style={styles.resultDescription}>
                  {scanResult.description}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.cameraText}>Camera Preview</Text>
              <Text style={styles.cameraDescription}>
                Camera integration will be implemented using{"\n"}
                expo-camera or react-native-vision-camera
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {!scanResult && !isScanning && (
            <>
              <CustomButton
                title="Start Scan"
                onPress={handleStartScan}
                style={styles.primaryButton}
              />
              <CustomButton
                title="Manual Classification"
                onPress={handleManualClassification}
                variant="secondary"
                style={styles.secondaryButton}
              />
            </>
          )}

          {isScanning && (
            <CustomButton
              title="Scanning..."
              disabled={true}
              style={styles.disabledButton}
            />
          )}

          {scanResult && (
            <View style={styles.resultActions}>
              <CustomButton
                title="Save Result"
                onPress={handleSaveResult}
                style={[
                  styles.actionButton,
                  { backgroundColor: COLORS.success },
                ]}
              />
              <CustomButton
                title="Retake Photo"
                onPress={handleRetakePhoto}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>📋 Scanning Tips</Text>
          <Text style={styles.tipText}>
            • Ensure good lighting for better accuracy
          </Text>
          <Text style={styles.tipText}>
            • Clean the item if possible before scanning
          </Text>
          <Text style={styles.tipText}>
            • Hold camera steady for 2-3 seconds
          </Text>
          <Text style={styles.tipText}>
            • Make sure the item fills most of the frame
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  header: {
    alignItems: "center",
    marginBottom: SIZES.large,
  },
  title: {
    fontSize: SIZES.fontHeader,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.large,
  },
  cameraIcon: {
    fontSize: 64,
    marginBottom: SIZES.large,
  },
  cameraText: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  cameraDescription: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  scanningView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.large,
  },
  scanningText: {
    fontSize: 64,
    marginBottom: SIZES.large,
  },
  scanningLabel: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  scanningDescription: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  resultView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.large,
  },
  resultIcon: {
    fontSize: 64,
    marginBottom: SIZES.large,
  },
  resultTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.large,
  },
  resultCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    borderWidth: 2,
    alignItems: "center",
    width: "100%",
  },
  resultName: {
    fontSize: SIZES.fontTitle,
    fontWeight: "bold",
    marginBottom: SIZES.small,
    textAlign: "center",
  },
  resultDescription: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  actionContainer: {
    marginBottom: SIZES.large,
  },
  primaryButton: {
    marginBottom: SIZES.medium,
  },
  secondaryButton: {
    marginBottom: SIZES.medium,
  },
  disabledButton: {
    opacity: 0.6,
  },
  resultActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SIZES.medium,
  },
  actionButton: {
    flex: 1,
  },
  tipsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  tipText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.small,
    lineHeight: 20,
  },
});
