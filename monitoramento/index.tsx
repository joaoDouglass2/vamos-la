import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
// Ajuste o caminho conforme necessário


interface Monitoramento {
  id: string;
  data: string;
  granja: string;
  "Media Peso": string;
  Mortos: number;
  Observação: string;
}

export default function Monitoramento() {
  const [dados, setDados] = useState<Monitoramento[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const buscarDados = async () => {
    try {
      const snapshot = await getDocs(collection(db, "monitoramento"));
      const lista: Monitoramento[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Monitoramento, "id">),
      }));
      setDados(lista);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar dados de monitoramento.");
    } finally {
      setLoading(false);
    }
  };

  const deletarRegistro = async (id: string) => {
    try {
      await deleteDoc(doc(db, "monitoramento", id));
      setDados((prev) => prev.filter((item) => item.id !== id));
      Alert.alert("Sucesso", "Registro excluído.");
    } catch (error) {
      Alert.alert("Erro", "Erro ao excluir registro.");
    }
  };

  const confirmarExclusao = (id: string) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir este monitoramento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => deletarRegistro(id) },
      ]
    );
  };

  useEffect(() => {
    buscarDados();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/monitoramento/novo")}
      >
        <Text style={styles.addButtonText}>+ Adicionar Monitoramento</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Monitoramento</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={dados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onLongPress={() => confirmarExclusao(item.id)}
            >
              <Text style={styles.cardTitle}>Granja: {item.granja}</Text>
              <Text style={styles.cardText}>Data: {item.data}</Text>
              <Text style={styles.cardText}>Peso: {item["Media Peso"]}</Text>
              <Text style={styles.cardText}>Mortos: {item.Mortos}</Text>
              <Text style={styles.cardText}>Obs: {item.Observação}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  card: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 8, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cardText: { color: "#555" },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
