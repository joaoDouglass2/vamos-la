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

interface Documento {
  id: string;
  nome: string;
  dataVencimento: string;
}

export default function Documentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const buscarDocumentos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "documentos"));
      const lista: Documento[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Documento, "id">),
      }));
      setDocumentos(lista);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar documentos.");
    } finally {
      setLoading(false);
    }
  };

  const deletarDocumento = async (id: string) => {
    try {
      await deleteDoc(doc(db, "documentos", id));
      setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
      Alert.alert("Sucesso", "Documento deletado com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Erro ao deletar documento.");
    }
  };

  const confirmarExclusao = (id: string) => {
  Alert.alert(
  "Confirmação",
  "Tem certeza que deseja excluir este documento?",
  [
    { text: "Cancelar", style: "cancel" },
    { text: "Excluir", style: "destructive", onPress: () => deletarDocumento(id) },
  ]
);

  };

  useEffect(() => {
    buscarDocumentos();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/documentos/novo")}
      >
        <Text style={styles.addButtonText}>+ Adicionar Documento</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Documentos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={documentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onLongPress={() => confirmarExclusao(item.id)}
            >
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardText}>Vencimento: {item.dataVencimento}</Text>
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
    backgroundColor: "#007bff",
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
