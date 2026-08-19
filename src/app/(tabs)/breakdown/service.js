
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../../constants/colors';

export default function ServiceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerInfo}>

          <Text style={styles.title}>
            Service in Progress
          </Text>

          <Text style={styles.subtitle}>
            Your vehicle is being serviced
          </Text>

        </View>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            ACTIVE
          </Text>
        </View>

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View style={styles.hero}>

          <View style={styles.heroIcon}>

            <Ionicons
              name="construct"
              size={34}
              color={colors.white}
            />

          </View>

          <Text style={styles.heroTitle}>
            Service in progress
          </Text>

          <Text style={styles.heroText}>
            Kumar is working on your vehicle.
          </Text>

        </View>


        <View style={styles.mechanicCard}>

          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={29}
              color={colors.accent}
            />
          </View>

          <View style={styles.mechanicInfo}>

            <Text style={styles.name}>
              Kumar
            </Text>

            <Text style={styles.type}>
              Roadside Mechanic
            </Text>

            <View style={styles.ratingRow}>

              <Ionicons
                name="star"
                size={13}
                color={colors.warning}
              />

              <Text style={styles.rating}>
                4.8
              </Text>

              <Text style={styles.jobs}>
                • 326 jobs
              </Text>

            </View>

          </View>

          <TouchableOpacity style={styles.callButton}>

            <Ionicons
              name="call"
              size={18}
              color={colors.white}
            />

          </TouchableOpacity>

        </View>


        <Text style={styles.sectionLabel}>
          CURRENT SERVICE
        </Text>

        <View style={styles.workCard}>

          <View style={styles.workIcon}>

            <Ionicons
              name="battery-half-outline"
              size={24}
              color={colors.serviceBattery}
            />

          </View>

          <View style={styles.workInfo}>

            <Text style={styles.workTitle}>
              Battery inspection
            </Text>

            <Text style={styles.workText}>
              Checking battery condition and electrical
              connections.
            </Text>

            <View style={styles.workingBadge}>

              <View style={styles.workingDot} />

              <Text style={styles.workingText}>
                IN PROGRESS
              </Text>

            </View>

          </View>

        </View>


        <Text style={styles.sectionLabel}>
          SERVICE STATUS
        </Text>

        <View style={styles.timelineCard}>

          <Timeline
            icon="checkmark"
            title="Request accepted"
            subtitle="Mechanic accepted your request"
            completed
          />

          <View style={styles.timelineLine} />

          <Timeline
            icon="location"
            title="Mechanic arrived"
            subtitle="Mechanic reached your location"
            completed
          />

          <View style={styles.timelineLine} />

          <Timeline
            icon="construct"
            title="Service in progress"
            subtitle="Vehicle is currently being serviced"
            active
          />

          <View style={styles.timelineLine} />

          <Timeline
            icon="checkmark-circle-outline"
            title="Service completed"
            subtitle="Waiting for service completion"
          />

        </View>


        <View style={styles.noteCard}>

          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.info}
          />

          <Text style={styles.noteText}>
            The final bill will be generated after the
            mechanic completes the service.
          </Text>

        </View>


        <TouchableOpacity
          style={styles.demoButton}
          onPress={() =>
            router.push('/breakdown/completion')
          }
        >

          <Ionicons
            name="checkmark-circle-outline"
            size={19}
            color={colors.white}
          />

          <Text style={styles.demoText}>
            SIMULATE SERVICE COMPLETION
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

function Timeline({
  icon,
  title,
  subtitle,
  completed,
  active,
}) {
  return (
    <View style={styles.timelineRow}>

      <View
        style={[
          styles.timelineIcon,
          completed && styles.timelineCompleted,
          active && styles.timelineActive,
        ]}
      >

        <Ionicons
          name={icon}
          size={14}
          color={
            completed || active
              ? colors.white
              : colors.textLight
          }
        />

      </View>

      <View style={styles.timelineInfo}>

        <Text
          style={[
            styles.timelineTitle,
            active && styles.timelineTitleActive,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.timelineSubtitle}>
          {subtitle}
        </Text>

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
    minHeight: 76,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontFamily: 'InterBold',
    fontSize: 17,
    color: colors.text,
  },

  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },

  statusBadge: {
    backgroundColor: colors.accentLight,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },

  statusText: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: colors.accent,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  hero: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 22,
  },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 27,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroTitle: {
    fontFamily: 'InterExtraBold',
    fontSize: 24,
    color: colors.text,
    marginTop: 15,
  },

  heroText: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  mechanicCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  mechanicInfo: {
    flex: 1,
  },

  name: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: colors.text,
  },

  type: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },

  rating: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: colors.text,
  },

  jobs: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
  },

  callButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginTop: 22,
    marginBottom: 9,
  },

  workCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
  },

  workIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  workInfo: {
    flex: 1,
  },

  workTitle: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
  },

  workText: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
    marginTop: 3,
  },

  workingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentLight,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },

  workingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },

  workingText: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: colors.accent,
  },

  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  timelineRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },

  timelineIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  timelineCompleted: {
    backgroundColor: colors.success,
  },

  timelineActive: {
    backgroundColor: colors.accent,
  },

  timelineInfo: {
    flex: 1,
  },

  timelineTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.textLight,
  },

  timelineTitleActive: {
    color: colors.accent,
  },

  timelineSubtitle: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },

  timelineLine: {
    height: 10,
    width: 1,
    backgroundColor: colors.border,
    marginLeft: 17,
  },

  noteCard: {
    marginTop: 17,
    backgroundColor: colors.infoLight,
    borderRadius: 15,
    padding: 13,
    flexDirection: 'row',
    gap: 9,
  },

  noteText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
  },

  demoButton: {
    height: 51,
    borderRadius: 15,
    backgroundColor: colors.primary,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  demoText: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: colors.white,
  },
});
