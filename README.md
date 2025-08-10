
# Calculadora de Curto-Circuito Trifásico ⚡

Aplicativo em **React Native** (compatível com **Expo**) para cálculo de correntes e potências de curto-circuito em redes elétricas trifásicas de alta tensão.  
Permite simular três tipos de falta:

- **Três fases (LLL)**
- **Duas fases (LL)**
- **Fase-Terra (LG)**


## 📦 Funcionalidades

- Entrada de dados:
  - Tensão **linha-linha** (*kV*)
  - Impedâncias **Z₁**, **Z₂** e **Z₀** (*Ω*)
- Escolha do tipo de curto-circuito via **Radio Button**
- Cálculo automático de:
  - Corrente de curto-circuito em **A** e **kA**
  - Potência de curto em **MVA**
- Interface simples e responsiva para dispositivos móveis

---

## 🛠️ Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- JavaScript (ES6+)

---

## 🚀 Como executar

### 1. Clonar o repositório
```bash
git clone https://github.com/vitor-souza-ime/cc.git
cd cc
````

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar no Expo

```bash
npx expo start
```

Escaneie o QR code no seu celular usando o aplicativo **Expo Go** (disponível na Google Play Store e App Store).

---

## 📄 Fórmulas utilizadas

### Curto-Circuito Trifásico (LLL)

$$
I_{fault} = \frac{V_{LL}}{\sqrt{3} \times Z_1}
$$

### Curto-Circuito Duas Fases (LL)

$$
I_{fault} = \frac{\sqrt{3} \times V_{LL}}{Z_1 + Z_2}
$$

### Curto-Circuito Fase-Terra (LG)

$$
I_{fault} = \frac{\sqrt{3} \times V_{LL}}{Z_1 + Z_2 + Z_0}
$$

---

## 📂 Estrutura de Arquivos

```
.
├── main.js        # Código principal do aplicativo
├── package.json   # Dependências e scripts
└── README.md      # Este arquivo
```

---

## 📜 Licença

Este projeto é distribuído sob a licença MIT.
Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---
