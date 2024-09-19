import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useEncryption } from '../../hooks/useEncryption';
import { useChartData } from '../../hooks/useChartData';

const TabTwoScreen = () => {
  const [text, setText] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [method, setMethod] = useState<string>('caesar');
  const [texts, setTexts] = useState<any[]>([]); 
  const [selectedText, setSelectedText] = useState<string>(''); 
  const { result, encrypt, decrypt } = useEncryption();
  const { chartData, labels, addData } = useChartData();

  const fetchTexts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/data');
      setTexts(response.data);
    } catch (error) {
      console.error('Помилка при завантаженні текстів:', error);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const handleEncrypt = async () => {
    await encrypt(text, key, method);
    addData(text.length);
  };

  const handleDecrypt = async () => {
    await decrypt(text, key, method);
  };

  const handleDelete = async () => {
    if (!selectedText) {
      Alert.alert('Помилка', 'Виберіть текст для видалення');
      return;
    }

    const [selectedEntry] = texts.filter(entry => entry.text === selectedText);

    if (!selectedEntry) {
      Alert.alert('Помилка', 'Текст не знайдено');
      return;
    }

    try {
      await axios.delete('http://localhost:3000/delete', {
        data: { text: selectedEntry.text, method: selectedEntry.method, key: selectedEntry.key },
      });
      Alert.alert('Успіх', 'Текст успішно видалено');
      fetchTexts();
    } catch (error) {
      console.error('Помилка при видаленні тексту:', error);
      Alert.alert('Помилка', 'Текст не вдалося видалити');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Введіть текст для шифрування/дешифрування:</Text>
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

      <Text style={styles.text}>Виберіть метод шифрування:</Text>
      <Picker
        selectedValue={method}
        style={styles.picker}
        onValueChange={(itemValue: string) => setMethod(itemValue)}
      >
        <Picker.Item label="Цезар" value="caesar" />
        <Picker.Item label="XOR" value="xor" />
      </Picker>
      <View style={styles.buttonContainer}>
        <Button title="Зашифрувати" onPress={handleEncrypt} />
        <Button title="Розшифрувати" onPress={handleDecrypt} />
      </View>
      <Text style={styles.text}>{result}</Text>

      {chartData.length > 0 && (
        <PieChart
          data={
            labels.map((label, index) => ({
              name: label,
              population: chartData[index],
              color: `rgba(0, ${index * 50}, ${index * 100}, 1)`,
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            }))
          }
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      )}

      <Text style={styles.text}>Виберіть текст для видалення:</Text>
      <Picker
        selectedValue={selectedText}
        style={styles.picker}
        onValueChange={(itemValue: string) => setSelectedText(itemValue)}
      >
        {texts.map((entry, index) => (
          <Picker.Item key={index} label={entry.text} value={entry.text} />
        ))}
      </Picker>
      <Button title="Видалити текст" onPress={handleDelete} />
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
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
