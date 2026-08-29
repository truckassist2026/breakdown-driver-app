import { Image, StyleSheet, View } from "react-native";

import { StatusBar } from "expo-status-bar";

export default function LaunchScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Image
        source={require("../../assets/images/splash-icon.png")}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FF",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});
