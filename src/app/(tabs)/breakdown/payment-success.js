// src/app/(tabs)/breakdown/payment-success.js

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "../../../constants/colors";
import spacing from "../../../constants/spacing";

import { apiRequest } from "../../../services/api";

// =========================================================
// HELPERS
// =========================================================

function firstParam(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function formatAmount(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toFixed(0);
}

function getServiceName(category) {
  switch (String(category || "").toUpperCase()) {
    case "BATTERY":
      return "Battery Assistance";

    case "TYRE":
      return "Tyre Assistance";

    case "FUEL":
      return "Fuel Assistance";

    case "BREAKDOWN":
      return "Breakdown Assistance";

    case "ELECTRICAL":
      return "Electrical Assistance";

    case "TOWING":
      return "Towing Assistance";

    default:
      return "Roadside Assistance";
  }
}

function getPaymentMethodLabel(method) {
  const value = String(method || "")
    .trim()
    .toUpperCase();

  if (value === "UPI") {
    return "UPI";
  }

  if (value === "CARD") {
    return "CARD";
  }

  if (value === "CASH") {
    return "CASH";
  }

  return value || "PAYMENT";
}

function getTransactionId(payment, params) {
  return (
    payment?.transactionId ||
    payment?.transactionID ||
    payment?.referenceId ||
    payment?.referenceID ||
    payment?.id ||
    firstParam(params.transactionId) ||
    firstParam(params.transactionID) ||
    "—"
  );
}

// =========================================================
// SCREEN
// =========================================================

export default function PaymentSuccessScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  // =======================================================
  // REQUEST ID
  // =======================================================

  const requestId = firstParam(params.requestId);

  // =======================================================
  // STATE
  // =======================================================

  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(false);

  // =======================================================
  // LOAD PAYMENT FROM BACKEND
  // =======================================================

  useEffect(() => {
    let mounted = true;

    async function loadPayment() {
      if (!requestId) {
        console.log("[DRIVER PAYMENT SUCCESS] No request ID provided");

        return;
      }

      try {
        setLoading(true);

        console.log("[DRIVER PAYMENT SUCCESS] Loading payment:", requestId);

        const response = await apiRequest(
          `/api/v1/payments/requests/${encodeURIComponent(String(requestId))}`,
          {
            method: "GET",
          },
        );

        if (!mounted) {
          return;
        }

        console.log(
          "[DRIVER PAYMENT SUCCESS] Payment response:",
          JSON.stringify(response, null, 2),
        );

        setPayment(response || null);
      } catch (error) {
        /*
         * Payment was already successful before navigating
         * to this screen, so failure to refresh the payment
         * must not prevent the success screen from displaying.
         *
         * The screen can still use route parameters.
         */

        console.warn(
          "[DRIVER PAYMENT SUCCESS] Unable to refresh payment:",
          error,
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPayment();

    return () => {
      mounted = false;
    };
  }, [requestId]);

  // =======================================================
  // DISPLAY VALUES
  // =======================================================

  const amount = useMemo(() => {
    return (
      payment?.amount ??
      firstParam(params.amount) ??
      firstParam(params.amountPaid) ??
      0
    );
  }, [payment?.amount, params.amount, params.amountPaid]);

  const paymentMethod = getPaymentMethodLabel(
    payment?.paymentMethod ||
      firstParam(params.paymentMethod) ||
      firstParam(params.paymentMode),
  );

  const transactionId = getTransactionId(payment, params);

  const service =
    payment?.serviceName ||
    firstParam(params.serviceName) ||
    firstParam(params.service) ||
    getServiceName(firstParam(params.category));

  // =======================================================
  // BACK TO HOME
  // =======================================================

  const handleBackToHome = () => {
    console.log("[DRIVER PAYMENT SUCCESS] Going to Home");

    router.replace("/(tabs)/home");
  };

  // =======================================================
  // VIEW INVOICE
  // =======================================================

  const handleViewInvoice = () => {
    /*
     * Invoice API/PDF generation is not currently part of
     * the confirmed payment flow.
     *
     * Do not invent an endpoint here.
     */

    Alert.alert(
      "Invoice",
      "Your payment has been successfully recorded. Invoice viewing will be available here.",
    );
  };

  // =======================================================
  // UI
  // =======================================================

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =================================================
            SUCCESS HEADER
            ================================================= */}

        <View style={styles.successArea}>
          <View style={styles.successOuter}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={58} color={colors.white} />
            </View>
          </View>

          <Text style={styles.title}>Payment successful</Text>

          <Text style={styles.subtitle}>
            Your payment has been completed successfully.
          </Text>
        </View>

        {/* =================================================
            PAYMENT DETAILS
            ================================================= */}

        <View style={styles.detailsCard}>
          {/* AMOUNT */}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount paid</Text>

            <Text style={[styles.detailValue, styles.amountValue]}>
              ₹{formatAmount(amount)}
            </Text>
          </View>

          {/* PAYMENT METHOD */}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment method</Text>

            <Text style={styles.detailValue}>{paymentMethod}</Text>
          </View>

          {/* TRANSACTION */}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>

            <Text
              style={[styles.detailValue, styles.transactionValue]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {transactionId}
            </Text>
          </View>

          {/* SERVICE */}

          <View style={[styles.detailRow, styles.lastDetailRow]}>
            <Text style={styles.detailLabel}>Service</Text>

            <Text style={styles.detailValue} numberOfLines={1}>
              {service}
            </Text>
          </View>
        </View>

        {/* =================================================
            VIEW INVOICE
            ================================================= */}

        <TouchableOpacity
          style={styles.invoiceButton}
          onPress={handleViewInvoice}
          activeOpacity={0.85}
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={colors.accent}
          />

          <Text style={styles.invoiceText}>VIEW INVOICE</Text>
        </TouchableOpacity>

        {/* =================================================
            BACK TO HOME
            ================================================= */}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleBackToHome}
          activeOpacity={0.85}
        >
          <Text style={styles.homeButtonText}>BACK TO HOME</Text>

          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>

        {/* =================================================
            REFRESHING
            ================================================= */}

        {loading && (
          <View style={styles.refreshingRow}>
            <ActivityIndicator size="small" color={colors.accent} />

            <Text style={styles.refreshingText}>Confirming payment...</Text>
          </View>
        )}
      </ScrollView>

      {/* =================================================
          IMPORTANT
          
          NO BottomNavigation HERE.

          The existing TabsLayout:
          
          src/app/(tabs)/_layout.js
          
          already provides:
          
          Home | Requests | Vehicle | Profile
          
          Therefore adding another navigation here would
          create the duplicate bottom navigation problem.
          ================================================= */}
    </View>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: spacing.lg || 20,

    paddingTop: spacing.xl || 28,

    /*
     * Space for the existing Expo Router tab bar.
     */
    paddingBottom: 110,
  },

  // -----------------------------------------------------
  // SUCCESS
  // -----------------------------------------------------

  successArea: {
    alignItems: "center",

    paddingTop: 24,

    paddingBottom: 30,
  },

  successOuter: {
    width: 132,

    height: 132,

    borderRadius: 66,

    backgroundColor: colors.successLight || "#DCFCE7",

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 26,
  },

  successCircle: {
    width: 96,

    height: 96,

    borderRadius: 48,

    backgroundColor: colors.success || "#16A34A",

    alignItems: "center",

    justifyContent: "center",
  },

  title: {
    fontSize: 30,

    fontWeight: "700",

    color: colors.text || "#111827",

    textAlign: "center",

    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,

    lineHeight: 21,

    color: colors.textMuted || "#64748B",

    textAlign: "center",

    maxWidth: 320,
  },

  // -----------------------------------------------------
  // DETAILS
  // -----------------------------------------------------

  detailsCard: {
    backgroundColor: colors.white,

    borderRadius: 18,

    borderWidth: 1,

    borderColor: colors.borderLight,

    paddingHorizontal: 18,

    paddingVertical: 8,

    marginBottom: 18,

    shadowColor: "#000",

    shadowOpacity: 0.04,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,

      height: 4,
    },

    elevation: 2,
  },

  detailRow: {
    minHeight: 58,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    borderBottomWidth: 1,

    borderBottomColor: colors.borderLight,
  },

  lastDetailRow: {
    borderBottomWidth: 0,
  },

  detailLabel: {
    flex: 1,

    fontSize: 13,

    color: colors.textMuted,

    paddingRight: 12,
  },

  detailValue: {
    flex: 1,

    textAlign: "right",

    fontSize: 13,

    fontWeight: "600",

    color: colors.text,
  },

  amountValue: {
    color: colors.success || "#16A34A",

    fontSize: 15,
  },

  transactionValue: {
    fontSize: 12,
  },

  // -----------------------------------------------------
  // INVOICE
  // -----------------------------------------------------

  invoiceButton: {
    minHeight: 58,

    borderRadius: 16,

    borderWidth: 1,

    borderColor: colors.borderLight,

    backgroundColor: colors.white,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 10,

    marginBottom: 14,
  },

  invoiceText: {
    fontSize: 13,

    fontWeight: "700",

    color: colors.accent,

    letterSpacing: 0.2,
  },

  // -----------------------------------------------------
  // HOME
  // -----------------------------------------------------

  homeButton: {
    minHeight: 60,

    borderRadius: 16,

    backgroundColor: colors.accent,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 12,

    paddingHorizontal: 20,
  },

  homeButtonText: {
    color: colors.white,

    fontSize: 13,

    fontWeight: "700",

    letterSpacing: 0.2,
  },

  // -----------------------------------------------------
  // LOADING
  // -----------------------------------------------------

  refreshingRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    paddingTop: 18,
  },

  refreshingText: {
    fontSize: 12,

    color: colors.textMuted,
  },
});
