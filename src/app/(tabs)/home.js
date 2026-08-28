import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCallback, useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect, useRouter } from "expo-router";

import colors from "../../constants/colors";

import {
  cancelServiceRequest,
  getActiveServiceRequest,
  getMyServiceRequests,
} from "../../services/requestService";

import { getMyDriverProfile } from "../../services/driverService";

import { apiRequest } from "../../services/api";

// =========================================================
// VEHICLE API
// =========================================================

async function getMyVehicles() {
  return apiRequest("/api/v1/vehicles/my", {
    method: "GET",
  });
}

// =========================================================
// GREETING
// =========================================================

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

// =========================================================
// VEHICLE NAME
// =========================================================

function getVehicleName(vehicle) {
  if (!vehicle) {
    return "";
  }

  const manufacturer = vehicle?.manufacturer || "";

  const model = vehicle?.model || "";

  const name = `${manufacturer} ${model}`.trim();

  if (name) {
    return name;
  }

  return vehicle?.vehicleType || "My Vehicle";
}

// =========================================================
// REQUEST STATUS LABEL
// =========================================================

function getRequestStatusLabel(status) {
  switch (String(status || "").toUpperCase()) {
    case "CREATED":
      return "Request Created";

    case "SEARCHING":
      return "Finding Mechanic";

    case "ASSIGNED":
      return "Mechanic Assigned";

    case "MECHANIC_EN_ROUTE":
      return "Mechanic On The Way";

    case "ARRIVED":
      return "Mechanic Arrived";

    case "IN_PROGRESS":
      return "Service In Progress";

    case "PAYMENT_PENDING":
      return "Payment Pending";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status || "Unknown";
  }
}

// =========================================================
// REQUEST STATUS COLOR
// =========================================================

function getRequestStatusColors(status) {
  switch (String(status || "").toUpperCase()) {
    case "SEARCHING":
    case "CREATED":
      return {
        background: colors.warningLight,
        text: colors.warning,
      };

    case "ASSIGNED":
    case "MECHANIC_EN_ROUTE":
    case "ARRIVED":
      return {
        background: colors.infoLight,
        text: colors.info,
      };

    case "IN_PROGRESS":
      return {
        background: colors.accentLight,
        text: colors.accent,
      };

    case "COMPLETED":
      return {
        background: colors.successLight,
        text: colors.success,
      };

    case "CANCELLED":
      return {
        background: colors.dangerLight,
        text: colors.danger,
      };

    default:
      return {
        background: colors.borderLight,
        text: colors.textMuted,
      };
  }
}

// =========================================================
// CATEGORY ICON
// =========================================================

function getCategoryIcon(category) {
  switch (String(category || "").toUpperCase()) {
    case "TYRE":
      return "speedometer-outline";

    case "BATTERY":
      return "battery-half-outline";

    case "FUEL":
      return "flame-outline";

    case "BREAKDOWN":
      return "construct-outline";

    case "ELECTRICAL":
      return "flash-outline";

    case "TOWING":
      return "car-outline";

    default:
      return "construct-outline";
  }
}

// =========================================================
// CATEGORY TITLE
// =========================================================

function getCategoryTitle(category) {
  switch (String(category || "").toUpperCase()) {
    case "TYRE":
      return "Tyre Assistance";

    case "BATTERY":
      return "Battery Assistance";

    case "FUEL":
      return "Fuel Assistance";

    case "BREAKDOWN":
      return "Breakdown Assistance";

    case "ELECTRICAL":
      return "Electrical Assistance";

    case "TOWING":
      return "Towing Assistance";

    case "OTHER":
      return "Other Assistance";

    default:
      return category || "Service Request";
  }
}

// =========================================================
// DATE FORMATTER
// =========================================================

function formatRequestDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  try {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "";
  }
}

// =========================================================
// TIME FORMATTER
// =========================================================

function formatRequestTime(dateValue) {
  if (!dateValue) {
    return "";
  }

  try {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "";
  }
}

// =========================================================
// HOME SCREEN
// =========================================================

export default function HomeScreen() {
  const router = useRouter();

  // =======================================================
  // DRIVER PROFILE
  // =======================================================

  const [driverProfile, setDriverProfile] = useState(null);

  const [loadingDriver, setLoadingDriver] = useState(true);

  // =======================================================
  // PRIMARY VEHICLE
  // =======================================================

  const [primaryVehicle, setPrimaryVehicle] = useState(null);

  const [loadingVehicle, setLoadingVehicle] = useState(true);

  // =======================================================
  // ACTIVE SERVICE
  // =======================================================

  const [activeRequest, setActiveRequest] = useState(null);

  const [loadingActiveRequest, setLoadingActiveRequest] = useState(true);

  const [cancellingRequest, setCancellingRequest] = useState(false);

  // =======================================================
  // RECENT SERVICE
  // =======================================================

  const [recentRequest, setRecentRequest] = useState(null);

  const [loadingRequests, setLoadingRequests] = useState(false);

  const [requestError, setRequestError] = useState(null);

  // =======================================================
  // QUICK ASSISTANCE
  // =======================================================

  const breakdownTypes = [
    {
      title: "Tyre",
      category: "TYRE",
      icon: "speedometer-outline",
    },

    {
      title: "Battery",
      category: "BATTERY",
      icon: "battery-half-outline",
    },

    {
      title: "Fuel",
      category: "FUEL",
      icon: "flame-outline",
    },

    {
      title: "Mechanical",
      category: "BREAKDOWN",
      icon: "construct-outline",
    },

    {
      title: "Electrical",
      category: "ELECTRICAL",
      icon: "flash-outline",
    },

    {
      title: "Towing",
      category: "TOWING",
      icon: "car-outline",
    },
  ];

  // =======================================================
  // LOAD DRIVER PROFILE
  // =======================================================

  const loadDriverProfile = useCallback(async () => {
    try {
      setLoadingDriver(true);

      const response = await getMyDriverProfile();

      console.log("[Truck Assist] Driver profile:", response);

      setDriverProfile(response || null);
    } catch (error) {
      console.error("Unable to load driver profile:", error);

      setDriverProfile(null);
    } finally {
      setLoadingDriver(false);
    }
  }, []);

  // =======================================================
  // LOAD PRIMARY VEHICLE
  // =======================================================

  const loadPrimaryVehicle = useCallback(async () => {
    try {
      setLoadingVehicle(true);

      const response = await getMyVehicles();

      console.log("[Truck Assist] My vehicles:", response);

      const vehicles = Array.isArray(response) ? response : [];

      const primary = vehicles.find(
        (vehicle) =>
          vehicle?.primary === true &&
          String(vehicle?.status || "").toUpperCase() !== "DELETED",
      );

      const activeVehicle = vehicles.find(
        (vehicle) => String(vehicle?.status || "").toUpperCase() === "ACTIVE",
      );

      setPrimaryVehicle(primary || activeVehicle || null);
    } catch (error) {
      console.error("Unable to load primary vehicle:", error);

      setPrimaryVehicle(null);
    } finally {
      setLoadingVehicle(false);
    }
  }, []);

  // =======================================================
  // LOAD ACTIVE SERVICE
  // =======================================================

  const loadActiveRequest = useCallback(async () => {
    try {
      setLoadingActiveRequest(true);

      const response = await getActiveServiceRequest();

      console.log("[Truck Assist] Active request:", response);

      const status = String(response?.status || "")
        .trim()
        .toUpperCase();

      console.log(
        "[Truck Assist] Active request status:",
        status,
      );

      // =====================================================
      // COMPLETED / CANCELLED ARE NOT ACTIVE
      // =====================================================

      if (
        status === "COMPLETED" ||
        status === "CANCELLED"
      ) {
        console.log(
          "[Truck Assist] Request is completed/cancelled. " +
            "Removing from Active Service.",
        );

        setActiveRequest(null);
        return;
      }

      // =====================================================
      // VALID ACTIVE REQUEST
      // =====================================================

      setActiveRequest(response || null);
    } catch (error) {
      // 404 means there is no active request.
      // This is a normal state.

      if (error?.status === 404) {
        console.log(
          "[Truck Assist] No active service request.",
        );

        setActiveRequest(null);
      } else {
        console.error(
          "Unable to load active service:",
          error,
        );

        setActiveRequest(null);
      }
    } finally {
      setLoadingActiveRequest(false);
    }
  }, []);

  // =======================================================
  // LOAD RECENT REQUEST
  // =======================================================

  const loadRecentRequest = useCallback(async () => {
    try {
      setLoadingRequests(true);

      setRequestError(null);

      const requests = await getMyServiceRequests();

      console.log("[Truck Assist] Driver service requests:", requests);

      if (Array.isArray(requests) && requests.length > 0) {
        setRecentRequest(requests[0]);
      } else {
        setRecentRequest(null);
      }
    } catch (error) {
      console.error("Unable to load recent service:", error);

      setRequestError(error?.message || "Unable to load service requests");
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  // =======================================================
  // REFRESH HOME
  // =======================================================

  const refreshHome = useCallback(async () => {
    await Promise.all([
      loadDriverProfile(),
      loadPrimaryVehicle(),
      loadActiveRequest(),
      loadRecentRequest(),
    ]);
  }, [
    loadDriverProfile,
    loadPrimaryVehicle,
    loadActiveRequest,
    loadRecentRequest,
  ]);

  // =======================================================
  // LOAD WHEN HOME GETS FOCUS
  // =======================================================

  useFocusEffect(
    useCallback(() => {
      refreshHome();
    }, [refreshHome]),
  );

  // =========================================================
  // OPEN REQUEST / RESUME ACTIVE BREAKDOWN
  // =========================================================

  const openRequest = (request) => {
    if (!request?.id) {
      return;
    }

    const requestId = String(request.id);

    const status = String(request.status || "")
      .trim()
      .toUpperCase();

    console.log(
      "[Truck Assist] Opening request:",
      requestId,
      "Status:",
      status,
    );

    // =======================================================
    // SEARCHING
    // =======================================================

    if (status === "CREATED" || status === "SEARCHING") {
      router.replace({
        pathname: "/breakdown/searching",
        params: {
          requestId,
        },
      });

      return;
    }

    // =======================================================
    // MECHANIC ASSIGNED / ON THE WAY
    // =======================================================

    if (
      status === "ASSIGNED" ||
      status === "MECHANIC_EN_ROUTE" ||
      status === "EN_ROUTE"
    ) {
      router.replace({
        pathname: "/breakdown/found",
        params: {
          requestId,

          type: String(request.category || "").toLowerCase(),

          vehicleNumber: request?.vehicle?.registrationNumber || "",
        },
      });

      return;
    }

    // =======================================================
    // MECHANIC ARRIVED / SERVICE IN PROGRESS
    // =======================================================

    if (
      status === "ARRIVED" ||
      status === "IN_PROGRESS" ||
      status === "PAYMENT_PENDING"
    ) {
      router.replace({
        pathname: "/(tabs)/breakdown/service",
        params: {
          requestId,
        },
      });

      return;
    }

    // =======================================================
    // COMPLETED / CANCELLED / UNKNOWN
    // =======================================================

    router.push(`/requests/${requestId}`);
  };

  // =======================================================
  // CANCEL ACTIVE REQUEST
  // =======================================================

  const handleCancelRequest = () => {
    if (!activeRequest?.id || cancellingRequest) {
      return;
    }

    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel this service request?",
      [
        {
          text: "Keep Request",
          style: "cancel",
        },

        {
          text: "Cancel Request",
          style: "destructive",

          onPress: async () => {
            try {
              setCancellingRequest(true);

              await cancelServiceRequest(activeRequest.id);

              console.log("[Truck Assist] Service request cancelled");

              setActiveRequest(null);

              // Refresh recent service
              await loadRecentRequest();
            } catch (error) {
              console.error("Unable to cancel request:", error);

              Alert.alert(
                "Unable to Cancel",
                error?.message ||
                  "Unable to cancel the service request. Please try again.",
              );
            } finally {
              setCancellingRequest(false);
            }
          },
        },
      ],
    );
  };

  // =======================================================
  // DRIVER NAME
  // =======================================================

  const driverName = driverProfile?.name || "Driver";

  // =======================================================
  // GREETING
  // =======================================================

  const greeting = getGreeting();

  // =======================================================
  // ACTIVE REQUEST STATUS
  // =======================================================

  const activeStatus = getRequestStatusLabel(activeRequest?.status);

  const activeStatusColors = getRequestStatusColors(activeRequest?.status);

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =================================================
            HEADER
            ================================================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>

            <Text style={styles.name} numberOfLines={1}>
              {loadingDriver ? "Driver" : driverName}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text}
            />

            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* =================================================
            PRIMARY VEHICLE
            ================================================= */}

        <TouchableOpacity
          style={styles.vehicleCard}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/vehicle")}
        >
          <View style={styles.vehicleIcon}>
            <Ionicons name="car-sport" size={28} color={colors.accent} />
          </View>

          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleLabel}>PRIMARY VEHICLE</Text>

            {loadingVehicle ? (
              <View style={styles.vehicleLoading}>
                <ActivityIndicator size="small" color={colors.accent} />
              </View>
            ) : primaryVehicle ? (
              <>
                <Text style={styles.vehicleNumber} numberOfLines={1}>
                  {primaryVehicle?.registrationNumber ||
                    "Registration unavailable"}
                </Text>

                <Text style={styles.vehicleName} numberOfLines={1}>
                  {getVehicleName(primaryVehicle)}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.vehicleNumber}>No vehicle added</Text>

                <Text style={styles.vehicleName}>Add your vehicle</Text>
              </>
            )}
          </View>

          <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
        </TouchableOpacity>

        {/* =================================================
            ACTIVE SERVICE
            ================================================= */}

        {!loadingActiveRequest &&
          activeRequest &&
          !["COMPLETED", "CANCELLED"].includes(
            String(activeRequest.status || "")
              .trim()
              .toUpperCase(),
          ) && (
          <View style={styles.activeServiceCard}>
            {/* -------------------------------------------
                  ACTIVE HEADER
                  ------------------------------------------- */}

            <View style={styles.activeHeader}>
              <View style={styles.activeHeaderLeft}>
                <View style={styles.activeIcon}>
                  <Ionicons name="construct" size={23} color={colors.white} />
                </View>

                <View>
                  <Text style={styles.activeTitle}>Active Service</Text>

                  <Text style={styles.activeSubtitle}>
                    Your assistance request
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.activeStatusBadge,
                  {
                    backgroundColor: activeStatusColors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.activeStatusText,
                    {
                      color: activeStatusColors.text,
                    },
                  ]}
                >
                  {activeStatus}
                </Text>
              </View>
            </View>

            {/* -------------------------------------------
                  REQUEST DETAILS
                  ------------------------------------------- */}

            <View style={styles.activeDetails}>
              <View style={styles.activeDetailRow}>
                <Ionicons
                  name={getCategoryIcon(activeRequest.category)}
                  size={19}
                  color={colors.accent}
                />

                <View style={styles.activeDetailContent}>
                  <Text style={styles.activeDetailLabel}>SERVICE</Text>

                  <Text style={styles.activeDetailValue}>
                    {getCategoryTitle(activeRequest.category)}
                  </Text>
                </View>
              </View>

              <View style={styles.activeDetailDivider} />

              <View style={styles.activeDetailRow}>
                <Ionicons name="car-outline" size={19} color={colors.accent} />

                <View style={styles.activeDetailContent}>
                  <Text style={styles.activeDetailLabel}>VEHICLE</Text>

                  <Text style={styles.activeDetailValue}>
                    {primaryVehicle?.registrationNumber || "Vehicle"}
                  </Text>
                </View>
              </View>

              <View style={styles.activeDetailDivider} />

              <View style={styles.activeDetailRow}>
                <Ionicons name="time-outline" size={19} color={colors.accent} />

                <View style={styles.activeDetailContent}>
                  <Text style={styles.activeDetailLabel}>REQUESTED</Text>

                  <Text style={styles.activeDetailValue}>
                    {formatRequestDate(activeRequest.createdAt)}

                    {activeRequest.createdAt
                      ? ` • ${formatRequestTime(activeRequest.createdAt)}`
                      : ""}
                  </Text>
                </View>
              </View>
            </View>

            {/* -------------------------------------------
                  DESCRIPTION
                  ------------------------------------------- */}

            {activeRequest.description ? (
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionLabel}>DESCRIPTION</Text>

                <Text style={styles.descriptionText} numberOfLines={2}>
                  {activeRequest.description}
                </Text>
              </View>
            ) : null}

            {/* -------------------------------------------
                  ACTIONS
                  ------------------------------------------- */}

            <View style={styles.activeActions}>
              <TouchableOpacity
                style={styles.viewRequestButton}
                activeOpacity={0.85}
                onPress={() => openRequest(activeRequest)}
              >
                <Text style={styles.viewRequestText}>VIEW REQUEST</Text>

                <Ionicons name="arrow-forward" size={18} color={colors.white} />
              </TouchableOpacity>

              {["CREATED", "SEARCHING"].includes(
                String(activeRequest.status || "").toUpperCase(),
              ) && (
                <TouchableOpacity
                  style={styles.cancelRequestButton}
                  activeOpacity={0.8}
                  disabled={cancellingRequest}
                  onPress={handleCancelRequest}
                >
                  {cancellingRequest ? (
                    <ActivityIndicator size="small" color={colors.danger} />
                  ) : (
                    <Text style={styles.cancelRequestText}>CANCEL</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* =================================================
            ASSISTANCE CARD
            ================================================= */}

        <View style={styles.assistanceCard}>
          <View style={styles.assistanceIconContainer}>
            <Ionicons name="construct" size={34} color={colors.white} />
          </View>

          <Text style={styles.assistanceTitle}>Vehicle breakdown?</Text>

          <Text style={styles.assistanceDescription}>
            Get roadside assistance from a nearby mechanic.
          </Text>

          <TouchableOpacity
            style={styles.requestButton}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/breakdown/category",
                params: {
                  category: "",
                  vehicleId: primaryVehicle?.id || "",
                  vehicleNumber: primaryVehicle?.registrationNumber || "",
                },
              })
            }
          >
            <Text style={styles.requestButtonText}>REQUEST ASSISTANCE</Text>

            <Ionicons name="arrow-forward" size={19} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* =================================================
            QUICK ASSISTANCE
            ================================================= */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Quick Assistance</Text>

            <Text style={styles.sectionSubtitle}>Select your problem</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {breakdownTypes.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.breakdownItem}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/breakdown/category",
                  params: {
                    category: item.category,
                    vehicleId: primaryVehicle?.id || "",
                    vehicleNumber: primaryVehicle?.registrationNumber || "",
                  },
                })
              }
            >
              <View style={styles.breakdownIcon}>
                <Ionicons name={item.icon} size={23} color={colors.accent} />
              </View>

              <Text style={styles.breakdownText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* =================================================
            RECENT SERVICE
            ================================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Service</Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push("/(tabs)/requests")}
          >
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {loadingRequests ? (
          <View style={styles.emptyHistoryCard}>
            <ActivityIndicator size="small" color={colors.accent} />

            <Text style={styles.emptyHistoryText}>
              Loading recent service...
            </Text>
          </View>
        ) : requestError ? (
          <TouchableOpacity
            style={styles.emptyHistoryCard}
            activeOpacity={0.8}
            onPress={loadRecentRequest}
          >
            <View style={styles.emptyHistoryIcon}>
              <Ionicons
                name="refresh-outline"
                size={23}
                color={colors.accent}
              />
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle}>Unable to load service</Text>

              <Text style={styles.historyId} numberOfLines={2}>
                Tap to try again
              </Text>
            </View>
          </TouchableOpacity>
        ) : recentRequest ? (
          <TouchableOpacity
            style={styles.historyCard}
            activeOpacity={0.85}
            onPress={() => openRequest(recentRequest)}
          >
            <View style={styles.historyIcon}>
              <Ionicons
                name={getCategoryIcon(recentRequest.category)}
                size={23}
                color={colors.info}
              />
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle} numberOfLines={1}>
                {getCategoryTitle(recentRequest.category)}
              </Text>

              <Text style={styles.historyId} numberOfLines={1}>
                #{String(recentRequest.id || "").slice(0, 8)}
                {recentRequest.createdAt
                  ? ` • ${formatRequestDate(recentRequest.createdAt)}`
                  : ""}
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {getRequestStatusLabel(recentRequest.status)}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
              style={styles.historyChevron}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.emptyHistoryCard}
            activeOpacity={0.85}
            onPress={() => router.push("/(tabs)/requests")}
          >
            <View style={styles.emptyHistoryIcon}>
              <Ionicons
                name="document-text-outline"
                size={23}
                color={colors.accent}
              />
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle}>No service requests yet</Text>

              <Text style={styles.historyId}>
                Your recent assistance requests will appear here.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 90,
  },

  // =======================================================
  // HEADER
  // =======================================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  greeting: {
    fontFamily: "InterRegular",
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 3,
  },

  name: {
    fontFamily: "InterBold",
    fontSize: 23,
    color: colors.text,
    letterSpacing: -0.3,
    maxWidth: 280,
  },

  // =======================================================
  // NOTIFICATION
  // =======================================================

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 15,

    backgroundColor: colors.white,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: colors.border,
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 11,

    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: colors.danger,

    borderWidth: 1.5,
    borderColor: colors.white,
  },

  // =======================================================
  // VEHICLE
  // =======================================================

  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.white,

    borderRadius: 18,

    padding: 16,

    borderWidth: 1,
    borderColor: colors.border,

    marginBottom: 18,
  },

  vehicleIcon: {
    width: 52,
    height: 52,

    borderRadius: 16,

    backgroundColor: "#FFF7ED",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  vehicleInfo: {
    flex: 1,
    minWidth: 0,
  },

  vehicleLabel: {
    fontFamily: "InterBold",
    fontSize: 10,

    color: colors.textMuted,

    letterSpacing: 0.8,

    marginBottom: 3,
  },

  vehicleNumber: {
    fontFamily: "InterBold",
    fontSize: 17,

    color: colors.text,

    letterSpacing: -0.2,
  },

  vehicleName: {
    fontFamily: "InterRegular",
    fontSize: 13,

    color: colors.textSecondary,

    marginTop: 2,
  },

  vehicleLoading: {
    minHeight: 38,

    justifyContent: "center",
    alignItems: "flex-start",
  },

  // =======================================================
  // ACTIVE SERVICE
  // =======================================================

  activeServiceCard: {
    backgroundColor: colors.white,

    borderRadius: 20,

    padding: 17,

    marginBottom: 20,

    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.shadow,

    shadowOpacity: 0.06,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  activeHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 16,
  },

  activeHeaderLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,

    minWidth: 0,
  },

  activeIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: colors.accent,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 11,
  },

  activeTitle: {
    fontFamily: "InterBold",

    fontSize: 16,

    color: colors.text,
  },

  activeSubtitle: {
    fontFamily: "InterRegular",

    fontSize: 11,

    color: colors.textMuted,

    marginTop: 2,
  },

  activeStatusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 9,

    marginLeft: 8,

    maxWidth: 125,
  },

  activeStatusText: {
    fontFamily: "InterBold",

    fontSize: 9,

    textAlign: "center",
  },

  // =======================================================
  // ACTIVE DETAILS
  // =======================================================

  activeDetails: {
    backgroundColor: colors.borderLight,

    borderRadius: 14,

    paddingHorizontal: 13,

    paddingVertical: 5,
  },

  activeDetailRow: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 10,
  },

  activeDetailContent: {
    marginLeft: 11,

    flex: 1,
  },

  activeDetailLabel: {
    fontFamily: "InterBold",

    fontSize: 9,

    color: colors.textMuted,

    letterSpacing: 0.6,

    marginBottom: 2,
  },

  activeDetailValue: {
    fontFamily: "InterSemiBold",

    fontSize: 13,

    color: colors.text,
  },

  activeDetailDivider: {
    height: 1,

    backgroundColor: colors.border,

    marginLeft: 30,
  },

  // =======================================================
  // DESCRIPTION
  // =======================================================

  descriptionBox: {
    marginTop: 12,

    backgroundColor: colors.accentLight,

    borderRadius: 12,

    padding: 11,
  },

  descriptionLabel: {
    fontFamily: "InterBold",

    fontSize: 9,

    color: colors.textMuted,

    letterSpacing: 0.6,

    marginBottom: 4,
  },

  descriptionText: {
    fontFamily: "InterRegular",

    fontSize: 12,

    color: colors.textSecondary,

    lineHeight: 18,
  },

  // =======================================================
  // ACTIVE ACTIONS
  // =======================================================

  activeActions: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 14,

    gap: 9,
  },

  viewRequestButton: {
    flex: 1,

    minHeight: 45,

    borderRadius: 13,

    backgroundColor: colors.accent,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 7,
  },

  viewRequestText: {
    fontFamily: "InterBold",

    fontSize: 11,

    color: colors.white,

    letterSpacing: 0.3,
  },

  cancelRequestButton: {
    minHeight: 45,

    minWidth: 78,

    paddingHorizontal: 14,

    borderRadius: 13,

    borderWidth: 1,

    borderColor: colors.danger,

    backgroundColor: colors.dangerLight,

    justifyContent: "center",

    alignItems: "center",
  },

  cancelRequestText: {
    fontFamily: "InterBold",

    fontSize: 10,

    color: colors.danger,

    letterSpacing: 0.3,
  },

  // =======================================================
  // ASSISTANCE CARD
  // =======================================================

  assistanceCard: {
    backgroundColor: colors.primary,

    borderRadius: 24,

    padding: 22,

    marginBottom: 26,

    overflow: "hidden",
  },

  assistanceIconContainer: {
    width: 58,
    height: 58,

    borderRadius: 18,

    backgroundColor: colors.accent,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 17,
  },

  assistanceTitle: {
    fontFamily: "InterBold",

    color: colors.white,

    fontSize: 24,

    letterSpacing: -0.4,
  },

  assistanceDescription: {
    fontFamily: "InterRegular",

    color: "#CBD5E1",

    fontSize: 14,

    lineHeight: 21,

    marginTop: 7,

    maxWidth: 290,
  },

  // =======================================================
  // REQUEST BUTTON
  // =======================================================

  requestButton: {
    height: 52,

    borderRadius: 15,

    backgroundColor: colors.accent,

    marginTop: 20,

    paddingHorizontal: 18,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 10,
  },

  requestButtonText: {
    fontFamily: "InterBold",

    color: colors.white,

    fontSize: 13,

    letterSpacing: 0.4,
  },

  // =======================================================
  // SECTION HEADER
  // =======================================================

  sectionHeader: {
    flexDirection: "row",

    alignItems: "flex-end",

    justifyContent: "space-between",

    marginBottom: 13,
  },

  sectionTitle: {
    fontFamily: "InterBold",

    fontSize: 18,

    color: colors.text,

    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    fontFamily: "InterRegular",

    fontSize: 12,

    color: colors.textMuted,

    marginTop: 3,
  },

  viewAll: {
    fontFamily: "InterBold",

    fontSize: 13,

    color: colors.accent,
  },

  // =======================================================
  // QUICK ASSISTANCE
  // =======================================================

  grid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

    marginBottom: 27,
  },

  breakdownItem: {
    width: "31.5%",

    backgroundColor: colors.white,

    borderRadius: 17,

    paddingVertical: 15,

    alignItems: "center",

    borderWidth: 1,

    borderColor: colors.border,

    marginBottom: 10,
  },

  breakdownIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    backgroundColor: "#FFF7ED",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 8,
  },

  breakdownText: {
    fontFamily: "InterBold",

    fontSize: 12,

    color: colors.text,
  },

  // =======================================================
  // HISTORY
  // =======================================================

  historyCard: {
    backgroundColor: colors.white,

    borderRadius: 18,

    padding: 15,

    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderColor: colors.border,
  },

  historyIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: colors.infoLight,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  historyInfo: {
    flex: 1,

    minWidth: 0,
  },

  historyTitle: {
    fontFamily: "InterBold",

    fontSize: 14,

    color: colors.text,
  },

  historyId: {
    fontFamily: "InterRegular",

    fontSize: 11,

    color: colors.textMuted,

    marginTop: 4,
  },

  // =======================================================
  // STATUS BADGE
  // =======================================================

  statusBadge: {
    backgroundColor: colors.successLight,

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 9,

    maxWidth: 105,
  },

  statusText: {
    fontFamily: "InterBold",

    color: colors.success,

    fontSize: 9,

    textAlign: "center",
  },

  historyChevron: {
    marginLeft: 8,
  },

  // =======================================================
  // EMPTY HISTORY
  // =======================================================

  emptyHistoryCard: {
    backgroundColor: colors.white,

    borderRadius: 18,

    padding: 15,

    minHeight: 76,

    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderColor: colors.border,
  },

  emptyHistoryIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: "#FFF7ED",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  emptyHistoryText: {
    fontFamily: "InterRegular",

    fontSize: 12,

    color: colors.textMuted,

    marginLeft: 12,
  },

  // =======================================================
  // BOTTOM SPACE
  // =======================================================

  bottomSpace: {
    height: 20,
  },
});
