module.exports = ({ config }) => {
  return {
    ...config,

    plugins: [
      ...(config.plugins || []),

      [
        "react-native-maps",
        {
          androidGoogleMapsApiKey:
            process.env.GOOGLE_MAPS_API_KEY || "",
        },
      ],
    ],
  };
};