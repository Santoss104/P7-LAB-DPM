import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";

const { width } = Dimensions.get("window");

interface LoginResponse {
  message: string;
  data: {
    token: string;
  };
}

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Validasi input
    if (!username || !password) {
      setDialogMessage("Username and password are required");
      setIsSuccess(false);
      setDialogVisible(true);
      return;
    }

    try {
      console.log("Sending login request with:", { username, password });

      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      if (response.data && response.data.data && response.data.data.token) {
        const { token } = response.data.data;
        await AsyncStorage.setItem("token", token);

        setDialogMessage(response.data.message || "Login successful!");
        setIsSuccess(true);
        setDialogVisible(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "An error occurred during login";

      if (error.response) {
        // Error dari server
        if (error.response.status === 401) {
          errorMessage = "Invalid username or password";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Error koneksi
        errorMessage = "Network error. Please check your connection";
      }

      setDialogMessage(errorMessage);
      setIsSuccess(false);
      setDialogVisible(true);
    }
  };

  const handleDialogDismiss = () => {
    setDialogVisible(false);
    if (isSuccess) {
      router.replace("/(tabs)");
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ThemedView style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Log in to continue</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                (!username || !password) && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={!username || !password}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/auth/RegisterScreen")}
            >
              <Text style={styles.registerButtonText}>Create New Account</Text>
            </TouchableOpacity>
          </View>

          <Portal>
            <Dialog
              visible={dialogVisible}
              onDismiss={handleDialogDismiss}
              style={styles.dialog}
            >
              <Dialog.Title style={styles.dialogTitle}>
                {isSuccess ? "Success" : "Login Failed"}
              </Dialog.Title>
              <Dialog.Content>
                <Text style={styles.dialogMessage}>{dialogMessage}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={handleDialogDismiss}
                  style={styles.dialogButton}
                >
                  OK
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ThemedView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    marginTop: 200,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    marginTop: 40,
    marginBottom: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#666",
    letterSpacing: 0.3,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 55,
    borderColor: "#e0e0e0",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  loginButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#2563eb", // Tailwind blue-600
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  registerButton: {
    width: "100%",
    height: 55,
    borderWidth: 2,
    borderColor: "#2563eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  registerButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  dialog: {
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  dialogTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  dialogMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  dialogButton: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#93c5fd",
    shadowOpacity: 0.1,
  },
});
