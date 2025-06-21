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
import { api, Documento } from "@/services/api";

export default function Documentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const buscarDocumentos = async () => {
    try {
      const dados = await api.getDocumentos();
      setDocumentos(dados);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar documentos.");
    } finally {
      setLoading(false);
    }
  };

  const deletarDocumento = async (id?: string) => {
    if (!id) return;
    try {
      await api.deleteDocumento(id);
      setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
      Alert.alert("Sucesso", "Documento deletado com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Erro ao deletar documento.");
    }
  };

  const deletarDocumentoComConfirmacao = (id?: string) => {
    if (!id) return;

    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir este docume
