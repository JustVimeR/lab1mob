import { useState } from 'react';
import axios from 'axios';

const caesarCipher = (str: string, shift: number): string => {
  const alphabetUA = 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ';
  const alphabetEN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return str.split('').map((char) => {
    if (/[A-Z]/.test(char)) {
      return shiftChar(char, shift, alphabetEN);
    }
    if (/[a-z]/.test(char)) {
      return shiftChar(char, shift, alphabetEN.toLowerCase());
    }
    if (/[А-Я]/.test(char)) {
      return shiftChar(char, shift, alphabetUA);
    }
    if (/[а-я]/.test(char)) {
      return shiftChar(char, shift, alphabetUA.toLowerCase());
    }
    return char;
  }).join('');
};

const shiftChar = (char: string, shift: number, alphabet: string): string => {
  const index = alphabet.indexOf(char);
  if (index === -1) return char;
  const newIndex = (index + shift + alphabet.length) % alphabet.length;
  return alphabet[newIndex];
};

const caesarDecipher = (str: string, shift: number): string => {
  return caesarCipher(str, -shift);
};

  
const xorCipher = (str: string, key: number): string => {
  return str.split('').map(char => String.fromCharCode(char.charCodeAt(0) ^ key)).join('');
};

export const useEncryption = () => {
  const [result, setResult] = useState<string>('');

  const encrypt = async (text: string, key: string, method: string) => {
    if (!text.trim()) {
      alert('Текст для шифрування не може бути порожнім');
      return;
    }
  
    if (!/^\d+$/.test(key)) {
      alert('Ключ має містити лише цифри або не бути порожнім');
      return;
    }

    let encryptedText = '';

    if (method === 'caesar') {
      const shift = parseInt(key);
      encryptedText = caesarCipher(text, shift);
    } else if (method === 'xor') {
      const xorKey = parseInt(key);
      encryptedText = xorCipher(text, xorKey);
    }

    try {
      await axios.post('http://localhost:3000/save', { text: encryptedText, method, key });
      setResult(`Зашифрований текст (${method}): ${encryptedText}`);
    } catch (error) {
      console.error(error);
    }
  };

  const decrypt = async (text: string, key: string, method: string) => {
    try {
      const response = await axios.post('http://localhost:3000/decrypt', { text, method, key });
      if (response.data.decrypted) {
        let decryptedText = '';

        if (method === 'caesar') {
          const shift = parseInt(key);
          decryptedText  = caesarDecipher(text, shift);
        } else if (method === 'xor') {
          const xorKey = parseInt(key);
          decryptedText = xorCipher(text, xorKey);
        }

        setResult(`Розшифрований текст: ${decryptedText}`);
      } else {
        alert('Текст не знайдено в базі');
      }
    } catch (error) {
      console.error('Помилка при розшифруванні', error);
    }
  };

  return {
    result,
    encrypt,
    decrypt,
  };
};
