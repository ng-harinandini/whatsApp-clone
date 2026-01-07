import { AntDesign, Feather, FontAwesome6 } from "@expo/vector-icons";
import {
    CameraMode,
    CameraType,
    CameraView,
    useCameraPermissions,
    useMicrophonePermissions,
} from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import styles from "./styles";

function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [isVideoRecording, setIsVideoRecording] = useState<boolean>(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const ref = useRef<CameraView | null>(null);
  const [currentMode, setCurrentMode] = useState<CameraMode>("picture");

  useEffect(() => {
    if (permission?.status === "undetermined") {
      requestPermission();
    }
    if (micPermission?.status === "undetermined") {
      requestMicPermission();
    }
  }, [permission?.status, micPermission?.status]);

  if (
    !permission ||
    !permission.granted ||
    !micPermission ||
    !micPermission.granted
  ) {
    return (
      <View style={styles.ccontainer}>
        <Text style={{ textAlign: "center", marginBottom: 6 }}>
          We need your permission to use the camera and video
        </Text>
        {permission?.canAskAgain ? (
          <Button
            title="Grant permission"
            onPress={() => {
              requestPermission();
              requestMicPermission();
            }}
            color="#25D366"
          />
        ) : (
          <Text style={{ textAlign: "center", color: "#25D366" }}>
            Enable camera permission from app settings
          </Text>
        )}
      </View>
    );
  }

  const toggleMode = () => {
    setCurrentMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    // if (photo?.uri) setUri(photo.uri);
    console.log(photo?.uri);
  };

  const recordVideo = async () => {
    if (isVideoRecording) {
      setIsVideoRecording(false);
      ref.current?.stopRecording();
      return;
    }
    setIsVideoRecording(true);
    const video = await ref.current?.recordAsync();
    console.log({ video });
  };
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={currentMode}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      />
      <View style={styles.shutterContainer}>
        <Pressable onPress={toggleMode}>
          {currentMode === "picture" ? (
            <AntDesign name="picture" size={24} color="white" />
          ) : (
            <Feather name="video" size={24} color="white" />
          )}
        </Pressable>
        <Pressable
          onPress={currentMode === "picture" ? takePicture : recordVideo}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.shutterBtn,
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.shutterBtnInner,
                  currentMode === "video" &&
                    isVideoRecording &&
                    styles.recording,
                  {
                    backgroundColor:
                      currentMode === "picture"
                        ? "white"
                        : isVideoRecording
                        ? "darkred"
                        : "red",
                  },
                ]}
              />
            </View>
          )}
        </Pressable>
        <Pressable onPress={toggleFacing}>
          <FontAwesome6 name="rotate-left" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

export default CameraScreen;
