import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const HistogramComponent = ({ histogramData }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
  
    useEffect(() => {
      if (chartRef.current && histogramData) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
  
        const ctx = chartRef.current.getContext('2d');
        const labels = Array.from({ length: 256 }, (_, i) => i);
  
        const chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Histograma de Intensidade',
                data: histogramData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Intensidade',
                },
                ticks: {
                  stepSize: 25,
                  callback: function (value) {
                    return value === 0 ? 'Preto' : value.toString();
                  },
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Frequência',
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          },
        });
  
        chartInstanceRef.current = chartInstance;
      }
    }, [histogramData]);
  
    return <canvas ref={chartRef} width={300} height={200} />;
  };
  
  export default HistogramComponent;