import { useState } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../../constants/colors';

export default function RatingScreen() {
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const submit = () => {
    router.replace('/breakdown/completed');
  };

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

        <View>

          <Text style={styles.title}>
            Rate Your Experience
          </Text>

          <Text style={styles.subtitle}>
            Your feedback matters
          </Text>

        </View>

      </View>


      <View style={styles.content}>

        <View style={styles.avatar}>

          <Ionicons
            name="person"
            size={34}
            color={colors.accent}
          />

        </View>

        <Text style={styles.heading}>
          How was your service?
        </Text>

        <Text style={styles.description}>
          Rate your experience with Kumar
        </Text>


        <View style={styles.stars}>

          {[1, 2, 3, 4, 5].map((item) => (

            <TouchableOpacity
              key={item}
              onPress={() => setRating(item)}
            >

              <Ionicons
                name={
                  item <= rating
                    ? 'star'
                    : 'star-outline'
                }
                size={41}
                color={
                  item <= rating
                    ? colors.warning
                    : colors.border
                }
              />

            </TouchableOpacity>

          ))}

        </View>


        <Text style={styles.ratingText}>
          {rating === 5
            ? 'Excellent service!'
            : rating === 4
            ? 'Very good service'
            : rating === 3
            ? 'Good service'
            : rating === 2
            ? 'Needs improvement'
            : 'Poor experience'}
        </Text>


        <Text style={styles.label}>
          ADD A COMMENT
        </Text>

        <View style={styles.inputCard}>

          <TextInput
            value={review}
            onChangeText={setReview}
            placeholder="Tell us about your experience..."
            placeholderTextColor={colors.textLight}
            multiline
            textAlignVertical="top"
            style={styles.input}
            maxLength={500}
          />

          <Text style={styles.counter}>
            {review.length}/500
          </Text>

        </View>


        <Text style={styles.label}>
          QUICK FEEDBACK
        </Text>

        <View style={styles.tags}>

          <Tag
            icon="flash-outline"
            text="Quick"
          />

          <Tag
            icon="thumbs-up-outline"
            text="Professional"
          />

          <Tag
            icon="construct-outline"
            text="Good service"
          />

        </View>


        <TouchableOpacity
          style={styles.submitButton}
          onPress={submit}
        >

          <Text style={styles.submitText}>
            SUBMIT RATING
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.white}
          />

        </TouchableOpacity>

      </View>

    </View>
  );
}

function Tag({ icon, text }) {
  return (
    <TouchableOpacity style={styles.tag}>

      <Ionicons
        name={icon}
        size={15}
        color={colors.accent}
      />

      <Text style={styles.tagText}>
        {text}
      </Text>

    </TouchableOpacity>
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

  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },

  avatar: {
    width: 74,
    height: 74,
    borderRadius: 25,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 23,
  },

  heading: {
    fontFamily: 'InterExtraBold',
    fontSize: 23,
    color: colors.text,
    marginTop: 17,
  },

  description: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  stars: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 19,
  },

  ratingText: {
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.accent,
    marginTop: 7,
    marginBottom: 22,
  },

  label: {
    width: '100%',
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.textMuted,
    marginBottom: 8,
  },

  inputCard: {
    width: '100%',
    height: 105,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 12,
  },

  input: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.text,
  },

  counter: {
    alignSelf: 'flex-end',
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textLight,
  },

  tags: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },

  tag: {
    height: 37,
    paddingHorizontal: 11,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  tagText: {
    fontFamily: 'InterMedium',
    fontSize: 10,
    color: colors.text,
  },

  submitButton: {
    width: '100%',
    height: 53,
    borderRadius: 15,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 'auto',
    marginBottom: 12,
  },

  submitText: {
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },
});
