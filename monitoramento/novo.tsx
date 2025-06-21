import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useRouter } from "expo-router";

export default function NovoMonitoramento() {
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [granja, setGranja] = useState("");
  const [mediaPeso, setMediaPeso] = useState("");
  const [mortos, setMortos] = useState("");
  const [observacao, setObservacao] = useState("");

  const router = useRouter();

  const salvar = async () => {
    if (!granja || !mediaPeso || !mortos || !data) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await addDoc(collection(db, "monitoramento"), {
        data,
        granja,
        "Media Peso": mediaPeso,
        Mortos: parseInt(mortos),
        Observação: observacao,
      });

      Alert.alert("Sucesso", "Registro salvo com sucesso!");
      router.replace("/monitoramento");
    } catch (error) {
      Alert.alert("Erro", "Erro ao salvar registro.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Monitoramento</Text>

      <TextInput
        style={styles.input}
        placeholder="Data"
        value={data}
        onChangeText={setData}
      />

      <TextInput
        style={styles.input}
        placeholder="Granja"
        value={granja}
        onChangeText={setGranja}
      />

      <TextInput
        style={styles.input}
        placeholder="Média de Peso"
        value={mediaPeso}
        onChangeText={setMediaPeso}
        keyboardType="decimal-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Número de Mortos"
        value={mortos}
        onChangeText={setMortos}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Observações"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#003366",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
