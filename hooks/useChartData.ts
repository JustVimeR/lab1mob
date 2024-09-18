import { useState, useEffect } from 'react';
import axios from 'axios';

export const useChartData = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

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

  const addData = (textLength: number) => {
    setChartData((prevData) => [...prevData, textLength]);
    setLabels((prevLabels) => [...prevLabels, `Текст ${labels.length + 1}`]);
  };

  return {
    chartData,
    labels,
    addData,
  };
};
