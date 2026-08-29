import { Image, StyleSheet, View } from "react-native";

import { StatusBar } from "expo-status-bar";

export default function LaunchScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Image
        source={require("../../assets/images/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#F4F8FF",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: "100%",
    height: "100%",
  },
});
