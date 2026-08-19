import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../../constants/colors';
import {
  getServiceCategories,
} from '../../../services/serviceCategoryService';

export default function BreakdownCategoryScreen() {
  const router = useRouter();

  const [categories, setCategories] =
    useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // =====================================================
  // LOAD SERVICE CATEGORIES
  // =====================================================

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      setError('');

      const response =
        await getServiceCategories();

      console.log(
        '[Service Categories] Response:',
        response
      );

      const activeCategories =
        Array.isArray(response)
          ? response
              .filter(
                item => item?.active !== false
              )
              .sort(
                (a, b) =>
                  (a.displayOrder || 0) -
                  (b.displayOrder || 0)
              )
          : [];

      setCategories(
        activeCategories
      );
    } catch (error) {
      console.error(
        '[Service Categories] Error:',
        error
      );

      setError(
        error?.message ||
        'Unable to load assistance types.'
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CONTINUE
  // =====================================================

  function handleContinue() {
    if (!selectedCategory) {
      return;
    }

    console.log(
      '[Breakdown] Selected category:',
      selectedCategory
    );

    router.push({
      pathname:
        '/breakdown/details',

      params: {
        categoryId:
          selectedCategory.id || '',

        categoryCode:
          selectedCategory.code || '',

        categoryName:
          selectedCategory.name || '',

        categoryDescription:
          selectedCategory.description || '',

        categoryIcon:
          selectedCategory.icon || '',
      },
    });
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />

        <Text style={styles.loadingText}>
          Loading assistance options...
        </Text>
      </View>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={colors.danger}
            />
          </View>

          <Text style={styles.errorTitle}>
            Unable to Load Assistance
          </Text>

          <Text style={styles.errorMessage}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadCategories}
          >
            <Text style={styles.retryText}>
              TRY AGAIN
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Request Assistance
          </Text>

          <Text style={styles.subtitle}>
            What type of assistance do you need?
          </Text>
        </View>

      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >

        <View style={styles.intro}>
          <Text style={styles.sectionTitle}>
            Select assistance
          </Text>

          <Text style={styles.sectionSubtitle}>
            Choose the problem you're facing with
            your vehicle.
          </Text>
        </View>

        {categories.map(
          (item) => {

            const isSelected =
              selectedCategory?.id ===
              item.id;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={[
                  styles.card,
                  isSelected &&
                    styles.selectedCard,
                ]}
                onPress={() =>
                  setSelectedCategory(item)
                }
              >

                {/* ICON */}

                <View
                  style={[
                    styles.iconContainer,
                    isSelected &&
                      styles.selectedIconContainer,
                  ]}
                >
                  <Ionicons
                    name={
                      item.icon ||
                      'construct-outline'
                    }
                    size={25}
                    color={
                      isSelected
                        ? colors.white
                        : colors.accent
                    }
                  />
                </View>

                {/* INFORMATION */}

                <View
                  style={styles.cardInfo}
                >
                  <Text
                    style={
                      styles.cardTitle
                    }
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={
                      styles.cardDescription
                    }
                  >
                    {item.description}
                  </Text>
                </View>

                {/* SELECTION */}

                <View
                  style={[
                    styles.radio,
                    isSelected &&
                      styles.radioSelected,
                  ]}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={colors.white}
                    />
                  )}
                </View>

              </TouchableOpacity>
            );
          }
        )}

        <View style={styles.bottomSpace} />

      </ScrollView>

      {/* =================================================
          FOOTER
      ================================================= */}

      <View style={styles.footer}>

        <TouchableOpacity
          disabled={!selectedCategory}
          style={[
            styles.continueButton,
            !selectedCategory &&
              styles.disabledButton,
          ]}
          onPress={handleContinue}
        >

          <Text
            style={styles.continueText}
          >
            CONTINUE
          </Text>

          <Ionicons
            name="arrow-forward"
            size={19}
            color={colors.white}
          />

        </TouchableOpacity>

      </View>

    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor:
      colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor:
      colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:
      colors.border,
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontFamily:
      'InterExtraBold',
    fontSize: 22,
    color: colors.text,
  },

  subtitle: {
    fontFamily:
      'InterRegular',
    fontSize: 12,
    color:
      colors.textSecondary,
    marginTop: 3,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  intro: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontFamily:
      'InterBold',
    fontSize: 15,
    color: colors.text,
  },

  sectionSubtitle: {
    fontFamily:
      'InterRegular',
    fontSize: 11,
    color:
      colors.textSecondary,
    marginTop: 4,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.white,
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor:
      colors.border,
  },

  selectedCard: {
    borderColor:
      colors.accent,
    backgroundColor:
      '#FFF7ED',
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor:
      '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  selectedIconContainer: {
    backgroundColor:
      colors.accent,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontFamily:
      'InterBold',
    fontSize: 15,
    color: colors.text,
  },

  cardDescription: {
    fontFamily:
      'InterRegular',
    fontSize: 11,
    color:
      colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },

  radio: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor:
      colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    backgroundColor:
      colors.accent,
    borderColor:
      colors.accent,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      colors.white,
    borderTopWidth: 1,
    borderTopColor:
      colors.border,
    padding: 16,
  },

  continueButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor:
      colors.accent,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  disabledButton: {
    backgroundColor:
      '#CBD5E1',
  },

  continueText: {
    fontFamily:
      'InterBold',
    color: colors.white,
    fontSize: 13,
  },

  bottomSpace: {
    height: 20,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor:
      '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTitle: {
    marginTop: 18,
    fontFamily:
      'InterExtraBold',
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },

  errorMessage: {
    marginTop: 8,
    fontFamily:
      'InterRegular',
    fontSize: 12,
    color:
      colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  retryButton: {
    marginTop: 20,
    height: 50,
    paddingHorizontal: 30,
    borderRadius: 15,
    backgroundColor:
      colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryText: {
    fontFamily:
      'InterBold',
    fontSize: 12,
    color: colors.white,
  },
});