import { Redirect } from "expo-router";

const isLoggedIn = false; // TODO: replace with actual auth logic

export default function Entry() {
  return isLoggedIn ? (
    <Redirect href="/(protected)/(tabs)" />
  ) : (
    <Redirect href="/(public)" />
  );
}
