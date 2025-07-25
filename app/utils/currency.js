import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const countryToCurrency = {
  IN: "₹", // India
  US: "$", // United States
  GB: "£", // United Kingdom
  EU: "€", // European Union
  JP: "¥", // Japan
  CN: "¥", // China
  KR: "₩", // South Korea
  RU: "₽", // Russia
  AE: "د.إ", // United Arab Emirates
  SA: "﷼", // Saudi Arabia
  AU: "A$", // Australia
  CA: "C$", // Canada
  NZ: "NZ$", // New Zealand
  SG: "S$", // Singapore
  HK: "HK$", // Hong Kong
  CH: "CHF", // Switzerland
  SE: "kr", // Sweden
  NO: "kr", // Norway
  DK: "kr", // Denmark
  PL: "zł", // Poland
  BR: "R$", // Brazil
  MX: "Mex$", // Mexico
  ID: "Rp", // Indonesia
  TH: "฿", // Thailand
  MY: "RM", // Malaysia
  PK: "₨", // Pakistan
  BD: "৳", // Bangladesh
  NG: "₦", // Nigeria
  EG: "E£", // Egypt
  ZA: "R", // South Africa
  TR: "₺", // Turkey
  IL: "₪", // Israel
  KE: "KSh", // Kenya
  GH: "₵", // Ghana
  PH: "₱", // Philippines
  AR: "$", // Argentina
  CL: "CLP$", // Chile
  CO: "$", // Colombia
  VN: "₫", // Vietnam
  CZ: "Kč", // Czech Republic
  HU: "Ft", // Hungary
  RO: "lei", // Romania
  UA: "₴", // Ukraine
};

const CURRENCY_KEY = "user_currency_symbol";

export const getCurrencySymbolByLocation = async () => {
  try {
    const cachedCurrency = await AsyncStorage.getItem(CURRENCY_KEY);

    if (cachedCurrency !== null) {
      return cachedCurrency;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return "$";
    }

    let location = await Location.getCurrentPositionAsync({});
    let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);

    if (reverseGeocode.length > 0) {
      let country = reverseGeocode[0].isoCountryCode;
      console.log("Detected Country:", country);

      let currencySymbol = countryToCurrency[country] || "$";

      await AsyncStorage.setItem(CURRENCY_KEY, currencySymbol);

      return currencySymbol;
    }

    return "$";
  } catch (error) {
    console.log("Error getting location:", error);
    return "$";
  }
};
