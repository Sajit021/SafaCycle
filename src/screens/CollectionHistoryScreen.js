import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { formatDate, formatTime, getStatusColor } from "../utils/helpers";

export default function CollectionHistoryScreen({ navigation }) {
  const [collections, setCollections] = useState([
    {
      id: 1,
      date: "2025-01-30",
      time: "09:15 AM",
      driver: "John Martinez",
      wasteType: "Mixed Household",
      weight: 25.5,
      status: "completed",
      rating: 5,
      notes: "Excellent service, on time",
      cost: 28.5,
      address: "789 Your Street, Eco City",
      driverPhoto: null,
      issues: [],
    },
    {
      id: 2,
      date: "2025-01-23",
      time: "08:45 AM",
      driver: "Sarah Johnson",
      wasteType: "Recyclables",
      weight: 18.2,
      status: "completed",
      rating: 4,
      notes: "Good service",
      cost: 22.0,
      address: "789 Your Street, Eco City",
      driverPhoto: null,
      issues: [],
    },
    {
      id: 3,
      date: "2025-01-16",
      time: "10:30 AM",
      driver: "Mike Chen",
      wasteType: "Organic",
      weight: 32.1,
      status: "completed",
      rating: 5,
      notes: "Very professional and friendly",
      cost: 35.75,
      address: "789 Your Street, Eco City",
      driverPhoto: null,
      issues: [],
    },
    {
      id: 4,
      date: "2025-01-09",
      time: "09:00 AM",
      driver: "Lisa Davis",
      wasteType: "Mixed Household",
      weight: 28.8,
      status: "completed",
      rating: 4,
      notes: "On time, efficient",
      cost: 31.25,
      address: "789 Your Street, Eco City",
      driverPhoto: null,
      issues: [],
    },
    {
      id: 5,
      date: "2025-01-02",
      time: "11:15 AM",
      driver: "Bob Wilson",
      wasteType: "Garden Waste",
      weight: 45.3,
      status: "completed",
      rating: 3,
      notes: "Slightly late but good work",
      cost: 42.0,
      address: "789 Your Street, Eco City",
      driverPhoto: null,
      issues: ["15 minutes late"],
    },
    {
      id: 6,
      date: "2024-12-26",
      time: "08:30 AM",
      driver: "John Martinez",
      wasteType: "Recyclables",
      weight: 21.7,
      status: "cancelled",
      rating: null,
      notes: "Cancelled due to weather",
      cost: 0,
      address: "789 Your Street, Eco City",
      driverPhoto: null,
      issues: ["Heavy rainfall", "Safety concerns"],
    },
  ]);

  const [filteredCollections, setFilteredCollections] = useState(collections);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newFeedback, setNewFeedback] = useState("");

  const statuses = ["all", "completed", "cancelled"];

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterCollections(query, selectedStatus);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    filterCollections(searchQuery, status);
  };

  const filterCollections = (query, status) => {
    let filtered = collections;

    if (query) {
      filtered = filtered.filter(
        (collection) =>
          collection.driver.toLowerCase().includes(query.toLowerCase()) ||
          collection.wasteType.toLowerCase().includes(query.toLowerCase()) ||
          formatDate(collection.date)
            .toLowerCase()
            .includes(query.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((collection) => collection.status === status);
    }

    setFilteredCollections(filtered);
  };

  const handleCollectionAction = (collection, action) => {
    setSelectedCollection(collection);
    switch (action) {
      case "view":
        setShowDetailsModal(true);
        break;
      case "rate":
        setNewRating(collection.rating || 0);
        setNewFeedback(collection.notes || "");
        setShowRatingModal(true);
        break;
      case "reorder":
        Alert.alert(
          "Reorder Collection",
          `Schedule a new ${collection.wasteType} collection?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Schedule",
              onPress: () =>
                Alert.alert("Success", "New collection scheduled!"),
            },
          ]
        );
        break;
      case "report":
        Alert.alert("Report Issue", "Issue reporting feature coming soon!");
        break;
    }
  };

  const submitRating = () => {
    if (newRating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }

    const updatedCollections = collections.map((collection) =>
      collection.id === selectedCollection.id
        ? { ...collection, rating: newRating, notes: newFeedback }
        : collection
    );

    setCollections(updatedCollections);
    setFilteredCollections(updatedCollections);
    setShowRatingModal(false);
    setNewRating(0);
    setNewFeedback("");
    Alert.alert("Thank you!", "Your rating has been submitted.");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "❓";
    }
  };

  const getWasteTypeIcon = (wasteType) => {
    switch (wasteType.toLowerCase()) {
      case "mixed household":
        return "🗑️";
      case "recyclables":
        return "♻️";
      case "organic":
        return "🥬";
      case "garden waste":
        return "🌱";
      case "hazardous":
        return "☢️";
      default:
        return "📦";
    }
  };

  const renderStars = (rating, onPress = null) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={onPress ? () => onPress(star) : null}
            disabled={!onPress}
          >
            <Text
              style={[
                styles.star,
                star <= rating ? styles.starFilled : styles.starEmpty,
              ]}
            >
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const stats = {
    total: collections.length,
    completed: collections.filter((c) => c.status === "completed").length,
    totalWeight: collections
      .filter((c) => c.status === "completed")
      .reduce((sum, c) => sum + c.weight, 0),
    totalCost: collections
      .filter((c) => c.status === "completed")
      .reduce((sum, c) => sum + c.cost, 0),
    avgRating:
      collections
        .filter((c) => c.rating)
        .reduce((sum, c) => sum + c.rating, 0) /
        collections.filter((c) => c.rating).length || 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: COLORS.primary + "20" },
              ]}
            >
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: COLORS.success + "20" },
              ]}
            >
              <Text style={styles.statNumber}>
                {stats.totalWeight.toFixed(1)}kg
              </Text>
              <Text style={styles.statLabel}>Total Weight</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: COLORS.warning + "20" },
              ]}
            >
              <Text style={styles.statNumber}>
                ${stats.totalCost.toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: COLORS.info + "20" }]}
            >
              <Text style={styles.statNumber}>
                {stats.avgRating.toFixed(1)} ⭐
              </Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by driver, waste type, or date..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    selectedStatus === status && styles.filterChipSelected,
                  ]}
                  onPress={() => handleStatusFilter(status)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedStatus === status &&
                        styles.filterChipTextSelected,
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Collections List */}
        <View style={styles.collectionsContainer}>
          <Text style={styles.sectionTitle}>
            Collection History ({filteredCollections.length})
          </Text>
          {filteredCollections.map((collection) => (
            <View key={collection.id} style={styles.collectionCard}>
              <View style={styles.collectionHeader}>
                <View style={styles.collectionLeft}>
                  <View style={styles.collectionDate}>
                    <Text style={styles.dateText}>
                      {formatDate(collection.date)}
                    </Text>
                    <Text style={styles.timeText}>{collection.time}</Text>
                  </View>
                  <View style={styles.collectionInfo}>
                    <Text style={styles.driverName}>{collection.driver}</Text>
                    <Text style={styles.wasteType}>
                      {getWasteTypeIcon(collection.wasteType)}{" "}
                      {collection.wasteType}
                    </Text>
                    {collection.weight > 0 && (
                      <Text style={styles.weightText}>
                        Weight: {collection.weight}kg
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.collectionRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          getStatusColor(collection.status) + "20",
                      },
                    ]}
                  >
                    <Text style={styles.statusIcon}>
                      {getStatusIcon(collection.status)}
                    </Text>
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(collection.status) },
                      ]}
                    >
                      {collection.status.toUpperCase()}
                    </Text>
                  </View>
                  {collection.cost > 0 && (
                    <Text style={styles.costText}>
                      ${collection.cost.toFixed(2)}
                    </Text>
                  )}
                  {collection.rating && (
                    <View style={styles.ratingContainer}>
                      {renderStars(collection.rating)}
                    </View>
                  )}
                </View>
              </View>

              {collection.notes && (
                <Text style={styles.notesText}>💬 {collection.notes}</Text>
              )}

              {collection.issues.length > 0 && (
                <View style={styles.issuesContainer}>
                  <Text style={styles.issuesLabel}>Issues:</Text>
                  {collection.issues.map((issue, index) => (
                    <Text key={index} style={styles.issueText}>
                      • {issue}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.collectionActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.info },
                  ]}
                  onPress={() => handleCollectionAction(collection, "view")}
                >
                  <Text style={styles.actionButtonText}>Details</Text>
                </TouchableOpacity>

                {collection.status === "completed" && (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: COLORS.warning },
                      ]}
                      onPress={() => handleCollectionAction(collection, "rate")}
                    >
                      <Text style={styles.actionButtonText}>
                        {collection.rating ? "Update Rating" : "Rate"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: COLORS.primary },
                      ]}
                      onPress={() =>
                        handleCollectionAction(collection, "reorder")
                      }
                    >
                      <Text style={styles.actionButtonText}>Reorder</Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.error },
                  ]}
                  onPress={() => handleCollectionAction(collection, "report")}
                >
                  <Text style={styles.actionButtonText}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Collection Details Modal */}
        <Modal
          visible={showDetailsModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDetailsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedCollection && (
                <>
                  <Text style={styles.modalTitle}>Collection Details</Text>
                  <ScrollView style={styles.detailsScroll}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date & Time:</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(selectedCollection.date)} at{" "}
                        {selectedCollection.time}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Driver:</Text>
                      <Text style={styles.detailValue}>
                        {selectedCollection.driver}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Address:</Text>
                      <Text style={styles.detailValue}>
                        {selectedCollection.address}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Waste Type:</Text>
                      <Text style={styles.detailValue}>
                        {selectedCollection.wasteType}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Weight:</Text>
                      <Text style={styles.detailValue}>
                        {selectedCollection.weight}kg
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Cost:</Text>
                      <Text style={styles.detailValue}>
                        ${selectedCollection.cost.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status:</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: getStatusColor(selectedCollection.status) },
                        ]}
                      >
                        {selectedCollection.status.charAt(0).toUpperCase() +
                          selectedCollection.status.slice(1)}
                      </Text>
                    </View>
                    {selectedCollection.rating && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rating:</Text>
                        <View style={styles.detailValue}>
                          {renderStars(selectedCollection.rating)}
                        </View>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Notes:</Text>
                      <Text style={styles.detailValue}>
                        {selectedCollection.notes || "No notes"}
                      </Text>
                    </View>
                  </ScrollView>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => setShowDetailsModal(false)}
                  >
                    <Text style={styles.confirmButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Rating Modal */}
        <Modal
          visible={showRatingModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRatingModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Rate Your Experience</Text>

              <Text style={styles.modalLabel}>
                How was your collection service?
              </Text>
              <View style={styles.ratingSection}>
                {renderStars(newRating, setNewRating)}
              </View>

              <Text style={styles.modalLabel}>
                Additional Feedback (Optional):
              </Text>
              <TextInput
                style={[styles.modalInput, styles.feedbackInput]}
                placeholder="Share your experience..."
                placeholderTextColor={COLORS.textLight}
                value={newFeedback}
                onChangeText={setNewFeedback}
                multiline
                numberOfLines={4}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowRatingModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={submitRating}
                >
                  <Text style={styles.confirmButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  statsContainer: {
    marginBottom: SIZES.large,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.medium,
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
  searchContainer: {
    marginBottom: SIZES.medium,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
  },
  filtersContainer: {
    marginBottom: SIZES.large,
  },
  filterSection: {
    marginBottom: SIZES.medium,
  },
  filterLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusLarge,
    marginRight: SIZES.small,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: "500",
  },
  filterChipTextSelected: {
    color: COLORS.surface,
  },
  collectionsContainer: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  collectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.medium,
  },
  collectionLeft: {
    flexDirection: "row",
    flex: 1,
  },
  collectionDate: {
    alignItems: "center",
    marginRight: SIZES.medium,
    minWidth: 80,
  },
  dateText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "center",
  },
  timeText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  collectionInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  wasteType: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  weightText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  collectionRight: {
    alignItems: "flex-end",
    gap: SIZES.small,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
  },
  statusText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  costText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.success,
    fontWeight: "600",
  },
  ratingContainer: {
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 16,
  },
  starFilled: {
    opacity: 1,
  },
  starEmpty: {
    opacity: 0.3,
  },
  notesText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginBottom: SIZES.small,
  },
  issuesContainer: {
    backgroundColor: COLORS.error + "10",
    borderRadius: SIZES.radiusSmall,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  issuesLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.error,
    fontWeight: "600",
    marginBottom: 4,
  },
  issueText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.error,
    marginBottom: 2,
  },
  collectionActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SIZES.small,
  },
  actionButton: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.radiusSmall,
    alignItems: "center",
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.large,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SIZES.large,
    textAlign: "center",
  },
  detailsScroll: {
    maxHeight: 400,
    marginBottom: SIZES.large,
  },
  detailRow: {
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  detailLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  modalLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  ratingSection: {
    alignItems: "center",
    marginBottom: SIZES.large,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  feedbackInput: {
    height: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
});
