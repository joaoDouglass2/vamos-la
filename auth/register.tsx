import { useState } from "react";
import {
import { useEffect } from "react";
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

useEffect(() => {


  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        email,
      });

      Alert.alert("Sucesso", "Conta criada com sucesso!");
        router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert("Erro", "Erro ao registrar. Verifique os dados.");
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Criar Conta</Text>
        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", backgroundColor: "#fff" },
  overlay: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#003366", textAlign: "center", marginBottom: 24 },
  input: { backgroundColor: "#f2f2f2", borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: "#003366", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

}, []);
