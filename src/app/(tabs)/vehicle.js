import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { apiRequest } from '../../services/api';


// =====================================================
// APPROVED TRUCK ASSIST COLORS
// =====================================================

const colors = {
  primary: '#0F172A',
  primaryLight: '#1E293B',

  accent: '#2563EB',
  accentDark: '#1D4ED8',
  accentLight: '#EFF6FF',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  white: '#FFFFFF',

  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  success: '#16A34A',
  successDark: '#15803D',
  successLight: '#DCFCE7',

  warning: '#F59E0B',
  warningLight: '#FEF3C7',

  danger: '#DC2626',
  dangerLight: '#FEE2E2',

  info: '#0284C7',
  infoLight: '#E0F2FE',

  serviceBattery: '#F59E0B',
  serviceEngine: '#7C3AED',
  serviceTyre: '#0F172A',
  serviceFuel: '#EA580C',
  serviceElectrical: '#2563EB',
  serviceOther: '#64748B',

  mapBackground: '#E8EEF3',
  mapRoad: '#FFFFFF',

  shadow: '#0F172A',
};


// =====================================================
// VEHICLE TYPES
// =====================================================

const VEHICLE_TYPES = [
  {
    value: 'TRUCK',
    label: 'Truck',
    icon: 'car-outline',
  },
  {
    value: 'LORRY',
    label: 'Lorry',
    icon: 'bus-outline',
  },
  {
    value: 'TANKER',
    label: 'Tanker',
    icon: 'water-outline',
  },
  {
    value: 'TRAILER',
    label: 'Trailer',
    icon: 'trail-sign-outline',
  },
  {
    value: 'OTHER',
    label: 'Other',
    icon: 'ellipsis-horizontal-circle-outline',
  },
];


// =====================================================
// EMPTY FORM
// =====================================================

const EMPTY_FORM = {
  registrationNumber: '',
  manufacturer: '',
  model: '',
  vehicleType: '',
  manufacturingYear: '',
  color: '',
  primary: false,
};


// =====================================================
// HELPERS
// =====================================================

function normalizeVehicleType(value) {
  if (!value) {
    return '';
  }

  return String(value).toUpperCase();
}


function getVehicleName(vehicle) {
  const manufacturer =
    vehicle?.manufacturer || '';

  const model =
    vehicle?.model || '';

  const name =
    `${manufacturer} ${model}`.trim();

  return name || 'Vehicle';
}


function getVehicleTypeLabel(value) {
  const normalized =
    normalizeVehicleType(value);

  const found =
    VEHICLE_TYPES.find(
      item => item.value === normalized
    );

  return found
    ? found.label
    : value || 'Vehicle';
}


function getVehicleTypeIcon(value) {
  const normalized =
    normalizeVehicleType(value);

  const found =
    VEHICLE_TYPES.find(
      item => item.value === normalized
    );

  return found?.icon || 'car-outline';
}


// =====================================================
// MAIN SCREEN
// =====================================================

export default function VehicleScreen() {

  const [vehicles, setVehicles] =
    useState([]);

  const [driverId, setDriverId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [deleteVehicle, setDeleteVehicle] =
    useState(null);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editingVehicle, setEditingVehicle] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [errorMessage, setErrorMessage] =
    useState('');

  // ===================================================
  // LOAD DRIVER PROFILE
  // ===================================================

  const loadDriverProfile =
    useCallback(async () => {

      try {

        const profile =
          await apiRequest(
            '/api/v1/drivers/me',
            {
              method: 'GET',
            }
          );

        const id =
          profile?.id ||
          profile?.driverId;

        if (id) {
          setDriverId(id);
        }

        return id;

      } catch (error) {

        console.error(
          'Unable to load driver profile:',
          error
        );

        return null;
      }

    }, []);


  // ===================================================
  // LOAD VEHICLES
  // ===================================================

  const loadVehicles =
    useCallback(async () => {

      try {

        const data =
          await apiRequest(
            '/api/v1/vehicles/my',
            {
              method: 'GET',
            }
          );

        const list =
          Array.isArray(data)
            ? data
            : [];

        setVehicles(list);

        if (!driverId && list.length > 0) {

          const existingDriverId =
            list[0]?.driverId;

          if (existingDriverId) {
            setDriverId(
              existingDriverId
            );
          }
        }

      } catch (error) {

        console.error(
          'Unable to load vehicles:',
          error
        );

        setErrorMessage(
          error?.message ||
          'Unable to load vehicles.'
        );

      } finally {

        setLoading(false);
        setRefreshing(false);
      }

    }, [driverId]);


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    let mounted = true;

    const initialise =
      async () => {

        const id =
          await loadDriverProfile();

        if (
          mounted &&
          id
        ) {
          setDriverId(id);
        }

        if (mounted) {
          await loadVehicles();
        }
      };

    initialise();

    return () => {
      mounted = false;
    };

  }, [
    loadDriverProfile,
    loadVehicles,
  ]);


  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh =
    async () => {

      setRefreshing(true);

      await loadVehicles();

      setRefreshing(false);
    };


  // ===================================================
  // OPEN ADD
  // ===================================================

  const openAddVehicle =
    () => {

      setEditingVehicle(null);

      setForm({
        ...EMPTY_FORM,

        primary:
          vehicles.length === 0,
      });

      setErrorMessage('');

      setModalVisible(true);
    };


  // ===================================================
  // OPEN EDIT
  // ===================================================

  const openEditVehicle =
    vehicle => {

      setEditingVehicle(vehicle);

      setForm({
        registrationNumber:
          vehicle?.registrationNumber || '',

        manufacturer:
          vehicle?.manufacturer || '',

        model:
          vehicle?.model || '',

        vehicleType:
          normalizeVehicleType(
            vehicle?.vehicleType
          ),

        manufacturingYear:
          vehicle?.manufacturingYear
            ? String(
                vehicle.manufacturingYear
              )
            : '',

        color:
          vehicle?.color || '',

        primary:
          Boolean(
            vehicle?.primary
          ),
      });

      setErrorMessage('');

      setModalVisible(true);
    };


  // ===================================================
  // CLOSE FORM
  // ===================================================

  const closeModal =
    () => {

      if (saving) {
        return;
      }

      setModalVisible(false);

      setEditingVehicle(null);

      setForm(
        EMPTY_FORM
      );

      setErrorMessage('');
    };


  // ===================================================
  // FORM UPDATE
  // ===================================================

  const updateField =
    (field, value) => {

      setForm(previous => ({
        ...previous,
        [field]: value,
      }));

      setErrorMessage('');
    };


  // ===================================================
  // PRIMARY
  // ===================================================

  const handlePrimaryChange =
    value => {

      setForm(previous => ({
        ...previous,
        primary: value,
      }));
    };


  // ===================================================
  // VALIDATION
  // ===================================================

  const validateForm =
    () => {

      const registration =
        form.registrationNumber
          .trim()
          .toUpperCase();

      if (!registration) {
        return (
          'Please enter the vehicle registration number.'
        );
      }

      if (
        form.manufacturingYear &&
        !/^\d{4}$/.test(
          String(
            form.manufacturingYear
          ).trim()
        )
      ) {
        return (
          'Please enter a valid manufacturing year.'
        );
      }

      if (
        form.manufacturingYear
      ) {

        const year =
          Number(
            form.manufacturingYear
          );

        const currentYear =
          new Date().getFullYear();

        if (
          year < 1900 ||
          year > currentYear
        ) {
          return (
            `Manufacturing year must be between 1900 and ${currentYear}.`
          );
        }
      }

      return null;
    };


  // ===================================================
  // SAVE VEHICLE
  // ===================================================

  const handleSave =
    async () => {

      if (saving) {
        return;
      }

      setErrorMessage('');

      const validationError =
        validateForm();

      if (validationError) {

        setErrorMessage(
          validationError
        );

        return;
      }

      let currentDriverId =
        driverId;

      if (!currentDriverId) {

        currentDriverId =
          await loadDriverProfile();
      }

      if (!currentDriverId) {

        setErrorMessage(
          'Driver profile not found.'
        );

        return;
      }

      let manufacturingYear =
        null;

      if (
        form.manufacturingYear &&
        String(
          form.manufacturingYear
        ).trim()
      ) {

        manufacturingYear =
          Number(
            form.manufacturingYear
          );
      }

      const payload = {

        driverId:
          editingVehicle?.driverId ||
          currentDriverId,

        registrationNumber:
          form.registrationNumber
            .trim()
            .toUpperCase(),

        manufacturer:
          form.manufacturer.trim() ||
          null,

        model:
          form.model.trim() ||
          null,

        vehicleType:
          form.vehicleType ||
          null,

        manufacturingYear,

        color:
          form.color.trim() ||
          null,

        primary:
          Boolean(
            form.primary
          ),
      };

      try {

        setSaving(true);

        if (!editingVehicle) {

          await apiRequest(
            '/api/v1/vehicles',
            {
              method: 'POST',
              body: payload,
            }
          );

        } else {

          await apiRequest(
            `/api/v1/vehicles/${editingVehicle.id}`,
            {
              method: 'PUT',
              body: payload,
            }
          );
        }

        setModalVisible(false);

        setEditingVehicle(null);

        setForm(
          EMPTY_FORM
        );

        await loadVehicles();

      } catch (error) {

        console.error(
          'Unable to save vehicle:',
          error
        );

        let message =
          error?.message ||
          'Unable to save vehicle.';

        if (
          message
            .toLowerCase()
            .includes(
              'registration already exists'
            )
        ) {

          message =
            'This vehicle registration number already exists.';
        }

        setErrorMessage(
          message
        );

      } finally {

        setSaving(false);
      }
    };


  // ===================================================
  // OPEN DELETE CONFIRMATION
  // ===================================================

  const handleDelete =
    vehicle => {

      if (
        !vehicle?.id ||
        deletingId
      ) {
        return;
      }

      setDeleteVehicle(
        vehicle
      );
    };


  // ===================================================
  // CANCEL DELETE
  // ===================================================

  const cancelDelete =
    () => {

      if (deletingId) {
        return;
      }

      setDeleteVehicle(null);
    };


  // ===================================================
  // CONFIRM PERMANENT DELETE
  // ===================================================

  const confirmDelete =
    async () => {

      if (
        !deleteVehicle?.id ||
        deletingId
      ) {
        return;
      }

      const vehicleId =
        deleteVehicle.id;

      try {

        console.log(
          '[Vehicle] Deleting vehicle:',
          vehicleId
        );

        setDeletingId(
          vehicleId
        );

        /*
         * IMPORTANT:
         *
         * This calls:
         *
         * DELETE
         * /api/v1/vehicles/{vehicleId}
         *
         * Your backend now performs an actual
         * repository.delete(vehicle).
         */

        await apiRequest(
          `/api/v1/vehicles/${vehicleId}`,
          {
            method: 'DELETE',
          }
        );

        console.log(
          '[Vehicle] Vehicle deleted successfully:',
          vehicleId
        );

        // Remove immediately from UI.
        setVehicles(
          previous =>
            previous.filter(
              vehicle =>
                vehicle.id !==
                vehicleId
            )
        );

        // Close confirmation.
        setDeleteVehicle(null);

        /*
         * Reload from backend.
         *
         * This confirms that the record is actually
         * gone from the database and not merely removed
         * from the screen.
         */

        await loadVehicles();

      } catch (error) {

        console.error(
          '[Vehicle] Unable to delete vehicle:',
          error
        );

        setErrorMessage(
          error?.message ||
          'Unable to delete vehicle.'
        );

      } finally {

        setDeletingId(null);
      }
    };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (
      <View
        style={
          styles.loadingContainer
        }
      >

        <ActivityIndicator
          size="large"
          color={
            colors.accent
          }
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading your vehicles...
        </Text>

      </View>
    );
  }


  // ===================================================
  // SCREEN
  // ===================================================

  return (
    <View
      style={
        styles.container
      }
    >

      {/* =============================================
          HEADER
      ============================================= */}

      <View
        style={
          styles.header
        }
      >

        <View
          style={
            styles.headerTextContainer
          }
        >

          <Text
            style={
              styles.pageTitle
            }
          >
            My Vehicle
          </Text>

          <Text
            style={
              styles.pageSubtitle
            }
          >
            Manage your registered vehicles
          </Text>

        </View>

        <Pressable
          onPress={
            openAddVehicle
          }
          style={({ pressed }) => [
            styles.addButton,
            pressed &&
              styles.pressed,
          ]}
        >

          <Ionicons
            name="add"
            size={20}
            color={
              colors.white
            }
          />

          <Text
            style={
              styles.addButtonText
            }
          >
            Add Vehicle
          </Text>

        </Pressable>

      </View>


      {/* =============================================
          ERROR
      ============================================= */}

      {errorMessage ? (

        <View
          style={
            styles.errorBanner
          }
        >

          <Ionicons
            name="alert-circle-outline"
            size={19}
            color={
              colors.danger
            }
          />

          <Text
            style={
              styles.errorBannerText
            }
          >
            {errorMessage}
          </Text>

          <Pressable
            onPress={() =>
              setErrorMessage('')
            }
          >

            <Ionicons
              name="close"
              size={19}
              color={
                colors.danger
              }
            />

          </Pressable>

        </View>

      ) : null}


      {/* =============================================
          CONTENT
      ============================================= */}

      <ScrollView
        style={
          styles.scrollView
        }
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
            tintColor={
              colors.accent
            }
          />
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* ===========================================
            SUMMARY
        =========================================== */}

        <View
          style={
            styles.summaryCard
          }
        >

          <View
            style={
              styles.summaryIcon
            }
          >

            <Ionicons
              name="car-outline"
              size={24}
              color={
                colors.accent
              }
            />

          </View>

          <View
            style={
              styles.summaryContent
            }
          >

            <Text
              style={
                styles.summaryTitle
              }
            >
              {vehicles.length}{' '}
              {vehicles.length === 1
                ? 'Vehicle'
                : 'Vehicles'}
            </Text>

            <Text
              style={
                styles.summarySubtitle
              }
            >
              {vehicles.length === 0
                ? 'Add your vehicle to get started'
                : 'Your registered vehicles'}
            </Text>

          </View>

        </View>


        {/* ===========================================
            EMPTY
        =========================================== */}

        {vehicles.length === 0 ? (

          <View
            style={
              styles.emptyCard
            }
          >

            <View
              style={
                styles.emptyIcon
              }
            >

              <Ionicons
                name="car-outline"
                size={38}
                color={
                  colors.accent
                }
              />

            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              No vehicles yet
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              Add your truck or commercial vehicle
              to manage its details and use it for
              breakdown service requests.
            </Text>

            <Pressable
              onPress={
                openAddVehicle
              }
              style={({ pressed }) => [
                styles.emptyAddButton,
                pressed &&
                  styles.pressed,
              ]}
            >

              <Ionicons
                name="add"
                size={19}
                color={
                  colors.white
                }
              />

              <Text
                style={
                  styles.emptyAddButtonText
                }
              >
                Add Your Vehicle
              </Text>

            </Pressable>

          </View>

        ) : (

          <View>

            <Text
              style={
                styles.sectionTitle
              }
            >
              Your Vehicles
            </Text>

            {vehicles.map(
              (vehicle, index) => (

                <VehicleCard
                  key={
                    vehicle.id ||
                    `${vehicle.registrationNumber}-${index}`
                  }
                  vehicle={
                    vehicle
                  }
                  onEdit={
                    openEditVehicle
                  }
                  onDelete={
                    handleDelete
                  }
                  deleting={
                    deletingId ===
                    vehicle.id
                  }
                />

              )
            )}

          </View>

        )}

      </ScrollView>


      {/* =============================================
          ADD / EDIT MODAL
      ============================================= */}

      <VehicleFormModal
        visible={
          modalVisible
        }
        editing={
          Boolean(
            editingVehicle
          )
        }
        form={
          form
        }
        saving={
          saving
        }
        error={
          errorMessage
        }
        onChange={
          updateField
        }
        onPrimaryChange={
          handlePrimaryChange
        }
        onSave={
          handleSave
        }
        onClose={
          closeModal
        }
      />


      {/* =============================================
          DELETE CONFIRMATION MODAL
      ============================================= */}

      <DeleteConfirmModal
        visible={
          Boolean(
            deleteVehicle
          )
        }
        vehicle={
          deleteVehicle
        }
        deleting={
          Boolean(
            deletingId
          )
        }
        onCancel={
          cancelDelete
        }
        onConfirm={
          confirmDelete
        }
      />

    </View>
  );
}


// =====================================================
// VEHICLE CARD
// =====================================================

function VehicleCard({
  vehicle,
  onEdit,
  onDelete,
  deleting,
}) {

  const vehicleName =
    getVehicleName(
      vehicle
    );

  const typeLabel =
    getVehicleTypeLabel(
      vehicle?.vehicleType
    );

  const typeIcon =
    getVehicleTypeIcon(
      vehicle?.vehicleType
    );

  return (
    <View
      style={
        styles.vehicleCard
      }
    >

      {/* CARD HEADER */}

      <View
        style={
          styles.vehicleCardHeader
        }
      >

        <View
          style={
            styles.vehicleIcon
          }
        >

          <Ionicons
            name={
              typeIcon
            }
            size={27}
            color={
              colors.accent
            }
          />

        </View>

        <View
          style={
            styles.vehicleHeaderText
          }
        >

          <View
            style={
              styles.registrationRow
            }
          >

            <Text
              style={
                styles.registrationNumber
              }
            >
              {vehicle?.registrationNumber ||
                '—'}
            </Text>

            {vehicle?.primary ? (

              <View
                style={
                  styles.primaryBadge
                }
              >

                <Ionicons
                  name="star"
                  size={11}
                  color={
                    colors.warning
                  }
                />

                <Text
                  style={
                    styles.primaryBadgeText
                  }
                >
                  Primary
                </Text>

              </View>

            ) : null}

          </View>

          <Text
            style={
              styles.vehicleName
            }
          >
            {vehicleName}
          </Text>

        </View>

      </View>


      {/* DETAILS */}

      <View
        style={
          styles.vehicleDetails
        }
      >

        <DetailItem
          icon="car-outline"
          label="Type"
          value={
            typeLabel
          }
        />

        <DetailItem
          icon="calendar-outline"
          label="Year"
          value={
            vehicle?.manufacturingYear
              ? String(
                  vehicle.manufacturingYear
                )
              : '—'
          }
        />

        <DetailItem
          icon="color-palette-outline"
          label="Color"
          value={
            vehicle?.color ||
            '—'
          }
        />

      </View>


      {/* MANUFACTURER / MODEL */}

      {(vehicle?.manufacturer ||
        vehicle?.model) ? (

        <View
          style={
            styles.infoRow
          }
        >

          <Ionicons
            name="construct-outline"
            size={17}
            color={
              colors.textMuted
            }
          />

          <Text
            style={
              styles.infoText
            }
          >
            {[
              vehicle?.manufacturer,
              vehicle?.model,
            ]
              .filter(Boolean)
              .join(' • ')}
          </Text>

        </View>

      ) : null}


      {/* =============================================
          ACTIONS
      ============================================= */}

      <View
        style={
          styles.vehicleActions
        }
      >

        <Pressable
          onPress={() =>
            onEdit(vehicle)
          }
          style={({ pressed }) => [
            styles.editButton,
            pressed &&
              styles.pressed,
          ]}
        >

          <Ionicons
            name="create-outline"
            size={18}
            color={
              colors.accent
            }
          />

          <Text
            style={
              styles.editButtonText
            }
          >
            Edit
          </Text>

        </Pressable>


        <Pressable
          onPress={() =>
            onDelete(vehicle)
          }
          disabled={
            deleting
          }
          style={({ pressed }) => [
            styles.deleteButton,
            pressed &&
              styles.pressed,
            deleting &&
              styles.disabledButton,
          ]}
        >

          {deleting ? (

            <ActivityIndicator
              size="small"
              color={
                colors.danger
              }
            />

          ) : (

            <Ionicons
              name="trash-outline"
              size={18}
              color={
                colors.danger
              }
            />

          )}

          <Text
            style={
              styles.deleteButtonText
            }
          >
            {deleting
              ? 'Deleting...'
              : 'Delete'}
          </Text>

        </Pressable>

      </View>

    </View>
  );
}


// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({
  icon,
  label,
  value,
}) {

  return (
    <View
      style={
        styles.detailItem
      }
    >

      <Ionicons
        name={icon}
        size={17}
        color={
          colors.textMuted
        }
      />

      <View>

        <Text
          style={
            styles.detailLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.detailValue
          }
        >
          {value}
        </Text>

      </View>

    </View>
  );
}


// =====================================================
// VEHICLE FORM MODAL
// =====================================================

function VehicleFormModal({
  visible,
  editing,
  form,
  saving,
  error,
  onChange,
  onPrimaryChange,
  onSave,
  onClose,
}) {

  return (
    <Modal
      visible={
        visible
      }
      animationType="slide"
      transparent
      onRequestClose={
        onClose
      }
    >

      <KeyboardAvoidingView
        style={
          styles.modalOverlay
        }
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <View
          style={
            styles.modalContainer
          }
        >

          {/* HEADER */}

          <View
            style={
              styles.modalHeader
            }
          >

            <View>

              <Text
                style={
                  styles.modalTitle
                }
              >
                {editing
                  ? 'Edit Vehicle'
                  : 'Add Vehicle'}
              </Text>

              <Text
                style={
                  styles.modalSubtitle
                }
              >
                {editing
                  ? 'Update your vehicle information'
                  : 'Enter your vehicle details'}
              </Text>

            </View>

            <Pressable
              onPress={
                onClose
              }
              disabled={
                saving
              }
              style={
                styles.closeButton
              }
            >

              <Ionicons
                name="close"
                size={22}
                color={
                  colors.textSecondary
                }
              />

            </Pressable>

          </View>


          {/* FORM */}

          <ScrollView
            style={
              styles.modalScroll
            }
            contentContainerStyle={
              styles.modalContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
          >

            <InputField
              label="Registration Number"
              required
              placeholder="e.g. TN 01 AB 1234"
              value={
                form.registrationNumber
              }
              onChangeText={
                value =>
                  onChange(
                    'registrationNumber',
                    value
                  )
              }
              autoCapitalize="characters"
            />


            <InputField
              label="Manufacturer"
              placeholder="e.g. Tata"
              value={
                form.manufacturer
              }
              onChangeText={
                value =>
                  onChange(
                    'manufacturer',
                    value
                  )
              }
            />


            <InputField
              label="Model"
              placeholder="e.g. Prima"
              value={
                form.model
              }
              onChangeText={
                value =>
                  onChange(
                    'model',
                    value
                  )
              }
            />


            {/* VEHICLE TYPE */}

            <Text
              style={
                styles.fieldLabel
              }
            >
              Vehicle Type
            </Text>

            <View
              style={
                styles.typeGrid
              }
            >

              {VEHICLE_TYPES.map(
                type => {

                  const selected =
                    normalizeVehicleType(
                      form.vehicleType
                    ) ===
                    type.value;

                  return (
                    <Pressable
                      key={
                        type.value
                      }
                      onPress={() =>
                        onChange(
                          'vehicleType',
                          type.value
                        )
                      }
                      style={[
                        styles.typeOption,
                        selected &&
                          styles.typeOptionSelected,
                      ]}
                    >

                      <Ionicons
                        name={
                          type.icon
                        }
                        size={20}
                        color={
                          selected
                            ? colors.accent
                            : colors.textMuted
                        }
                      />

                      <Text
                        style={[
                          styles.typeOptionText,
                          selected &&
                            styles.typeOptionTextSelected,
                        ]}
                      >
                        {type.label}
                      </Text>

                    </Pressable>
                  );
                }
              )}

            </View>


            <InputField
              label="Manufacturing Year"
              placeholder="e.g. 2022"
              value={
                form.manufacturingYear
              }
              onChangeText={
                value =>
                  onChange(
                    'manufacturingYear',
                    value
                      .replace(
                        /[^0-9]/g,
                        ''
                      )
                      .slice(0, 4)
                  )
              }
              keyboardType="numeric"
              maxLength={4}
            />


            <InputField
              label="Color"
              placeholder="e.g. White"
              value={
                form.color
              }
              onChangeText={
                value =>
                  onChange(
                    'color',
                    value
                  )
              }
            />


            {/* PRIMARY */}

            <View
              style={
                styles.primarySection
              }
            >

              <View
                style={
                  styles.primaryTextContainer
                }
              >

                <View
                  style={
                    styles.primaryTitleRow
                  }
                >

                  <Ionicons
                    name="star-outline"
                    size={18}
                    color={
                      colors.warning
                    }
                  />

                  <Text
                    style={
                      styles.primaryTitle
                    }
                  >
                    Primary Vehicle
                  </Text>

                </View>

                <Text
                  style={
                    styles.primaryDescription
                  }
                >
                  Use this as your default vehicle
                  for service requests.
                </Text>

              </View>

              <Pressable
                onPress={() =>
                  onPrimaryChange(
                    !form.primary
                  )
                }
                style={[
                  styles.radioOuter,
                  form.primary &&
                    styles.radioOuterSelected,
                ]}
              >

                {form.primary ? (

                  <View
                    style={
                      styles.radioInner
                    }
                  />

                ) : null}

              </Pressable>

            </View>


            {error ? (

              <View
                style={
                  styles.formError
                }
              >

                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={
                    colors.danger
                  }
                />

                <Text
                  style={
                    styles.formErrorText
                  }
                >
                  {error}
                </Text>

              </View>

            ) : null}

          </ScrollView>


          {/* FOOTER */}

          <View
            style={
              styles.modalFooter
            }
          >

            <Pressable
              onPress={
                onClose
              }
              disabled={
                saving
              }
              style={({ pressed }) => [
                styles.cancelButton,
                pressed &&
                  styles.pressed,
              ]}
            >

              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancel
              </Text>

            </Pressable>


            <Pressable
              onPress={
                onSave
              }
              disabled={
                saving
              }
              style={({ pressed }) => [
                styles.saveButton,
                pressed &&
                  styles.pressed,
                saving &&
                  styles.disabledButton,
              ]}
            >

              {saving ? (

                <ActivityIndicator
                  size="small"
                  color={
                    colors.white
                  }
                />

              ) : (

                <Ionicons
                  name={
                    editing
                      ? 'checkmark-outline'
                      : 'add'
                  }
                  size={19}
                  color={
                    colors.white
                  }
                />

              )}

              <Text
                style={
                  styles.saveButtonText
                }
              >
                {saving
                  ? 'Saving...'
                  : editing
                    ? 'Save Changes'
                    : 'Add Vehicle'}
              </Text>

            </Pressable>

          </View>

        </View>

      </KeyboardAvoidingView>

    </Modal>
  );
}


// =====================================================
// DELETE CONFIRMATION MODAL
// =====================================================

function DeleteConfirmModal({
  visible,
  vehicle,
  deleting,
  onCancel,
  onConfirm,
}) {

  if (!vehicle) {
    return null;
  }

  return (
    <Modal
      visible={
        visible
      }
      transparent
      animationType="fade"
      onRequestClose={
        onCancel
      }
    >

      <View
        style={
          styles.deleteOverlay
        }
      >

        <View
          style={
            styles.deleteModal
          }
        >

          {/* ICON */}

          <View
            style={
              styles.deleteIconContainer
            }
          >

            <Ionicons
              name="trash-outline"
              size={28}
              color={
                colors.danger
              }
            />

          </View>


          {/* TITLE */}

          <Text
            style={
              styles.deleteTitle
            }
          >
            Delete Vehicle?
          </Text>


          {/* DESCRIPTION */}

          <Text
            style={
              styles.deleteDescription
            }
          >
            Are you sure you want to permanently
            delete this vehicle?
          </Text>


          {/* VEHICLE */}

          <View
            style={
              styles.deleteVehicleCard
            }
          >

            <Ionicons
              name="car-outline"
              size={22}
              color={
                colors.accent
              }
            />

            <View
              style={
                styles.deleteVehicleInfo
              }
            >

              <Text
                style={
                  styles.deleteVehicleRegistration
                }
              >
                {vehicle.registrationNumber}
              </Text>

              <Text
                style={
                  styles.deleteVehicleName
                }
              >
                {getVehicleName(vehicle)}
              </Text>

            </View>

          </View>


          {/* WARNING */}

          <View
            style={
              styles.deleteWarning
            }
          >

            <Ionicons
              name="information-circle-outline"
              size={17}
              color={
                colors.danger
              }
            />

            <Text
              style={
                styles.deleteWarningText
              }
            >
              This action cannot be undone.
            </Text>

          </View>


          {/* ACTIONS */}

          <View
            style={
              styles.deleteActions
            }
          >

            <Pressable
              onPress={
                onCancel
              }
              disabled={
                deleting
              }
              style={({ pressed }) => [
                styles.deleteCancelButton,
                pressed &&
                  styles.pressed,
              ]}
            >

              <Text
                style={
                  styles.deleteCancelText
                }
              >
                Cancel
              </Text>

            </Pressable>


            <Pressable
              onPress={
                onConfirm
              }
              disabled={
                deleting
              }
              style={({ pressed }) => [
                styles.confirmDeleteButton,
                pressed &&
                  styles.pressed,
                deleting &&
                  styles.disabledButton,
              ]}
            >

              {deleting ? (

                <ActivityIndicator
                  size="small"
                  color={
                    colors.white
                  }
                />

              ) : (

                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={
                    colors.white
                  }
                />

              )}

              <Text
                style={
                  styles.confirmDeleteText
                }
              >
                {deleting
                  ? 'Deleting...'
                  : 'Delete'}
              </Text>

            </Pressable>

          </View>

        </View>

      </View>

    </Modal>
  );
}


// =====================================================
// INPUT FIELD
// =====================================================

function InputField({
  label,
  required,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  maxLength,
  autoCapitalize,
}) {

  return (
    <View
      style={
        styles.inputContainer
      }
    >

      <Text
        style={
          styles.fieldLabel
        }
      >
        {label}

        {required ? (

          <Text
            style={
              styles.requiredMark
            }
          >
            {' '}*
          </Text>

        ) : null}

      </Text>

      <TextInput
        value={
          value
        }
        onChangeText={
          onChangeText
        }
        placeholder={
          placeholder
        }
        placeholderTextColor={
          colors.textLight
        }
        keyboardType={
          keyboardType ||
          'default'
        }
        maxLength={
          maxLength
        }
        autoCapitalize={
          autoCapitalize ||
          'words'
        }
        style={
          styles.input
        }
      />

    </View>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  // ===================================================
  // SCREEN
  // ===================================================

  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent:
      'center',
    alignItems:
      'center',
    backgroundColor:
      colors.background,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '400',
    color:
      colors.textMuted,
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor:
      colors.surface,
    borderBottomWidth: 1,
    borderBottomColor:
      colors.borderLight,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  pageTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color:
      colors.primary,
    letterSpacing: -0.2,
  },

  pageSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color:
      colors.textMuted,
  },

  addButton: {
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'center',
    minHeight: 44,
    paddingHorizontal: 15,
    borderRadius: 11,
    backgroundColor:
      colors.accent,
  },

  addButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color:
      colors.white,
  },

  pressed: {
    opacity: 0.75,
  },

  disabledButton: {
    opacity: 0.55,
  },

  // ===================================================
  // ERROR
  // ===================================================

  errorBanner: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor:
      colors.dangerLight,
    borderWidth: 1,
    borderColor:
      '#FECACA',
  },

  errorBannerText: {
    flex: 1,
    marginHorizontal: 9,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color:
      colors.danger,
  },

  // ===================================================
  // CONTENT
  // ===================================================

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // ===================================================
  // SUMMARY
  // ===================================================

  summaryCard: {
    flexDirection:
      'row',
    alignItems:
      'center',
    padding: 16,
    backgroundColor:
      colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor:
      colors.border,
    marginBottom: 22,
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    alignItems:
      'center',
    justifyContent:
      'center',
    backgroundColor:
      colors.accentLight,
  },

  summaryContent: {
    flex: 1,
    marginLeft: 13,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color:
      colors.text,
  },

  summarySubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '400',
    color:
      colors.textMuted,
  },

  // ===================================================
  // SECTION
  // ===================================================

  sectionTitle: {
    marginBottom: 11,
    fontSize: 15,
    fontWeight: '700',
    color:
      colors.text,
  },

  // ===================================================
  // VEHICLE CARD
  // ===================================================

  vehicleCard: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 15,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
  },

  vehicleCardHeader: {
    flexDirection:
      'row',
    alignItems:
      'center',
  },

  vehicleIcon: {
    width: 50,
    height: 50,
    borderRadius: 13,
    alignItems:
      'center',
    justifyContent:
      'center',
    backgroundColor:
      colors.accentLight,
  },

  vehicleHeaderText: {
    flex: 1,
    marginLeft: 13,
  },

  registrationRow: {
    flexDirection:
      'row',
    alignItems:
      'center',
    flexWrap:
      'wrap',
  },

  registrationNumber: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color:
      colors.primary,
    letterSpacing: 0.1,
  },

  primaryBadge: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor:
      colors.warningLight,
  },

  primaryBadgeText: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: '600',
    color:
      '#B45309',
  },

  vehicleName: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '400',
    color:
      colors.textSecondary,
  },

  // ===================================================
  // DETAILS
  // ===================================================

  vehicleDetails: {
    flexDirection:
      'row',
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor:
      colors.borderLight,
  },

  detailItem: {
    flex: 1,
    flexDirection:
      'row',
    alignItems:
      'center',
  },

  detailLabel: {
    marginLeft: 7,
    fontSize: 10,
    fontWeight: '500',
    color:
      colors.textLight,
    textTransform:
      'uppercase',
    letterSpacing: 0.3,
  },

  detailValue: {
    marginLeft: 7,
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color:
      colors.textSecondary,
  },

  infoRow: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor:
      colors.borderLight,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '400',
    color:
      colors.textMuted,
  },

  // ===================================================
  // ACTIONS
  // ===================================================

  vehicleActions: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor:
      colors.borderLight,
  },

  editButton: {
    flex: 1,
    height: 42,
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'center',
    borderRadius: 10,
    backgroundColor:
      colors.accentLight,
    borderWidth: 1,
    borderColor:
      '#DBEAFE',
    marginRight: 5,
  },

  editButtonText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color:
      colors.accent,
  },

  deleteButton: {
    flex: 1,
    height: 42,
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'center',
    borderRadius: 10,
    backgroundColor:
      colors.dangerLight,
    borderWidth: 1,
    borderColor:
      '#FECACA',
    marginLeft: 5,
  },

  deleteButtonText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color:
      colors.danger,
  },

  // ===================================================
  // EMPTY
  // ===================================================

  emptyCard: {
    alignItems:
      'center',
    paddingHorizontal: 24,
    paddingVertical: 38,
    borderRadius: 15,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 21,
    alignItems:
      'center',
    justifyContent:
      'center',
    backgroundColor:
      colors.accentLight,
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '700',
    color:
      colors.primary,
  },

  emptyDescription: {
    maxWidth: 400,
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
    color:
      colors.textMuted,
    textAlign:
      'center',
  },

  emptyAddButton: {
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'center',
    marginTop: 22,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 11,
    backgroundColor:
      colors.accent,
  },

  emptyAddButtonText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: '600',
    color:
      colors.white,
  },

  // ===================================================
  // FORM MODAL
  // ===================================================

  modalOverlay: {
    flex: 1,
    justifyContent:
      'flex-end',
    backgroundColor:
      'rgba(15,23,42,0.45)',
  },

  modalContainer: {
    width: '100%',
    maxHeight: '94%',
    backgroundColor:
      colors.background,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    overflow:
      'hidden',
  },

  modalHeader: {
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor:
      colors.surface,
    borderBottomWidth: 1,
    borderBottomColor:
      colors.borderLight,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color:
      colors.primary,
  },

  modalSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '400',
    color:
      colors.textMuted,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems:
      'center',
    justifyContent:
      'center',
    backgroundColor:
      colors.borderLight,
  },

  modalScroll: {
    flexGrow: 0,
  },

  modalContent: {
    padding: 20,
    paddingBottom: 25,
  },

  // ===================================================
  // FORM
  // ===================================================

  inputContainer: {
    marginBottom: 17,
  },

  fieldLabel: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: '600',
    color:
      colors.textSecondary,
  },

  requiredMark: {
    color:
      colors.danger,
  },

  input: {
    height: 46,
    paddingHorizontal: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor:
      colors.border,
    backgroundColor:
      colors.surface,
    fontSize: 14,
    fontWeight: '400',
    color:
      colors.text,
  },

  // ===================================================
  // VEHICLE TYPE
  // ===================================================

  typeGrid: {
    flexDirection:
      'row',
    flexWrap:
      'wrap',
    marginBottom: 18,
  },

  typeOption: {
    width: '31.5%',
    minHeight: 70,
    alignItems:
      'center',
    justifyContent:
      'center',
    marginRight: '2.5%',
    marginBottom: 8,
    borderRadius: 11,
    borderWidth: 1,
    borderColor:
      colors.border,
    backgroundColor:
      colors.surface,
  },

  typeOptionSelected: {
    borderColor:
      colors.accent,
    backgroundColor:
      colors.accentLight,
  },

  typeOptionText: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: '500',
    color:
      colors.textMuted,
  },

  typeOptionTextSelected: {
    color:
      colors.accent,
    fontWeight: '600',
  },

  // ===================================================
  // PRIMARY
  // ===================================================

  primarySection: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginTop: 2,
    padding: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor:
      colors.border,
    backgroundColor:
      colors.surface,
  },

  primaryTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  primaryTitleRow: {
    flexDirection:
      'row',
    alignItems:
      'center',
  },

  primaryTitle: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: '600',
    color:
      colors.text,
  },

  primaryDescription: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '400',
    color:
      colors.textMuted,
  },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems:
      'center',
    justifyContent:
      'center',
    borderWidth: 2,
    borderColor:
      colors.border,
    backgroundColor:
      colors.white,
  },

  radioOuterSelected: {
    borderColor:
      colors.accent,
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor:
      colors.accent,
  },

  // ===================================================
  // FORM ERROR
  // ===================================================

  formError: {
    flexDirection:
      'row',
    alignItems:
      'flex-start',
    marginTop: 14,
    padding: 11,
    borderRadius: 10,
    backgroundColor:
      colors.dangerLight,
  },

  formErrorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color:
      colors.danger,
  },

  // ===================================================
  // FORM FOOTER
  // ===================================================

  modalFooter: {
    flexDirection:
      'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom:
      Platform.OS === 'ios'
        ? 26
        : 16,
    backgroundColor:
      colors.surface,
    borderTopWidth: 1,
    borderTopColor:
      colors.borderLight,
  },

  cancelButton: {
    flex: 1,
    height: 46,
    alignItems:
      'center',
    justifyContent:
      'center',
    borderRadius: 11,
    borderWidth: 1,
    borderColor:
      colors.border,
    backgroundColor:
      colors.surface,
    marginRight: 6,
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color:
      colors.textSecondary,
  },

  saveButton: {
    flex: 1.4,
    height: 46,
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'center',
    borderRadius: 11,
    backgroundColor:
      colors.accent,
    marginLeft: 6,
  },

  saveButtonText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: '600',
    color:
      colors.white,
  },

  // ===================================================
  // DELETE MODAL
  // ===================================================

  deleteOverlay: {
    flex: 1,
    alignItems:
      'center',
    justifyContent:
      'center',
    paddingHorizontal: 20,
    backgroundColor:
      'rgba(15,23,42,0.50)',
  },

  deleteModal: {
    width: '100%',
    maxWidth: 430,
    padding: 22,
    borderRadius: 18,
    backgroundColor:
      colors.surface,
  },

  deleteIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems:
      'center',
    justifyContent:
      'center',
    backgroundColor:
      colors.dangerLight,
    alignSelf:
      'center',
  },

  deleteTitle: {
    marginTop: 17,
    fontSize: 19,
    fontWeight: '700',
    color:
      colors.primary,
    textAlign:
      'center',
  },

  deleteDescription: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
    color:
      colors.textMuted,
    textAlign:
      'center',
  },

  deleteVehicleCard: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginTop: 17,
    padding: 13,
    borderRadius: 11,
    backgroundColor:
      colors.background,
    borderWidth: 1,
    borderColor:
      colors.border,
  },

  deleteVehicleInfo: {
    marginLeft: 10,
  },

  deleteVehicleRegistration: {
    fontSize: 14,
    fontWeight: '700',
    color:
      colors.primary,
  },

  deleteVehicleName: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '400',
    color:
      colors.textMuted,
  },

  deleteWarning: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor:
      colors.dangerLight,
  },

  deleteWarningText: {
    marginLeft: 7,
    fontSize: 11,
    fontWeight: '500',
    color:
      colors.danger,
  },

  deleteActions: {
    flexDirection:
      'row',
    marginTop: 19,
  },

  deleteCancelButton: {
    flex: 1,
    height: 44,
    alignItems:
      'center',
    justifyContent:
      'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor:
      colors.border,
    backgroundColor:
      colors.surface,
    marginRight: 5,
  },

  deleteCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color:
      colors.textSecondary,
  },

  confirmDeleteButton: {
    flex: 1,
    height: 44,
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'center',
    borderRadius: 10,
    backgroundColor:
      colors.danger,
    marginLeft: 5,
  },

  confirmDeleteText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color:
      colors.white,
  },
});