import React, { useState } from 'react';
import styled from 'styled-components';
import HistogramComponent from './HistogramComponent';


const Button = styled.button`
  background-color: #ccc;
  color: #333;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  cursor: pointer;

  ${(props) =>
    props.isSelected &&
    `
    background-color: #007bff;
    color: #fff;
  `}
`;

const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-top: 15px;
  border: 2px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: green;
  }
`;

const StyledParagraph = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 1.2;
  color: #333;
`;

const StyledParagraph2 = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 1.2;
  color: red;
  font-style: italic;
`;

const RedButton = styled.button`
  background-color: #ff0000;
  color: #fff;
  padding: 10px 20px;
  margin: 30px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #cc0000;
  }
`;

const ColumnContainer = styled.div`
  background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%); /* Padrão de listras diagonais */
  background-size: 10px 10px;
  min-height: 100vh;  
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const AlgorithmsContainer = styled.div`
  position: absolute;
  left: 150px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
`;

const NotepadContainer = styled.div`

  background-color: #FAFAD2;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  position: absolute;
  height: 300px;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
`;

const algorithmTexts = {
  threshold: 'Técnica usada para segmentar uma imagem em regiões ou objetos de interesse com base em um valor limite predefinido. Essa técnica é frequentemente aplicada para converter uma imagem em escala de cinza em uma imagem binária, onde os pixels são divididos em dois grupos distintos: pixels que estão acima do limite e pixels que estão abaixo do limite.',
  grayscale: 'Grayscale é uma representação de imagem em que cada pixel é exibido em tons de cinza, variando de preto a branco, em vez de cores. Em uma imagem grayscale, a informação de cor é removida, e apenas a informação de intensidade luminosa é retida.',
  passaAltaBasico: 'A filtragem passa-alta básica (high-pass filter) é usada para realçar as características de alta frequência em uma imagem, realçando bordas e detalhes. Um filtro passa-alta simples pode ser implementado subtraindo a versão borrada da imagem original da imagem original. ',
  passaAltaReforço: 'O filtro Passa-Alta com Reforço (High-Boost Filtering) é uma técnica que realça as características de alta frequência em uma imagem, dando ênfase às bordas e detalhes. Ele é obtido através da combinação da imagem original com uma versão ampliada (reforçada) dos detalhes de alta frequência da imagem',
  passaBaixaBasico: 'O filtro Passa-Baixo Básico (Low-Pass Filter) é usado para suavizar uma imagem, reduzindo as características de alta frequência, como ruído e detalhes finos. Um filtro passa-baixo pode ser implementado com uma operação de média ou um desfoque gaussiano',
  passaBaixaMediana: 'O filtro Passa-Baixo Mediana (Median Filter) é usado para suavizar uma imagem, removendo ruído e detalhes finos, preservando as bordas e os objetos de maior escala. Ele funciona substituindo cada pixel da imagem pelo valor mediano dos pixels em sua vizinhança.',
  roberts: 'O operador Roberts é um operador de detecção de bordas usado para realçar bordas em uma imagem. Ele é um filtro de detecção de bordas que calcula a diferença de intensidade entre os pixels vizinhos em duas direções (horizontal e vertical) e combina essas diferenças para obter a magnitude da borda.',
  prewitt: 'O operador de Prewitt é um operador de detecção de bordas usado para realçar bordas em uma imagem, semelhante ao operador Roberts. Ele calcula a diferença de intensidade entre os pixels vizinhos em duas direções (horizontal e vertical) e combina essas diferenças para obter a magnitude da borda.',
  sobel: 'O operador Sobel é um operador de detecção de bordas usado para realçar bordas em uma imagem, semelhante aos operadores Roberts e Prewitt. Ele calcula a diferença de intensidade entre os pixels vizinhos em duas direções (horizontal e vertical) e combina essas diferenças para obter a magnitude da borda. O operador Sobel é mais eficaz na detecção de bordas do que os operadores anteriores.',
  log: 'O filtro LoG (Laplacian of Gaussian) é usado para realçar bordas e detalhes em uma imagem, combinando duas etapas: primeiro, aplicando um filtro Gaussiano para suavizar a imagem e, em seguida, aplicando o operador Laplaciano para realçar as transições de intensidade na imagem suavizada',
  zerocross: 'A detecção de cruzamento por zero (Zero-Crossing) é uma técnica frequentemente usada após a aplicação de operadores de detecção de bordas, como o operador Laplaciano ou o filtro LoG. A detecção de cruzamento por zero identifica os pontos em que a mudança de sinal ocorre na imagem, o que geralmente indica a presença de bordas.',
  canny: 'O operador Canny é um método popular para detecção de bordas em imagens. Ele combina várias etapas, incluindo suavização, detecção de gradientes e supressão de não máximos, para produzir uma imagem binária que destaca as bordas na imagem original.',
  noise_salt_and_pepper: 'O ruído "salt and pepper" adiciona pixels pretos (ruído "sal") e pixels brancos (ruído "pimenta") aleatoriamente à imagem.',
  watershed: 'O algoritmo Watershed é usado para segmentação de imagem. Ele divide a imagem em regiões com base nas características de intensidade dos pixels.',
  limiarização: 'A limiarização, ou thresholding em inglês, é uma técnica de processamento de imagens usada para segmentar uma imagem em diferentes regiões com base nos níveis de intensidade dos pixels. Ela é frequentemente usada para separar objetos de interesse do fundo de uma imagem ou para destacar características específicas da imagem.',
};

const parametroText = {

  threshold: 'PARÂMETRO: Limiar, valor que separa os pixels em duas classes, base: 127',
  grayscale: 'PARÂMETRO: Nenhum',
  passaAltaBasico: 'PARÂMETRO: Tamanho do kernel usado para aplicar o filtro de desfoque gaussiano.',
  passaAltaReforço: 'PARÂMETRO: Fator de reforço',
  passaBaixaBasico: 'PARÂMETRO: Tamanho do kernel usado para aplicar o filtro de desfoque gaussiano.',
  passaBaixaMediana: 'PARÂMETRO: Tamanho do kernel usado para aplicar o filtro mediana.',
  roberts: 'PARÂMETRO: Nenhum',
  prewitt: 'PARÂMETRO: Nenhum',
  sobel: 'PARÂMETRO: Tamanho do kernel usado para calcular as derivadas em cada direção (horizontal e vertical)',
  log: 'PARÂMETRO: Tamanho do kernel usado para aplicar o filtro de desfoque gaussiano.',
  zerocross: 'PARÂMETRO:  Elemento estruturante usado na operação de fechamento para alterar a sensibilidade à detecção de cruzamento por zero',
  canny: 'PARÂMETRO: Primeiro Limiar, o segundo será Parâmetro+100',
  noise_salt_and_pepper: 'PARÂMETRO: Probabilidade de rúido, será parâmetro / 100',
  watershed: 'PARÂMETRO:  Limiar que determina quais pixels pertencem à região do primeiro plano, será parâmetro/10',
  limiarização: 'PARÂMETRO: Nenhum',

};

function App() {
  const [file, setFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
  const [intValue, setIntValue] = useState(0);


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setOriginalImage(url);
  };

  const handleSelectAlgorithm = (algorithm) => {
    setSelectedAlgorithm(algorithm);
  };

  const handleUpload = () => {
    if (file && selectedAlgorithm) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('algorithm', selectedAlgorithm);
      formData.append('intValue', intValue); 
  
      fetch('http://localhost:888/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
  
          fetch(`http://localhost:888/processed/${file.name}`)
            .then((response) => response.blob())
            .then((blob) => {
              const url = URL.createObjectURL(blob);
              setProcessedImage(url);
            });
        })
        .catch((error) => console.error(error));
  
      fetch(`http://localhost:888/histogram/${file.name}`)
        .then((response) => response.json())
        .then((histogram) => {
          setHistogramData(histogram.histogram);
        })
        .catch((error) => console.error(error));
    } else {
      console.log('Nenhum arquivo selecionado ou algoritmo escolhido.');
    }
  };
  

  return (
    <ColumnContainer>
      <h1>Envie um arquivo e escolha o algoritmo:</h1>
      <input type="file" onChange={handleFileChange} />
      <StyledInput
        type="number"
        placeholder="Digite um valor inteiro"
        value={intValue}
        onChange={(e) => setIntValue(parseInt(e.target.value))}
      />
      <AlgorithmsContainer>
        <Button isSelected={selectedAlgorithm === 'threshold'} onClick={() => handleSelectAlgorithm('threshold')}>
          Threshsold
        </Button>
        <Button isSelected={selectedAlgorithm === 'grayscale'} onClick={() => handleSelectAlgorithm('grayscale')}>
          GrayScale
        </Button>
        <Button isSelected={selectedAlgorithm === 'passaAltaBasico'} onClick={() => handleSelectAlgorithm('passaAltaBasico')}>
          Passa Alta Básico
        </Button>
        <Button isSelected={selectedAlgorithm === 'passaAltaReforço'} onClick={() => handleSelectAlgorithm('passaAltaReforço')}>
          Passa Alta Reforço
        </Button>
        <Button isSelected={selectedAlgorithm === 'passaBaixaBasico'} onClick={() => handleSelectAlgorithm('passaBaixaBasico')}>
          Passa Baixa Básico
        </Button>
        <Button isSelected={selectedAlgorithm === 'passaBaixaMediana'} onClick={() => handleSelectAlgorithm('passaBaixaMediana')}>
          Passa Baixa Mediana
        </Button>
        <Button isSelected={selectedAlgorithm === 'roberts'} onClick={() => handleSelectAlgorithm('roberts')}>
          Roberts
        </Button>
        <Button isSelected={selectedAlgorithm === 'prewitt'} onClick={() => handleSelectAlgorithm('prewitt')}>
          Prewitt
        </Button>
        <Button isSelected={selectedAlgorithm === 'sobel'} onClick={() => handleSelectAlgorithm('sobel')}>
          Sobel
        </Button>
        <Button isSelected={selectedAlgorithm === 'log'} onClick={() => handleSelectAlgorithm('log')}>
          Log
        </Button>
        <Button isSelected={selectedAlgorithm === 'zerocross'} onClick={() => handleSelectAlgorithm('zerocross')}>
          Zerocross
        </Button>
        <Button isSelected={selectedAlgorithm === 'canny'} onClick={() => handleSelectAlgorithm('canny')}>
          Canny
        </Button>
        <Button isSelected={selectedAlgorithm === 'noise_salt_and_pepper'} onClick={() => handleSelectAlgorithm('noise_salt_and_pepper')}>
          Ruido Salt e Pepper
        </Button>
        <Button isSelected={selectedAlgorithm === 'watershed'} onClick={() => handleSelectAlgorithm('watershed')}>
          Watershed
        </Button>
        <Button isSelected={selectedAlgorithm === 'limiarização'} onClick={() => handleSelectAlgorithm('limiarização')}>
          Limiarização
        </Button>
      </AlgorithmsContainer>

      <RedButton onClick={handleUpload}>Processar </RedButton>

      {originalImage && processedImage && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ marginRight: '20px' }}>
              <h3>Imagem Original:</h3>
              <img src={originalImage} alt="Imagem Original" style={{ height: '300px', width: '300px' }} />
            </div>
            <div>
              <h3>Imagem Processada:</h3>
              <img src={processedImage} alt="Imagem Processada" style={{ height: '300px', width: '300px' }} />
            </div>
          </div>
          {}
          {histogramData && (
            <div style={{ textAlign: 'center' }}>
              <h3>Histograma:</h3>
              <HistogramComponent histogramData={histogramData} />
            </div>
          )}
        </div>
      )}

      <NotepadContainer>
      {selectedAlgorithm && (
        <div>
          <StyledParagraph>{algorithmTexts[selectedAlgorithm]}</StyledParagraph>
          <StyledParagraph2>{parametroText[selectedAlgorithm]}</StyledParagraph2>
        </div>
      )}
      </NotepadContainer>
    </ColumnContainer>
  );
}

export default App;
