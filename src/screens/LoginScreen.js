import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import { validateEmail } from "../utils/helpers";
import CustomButton from "../components/CustomButton";

export default function LoginScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    selectedRole: "customer", // Default role
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "admin",
      title: "Admin",
      description: "Manage users and system",
      icon: "👑",
    },
    {
      id: "driver",
      title: "Driver",
      description: "Handle collection routes",
      icon: "🚛",
    },
    {
      id: "customer",
      title: "Customer",
      description: "Schedule waste pickup",
      icon: "🏠",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to role-based dashboard
      const dashboardMap = {
        admin: "AdminDashboard",
        driver: "DriverDashboard",
        customer: "CustomerDashboard",
      };

      const dashboardScreen = dashboardMap[formData.selectedRole];
      if (dashboardScreen) {
        navigation.replace(dashboardScreen);
      } else {
        Alert.alert("Error", "Invalid role selected");
      }
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupNavigation = () => {
    navigation.navigate("Signup");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset feature will be implemented soon!"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to continue to Smart Waste Manager
            </Text>
          </View>

          {/* Role Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Your Role</Text>
            <View style={styles.roleContainer}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleCard,
                    formData.selectedRole === role.id &&
                      styles.roleCardSelected,
                  ]}
                  onPress={() => handleInputChange("selectedRole", role.id)}
                >
                  <Text style={styles.roleIcon}>{role.icon}</Text>
                  <Text
                    style={[
                      styles.roleTitle,
                      formData.selectedRole === role.id &&
                        styles.roleTextSelected,
                    ]}
                  >
                    {role.title}
                  </Text>
                  <Text
                    style={[
                      styles.roleDescription,
                      formData.selectedRole === role.id &&
                        styles.roleTextSelected,
                    ]}
                  >
                    {role.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Login Credentials</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textLight}
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textLight}
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                autoCapitalize="none"
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <CustomButton
            title={loading ? "Signing In..." : "Sign In"}
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={loading}
          />

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignupNavigation}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  header: {
    marginBottom: SIZES.extraLarge,
    alignItems: "center",
  },
  title: {
    fontSize: SIZES.fontHeader,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontSize: SIZES.fontMedium,
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
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SIZES.small,
  },
  roleCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + "20",
  },
  roleIcon: {
    fontSize: 24,
    marginBottom: SIZES.small,
  },
  roleTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  roleTextSelected: {
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: SIZES.medium,
  },
  inputLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.error,
    marginTop: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: SIZES.small,
  },
  forgotPasswordText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.primary,
    fontWeight: "500",
  },
  loginButton: {
    marginTop: SIZES.medium,
    marginBottom: SIZES.large,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: SIZES.fontMedium,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
