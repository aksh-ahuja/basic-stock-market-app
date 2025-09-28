export default {
  expo: {
    name: "Stock Explore",
    slug: "stock-explore",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.paasa.stockexplore"
    },
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      eas: {
        projectId: "2351bafa-e4cd-4ddd-84e4-9208d16c9813"
      }
    }
  }
};