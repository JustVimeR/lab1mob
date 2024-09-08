import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';

const TabTwoScreen = () => {
  const [text, setText] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [method, setMethod] = useState<string>('caesar');
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const caesarCipher = (str: string, shift: number): string => {
    return str.replace(/[a-z]/gi, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26) + start);
    });
  };

  const xorCipher = (str: string, key: number): string => {
    return str.split('').map(char => String.fromCharCode(char.charCodeAt(0) ^ key)).join('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/data');
        const data = response.data;

        setChartData(data.map((entry: { text: string }) => entry.text.length));
        setLabels(data.map((_: any, index: number) => `Текст ${index + 1}`));
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
      }
    };

    fetchData();
  }, []); 

  const handleEncrypt = async () => {
    let encryptedText = '';

    if (method === 'caesar') {
      const shift = parseInt(key);
      encryptedText = caesarCipher(text, shift);
    } else if (method === 'xor') {
      const xorKey = parseInt(key);
      encryptedText = xorCipher(text, xorKey);
    }

    try {
      await axios.post('http://localhost:3000/save', {
        text: encryptedText,
        method,
        key
      });
      setResult(`Зашифрований текст (${method}): ${encryptedText}`);

      setChartData((prevData) => [...prevData, encryptedText.length]);
      setLabels((prevLabels) => [...prevLabels, `Текст ${labels.length + 1}`]);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrypt = async () => {
    try {
      const response = await axios.post('http://localhost:3000/decrypt', {
        text,
        method,
        key
      });

      if (response.data.decrypted) {
        let decryptedText = '';

        if (method === 'caesar') {
          const shift = parseInt(key);
          decryptedText = caesarCipher(text, -shift);
        } else if (method === 'xor') {
          const xorKey = parseInt(key);
          decryptedText = xorCipher(text, xorKey);
        }

        setResult(`Розшифрований текст: ${decryptedText}`);
      } else {
        Alert.alert('Текст не знайдено в базі');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Помилка при розшифруванні');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Введіть текст для шифрування/дешифрування:</Text>
      <TextInput
        style={styles.input}
        placeholder="Введіть текст"
        value={text}
        onChangeText={setText}
      />
      <TextInput
        style={styles.input}
        placeholder="Введіть ключ"
        keyboardType="numeric"
        value={key}
        onChangeText={setKey}
      />

      <Text>Виберіть метод шифрування:</Text>
      <Picker
        selectedValue={method}
        style={styles.picker}
        onValueChange={(itemValue: string) => setMethod(itemValue)}
      >
        <Picker.Item label="Цезар" value="caesar" />
        <Picker.Item label="XOR" value="xor" />
      </Picker>

      <Button title="Зашифрувати" onPress={handleEncrypt} />
      <Button title="Розшифрувати" onPress={handleDecrypt} />
      <Text>{result}</Text>

      {chartData.length > 0 && (
        <BarChart
          data={{
            labels: labels,
            datasets: [{ data: chartData }]
          }}
          width={300}
          height={200}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
          }}
          style={{ marginVertical: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});

export default TabTwoScreen;
