import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  ActivityIndicator,
  Button,
  Dialog,
  PaperProvider,
  Portal,
  Text,
  Surface,
  Avatar,
  IconButton,
} from "react-native-paper";
import { BlurView } from "expo-blur";
import API_URL from "@/config/config";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

type UserProfile = {
  username: string;
  email: string;
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    startLoadingAnimation();
  }, []);

  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 15,
          mass: 1,
          stiffness: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 15,
          mass: 1,
          stiffness: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get<{ data: UserProfile }>(
        `${API_URL}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setDialogVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/auth/LoginScreen");
  };

  if (loading) {
    return (
      <PaperProvider>
        <ThemedView style={styles.loadingContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <ActivityIndicator size="large" color="#2193b0" animating={true} />
          </Animated.View>
        </ThemedView>
      </PaperProvider>
    );
  }

  const AnimatedSurface = Animated.createAnimatedComponent(Surface);

  return (
    <PaperProvider>
      <ThemedView style={styles.container}>
        <AnimatedSurface
          style={[
            styles.profileCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateY }, { scale: scaleAnim }],
            },
          ]}
        >
          {profile ? (
            <>
              <ThemedView style={styles.avatarContainer}>
                <Avatar.Text
                  size={80}
                  label={profile.username.substring(0, 2).toUpperCase()}
                  style={styles.avatar}
                  labelStyle={styles.avatarLabel}
                />
              </ThemedView>
              <ThemedText style={styles.title}>Welcome back!</ThemedText>
              <ThemedText style={styles.subtitle}>
                {profile.username}
              </ThemedText>

              <ThemedView style={styles.infoContainer}>
                <ThemedView style={styles.infoRow}>
                  <IconButton
                    icon="account"
                    size={24}
                    iconColor="#2193b0"
                    style={styles.infoIcon}
                  />
                  <ThemedView style={styles.infoContent}>
                    <ThemedText style={styles.label}>Username</ThemedText>
                    <ThemedText style={styles.value}>
                      {profile.username}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.infoRow}>
                  <IconButton
                    icon="email"
                    size={24}
                    iconColor="#2193b0"
                    style={styles.infoIcon}
                  />
                  <ThemedView style={styles.infoContent}>
                    <ThemedText style={styles.label}>Email</ThemedText>
                    <ThemedText style={styles.value}>
                      {profile.email}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>

              <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.logoutButton}
                contentStyle={styles.logoutButtonContent}
                labelStyle={styles.logoutButtonLabel}
                icon="logout"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <ThemedText style={styles.noDataText}>
              No profile data available
            </ThemedText>
          )}
        </AnimatedSurface>

        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
            style={styles.dialog}
          >
            <BlurView intensity={100} style={StyleSheet.absoluteFill} />
            <Dialog.Title style={styles.dialogTitle}>Sign Out</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogContent}>
                Are you sure you want to sign out?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => setDialogVisible(false)}
                textColor="#666"
                style={styles.dialogButton}
              >
                Cancel
              </Button>
              <Button
                onPress={confirmLogout}
                mode="contained"
                style={styles.dialogConfirmButton}
              >
                Sign Out
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ThemedView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 150 : 40,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  profileCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: "#2193b0",
    elevation: 8,
    shadowColor: "#2193b0",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarLabel: {
    fontSize: 28,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    letterSpacing: 0.3,
  },
  infoContainer: {
    marginBottom: 32,
  },
  infoRow: {
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 12,
    backgroundColor: "rgba(33, 147, 176, 0.1)",
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#e74c3c",
    elevation: 4,
    shadowColor: "#e74c3c",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoutButtonContent: {
    height: 48,
    paddingHorizontal: 8,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
  dialog: {
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    elevation: 24,
    overflow: "hidden",
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
  },
  dialogContent: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "center",
  },
  dialogButton: {
    marginRight: 12,
    borderRadius: 8,
  },
  dialogConfirmButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
  },
});

export default ProfileScreen;