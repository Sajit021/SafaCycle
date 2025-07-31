import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { formatDate, formatTime } from "../utils/helpers";

export default function CustomerDashboard({ navigation }) {
  const [customerData] = useState({
    nextPickup: new Date("2025-08-02T08:00:00"),
    lastPickup: new Date("2025-07-28T08:30:00"),
    totalCollections: 24,
    wasteReduced: "145 kg",
  });

  const [upcomingPickups] = useState([
    {
      id: 1,
      date: "2025-08-02",
      time: "08:00 AM",
      type: "Regular Pickup",
      status: "scheduled",
    },
    {
      id: 2,
      date: "2025-08-05",
      time: "09:30 AM",
      type: "Recycling",
      status: "scheduled",
    },
    {
      id: 3,
      date: "2025-08-09",
      time: "08:00 AM",
      type: "Regular Pickup",
      status: "pending",
    },
  ]);

  const quickActions = [
    {
      id: 1,
      title: "Schedule Pickup",
      description: "Request waste collection",
      icon: "📅",
      action: "schedule",
    },
    {
      id: 2,
      title: "Track Driver",
      description: "See driver location",
      icon: "📍",
      action: "track",
    },
    {
      id: 3,
      title: "Scan Waste",
      description: "Identify waste type",
      icon: "📸",
      action: "scan",
    },
    {
      id: 4,
      title: "Report Issue",
      description: "Report a problem",
      icon: "⚠️",
      action: "report",
    },
    {
      id: 5,
      title: "View History",
      description: "Past collections",
      icon: "📋",
      action: "history",
    },
    {
      id: 6,
      title: "Notifications",
      description: "Manage alerts",
      icon: "🔔",
      action: "notifications",
    },
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case "schedule":
        navigation.navigate("SchedulePickup");
        break;
      case "track":
        navigation.navigate("DriverTracking");
        break;
      case "scan":
        navigation.navigate("CameraScanner");
        break;
      case "report":
        Alert.alert("Report Issue", "Issue reporting feature in development!");
        break;
      case "history":
        navigation.navigate("CollectionHistory");
        break;
      case "notifications":
        navigation.navigate("Notifications");
        break;
      default:
        Alert.alert(
          "Feature Coming Soon",
          "This feature will be available soon!"
        );
    }
  };

  const handlePickupAction = (pickupId, action) => {
    Alert.alert(
      "Pickup Action",
      `${action} for pickup ${pickupId} will be implemented soon!`
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => navigation.navigate("Welcome"),
      },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return COLORS.success;
      case "pending":
        return COLORS.warning;
      case "in-progress":
        return COLORS.info;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello Customer! 🏠</Text>
            <Text style={styles.subtitle}>Manage your waste collection</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Next Pickup Card */}
        <View style={styles.nextPickupCard}>
          <Text style={styles.nextPickupTitle}>Next Pickup</Text>
          <Text style={styles.nextPickupDate}>
            {formatDate(customerData.nextPickup)}
          </Text>
          <Text style={styles.nextPickupTime}>
            at {formatTime(customerData.nextPickup)}
          </Text>
          <CustomButton
            title="Track Driver"
            onPress={() => handleQuickAction("track")}
            style={styles.trackButton}
          />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: COLORS.customer + "20" },
              ]}
            >
              <Text style={styles.statNumber}>
                {customerData.totalCollections}
              </Text>
              <Text style={styles.statLabel}>Total Collections</Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: COLORS.success + "20" },
              ]}
            >
              <Text style={styles.statNumber}>{customerData.wasteReduced}</Text>
              <Text style={styles.statLabel}>Waste Reduced</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => handleQuickAction(action.action)}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Pickups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Collections</Text>
          <View style={styles.pickupsContainer}>
            {upcomingPickups.map((pickup) => (
              <View key={pickup.id} style={styles.pickupCard}>
                <View style={styles.pickupHeader}>
                  <View style={styles.pickupInfo}>
                    <Text style={styles.pickupType}>{pickup.type}</Text>
                    <Text style={styles.pickupDateTime}>
                      {formatDate(pickup.date)} at {pickup.time}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(pickup.status) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(pickup.status) },
                      ]}
                    >
                      {pickup.status.charAt(0).toUpperCase() +
                        pickup.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.pickupActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: COLORS.info },
                    ]}
                    onPress={() => handlePickupAction(pickup.id, "Reschedule")}
                  >
                    <Text style={styles.actionButtonText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: COLORS.error },
                    ]}
                    onPress={() => handlePickupAction(pickup.id, "Cancel")}
                  >
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Waste Management Tips</Text>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              • Separate recyclables from general waste
            </Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              • Rinse containers before recycling
            </Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              • Compost organic waste when possible
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SIZES.large,
  },
  greeting: {
    fontSize: SIZES.fontExtraLarge,
    fontWeight: "bold",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  logoutText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  nextPickupCard: {
    backgroundColor: COLORS.primary + "10",
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  nextPickupTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  nextPickupDate: {
    fontSize: SIZES.fontTitle,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  nextPickupTime: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.large,
  },
  trackButton: {
    paddingHorizontal: SIZES.extraLarge,
  },
  statsContainer: {
    marginBottom: SIZES.large,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    marginHorizontal: SIZES.small / 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: SIZES.fontTitle,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.medium,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: SIZES.small,
  },
  actionTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  pickupsContainer: {
    gap: SIZES.medium,
  },
  pickupCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SIZES.medium,
  },
  pickupInfo: {
    flex: 1,
  },
  pickupType: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  pickupDateTime: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.radiusLarge,
  },
  statusText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  pickupActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SIZES.small,
  },
  actionButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
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
  tip: {
    marginBottom: SIZES.small,
  },
  tipText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
