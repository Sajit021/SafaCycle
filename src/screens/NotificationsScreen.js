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
import { formatDate, formatTime } from "../utils/helpers";

export default function NotificationsScreen({ navigation }) {
  const [notifications] = useState([
    {
      id: 1,
      title: "Pickup Scheduled",
      message: "Your waste collection is scheduled for tomorrow at 8:00 AM",
      time: new Date("2025-08-01T14:30:00"),
      type: "info",
      read: false,
    },
    {
      id: 2,
      title: "Driver En Route",
      message: "Your assigned driver is 10 minutes away from your location",
      time: new Date("2025-08-01T12:15:00"),
      type: "success",
      read: true,
    },
    {
      id: 3,
      title: "Pickup Completed",
      message: "Waste collection completed successfully. Thank you!",
      time: new Date("2025-08-01T08:45:00"),
      type: "success",
      read: true,
    },
    {
      id: 4,
      title: "Schedule Reminder",
      message:
        "Don't forget to put your bins out tonight for tomorrow's collection",
      time: new Date("2025-07-31T18:00:00"),
      type: "warning",
      read: false,
    },
    {
      id: 5,
      title: "New Route Assignment",
      message: "You have been assigned to Route C for today's collection",
      time: new Date("2025-07-31T06:00:00"),
      type: "info",
      read: true,
    },
    {
      id: 6,
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 11 PM to 1 AM",
      time: new Date("2025-07-30T15:30:00"),
      type: "warning",
      read: true,
    },
  ]);

  const handleNotificationPress = (notification) => {
    Alert.alert(
      notification.title,
      `${notification.message}\n\nReceived: ${formatDate(
        notification.time
      )} at ${formatTime(notification.time)}`,
      [
        { text: "OK" },
        { text: "Mark as Read", onPress: () => console.log("Mark as read") },
      ]
    );
  };

  const handleMarkAllRead = () => {
    Alert.alert("Mark All Read", "All notifications have been marked as read.");
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => console.log("Clear all"),
        },
      ]
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return COLORS.success;
      case "warning":
        return COLORS.warning;
      case "error":
        return COLORS.error;
      case "info":
      default:
        return COLORS.info;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMarkAllRead}
          >
            <Text style={styles.actionButtonText}>Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={handleClearAll}
          >
            <Text style={[styles.actionButtonText, styles.clearButtonText]}>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <ScrollView
          style={styles.notificationsList}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyMessage}>
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.unreadNotification,
                ]}
                onPress={() => handleNotificationPress(notification)}
              >
                <View style={styles.notificationLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          getNotificationColor(notification.type) + "20",
                      },
                    ]}
                  >
                    <Text style={styles.notificationIcon}>
                      {getNotificationIcon(notification.type)}
                    </Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text
                      style={[
                        styles.notificationTitle,
                        !notification.read && styles.unreadTitle,
                      ]}
                    >
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatDate(notification.time)} •{" "}
                      {formatTime(notification.time)}
                    </Text>
                  </View>
                </View>
                <View style={styles.notificationRight}>
                  {!notification.read && <View style={styles.unreadDot} />}
                  <Text style={styles.chevron}>›</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.large,
    position: "relative",
  },
  title: {
    fontSize: SIZES.fontHeader,
    fontWeight: "bold",
    color: COLORS.text,
  },
  unreadBadge: {
    position: "absolute",
    right: 0,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  unreadText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.large,
    gap: SIZES.medium,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  clearButtonText: {
    color: COLORS.error,
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.extraLarge * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.large,
  },
  emptyTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  emptyMessage: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  notificationItem: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.medium,
  },
  notificationIcon: {
    fontSize: 18,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: "600",
  },
  notificationMessage: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SIZES.small,
  },
  notificationTime: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  notificationRight: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.small,
  },
  chevron: {
    fontSize: 18,
    color: COLORS.textLight,
    fontWeight: "300",
  },
});
