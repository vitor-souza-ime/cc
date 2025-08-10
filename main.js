// App.js
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";

/*
  App simples para calcular correntes e MVA de curto-circuito trifásico (Expo).
  Tipos: 3 fases (LLL), 2 fases (LL), fase-terra (LG).
  Entradas:
    - Vll (kV) -> convertido para V
    - Z1, Z2, Z0 (ohms)
*/

const RadioOption = ({ label, value, selected, onPress }) => (
  <TouchableOpacity style={styles.radioRow} onPress={() => onPress(value)}>
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function App() {
  const [tipo, setTipo] = useState("LLL"); // "LLL", "LL", "LG"
  const [vll, setVll] = useState("220"); // kV default example (220 kV)
  const [z1, setZ1] = useState("0.05");
  const [z2, setZ2] = useState("0.05");
  const [z0, setZ0] = useState("0.15");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  function parseNumber(str) {
    if (!str) return NaN;
    // aceita vírgula ou ponto
    return Number(str.replace(",", "."));
  }

  function calcular() {
    setErro("");
    setResultado(null);

    const Vll_kV = parseNumber(vll);
    const Z1 = parseNumber(z1);
    const Z2 = parseNumber(z2);
    const Z0 = parseNumber(z0);

    if (isNaN(Vll_kV) || Vll_kV <= 0) {
      setErro("Informe uma tensão VLL válida (>0).");
      return;
    }
    if (isNaN(Z1) || Z1 <= 0) {
      setErro("Informe Z1 válida (>0).");
      return;
    }
    if ((tipo === "LL" || tipo === "LG") && (isNaN(Z2) || Z2 <= 0)) {
      setErro("Informe Z2 válida (>0) para este tipo de falta.");
      return;
    }
    if (tipo === "LG" && (isNaN(Z0) || Z0 <= 0)) {
      setErro("Informe Z0 válida (>0) para falta fase-terra.");
      return;
    }

    // converter kV para V
    const Vll = Vll_kV * 1000;
    const sqrt3 = Math.sqrt(3);

    let Icc_A = 0;

    if (tipo === "LLL") {
      // Falta Trifásica: I = Vll / (sqrt(3) * Z1)
      Icc_A = Vll / (sqrt3 * Z1);
    } else if (tipo === "LL") {
      // Falta Bifásica: I = (√3/2) * Vll / (Z1 + Z2) = Vll / (2 * (Z1 + Z2) / √3)
      Icc_A = Vll / (2 * (Z1 + Z2) / sqrt3);
    } else if (tipo === "LG") {
      // Falta Fase-Terra: I = 3 * Vf / (Z1 + Z2 + Z0) = √3 * Vll / (Z1 + Z2 + Z0)
      Icc_A = (sqrt3 * Vll) / (Z1 + Z2 + Z0);
    }

    // potência de curto em MVA: S = sqrt(3) * Vll * I (V in kV -> usar V in kV * I to get kVA?)
    // Aqui Vll é em volts; S_VA = sqrt(3) * Vll * Icc_A
    const S_VA = sqrt3 * Vll * Icc_A;
    const S_MVA = S_VA / 1e6;

    setResultado({
      tipo,
      I_kA: Icc_A / 1000,
      I_A: Icc_A,
      S_MVA,
      detalhes: {
        Vll_kV,
        Z1,
        Z2,
        Z0,
      },
    });
  }

  function limpar() {
    setVll("");
    setZ1("");
    setZ2("");
    setZ0("");
    setResultado(null);
    setErro("");
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Calculadora de Curto-Circuito</Text>

        <Text style={styles.sectionTitle}>Tipo de falta</Text>
        <RadioOption label="Três fases (LLL)" value="LLL" selected={tipo === "LLL"} onPress={setTipo} />
        <RadioOption label="Duas fases (LL)" value="LL" selected={tipo === "LL"} onPress={setTipo} />
        <RadioOption label="Fase - Terra (LG)" value="LG" selected={tipo === "LG"} onPress={setTipo} />

        <Text style={styles.sectionTitle}>Entradas</Text>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Tensão linha-linha (kV)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={vll}
            onChangeText={setVll}
            placeholder="ex: 220"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Z₁ (Ω)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={z1} onChangeText={setZ1} placeholder="ex: 0.05" />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Z₂ (Ω)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={z2}
            onChangeText={setZ2}
            placeholder="ex: 0.05"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Z₀ (Ω)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={z0}
            onChangeText={setZ0}
            placeholder="ex: 0.15"
          />
        </View>

        {erro ? <Text style={styles.error}>{erro}</Text> : null}

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.button} onPress={calcular}>
            <Text style={styles.buttonText}>Calcular</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={limpar}>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Limpar</Text>
          </TouchableOpacity>
        </View>

        {resultado && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Resultado</Text>
            <Text>Tipo de falta: {resultado.tipo}</Text>
            <Text>Corrente de curto: {resultado.I_A.toFixed(2)} A ({resultado.I_kA.toFixed(3)} kA)</Text>
            <Text>Potência de curto: {resultado.S_MVA.toFixed(3)} MVA</Text>

            <View style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "600" }}>Detalhes de cálculo:</Text>
              <Text>VLL: {resultado.detalhes.Vll_kV} kV</Text>
              <Text>Z1: {resultado.detalhes.Z1} Ω</Text>
              <Text>Z2: {resultado.detalhes.Z2} Ω</Text>
              <Text>Z0: {resultado.detalhes.Z0} Ω</Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "700",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: "#1766A0",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1766A0",
  },
  radioLabel: {
    fontSize: 16,
  },
  inputRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: "#1766A0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  buttonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1766A0",
    marginRight: 0,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonTextSecondary: {
    color: "#1766A0",
  },
  resultBox: {
    marginTop: 18,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  resultTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },
  error: {
    color: "#b00020",
    marginTop: 6,
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    color: "#444",
  },
});
