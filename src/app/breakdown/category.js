import { useState } from 'react';

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../constants/colors';

export default function BreakdownCategoryScreen() {
  const router = useRouter();

  const [selected, setSelected] = useState(null);

  const categories = [
    {
      id: 'tyre',
      title: 'Tyre / Puncture',
      description: 'Flat tyre, puncture or tyre damage',
      icon: 'speedometer-outline',
    },
    {
      id: 'battery',
      title: 'Battery',
      description: 'Battery dead or starting problem',
      icon: 'battery-half-outline',
    },
    {
      id: 'fuel',
      title: 'Fuel',
      description: 'Fuel empty or fuel-related issue',
      icon: 'flame-outline',
    },
    {
      id: 'mechanical',
      title: 'Mechanical',
      description: 'Engine or mechanical breakdown',
      icon: 'construct-outline',
    },
    {
      id: 'electrical',
      title: 'Electrical',
      description: 'Electrical or wiring issue',
      icon: 'flash-outline',
    },
    {
      id: 'towing',
      title: 'Towing',
      description: 'Vehicle needs to be towed',
      icon: 'car-outline',
    },
  ];

  return (
    <View style={styles.container}>
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
            What's wrong?
          </Text>

          <Text style={styles.subtitle}>
            Select the type of assistance you need
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {categories.map((item) => {
          const isSelected = selected === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={[
                styles.card,
                isSelected && styles.selectedCard,
              ]}
              onPress={() => setSelected(item.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={25}
                  color={
                    isSelected
                      ? colors.white
                      : colors.accent
                  }
                />
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text style={styles.cardDescription}>
                  {item.description}
                </Text>
              </View>

              <View
                style={[
                  styles.radio,
                  isSelected && styles.radioSelected,
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
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!selected}
          style={[
            styles.continueButton,
            !selected && styles.disabledButton,
          ]}
          onPress={() =>
            router.push('/breakdown/details')
          }
        >
          <Text style={styles.continueText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },

  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  selectedCard: {
    borderColor: colors.accent,
    backgroundColor: '#FFF7ED',
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  selectedIconContainer: {
    backgroundColor: colors.accent,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },

  cardDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },

  radio: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },

  continueButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  disabledButton: {
    backgroundColor: '#CBD5E1',
  },

  continueText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});