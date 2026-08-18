import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

import {
  getMyDriverProfile,
  updateMyDriverProfile,
} from '../../services/driverService';

import { useAuth } from '../../context/AuthContext';

// =========================================================
// PROFILE SCREEN
// =========================================================

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    profileImageUrl: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  const loadProfile = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setErrorMessage('');

      const response = await getMyDriverProfile();

      setProfile(response);
      setForm(profileToForm(response));
    } catch (error) {
      console.error(
        'Unable to load driver profile:',
        error
      );

      setErrorMessage(
        error?.message ||
          'Unable to load your driver profile.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    setRefreshing(true);
    loadProfile(false);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = () => {
    if (!profile) {
      return;
    }

    setErrorMessage('');
    setForm(profileToForm(profile));
    setEditing(true);
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {
    if (profile) {
      setForm(profileToForm(profile));
    }

    setErrorMessage('');
    setEditing(false);
  };

  // =========================================================
  // PICK PROFILE PHOTO
  // =========================================================

  const handlePickPhoto = async () => {
    if (!editing || photoLoading || saving) {
      return;
    }

    try {
      setPhotoLoading(true);
      setErrorMessage('');

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow photo library access to select a profile photo.'
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.75,
          base64: true,
        });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        return;
      }

      // Prefer a self-contained data URL so the selected
      // photo remains usable after the temporary picker URI
      // disappears. The backend already stores this value in
      // profileImageUrl.
      let imageValue = asset.uri;

      if (asset.base64) {
        const mimeType =
          asset.mimeType || 'image/jpeg';

        imageValue =
          `data:${mimeType};base64,${asset.base64}`;
      }

      setForm(previous => ({
        ...previous,
        profileImageUrl: imageValue,
      }));
    } catch (error) {
      console.error(
        'Photo selection failed:',
        error
      );

      setErrorMessage(
        'Unable to select the profile photo.'
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async () => {
    if (saving) {
      return;
    }

    setErrorMessage('');

    const name = form.name.trim();
    const email = form.email.trim();
    const licenseNumber = form.licenseNumber.trim();
    const expiryDate = form.licenseExpiryDate.trim();
    const emergencyName =
      form.emergencyContactName.trim();
    const emergencyPhone =
      form.emergencyContactPhone.trim();

    if (!name) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!email) {
      setErrorMessage(
        'Please enter your email address.'
      );
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage(
        'Please enter a valid email address.'
      );
      return;
    }

    if (!licenseNumber) {
      setErrorMessage(
        'Please enter your driving license number.'
      );
      return;
    }

    if (!expiryDate) {
      setErrorMessage(
        'Please enter the license expiry date.'
      );
      return;
    }

    if (!isValidDate(expiryDate)) {
      setErrorMessage(
        'Please use YYYY-MM-DD for the license expiry date.'
      );
      return;
    }

    if (!emergencyName) {
      setErrorMessage(
        'Please enter the emergency contact name.'
      );
      return;
    }

    if (!emergencyPhone) {
      setErrorMessage(
        'Please enter the emergency contact number.'
      );
      return;
    }

    try {
      setSaving(true);

      const updated =
        await updateMyDriverProfile({
          name,
          email,
          profileImageUrl:
            form.profileImageUrl || null,
          licenseNumber,
          licenseExpiryDate: expiryDate,
          emergencyContactName: emergencyName,
          emergencyContactPhone: emergencyPhone,
        });

      setProfile(updated);
      setForm(profileToForm(updated));
      setEditing(false);

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.'
      );
    } catch (error) {
      console.error(
        'Unable to update driver profile:',
        error
      );

      setErrorMessage(
        error?.message ||
          'Unable to update your profile.'
      );
    } finally {
      setSaving(false);
    }
  };

 // =========================================================
// LOGOUT
// =========================================================

const handleLogout = async () => {
  console.log(
    '[Profile] Logout button pressed'
  );

  try {
    // Clear authentication session
    await logout();

    console.log(
      '[Profile] Logout successful'
    );

  } catch (error) {

    console.error(
      '[Profile] Logout failed:',
      error
    );

  } finally {

    // Always go to login screen
    router.replace({
      pathname: '/login',
    });

  }
};

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  // =========================================================
  // EMPTY
  // =========================================================

  if (!profile) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="person-outline"
            size={30}
            color={colors.accent}
          />
        </View>

        <Text style={styles.emptyTitle}>
          Profile unavailable
        </Text>

        <Text style={styles.emptyDescription}>
          We couldn't load your driver profile.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadProfile()}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayName =
    profile.name || 'Driver';

  const initials = getInitials(displayName);

  const displayPhoto = editing
    ? form.profileImageUrl
    : profile.profileImageUrl;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Profile
            </Text>

            <Text style={styles.subtitle}>
              Manage your driver profile
            </Text>
          </View>

          {!editing && (
            <TouchableOpacity
              style={styles.editHeaderButton}
              onPress={handleEdit}
              activeOpacity={0.8}
            >
              <Ionicons
                name="create-outline"
                size={19}
                color={colors.accent}
              />

              <Text style={styles.editHeaderText}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.danger}
            />

            <Text style={styles.errorText}>
              {errorMessage}
            </Text>

            <TouchableOpacity
              onPress={() => setErrorMessage('')}
            >
              <Ionicons
                name="close"
                size={18}
                color={colors.danger}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* =================================================
            PROFILE SUMMARY
        ================================================= */}

        <View style={styles.profileCard}>
          <TouchableOpacity
            onPress={
              editing
                ? handlePickPhoto
                : undefined
            }
            activeOpacity={editing ? 0.8 : 1}
            disabled={photoLoading || saving}
          >
            <View style={styles.avatarContainer}>
              {displayPhoto ? (
                <Image
                  source={{ uri: displayPhoto }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>
                    {initials}
                  </Text>
                </View>
              )}

              {editing && (
                <View style={styles.cameraButton}>
                  {photoLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.white}
                    />
                  ) : (
                    <Ionicons
                      name="camera-outline"
                      size={14}
                      color={colors.white}
                    />
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {displayName}
            </Text>

            <Text style={styles.phone}>
              {profile.phone ||
                'Mobile number not available'}
            </Text>

            <View style={styles.verifiedRow}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={colors.success}
              />

              <Text style={styles.verifiedText}>
                Verified Driver
              </Text>
            </View>
          </View>
        </View>

        {editing && (
          <Text style={styles.photoHint}>
            Tap the camera icon to change your profile photo.
          </Text>
        )}

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <SectionTitle title="Personal Information" />

        <View style={styles.card}>
          {editing ? (
            <>
              <InputField
                icon="person-outline"
                label="Full Name"
                value={form.name}
                onChangeText={value =>
                  setForm(previous => ({
                    ...previous,
                    name: value,
                  }))
                }
                placeholder="Enter your name"
              />

              <InfoRow
                icon="call-outline"
                label="Mobile Number"
                value={
                  profile.phone ||
                  'Not available'
                }
              />

              <InputField
                icon="mail-outline"
                label="Email Address"
                value={form.email}
                onChangeText={value =>
                  setForm(previous => ({
                    ...previous,
                    email: value,
                  }))
                }
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                isLast
              />
            </>
          ) : (
            <>
              <InfoRow
                icon="person-outline"
                label="Full Name"
                value={
                  profile.name ||
                  'Not provided'
                }
              />

              <InfoRow
                icon="call-outline"
                label="Mobile Number"
                value={
                  profile.phone ||
                  'Not available'
                }
              />

              <InfoRow
                icon="mail-outline"
                label="Email Address"
                value={
                  profile.email ||
                  'Not provided'
                }
                isLast
              />
            </>
          )}
        </View>

        {/* =================================================
            DRIVING LICENSE
        ================================================= */}

        <SectionTitle title="Driving License" />

        <View style={styles.card}>
          {editing ? (
            <>
              <InputField
                icon="card-outline"
                label="License Number"
                value={form.licenseNumber}
                onChangeText={value =>
                  setForm(previous => ({
                    ...previous,
                    licenseNumber: value,
                  }))
                }
                placeholder="Enter license number"
                autoCapitalize="characters"
              />

              <InputField
                icon="calendar-outline"
                label="License Expiry"
                value={form.licenseExpiryDate}
                onChangeText={value =>
                  setForm(previous => ({
                    ...previous,
                    licenseExpiryDate: value,
                  }))
                }
                placeholder="YYYY-MM-DD"
                keyboardType="numbers-and-punctuation"
                isLast
              />
            </>
          ) : (
            <>
              <InfoRow
                icon="card-outline"
                label="License Number"
                value={
                  profile.licenseNumber ||
                  'Not provided'
                }
              />

              <InfoRow
                icon="calendar-outline"
                label="Expiry Date"
                value={formatDisplayDate(
                  profile.licenseExpiryDate
                )}
                isLast
              />
            </>
          )}
        </View>

        {/* =================================================
            EMERGENCY CONTACT
        ================================================= */}

        <SectionTitle title="Emergency Contact" />

        <View style={styles.card}>
          {editing ? (
            <>
              <InputField
                icon="person-circle-outline"
                label="Contact Name"
                value={form.emergencyContactName}
                onChangeText={value =>
                  setForm(previous => ({
                    ...previous,
                    emergencyContactName: value,
                  }))
                }
                placeholder="Enter contact name"
              />

              <InputField
                icon="call-outline"
                label="Contact Phone"
                value={form.emergencyContactPhone}
                onChangeText={value =>
                  setForm(previous => ({
                    ...previous,
                    emergencyContactPhone: value,
                  }))
                }
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                isLast
              />
            </>
          ) : (
            <>
              <InfoRow
                icon="person-circle-outline"
                label="Contact Name"
                value={
                  profile.emergencyContactName ||
                  'Not provided'
                }
              />

              <InfoRow
                icon="call-outline"
                label="Contact Phone"
                value={
                  profile.emergencyContactPhone ||
                  'Not provided'
                }
                isLast
              />
            </>
          )}
        </View>

        {/* =================================================
            SAVE / CANCEL
        ================================================= */}

        {editing && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={saving || photoLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving || photoLoading}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color={colors.white}
                />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color={colors.white}
                  />

                  <Text style={styles.saveText}>
                    Save Changes
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* =================================================
            LOGOUT
        ================================================= */}

        {!editing && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color={colors.danger}
            />

            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.versionText}>
          Truck Assist Driver
        </Text>
      </ScrollView>
    </View>
  );
}

// =========================================================
// SECTION TITLE
// =========================================================

function SectionTitle({ title }) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

// =========================================================
// INFO ROW
// =========================================================

function InfoRow({
  icon,
  label,
  value,
  isLast = false,
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !isLast && styles.infoRowBorder,
      ]}
    >
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={17}
          color={colors.accent}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text
          style={styles.infoValue}
          numberOfLines={2}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// =========================================================
// INPUT FIELD
// =========================================================

function InputField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'sentences',
  isLast = false,
}) {
  return (
    <View
      style={[
        styles.inputField,
        !isLast && styles.inputFieldBorder,
      ]}
    >
      <View style={styles.inputIcon}>
        <Ionicons
          name={icon}
          size={17}
          color={colors.accent}
        />
      </View>

      <View style={styles.inputContent}>
        <Text style={styles.inputLabel}>
          {label}
        </Text>

        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable
        />
      </View>
    </View>
  );
}

// =========================================================
// PROFILE TO FORM
// =========================================================

function profileToForm(profile) {
  return {
    name: profile?.name || '',
    email: profile?.email || '',
    profileImageUrl:
      profile?.profileImageUrl || '',
    licenseNumber:
      profile?.licenseNumber || '',
    licenseExpiryDate:
      formatDateForInput(
        profile?.licenseExpiryDate
      ),
    emergencyContactName:
      profile?.emergencyContactName || '',
    emergencyContactPhone:
      profile?.emergencyContactPhone || '',
  };
}

// =========================================================
// INITIALS
// =========================================================

function getInitials(name) {
  if (!name || name === 'Driver') {
    return 'D';
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

// =========================================================
// DATE INPUT
// =========================================================

function formatDateForInput(date) {
  if (!date) {
    return '';
  }

  return String(date).substring(0, 10);
}

// =========================================================
// DATE DISPLAY
// =========================================================

function formatDisplayDate(date) {
  if (!date) {
    return 'Not provided';
  }

  const value = String(date).substring(0, 10);
  const parts = value.split('-');

  if (parts.length !== 3) {
    return value;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// =========================================================
// DATE VALIDATION
// =========================================================

function isValidDate(value) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return false;
  }

  const date = new Date(
    year,
    month - 1,
    day
  );

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// =========================================================
// EMAIL VALIDATION
// =========================================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
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
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 18,
    paddingBottom: 110,
  },

  // =======================================================
  // HEADER
  // =======================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontFamily: 'InterSemiBold',
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
    letterSpacing: -0.2,
  },

  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 3,
  },

  editHeaderButton: {
    height: 42,
    paddingHorizontal: 13,
    borderRadius: 11,
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  editHeaderText: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.accent,
  },

  // =======================================================
  // ERROR
  // =======================================================

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 13,
    borderRadius: 10,
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  errorText: {
    flex: 1,
    marginHorizontal: 8,
    fontFamily: 'InterRegular',
    fontSize: 11,
    lineHeight: 17,
    color: colors.danger,
  },

  // =======================================================
  // PROFILE SUMMARY
  // =======================================================

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    width: 68,
    height: 68,
    position: 'relative',
    marginRight: 13,
  },

  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 19,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 19,
    backgroundColor: colors.borderLight,
  },

  avatarText: {
    fontFamily: 'InterSemiBold',
    fontSize: 19,
    color: colors.accent,
  },

  cameraButton: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    lineHeight: 21,
    color: colors.text,
  },

  phone: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    lineHeight: 17,
    color: colors.textMuted,
    marginTop: 3,
  },

  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  verifiedText: {
    fontFamily: 'InterMedium',
    fontSize: 10,
    color: colors.successDark,
    marginLeft: 4,
  },

  photoHint: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textMuted,
    marginTop: 7,
    marginHorizontal: 2,
  },

  // =======================================================
  // SECTION
  // =======================================================

  sectionTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },

  // =======================================================
  // CARD
  // =======================================================

  card: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
  },

  // =======================================================
  // INFO ROW
  // =======================================================

  infoRow: {
    minHeight: 61,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
  },

  infoValue: {
    fontFamily: 'InterMedium',
    fontSize: 12,
    lineHeight: 17,
    color: colors.text,
    marginTop: 3,
  },

  // =======================================================
  // INPUT
  // =======================================================

  inputField: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputFieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  inputIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  inputContent: {
    flex: 1,
  },

  inputLabel: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 3,
  },

  textInput: {
    padding: 0,
    margin: 0,
    fontFamily: 'InterMedium',
    fontSize: 12,
    lineHeight: 18,
    color: colors.text,
    minHeight: 24,
  },

  // =======================================================
  // ACTIONS
  // =======================================================

  actionRow: {
    flexDirection: 'row',
    marginTop: 18,
  },

  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 11,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },

  cancelText: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.textSecondary,
  },

  saveButton: {
    flex: 1.45,
    height: 46,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    marginLeft: 5,
  },

  saveText: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.white,
  },

  // =======================================================
  // LOGOUT
  // =======================================================

  logoutButton: {
    height: 46,
    borderRadius: 11,
    marginTop: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  logoutText: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.danger,
  },

  versionText: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 15,
  },

  // =======================================================
  // LOADING
  // =======================================================

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  loadingText: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 10,
  },

  // =======================================================
  // EMPTY
  // =======================================================

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    backgroundColor: colors.background,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 19,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 17,
    color: colors.text,
    marginTop: 15,
  },

  emptyDescription: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },

  retryButton: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  retryText: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.white,
  },
});
