import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@firebase/config";
import { useRouter } from "expo-router";

type RegistroMonitoramento = {
  id?: string;
  data: string;
  granja: string;
  "Media Peso": string;
  Mortos: number;
  "Observação": string;
};

export default function MonitoramentoScreen() {
  const [registros, setRegistros] = useState<RegistroMonitoramento[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const buscarRegistros = async () => {
    try {
      const snapshot = await getDocs(collection(db, "monitoramento"));
      const dados: RegistroMonitoramento[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as RegistroMonitoramento[];

      setRegistros(dados);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar registros.");
    } finally {
      setLoading(false);
    }
  };

  const deletarRegistro = async (id?: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "monitoramento", id));
      setRegistros((prev) => prev.filter((r) => r.id !== id));
      Alert.alert("Sucesso", "Registro deletado com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Erro ao deletar registro.");
    }
  };

  const deletarRegistroComConfirmacao = (id?: string) => {
    if (!id) return;

    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: () => deletarRegistro(id),
        },
      ]
    );
  };

  useEffect(() => {
    buscarRegistros();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/monitoramento/novo")}
      >
        <Text style={styles.addButtonText}>+ Novo Monitoramento</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Monitoramento de Produção</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={registros}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onLongPress={() => deletarRegistroComConfirmacao(item.id)}
            >
              <Text style={styles.cardTitle}>{item.granja}</Text>
              <Text>Data: {item.data}</Text>
              <Text>Mortos: {item.Mortos}</Text>
              <Text>Média Peso: {item["Media Peso"]}</Text>
              <Text>Observação: {item["Observação"]}</Text>
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
