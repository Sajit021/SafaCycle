import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";

export default function SchedulePickupScreen({ navigation }) {
  const [selectedWasteType, setSelectedWasteType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [estimatedWeight, setEstimatedWeight] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [urgentPickup, setUrgentPickup] = useState(false);
  const [address, setAddress] = useState("789 Your Street, Eco City");
  const [contactPhone, setContactPhone] = useState("+1-555-0123");

  const wasteTypes = [
    {
      id: "household",
      name: "Mixed Household",
      icon: "🗑️",
      description: "General household waste",
      baseCost: 25.0,
      pricePerKg: 1.2,
    },
    {
      id: "recyclable",
      name: "Recyclables",
      icon: "♻️",
      description: "Paper, plastic, glass, metal",
      baseCost: 20.0,
      pricePerKg: 0.8,
    },
    {
      id: "organic",
      name: "Organic Waste",
      icon: "🥬",
      description: "Food scraps, compostable materials",
      baseCost: 22.0,
      pricePerKg: 1.0,
    },
    {
      id: "garden",
      name: "Garden Waste",
      icon: "🌱",
      description: "Leaves, branches, grass clippings",
      baseCost: 30.0,
      pricePerKg: 0.9,
    },
    {
      id: "hazardous",
      name: "Hazardous Waste",
      icon: "☢️",
      description: "Chemicals, batteries, electronics",
      baseCost: 45.0,
      pricePerKg: 2.5,
    },
    {
      id: "bulk",
      name: "Bulk Items",
      icon: "📦",
      description: "Furniture, appliances",
      baseCost: 55.0,
      pricePerKg: 1.8,
    },
  ];

  // Generate available dates (next 14 days, excluding Sundays)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    let dayOffset = 1; // Start from tomorrow

    while (count < 14) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);

      // Skip Sundays (0 = Sunday)
      if (date.getDay() !== 0) {
        dates.push({
          date: date.toISOString().split("T")[0],
          display: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        });
        count++;
      }
      dayOffset++;
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  const timeSlots = [
    { id: "morning", time: "08:00 - 11:00", label: "Morning", popular: true },
    { id: "midday", time: "11:00 - 14:00", label: "Midday", popular: false },
    {
      id: "afternoon",
      time: "14:00 - 17:00",
      label: "Afternoon",
      popular: true,
    },
    { id: "evening", time: "17:00 - 19:00", label: "Evening", popular: false },
  ];

  const calculateEstimatedCost = () => {
    if (!selectedWasteType || !estimatedWeight) return 0;

    const wasteType = wasteTypes.find((type) => type.id === selectedWasteType);
    if (!wasteType) return 0;

    const weight = parseFloat(estimatedWeight) || 0;
    let totalCost = wasteType.baseCost + weight * wasteType.pricePerKg;

    // Add urgent pickup fee (50% extra)
    if (urgentPickup) {
      totalCost *= 1.5;
    }

    return totalCost;
  };

  const validateForm = () => {
    if (!selectedWasteType) {
      Alert.alert("Error", "Please select a waste type");
      return false;
    }
    if (!selectedDate) {
      Alert.alert("Error", "Please select a pickup date");
      return false;
    }
    if (!selectedTimeSlot) {
      Alert.alert("Error", "Please select a time slot");
      return false;
    }
    if (!estimatedWeight || isNaN(parseFloat(estimatedWeight))) {
      Alert.alert("Error", "Please enter a valid estimated weight");
      return false;
    }
    return true;
  };

  const handleSchedulePickup = () => {
    if (!validateForm()) return;

    const selectedWasteTypeData = wasteTypes.find(
      (type) => type.id === selectedWasteType
    );
    const selectedDateData = availableDates.find(
      (date) => date.date === selectedDate
    );
    const selectedTimeSlotData = timeSlots.find(
      (slot) => slot.id === selectedTimeSlot
    );
    const estimatedCost = calculateEstimatedCost();

    Alert.alert(
      "Confirm Pickup",
      `Waste Type: ${selectedWasteTypeData.name}\nDate: ${
        selectedDateData.display
      }\nTime: ${
        selectedTimeSlotData.time
      }\nEstimated Cost: $${estimatedCost.toFixed(2)}${
        urgentPickup ? " (Urgent)" : ""
      }\n\nConfirm this pickup?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert(
              "Pickup Scheduled!",
              `Your pickup has been scheduled successfully. You will receive a confirmation shortly.`,
              [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pickup Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Address</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{address}</Text>
            <TouchableOpacity style={styles.changeAddressButton}>
              <Text style={styles.changeAddressText}>Change Address</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Waste Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Waste Type</Text>
          <View style={styles.wasteTypesGrid}>
            {wasteTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.wasteTypeCard,
                  selectedWasteType === type.id && styles.wasteTypeCardSelected,
                ]}
                onPress={() => setSelectedWasteType(type.id)}
              >
                <Text style={styles.wasteTypeIcon}>{type.icon}</Text>
                <Text style={styles.wasteTypeName}>{type.name}</Text>
                <Text style={styles.wasteTypeDescription}>
                  {type.description}
                </Text>
                <Text style={styles.wasteTypePrice}>
                  From ${type.baseCost.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.datesScroll}
          >
            {availableDates.map((date) => (
              <TouchableOpacity
                key={date.date}
                style={[
                  styles.dateCard,
                  selectedDate === date.date && styles.dateCardSelected,
                ]}
                onPress={() => setSelectedDate(date.date)}
              >
                <Text
                  style={[
                    styles.dateDayName,
                    selectedDate === date.date && styles.dateTextSelected,
                  ]}
                >
                  {date.dayName.substring(0, 3)}
                </Text>
                <Text
                  style={[
                    styles.dateDisplay,
                    selectedDate === date.date && styles.dateTextSelected,
                  ]}
                >
                  {date.display.split(" ").slice(1).join(" ")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slot Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlotCard,
                  selectedTimeSlot === slot.id && styles.timeSlotCardSelected,
                ]}
                onPress={() => setSelectedTimeSlot(slot.id)}
              >
                <View style={styles.timeSlotHeader}>
                  <Text
                    style={[
                      styles.timeSlotLabel,
                      selectedTimeSlot === slot.id &&
                        styles.timeSlotTextSelected,
                    ]}
                  >
                    {slot.label}
                  </Text>
                  {slot.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.timeSlotTime,
                    selectedTimeSlot === slot.id && styles.timeSlotTextSelected,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weight Estimation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimated Weight (kg)</Text>
          <TextInput
            style={styles.weightInput}
            placeholder="Enter estimated weight in kg"
            placeholderTextColor={COLORS.textLight}
            value={estimatedWeight}
            onChangeText={setEstimatedWeight}
            keyboardType="numeric"
          />
          <Text style={styles.weightHint}>
            💡 This helps us provide accurate pricing and allocate the right
            vehicle
          </Text>
        </View>

        {/* Urgent Pickup Option */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.urgentPickupContainer}
            onPress={() => setUrgentPickup(!urgentPickup)}
          >
            <View style={styles.urgentPickupLeft}>
              <Text style={styles.urgentPickupTitle}>🚨 Urgent Pickup</Text>
              <Text style={styles.urgentPickupDescription}>
                Same-day or next-day pickup (+50% fee)
              </Text>
            </View>
            <View
              style={[
                styles.urgentPickupToggle,
                urgentPickup && styles.urgentPickupToggleActive,
              ]}
            >
              {urgentPickup && <Text style={styles.urgentPickupCheck}>✓</Text>}
            </View>
          </TouchableOpacity>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Special Instructions (Optional)
          </Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Any special instructions for the driver..."
            placeholderTextColor={COLORS.textLight}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TextInput
            style={styles.contactInput}
            placeholder="Phone number"
            placeholderTextColor={COLORS.textLight}
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Cost Estimation */}
        {selectedWasteType && estimatedWeight && (
          <View style={styles.costEstimationContainer}>
            <Text style={styles.costEstimationTitle}>Estimated Cost</Text>
            <View style={styles.costBreakdown}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Base fee:</Text>
                <Text style={styles.costValue}>
                  $
                  {wasteTypes
                    .find((type) => type.id === selectedWasteType)
                    ?.baseCost.toFixed(2)}
                </Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>
                  Weight charge ({estimatedWeight}kg):
                </Text>
                <Text style={styles.costValue}>
                  $
                  {(
                    (parseFloat(estimatedWeight) || 0) *
                    (wasteTypes.find((type) => type.id === selectedWasteType)
                      ?.pricePerKg || 0)
                  ).toFixed(2)}
                </Text>
              </View>
              {urgentPickup && (
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Urgent pickup fee (50%):</Text>
                  <Text style={styles.costValue}>
                    +${((calculateEstimatedCost() / 1.5) * 0.5).toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.costDivider} />
              <View style={styles.costRow}>
                <Text style={styles.costTotalLabel}>Total Estimated Cost:</Text>
                <Text style={styles.costTotalValue}>
                  ${calculateEstimatedCost().toFixed(2)}
                </Text>
              </View>
            </View>
            <Text style={styles.costNote}>
              * Final cost may vary based on actual weight and additional
              services
            </Text>
          </View>
        )}

        {/* Schedule Button */}
        <CustomButton
          title="Schedule Pickup"
          onPress={handleSchedulePickup}
          style={styles.scheduleButton}
        />

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <View style={styles.helpOptions}>
            <TouchableOpacity style={styles.helpOption}>
              <Text style={styles.helpOptionText}>📞 Call Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpOption}>
              <Text style={styles.helpOptionText}>💬 Live Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpOption}>
              <Text style={styles.helpOptionText}>❓ FAQ</Text>
            </TouchableOpacity>
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
  section: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  addressContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    flex: 1,
  },
  changeAddressButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.primary + "20",
    borderRadius: SIZES.radiusSmall,
  },
  changeAddressText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.primary,
    fontWeight: "600",
  },
  wasteTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SIZES.medium,
  },
  wasteTypeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    alignItems: "center",
    width: "47%",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wasteTypeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  wasteTypeIcon: {
    fontSize: 32,
    marginBottom: SIZES.small,
  },
  wasteTypeName: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  wasteTypeDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SIZES.small,
  },
  wasteTypePrice: {
    fontSize: SIZES.fontSmall,
    color: COLORS.primary,
    fontWeight: "600",
  },
  datesScroll: {
    flexDirection: "row",
  },
  dateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    alignItems: "center",
    marginRight: SIZES.medium,
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  dateDayName: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  dateDisplay: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "center",
  },
  dateTextSelected: {
    color: COLORS.primary,
  },
  timeSlotsContainer: {
    gap: SIZES.medium,
  },
  timeSlotCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeSlotCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  timeSlotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  timeSlotLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
  },
  timeSlotTextSelected: {
    color: COLORS.primary,
  },
  popularBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SIZES.small,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSmall,
  },
  popularText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.surface,
    fontWeight: "600",
  },
  timeSlotTime: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  weightInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  weightHint: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  urgentPickupContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urgentPickupLeft: {
    flex: 1,
  },
  urgentPickupTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  urgentPickupDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  urgentPickupToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textLight,
    alignItems: "center",
    justifyContent: "center",
  },
  urgentPickupToggleActive: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  urgentPickupCheck: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionsInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    height: 80,
    textAlignVertical: "top",
  },
  contactInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
  },
  costEstimationContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  costEstimationTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  costBreakdown: {
    marginBottom: SIZES.small,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.small,
  },
  costLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  costValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  costDivider: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: SIZES.small,
  },
  costTotalLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  costTotalValue: {
    fontSize: SIZES.fontLarge,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  costNote: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
    fontStyle: "italic",
    textAlign: "center",
  },
  scheduleButton: {
    marginBottom: SIZES.large,
  },
  helpSection: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  helpOptions: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  helpOption: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  helpOptionText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: "500",
  },
});
