import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@firebase/config";

export default function NovoDocumento() {
  const [nome, setNome] = useState("");
  const [vencimento, setVencimento] = useState("");
  const router = useRouter();

  const salvarDocumento = async () => {
    if (!nome || !vencimento) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await addDoc(collection(db, "documentos"), {
        nome,
        dataVencimento: vencimento,
      });
      Alert.alert("Sucesso", "Documento cadastrado com sucesso");
      router.replace("/documentos" as any);
    } catch (error) {
      Alert.alert("Erro", "Erro ao cadastrar documento");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Documento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Documento"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de Vencimento (ex: 2025-12-31)"
        value={vencimento}
        onChangeText={setVencimento}
      />

      <TouchableOpacity style={styles.button} onPress={salvarDocumento}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#003366",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
