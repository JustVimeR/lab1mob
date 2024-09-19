import { StyleSheet, Text, View, Image } from 'react-native';

export default function HomeScreen() {
  return (
   <View style={styles.container}>
    <Image source={require('../../assets/images/Anya_forger.webp')} style={styles.image} />
    <Text style={styles.text}>Лабораторна робота 1</Text>
    <Text style={styles.text}>З навчального курсу «Розробка ПЗ під мобільні платформи»</Text>
    <Text style={styles.text}>Шифрування тексту методами Цезаря та XOR</Text>

    <Text style={styles.text}>Роботу виконав</Text>
    <Text style={styles.text}>Студент 4-го курсу групи ТТП-41</Text>
    <Text style={styles.text}>Таран Владислав</Text>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 290,
    height: 178,
    marginBottom: 20,
  },
});
