import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
        email,
      });
      router.replace("/auth/LoginScreen");
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || "An error occurred";
      setDialogMessage(errorMessage);
      setDialogVisible(true);
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
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subtitle}>Join us and get started</Text>

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
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/auth/LoginScreen")}
            >
              <Text style={styles.loginButtonText}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View>

          <Portal>
            <Dialog
              visible={dialogVisible}
              onDismiss={() => setDialogVisible(false)}
              style={styles.dialog}
            >
              <Dialog.Title style={styles.dialogTitle}>
                Registration Failed
              </Dialog.Title>
              <Dialog.Content>
                <Text style={styles.dialogMessage}>{dialogMessage}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setDialogVisible(false)}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
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
  registerButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#2563eb",
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
  registerButtonText: {
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
  loginButton: {
    width: "100%",
    height: 55,
    borderWidth: 2,
    borderColor: "#2563eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loginButtonText: {
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
});