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
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

import {
  getMyDriverProfile,
  updateDriverAvailability,
  updateMyDriverProfile,
} from '../../services/driverService';

import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {

  const router = useRouter();

  const { logout } = useAuth();

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);

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

  const loadProfile = async (
    showLoader = true
  ) => {

    try {

      if (showLoader) {
        setLoading(true);
      }

      const response =
        await getMyDriverProfile();

      console.log(
        '[Driver Profile]',
        response
      );

      setProfile(response);

      setForm({
        name:
          response?.name || '',

        email:
          response?.email || '',

        profileImageUrl:
          response?.profileImageUrl || '',

        licenseNumber:
          response?.licenseNumber || '',

        licenseExpiryDate:
          formatDateForInput(
            response?.licenseExpiryDate
          ),

        emergencyContactName:
          response?.emergencyContactName || '',

        emergencyContactPhone:
          response?.emergencyContactPhone || '',
      });

    } catch (error) {

      console.error(
        'Unable to load driver profile:',
        error
      );

      Alert.alert(
        'Unable to Load Profile',
        error?.message ||
          'Something went wrong while loading your profile.'
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

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

    setForm({
      name:
        profile.name || '',

      email:
        profile.email || '',

      profileImageUrl:
        profile.profileImageUrl || '',

      licenseNumber:
        profile.licenseNumber || '',

      licenseExpiryDate:
        formatDateForInput(
          profile.licenseExpiryDate
        ),

      emergencyContactName:
        profile.emergencyContactName || '',

      emergencyContactPhone:
        profile.emergencyContactPhone || '',
    });

    setEditing(true);
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {

    if (profile) {

      setForm({
        name:
          profile.name || '',

        email:
          profile.email || '',

        profileImageUrl:
          profile.profileImageUrl || '',

        licenseNumber:
          profile.licenseNumber || '',

        licenseExpiryDate:
          formatDateForInput(
            profile.licenseExpiryDate
          ),

        emergencyContactName:
          profile.emergencyContactName || '',

        emergencyContactPhone:
          profile.emergencyContactPhone || '',
      });
    }

    setEditing(false);
  };

  // =========================================================
  // PICK PHOTO
  // =========================================================

  const handlePickPhoto = async () => {

    try {

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        !permission.granted
      ) {

        Alert.alert(
          'Permission Required',
          'Please allow photo library access to select a profile photo.'
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({

          mediaTypes:
            ['images'],

          allowsEditing:
            true,

          aspect:
            [1, 1],

          quality:
            0.8,
        });

      if (
        result.canceled
      ) {
        return;
      }

      const uri =
        result.assets?.[0]?.uri;

      if (!uri) {
        return;
      }

      /*
       * For now we store the selected
       * image URI.
       *
       * Later this can be replaced with
       * cloud storage upload.
       */

      setForm(previous => ({
        ...previous,
        profileImageUrl:
          uri,
      }));

    } catch (error) {

      console.error(
        'Photo selection failed:',
        error
      );

      Alert.alert(
        'Photo Error',
        'Unable to select the profile photo.'
      );
    }
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async () => {

    if (saving) {
      return;
    }

    const name =
      form.name.trim();

    const email =
      form.email.trim();

    const licenseNumber =
      form.licenseNumber.trim();

    const expiryDate =
      form.licenseExpiryDate.trim();

    const emergencyName =
      form.emergencyContactName.trim();

    const emergencyPhone =
      form.emergencyContactPhone.trim();

    // -------------------------------------------------------
    // NAME
    // -------------------------------------------------------

    if (!name) {

      Alert.alert(
        'Name Required',
        'Please enter your name.'
      );

      return;
    }

    // -------------------------------------------------------
    // EMAIL
    // -------------------------------------------------------

    if (!email) {

      Alert.alert(
        'Email Required',
        'Please enter your email address.'
      );

      return;
    }

    if (!isValidEmail(email)) {

      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );

      return;
    }

    // -------------------------------------------------------
    // LICENSE
    // -------------------------------------------------------

    if (!licenseNumber) {

      Alert.alert(
        'License Number Required',
        'Please enter your driving license number.'
      );

      return;
    }

    if (!expiryDate) {

      Alert.alert(
        'License Expiry Required',
        'Please enter the license expiry date.'
      );

      return;
    }

    if (!isValidDate(expiryDate)) {

      Alert.alert(
        'Invalid Date',
        'Please use YYYY-MM-DD format.'
      );

      return;
    }

    // -------------------------------------------------------
    // EMERGENCY CONTACT
    // -------------------------------------------------------

    if (!emergencyName) {

      Alert.alert(
        'Emergency Contact Required',
        'Please enter the emergency contact name.'
      );

      return;
    }

    if (!emergencyPhone) {

      Alert.alert(
        'Emergency Phone Required',
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
            form.profileImageUrl ||
            null,

          licenseNumber,

          licenseExpiryDate:
            expiryDate,

          emergencyContactName:
            emergencyName,

          emergencyContactPhone:
            emergencyPhone,
        });

      console.log(
        '[Driver Profile Updated]',
        updated
      );

      setProfile(updated);

      setForm({
        name:
          updated?.name || '',

        email:
          updated?.email || '',

        profileImageUrl:
          updated?.profileImageUrl || '',

        licenseNumber:
          updated?.licenseNumber || '',

        licenseExpiryDate:
          formatDateForInput(
            updated?.licenseExpiryDate
          ),

        emergencyContactName:
          updated?.emergencyContactName || '',

        emergencyContactPhone:
          updated?.emergencyContactPhone || '',
      });

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

      Alert.alert(
        'Update Failed',
        error?.message ||
          'Unable to update your profile.'
      );

    } finally {

      setSaving(false);
    }
  };

  // =========================================================
  // AVAILABILITY
  // =========================================================

  const handleAvailabilityChange =
    async (value) => {

      if (
        !profile ||
        availabilityLoading
      ) {
        return;
      }

      try {

        setAvailabilityLoading(
          true
        );

        const updated =
          await updateDriverAvailability(
            value
          );

        setProfile(updated);

      } catch (error) {

        console.error(
          'Unable to update availability:',
          error
        );

        Alert.alert(
          'Availability Update Failed',
          error?.message ||
            'Unable to update your availability.'
        );

      } finally {

        setAvailabilityLoading(
          false
        );
      }
    };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Logout',
          style: 'destructive',

          onPress: async () => {

            try {

              await logout();

              router.replace(
                '/login'
              );

            } catch (error) {

              console.error(
                'Logout failed:',
                error
              );

              Alert.alert(
                'Logout Failed',
                'Unable to logout. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

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
      <View
        style={
          styles.emptyContainer
        }
      >

        <View
          style={
            styles.emptyIcon
          }
        >
          <Ionicons
            name="person-outline"
            size={30}
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
          Profile unavailable
        </Text>

        <Text
          style={
            styles.emptyDescription
          }
        >
          We couldn't load your driver
          profile.
        </Text>

        <TouchableOpacity
          style={
            styles.retryButton
          }
          onPress={() =>
            loadProfile()
          }
        >
          <Text
            style={
              styles.retryText
            }
          >
            Try Again
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  const displayName =
    profile.name ||
    'Driver';

  const initials =
    getInitials(
      displayName
    );

  const isAvailable =
    Boolean(
      profile.available
    );

  const displayPhoto =
    editing
      ? form.profileImageUrl
      : profile.profileImageUrl;

  // =========================================================
  // SCREEN
  // =========================================================

  return (
    <View
      style={
        styles.container
      }
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
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
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <View
          style={
            styles.header
          }
        >

          <View>

            <Text
              style={
                styles.title
              }
            >
              Profile
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Driver profile and settings
            </Text>

          </View>

          {!editing && (

            <TouchableOpacity
              style={
                styles.editHeaderButton
              }
              onPress={
                handleEdit
              }
              activeOpacity={0.8}
            >

              <Ionicons
                name="create-outline"
                size={19}
                color={
                  colors.accent
                }
              />

            </TouchableOpacity>
          )}

        </View>

        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <View
          style={
            styles.profileCard
          }
        >

          <TouchableOpacity
            onPress={
              editing
                ? handlePickPhoto
                : undefined
            }
            activeOpacity={
              editing ? 0.8 : 1
            }
          >

            <View
              style={
                styles.avatarContainer
              }
            >

              {displayPhoto ? (

                <Image
                  source={{
                    uri:
                      displayPhoto,
                  }}
                  style={
                    styles.avatarImage
                  }
                />

              ) : (

                <View
                  style={
                    styles.avatar
                  }
                >

                  <Text
                    style={
                      styles.avatarText
                    }
                  >
                    {initials}
                  </Text>

                </View>
              )}

              {editing && (

                <View
                  style={
                    styles.cameraButton
                  }
                >
                  <Ionicons
                    name="camera"
                    size={13}
                    color={
                      colors.white
                    }
                  />
                </View>
              )}

            </View>

          </TouchableOpacity>

          <View
            style={
              styles.profileInfo
            }
          >

            <Text
              style={
                styles.name
              }
            >
              {displayName}
            </Text>

            <Text
              style={
                styles.phone
              }
            >
              {profile.phone ||
                'Mobile number not available'}
            </Text>

            <View
              style={
                styles.verifiedRow
              }
            >

              <Ionicons
                name="checkmark-circle"
                size={13}
                color={
                  colors.success
                }
              />

              <Text
                style={
                  styles.verifiedText
                }
              >
                Verified Driver
              </Text>

            </View>

          </View>

        </View>

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Personal Information
        </Text>

        <View
          style={
            styles.card
          }
        >

          {editing ? (

            <>
              <InputField
                icon="person-outline"
                label="Full Name"
                value={
                  form.name
                }
                onChangeText={
                  value =>
                    setForm({
                      ...form,
                      name:
                        value,
                    })
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
                value={
                  form.email
                }
                onChangeText={
                  value =>
                    setForm({
                      ...form,
                      email:
                        value,
                    })
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
            LICENSE
        ================================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Driving License
        </Text>

        <View
          style={
            styles.card
          }
        >

          {editing ? (

            <>
              <InputField
                icon="card-outline"
                label="License Number"
                value={
                  form.licenseNumber
                }
                onChangeText={
                  value =>
                    setForm({
                      ...form,
                      licenseNumber:
                        value,
                    })
                }
                placeholder="Enter license number"
                autoCapitalize="characters"
              />

              <InputField
                icon="calendar-outline"
                label="License Expiry"
                value={
                  form.licenseExpiryDate
                }
                onChangeText={
                  value =>
                    setForm({
                      ...form,
                      licenseExpiryDate:
                        value,
                    })
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
                value={
                  formatDisplayDate(
                    profile.licenseExpiryDate
                  )
                }
                isLast
              />
            </>
          )}

        </View>

        {/* =================================================
            EMERGENCY CONTACT
        ================================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Emergency Contact
        </Text>

        <View
          style={
            styles.card
          }
        >

          {editing ? (

            <>
              <InputField
                icon="person-circle-outline"
                label="Contact Name"
                value={
                  form.emergencyContactName
                }
                onChangeText={
                  value =>
                    setForm({
                      ...form,
                      emergencyContactName:
                        value,
                    })
                }
                placeholder="Enter contact name"
              />

              <InputField
                icon="call-outline"
                label="Contact Phone"
                value={
                  form.emergencyContactPhone
                }
                onChangeText={
                  value =>
                    setForm({
                      ...form,
                      emergencyContactPhone:
                        value,
                    })
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
            AVAILABILITY
        ================================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Availability
        </Text>

        <View
          style={
            styles.availabilityCard
          }>

          <View
            style={[
              styles.availabilityIcon,
              isAvailable &&
                styles.availabilityIconActive,
            ]}
          >

            <Ionicons
              name={
                isAvailable
                  ? 'radio-outline'
                  : 'pause-outline'
              }
              size={20}
              color={
                isAvailable
                  ? colors.success
                  : colors.textMuted
              }
            />

          </View>

          <View
            style={
              styles.availabilityInfo
            }
          >

            <Text
              style={
                styles.availabilityTitle
              }
            >
              {isAvailable
                ? 'You are available'
                : 'You are offline'}
            </Text>

            <Text
              style={
                styles.availabilitySubtitle
              }
            >
              {isAvailable
                ? 'You can receive service requests'
                : 'You will not receive new requests'}
            </Text>

          </View>

          {availabilityLoading ? (

            <ActivityIndicator
              size="small"
              color={
                colors.accent
              }
            />

          ) : (

            <Switch
              value={
                isAvailable
              }
              onValueChange={
                handleAvailabilityChange
              }
              trackColor={{
                false:
                  colors.border,
                true:
                  colors.accentLight,
              }}
              thumbColor={
                isAvailable
                  ? colors.accent
                  : colors.textMuted
              }
            />
          )}

        </View>

        {/* =================================================
            SAVE / CANCEL
        ================================================= */}

        {editing && (

          <View
            style={
              styles.actionRow
            }
          >

            <TouchableOpacity
              style={
                styles.cancelButton
              }
              onPress={
                handleCancel
              }
              disabled={
                saving
              }
              activeOpacity={0.8}
            >

              <Text
                style={
                  styles.cancelText
                }
              >
                Cancel
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.saveButton
              }
              onPress={
                handleSave
              }
              disabled={
                saving
              }
              activeOpacity={0.8}
            >

              {saving ? (

                <ActivityIndicator
                  size="small"
                  color={
                    colors.white
                  }
                />

              ) : (

                <>
                  <Ionicons
                    name="checkmark"
                    size={17}
                    color={
                      colors.white
                    }
                  />

                  <Text
                    style={
                      styles.saveText
                    }
                  >
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
            style={
              styles.logoutButton
            }
            onPress={
              handleLogout
            }
            activeOpacity={0.8}
          >

            <Ionicons
              name="log-out-outline"
              size={18}
              color={
                colors.danger ||
                '#DC2626'
              }
            />

            <Text
              style={
                styles.logoutText
              }
            >
              Logout
            </Text>

          </TouchableOpacity>
        )}

        <Text
          style={
            styles.versionText
          }
        >
          Truck Assist Driver
        </Text>

      </ScrollView>
    </View>
  );
}

// ===========================================================
// INFO ROW
// ===========================================================

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
        !isLast &&
          styles.infoRowBorder,
      ]}
    >

      <View
        style={
          styles.infoIcon
        }
      >

        <Ionicons
          name={icon}
          size={17}
          color={
            colors.accent
          }
        />

      </View>

      <View
        style={
          styles.infoContent
        }
      >

        <Text
          style={
            styles.infoLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.infoValue
          }
          numberOfLines={2}
        >
          {value}
        </Text>

      </View>

    </View>
  );
}

// ===========================================================
// INPUT FIELD
// ===========================================================

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
        !isLast &&
          styles.inputFieldBorder,
      ]}
    >

      <View
        style={
          styles.inputIcon
        }
      >

        <Ionicons
          name={icon}
          size={17}
          color={
            colors.accent
          }
        />

      </View>

      <View
        style={
          styles.inputContent
        }
      >

        <Text
          style={
            styles.inputLabel
          }
        >
          {label}
        </Text>

        <TextInput
          style={
            styles.textInput
          }
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
            keyboardType
          }
          autoCapitalize={
            autoCapitalize
          }
        />

      </View>

    </View>
  );
}

// ===========================================================
// INITIALS
// ===========================================================

function getInitials(
  name
) {

  if (
    !name ||
    name === 'Driver'
  ) {
    return 'D';
  }

  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length === 1
  ) {

    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();
}

// ===========================================================
// DATE INPUT
// ===========================================================

function formatDateForInput(
  date
) {

  if (!date) {
    return '';
  }

  return String(date)
    .substring(0, 10);
}

// ===========================================================
// DATE DISPLAY
// ===========================================================

function formatDisplayDate(
  date
) {

  if (!date) {
    return 'Not provided';
  }

  const value =
    String(date)
      .substring(0, 10);

  const parts =
    value.split('-');

  if (
    parts.length !== 3
  ) {
    return value;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// ===========================================================
// DATE VALIDATION
// ===========================================================

function isValidDate(
  value
) {

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value
    );

  if (!match) {
    return false;
  }

  const year =
    Number(match[1]);

  const month =
    Number(match[2]);

  const day =
    Number(match[3]);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return false;
  }

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  return (
    date.getFullYear() === year &&
    date.getMonth() ===
      month - 1 &&
    date.getDate() === day
  );
}

// ===========================================================
// EMAIL VALIDATION
// ===========================================================

function isValidEmail(
  email
) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

// ===========================================================
// STYLES
// ===========================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  content: {
    paddingHorizontal:
      spacing.screenHorizontal,
    paddingTop: 18,
    paddingBottom: 110,
  },

  // =========================================================
  // HEADER
  // =========================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 18,
  },

  title: {
    fontFamily:
      'InterBold',
    fontSize: 22,
    color:
      colors.text,
  },

  subtitle: {
    fontFamily:
      'InterRegular',
    fontSize: 10,
    color:
      colors.textMuted,
    marginTop: 3,
  },

  editHeaderButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      colors.white,
    borderWidth: 1,
    borderColor:
      colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // =========================================================
  // PROFILE CARD
  // =========================================================

  profileCard: {
    backgroundColor:
      colors.white,
    borderRadius:
      spacing.radiusLarge,
    borderWidth: 1,
    borderColor:
      colors.borderLight,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    width: 64,
    height: 64,
    position: 'relative',
    marginRight: 12,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor:
      colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },

  avatarText: {
    fontFamily:
      'InterBold',
    fontSize: 17,
    color:
      colors.accent,
  },

  cameraButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor:
      colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor:
      colors.white,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontFamily:
      'InterBold',
    fontSize: 15,
    color:
      colors.text,
  },

  phone: {
    fontFamily:
      'InterRegular',
    fontSize: 9,
    color:
      colors.textMuted,
    marginTop: 3,
  },

  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  verifiedText: {
    fontFamily:
      'InterMedium',
    fontSize: 8,
    color:
      colors.successDark ||
      colors.success,
    marginLeft: 4,
  },

  // =========================================================
  // SECTION
  // =========================================================

  sectionTitle: {
    fontFamily:
      'InterBold',
    fontSize: 15,
    color:
      colors.text,
    marginTop: 20,
    marginBottom: 10,
  },

  // =========================================================
  // CARD
  // =========================================================

  card: {
    backgroundColor:
      colors.white,
    borderRadius:
      spacing.radiusLarge,
    borderWidth: 1,
    borderColor:
      colors.borderLight,
    paddingHorizontal: 14,
  },

  // =========================================================
  // INFO ROW
  // =========================================================

  infoRow: {
    minHeight: 59,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor:
      colors.borderLight,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor:
      colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontFamily:
      'InterRegular',
    fontSize: 8,
    color:
      colors.textMuted,
  },

  infoValue: {
    fontFamily:
      'InterSemiBold',
    fontSize: 11,
    color:
      colors.text,
    marginTop: 3,
  },

  // =========================================================
  // INPUT
  // =========================================================

  inputField: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputFieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor:
      colors.borderLight,
  },

  inputIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor:
      colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  inputContent: {
    flex: 1,
  },

  inputLabel: {
    fontFamily:
      'InterRegular',
    fontSize: 8,
    color:
      colors.textMuted,
    marginBottom: 3,
  },

  textInput: {
    padding: 0,
    margin: 0,
    fontFamily:
      'InterSemiBold',
    fontSize: 11,
    color:
      colors.text,
    minHeight: 24,
  },

  // =========================================================
  // AVAILABILITY
  // =========================================================

  availabilityCard: {
    backgroundColor:
      colors.white,
    borderRadius:
      spacing.radiusMedium,
    borderWidth: 1,
    borderColor:
      colors.borderLight,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  availabilityIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  availabilityIconActive: {
    backgroundColor:
      colors.successLight,
  },

  availabilityInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 10,
  },

  availabilityTitle: {
    fontFamily:
      'InterSemiBold',
    fontSize: 11,
    color:
      colors.text,
  },

  availabilitySubtitle: {
    fontFamily:
      'InterRegular',
    fontSize: 8,
    color:
      colors.textMuted,
    marginTop: 3,
  },

  // =========================================================
  // ACTIONS
  // =========================================================

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 13,
    backgroundColor:
      colors.white,
    borderWidth: 1,
    borderColor:
      colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontFamily:
      'InterSemiBold',
    fontSize: 10,
    color:
      colors.textSecondary,
  },

  saveButton: {
    flex: 1.5,
    height: 46,
    borderRadius: 13,
    backgroundColor:
      colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  saveText: {
    fontFamily:
      'InterBold',
    fontSize: 10,
    color:
      colors.white,
  },

  // =========================================================
  // LOGOUT
  // =========================================================

  logoutButton: {
    height: 46,
    borderRadius: 13,
    marginTop: 22,
    backgroundColor:
      colors.white,
    borderWidth: 1,
    borderColor:
      colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  logoutText: {
    fontFamily:
      'InterSemiBold',
    fontSize: 10,
    color:
      colors.danger ||
      '#DC2626',
  },

  versionText: {
    fontFamily:
      'InterRegular',
    fontSize: 8,
    color:
      colors.textLight,
    textAlign: 'center',
    marginTop: 15,
  },

  // =========================================================
  // LOADING
  // =========================================================

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      colors.background,
  },

  loadingText: {
    fontFamily:
      'InterRegular',
    fontSize: 10,
    color:
      colors.textMuted,
    marginTop: 10,
  },

  // =========================================================
  // EMPTY
  // =========================================================

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    backgroundColor:
      colors.background,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor:
      colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontFamily:
      'InterBold',
    fontSize: 16,
    color:
      colors.text,
    marginTop: 15,
  },

  emptyDescription: {
    fontFamily:
      'InterRegular',
    fontSize: 10,
    color:
      colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },

  retryButton: {
    height: 42,
    paddingHorizontal: 25,
    borderRadius: 12,
    backgroundColor:
      colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  retryText: {
    fontFamily:
      'InterBold',
    fontSize: 10,
    color:
      colors.white,
  },
});