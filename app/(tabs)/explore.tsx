import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { useEncryption } from '../../hooks/useEncryption';
import { useChartData } from '../../hooks/useChartData';

const TabTwoScreen = () => {
  const [text, setText] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [method, setMethod] = useState<string>('caesar');
  const { result, encrypt, decrypt } = useEncryption();
  const { chartData, labels, addData } = useChartData();

  const handleEncrypt = async () => {
    await encrypt(text, key, method);
    addData(text.length);
  };

  const handleDecrypt = async () => {
    await decrypt(text, key, method);
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 6
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
