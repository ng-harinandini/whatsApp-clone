import { Redirect } from "expo-router";

export default function Entry() {
  const isLoggedIn = false; // TODO: replace with actual auth logic

  return isLoggedIn ? (
    <Redirect href="/(protected)/(tabs)" />
  ) : (
    <Redirect href="/(public)" />
  );
}
