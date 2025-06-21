import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

useEffect(() => {


  return (
    <View style={styles.container}>
      <Text style={styles.title}>BirdTrack</Text>
      <Text style={styles.subtitle}>Painel de Controle</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>   router.push("/documentos")}
      >
        <Text style={styles.cardText}>📄 Documentos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>   router.push("/monitoramento")}
      >
        <Text style={styles.cardText}>📊 Monitoramento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafd",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardText: {
    fontSize: 18,
    color: "#003366",
    fontWeight: "600",
  },
});

}, []);
