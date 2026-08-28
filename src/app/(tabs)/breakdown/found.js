import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getServiceRequestById } from "../../../services/requestService";

import { useEffect, useRef, useState } from "react";
import colors from "../../../constants/colors";

export default function FoundScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const requestId = Array.isArray(params.requestId)
    ? params.requestId[0]
    : params.requestId;

  // =======================================================
  // ARRIVAL NAVIGATION GUARD
  // =======================================================

  const arrivalNavigationRef = useRef(false);

  const [activeRequest, setActiveRequest] = useState(null);

  const [checkingAssignment, setCheckingAssignment] = useState(true);

  // =======================================================
  // CHECK DRIVER REQUEST STATUS
  // =======================================================
  //
  // The previous screen was completely static.
  // Poll the backend so that when the mechanic accepts:
  // SEARCHING -> ASSIGNED
  // the driver immediately receives the real mechanic data.
  // =======================================================

  useEffect(() => {
    let mounted = true;

    const loadRequestStatus = async () => {
      try {
        if (!requestId) {
          console.error(
            "[DRIVER FOUND] Missing requestId while checking status.",
          );
          return;
        }

        const response = await getServiceRequestById(String(requestId));

        if (!mounted) {
          return;
        }

        console.log(
          "[DRIVER FOUND] Active request:",
          JSON.stringify(response, null, 2),
        );

        setActiveRequest(response);
      } catch (error) {
        console.error("[DRIVER FOUND] Status check failed:", error);
      } finally {
        if (mounted) {
          setCheckingAssignment(false);
        }
      }
    };

    loadRequestStatus();

    const interval = setInterval(loadRequestStatus, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [requestId]);

  const request = activeRequest;

  const mechanic = request?.mechanic || null;

  const vehicle = request?.vehicle || null;

  const status = String(request?.status || "SEARCHING")
    .trim()
    .toUpperCase();

  const serviceTitle =
    request?.category === "BATTERY"
      ? "Battery Assistance"
      : request?.category === "TYRE"
        ? "Tyre Assistance"
        : request?.category === "FUEL"
          ? "Fuel Assistance"
          : request?.category === "BREAKDOWN"
            ? "Breakdown Assistance"
            : "Roadside Assistance";

  const vehicleNumber =
    vehicle?.registrationNumber || params.vehicleNumber || "Vehicle";

  const locationText = request?.address || "Current GPS location";

  const mechanicName = mechanic?.name || "Finding mechanic...";

  const mechanicRating =
    mechanic?.rating !== null && mechanic?.rating !== undefined
      ? Number(mechanic.rating).toFixed(1)
      : "--";

  const mechanicJobs = mechanic?.totalJobs ?? 0;

  const statusLabel =
    status === "MECHANIC_EN_ROUTE"
      ? "ON THE WAY"
      : status === "ARRIVED"
        ? "ARRIVED"
        : status === "IN_PROGRESS"
          ? "SERVICE IN PROGRESS"
          : status === "ASSIGNED"
            ? "MECHANIC ASSIGNED"
            : "SEARCHING";

  const etaMinutes = (() => {
    // ETA is not relevant once the mechanic has arrived.
    if (
      status === "ARRIVED" ||
      status === "IN_PROGRESS" ||
      status === "PAYMENT_PENDING"
    ) {
      return null;
    }

    if (!request || !mechanic) {
      return null;
    }

    const lat1 = Number(request.latitude);
    const lon1 = Number(request.longitude);
    const lat2 = Number(mechanic.latitude);
    const lon2 = Number(mechanic.longitude);

    if ([lat1, lon1, lat2, lon2].some(Number.isNaN)) {
      return null;
    }

    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);

    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const distanceKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Approximate city ETA. Do not force a permanent 2-minute value.
    if (distanceKm < 0.15) {
      return 1;
    }

    const averageSpeedKmH = 25;

    return Math.max(1, Math.ceil((distanceKm / averageSpeedKmH) * 60));
  })();

  // =======================================================
  // AUTOMATIC ARRIVAL -> SERVICE SCREEN
  // =======================================================

  useEffect(() => {
    const normalizedStatus = String(activeRequest?.status || "")
      .trim()
      .toUpperCase();

    if (normalizedStatus !== "ARRIVED") {
      return;
    }

    if (arrivalNavigationRef.current) {
      return;
    }

    if (!requestId) {
      console.error(
        "[DRIVER FOUND] ARRIVED received but requestId is missing.",
      );

      return;
    }

    arrivalNavigationRef.current = true;

    console.log("[DRIVER FOUND] Mechanic has arrived");

    console.log("[DRIVER FOUND] Navigating to service screen:", requestId);

    router.replace({
      pathname: "/(tabs)/breakdown/service",
      params: {
        requestId: String(requestId),
      },
    });
  }, [activeRequest?.status, requestId, router]);

  const handleCallMechanic = async () => {
    if (!mechanic?.phone) {
      return;
    }

    try {
      await Linking.openURL(`tel:${mechanic.phone}`);
    } catch (error) {
      console.error("[DRIVER FOUND] Unable to call mechanic:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={34} color={colors.white} />
        </View>

        <Text style={styles.title}>Mechanic found</Text>

        <Text style={styles.subtitle}>
          A verified mechanic is on the way to help you.
        </Text>

        <View
          style={[
            styles.etaCard,
            status === "ARRIVED" && styles.arrivedEtaCard,
          ]}
        >
          <View
            style={[
              styles.etaIcon,
              status === "ARRIVED" && styles.arrivedEtaIcon,
            ]}
          >
            <Ionicons
              name={status === "ARRIVED" ? "checkmark-circle" : "time-outline"}
              size={24}
              color={status === "ARRIVED" ? colors.success : colors.accent}
            />
          </View>

          <View style={styles.etaInfo}>
            <Text style={styles.etaLabel}>
              {status === "ARRIVED" ? "MECHANIC ARRIVAL" : "ESTIMATED ARRIVAL"}
            </Text>

            <Text style={styles.etaValue}>
              {status === "ARRIVED"
                ? "Mechanic has arrived"
                : etaMinutes !== null
                  ? `${etaMinutes} minutes`
                  : checkingAssignment
                    ? "Waiting..."
                    : "Calculating..."}
            </Text>
          </View>

          <View
            style={[
              styles.etaBadge,
              status === "ARRIVED" && styles.arrivedEtaBadge,
            ]}
          >
            <Text
              style={[
                styles.etaBadgeText,
                status === "ARRIVED" && styles.arrivedEtaBadgeText,
              ]}
            >
              {status === "ARRIVED" ? "ARRIVED" : statusLabel}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>YOUR MECHANIC</Text>

        <View style={styles.mechanicCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={31} color={colors.accent} />
          </View>

          <View style={styles.mechanicInfo}>
            <Text style={styles.name}>{mechanicName}</Text>

            <Text style={styles.type}>
              {mechanic?.workshopName || "Roadside Mechanic"}
            </Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.warning} />

              <Text style={styles.rating}>{mechanicRating}</Text>

              <Text style={styles.jobs}>• {mechanicJobs} jobs completed</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.callButton}
            onPress={handleCallMechanic}
            disabled={!mechanic?.phone}
          >
            <Ionicons name="call" size={19} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            icon="construct-outline"
            label="SERVICE"
            value={serviceTitle}
          />

          <View style={styles.divider} />

          <InfoRow icon="car-outline" label="VEHICLE" value={vehicleNumber} />

          <View style={styles.divider} />

          <InfoRow
            icon="location-outline"
            label="LOCATION"
            value={locationText}
          />
        </View>

        <View style={styles.trustCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={22}
            color={colors.success}
          />

          <View style={styles.trustInfo}>
            <Text style={styles.trustTitle}>Verified mechanic</Text>

            <Text style={styles.trustText}>
              Identity and service credentials verified.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (status === "ARRIVED") {
              router.replace({
                pathname: "/(tabs)/breakdown/service",
                params: {
                  requestId: String(requestId || ""),
                },
              });

              return;
            }

            router.replace({
              pathname: "/breakdown/found",
              params: {
                requestId: String(requestId || ""),
                type: params.type || "battery",
                vehicleNumber: params.vehicleNumber || "",
              },
            });
          }}
        >
          <Ionicons name="navigate-outline" size={19} color={colors.white} />

          <Text style={styles.primaryText}>
            {status === "ARRIVED" ? "START SERVICE" : "TRACK MECHANIC"}
          </Text>

          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={19} color={colors.accent} />
      </View>

      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 110,
  },

  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },

  title: {
    fontFamily: "InterExtraBold",
    fontSize: 26,
    color: colors.text,
    textAlign: "center",
    marginTop: 18,
  },

  subtitle: {
    fontFamily: "InterRegular",
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 5,
  },

  etaCard: {
    backgroundColor: colors.accentLight,
    borderRadius: 18,
    padding: 14,
    marginTop: 23,
    flexDirection: "row",
    alignItems: "center",
  },

  etaIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  etaInfo: {
    flex: 1,
  },

  etaLabel: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.textMuted,
  },

  etaValue: {
    fontFamily: "InterExtraBold",
    fontSize: 18,
    color: colors.text,
    marginTop: 3,
  },

  etaBadge: {
    backgroundColor: colors.successLight,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  etaBadgeText: {
    fontFamily: "InterBold",
    fontSize: 8,
    color: colors.success,
  },

  arrivedEtaCard: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
  },

  arrivedEtaIcon: {
    backgroundColor: colors.white,
  },

  arrivedEtaBadge: {
    backgroundColor: colors.white,
  },

  arrivedEtaBadgeText: {
    color: colors.success,
  },

  sectionLabel: {
    fontFamily: "InterBold",
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginTop: 25,
    marginBottom: 9,
  },

  mechanicCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  mechanicInfo: {
    flex: 1,
  },

  name: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: colors.text,
  },

  type: {
    fontFamily: "InterRegular",
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },

  rating: {
    fontFamily: "InterBold",
    fontSize: 10,
    color: colors.text,
  },

  jobs: {
    fontFamily: "InterRegular",
    fontSize: 9,
    color: colors.textMuted,
  },

  callButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  infoText: {
    flex: 1,
  },

  infoLabel: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.textMuted,
  },

  infoValue: {
    fontFamily: "InterSemiBold",
    fontSize: 12,
    color: colors.text,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },

  trustCard: {
    marginTop: 18,
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  trustInfo: {
    flex: 1,
    marginLeft: 9,
  },

  trustTitle: {
    fontFamily: "InterSemiBold",
    fontSize: 11,
    color: colors.text,
  },

  trustText: {
    fontFamily: "InterRegular",
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    padding: 20,
  },

  primaryButton: {
    height: 53,
    borderRadius: 15,
    backgroundColor: colors.accent,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  primaryText: {
    flex: 1,
    fontFamily: "InterBold",
    fontSize: 12,
    color: colors.white,
  },
});
