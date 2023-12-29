import os
import cv2 as cv
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
import numpy as np

api = Flask(__name__)

# Diretório para armazenar os arquivos
upload_folder = 'uploads'
os.makedirs(upload_folder, exist_ok=True)

@api.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400

    file = request.files['file']
    algorithm = request.form.get('algorithm') 

    if file.filename == '':
        return jsonify({'error': 'Nome de arquivo vazio'}), 400

    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)


    if algorithm == 'threshold':
        
        intValue = request.form.get('intValue')
        intValue = int(intValue)

        img = cv.imread(file_path, cv.IMREAD_COLOR)
        
        imgToProcess = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        ret, thresh1 = cv.threshold(imgToProcess, intValue, 255, cv.THRESH_BINARY)
        
        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, thresh1)

    elif algorithm == 'grayscale':
        
        img = cv.imread(file_path, cv.IMREAD_COLOR)
        
        grayscale_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        
        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, grayscale_img)
        
    elif algorithm == 'passaAltaBasico':
        
        intValue = request.form.get('intValue')
        intValue = int(intValue)
        
        img = cv.imread(file_path, cv.IMREAD_COLOR)
        
        grayscale_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

        # Aplicar um filtro de suavização (borramento)
        blurred_img = cv.GaussianBlur(grayscale_img, (intValue, intValue), 0)
        # Aplicar o filtro passa-alta (subtrair a imagem borrada da imagem original)
        passaAlta_img = grayscale_img - blurred_img
        # Normalizar os valores de pixel para o intervalo [0, 255]
        passaAlta_img = cv.normalize(passaAlta_img, None, 0, 255, cv.NORM_MINMAX)


        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, passaAlta_img)
    
    elif algorithm == 'passaAltaReforço':
        
        intValue = request.form.get('intValue')
        intValue = int(intValue)

        img = cv.imread(file_path, cv.IMREAD_COLOR)

        grayscale_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        # Aplicar um filtro de suavização (borramento)
        blurred_img = cv.GaussianBlur(grayscale_img, (5, 5), 0)
        # Definir o fator de reforço (A)
        A = intValue
        # Calcular a imagem reforçada (High-Boost)
        highBoost_img = grayscale_img + (A * (grayscale_img - blurred_img))
        # Normalizar os valores de pixel para o intervalo [0, 255]
        highBoost_img = cv.normalize(highBoost_img, None, 0, 255, cv.NORM_MINMAX)

        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, highBoost_img)

    elif algorithm == 'passaBaixaBasico':
        
        intValue = request.form.get('intValue')
        intValue = int(intValue)
        
        img = cv.imread(file_path, cv.IMREAD_COLOR)
        
        # Aplicar um filtro passa-baixo básico com desfoque gaussiano
        passaBaixo_img = cv.GaussianBlur(img, (intValue, intValue), 0)

        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, passaBaixo_img)
        
    elif algorithm == 'passaBaixaMediana':
        
        intValue = request.form.get('intValue')
        intValue = int(intValue)

        img = cv.imread(file_path, cv.IMREAD_COLOR)
        
        # Aplicar um filtro passa-baixo mediana
        passaBaixo_img = cv.medianBlur(img, intValue)

        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, passaBaixo_img)
        
    elif algorithm == 'roberts':
        
        img = cv.imread(file_path, cv.IMREAD_GRAYSCALE)

        # Aplicar o operador Roberts em ambas as direções (horizontal e vertical)
        roberts_x = cv.filter2D(img, -1, np.array([[1, 0], [0, -1]]))
        roberts_y = cv.filter2D(img, -1, np.array([[0, 1], [-1, 0]]))
        # Calcular a magnitude da borda
        roberts_magnitude = cv.addWeighted(roberts_x, 0.5, roberts_y, 0.5, 0)
        # Normalizar os valores de pixel para o intervalo [0, 255]
        roberts_magnitude = cv.normalize(roberts_magnitude, None, 0, 255, cv.NORM_MINMAX)

        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, roberts_magnitude)
        
    elif algorithm == 'prewitt':

        img = cv.imread(file_path, cv.IMREAD_GRAYSCALE)

        # Matrizes de convolução para o operador Prewitt em ambas as direções (horizontal e vertical)
        prewitt_x = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]])
        prewitt_y = np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]])
        # Aplicar o operador Prewitt em ambas as direções
        prewitt_x_output = cv.filter2D(img, -1, prewitt_x)
        prewitt_y_output = cv.filter2D(img, -1, prewitt_y)
        # Calcular a magnitude da borda
        prewitt_magnitude = cv.addWeighted(prewitt_x_output, 0.5, prewitt_y_output, 0.5, 0)
        # Normalizar os valores de pixel para o intervalo [0, 255]
        prewitt_magnitude = cv.normalize(prewitt_magnitude, None, 0, 255, cv.NORM_MINMAX)
        
        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, prewitt_magnitude)

    elif algorithm == 'sobel':
        
        intValue = request.form.get('intValue')
        intValue = int(intValue)

        img = cv.imread(file_path, cv.IMREAD_GRAYSCALE)
        
        # Aplicar o operador Sobel em ambas as direções (horizontal e vertical)
        sobel_x = cv.Sobel(img, cv.CV_64F, 1, 0, ksize=intValue)
        sobel_y = cv.Sobel(img, cv.CV_64F, 0, 1, ksize=intValue)
        # Calcular a magnitude da borda
        sobel_magnitude = cv.magnitude(sobel_x, sobel_y)
        # Normalizar os valores de pixel para o intervalo [0, 255]
        sobel_magnitude = cv.normalize(sobel_magnitude, None, 0, 255, cv.NORM_MINMAX)
        # Converter a imagem de float64 para uint8
        sobel_magnitude = sobel_magnitude.astype(np.uint8)
        # Salvar a imagem processada com o operador Sobel
        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, sobel_magnitude)
        
    elif algorithm == 'log':
        
        intValue = request.form.get('intValue')
        intValue = int(intValue)

        img = cv.imread(file_path, cv.IMREAD_GRAYSCALE)
        
        # Aplicar um filtro Gaussiano para suavizar a imagem
        blurred_img = cv.GaussianBlur(img, (intValue, intValue), 0) 
        # Aplicar o operador Laplaciano para realçar bordas
        laplacian = cv.Laplacian(blurred_img, cv.CV_64F)
        # Calcular a magnitude do Laplaciano
        abs_laplacian = np.abs(laplacian)
        # Normalizar os valores de pixel para o intervalo [0, 255]
        normalized_laplacian = cv.normalize(abs_laplacian, None, 0, 255, cv.NORM_MINMAX)
        # Converter a imagem para o tipo uint8
        log_img = normalized_laplacian.astype(np.uint8)

        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, log_img)
        
    elif algorithm == 'zerocross':

        intValue = request.form.get('intValue')
        intValue = int(intValue)
        
        img = cv.imread(file_path)

        # Aplicar um filtro Gaussiano para suavizar a imagem
        blurred_img = cv.GaussianBlur(img, (5, 5), 0)

        # Aplicar o operador Laplaciano para realçar bordas
        laplacian = cv.Laplacian(blurred_img, cv.CV_64F)
        # Calcular a magnitude do Laplaciano
        abs_laplacian = np.abs(laplacian)
        # Normalizar os valores de pixel para o intervalo [0, 255]
        normalized_laplacian = cv.normalize(abs_laplacian, None, 0, 255, cv.NORM_MINMAX)
        # Converter a imagem para o tipo uint8
        log_img = normalized_laplacian.astype(np.uint8)
        # Aplicar a detecção de cruzamento por zero
        zero_crossings = cv.morphologyEx(log_img, cv.MORPH_CLOSE, np.ones((intValue, intValue), np.uint8))

        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, zero_crossings)
        
    elif algorithm == 'canny':

        intValue = request.form.get('intValue')
        intValue = int(intValue)
        
        img = cv.imread(file_path, cv.IMREAD_GRAYSCALE)

        # Aplicar o operador Canny
        canny_img = cv.Canny(img, intValue, intValue+100)
        
        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, canny_img)

    elif algorithm == 'noise_salt_and_pepper':
        
        intValue = request.form.get('intValue')
        intValue = int(intValue)
        
        img = cv.imread(file_path)

        # Adicionar ruído "salt and pepper" à imagem
        noise_img = img.copy()
        p = intValue/100

        for i in range(img.shape[0]):
            for j in range(img.shape[1]):
                rand = np.random.rand()
                if rand < p / 2:
                    noise_img[i, j] = 0  # Ruído de sal (preto)
                elif rand < p:
                    noise_img[i, j] = 255  # Ruído de pimenta (branco)

        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, noise_img)
        
    elif algorithm == 'watershed':
        
        intValue = request.form.get('intValue')
        intValue = int(intValue)
        
        img = cv.imread(file_path)

        # Converter a imagem para escala de cinza
        grayscale_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        # Aplicar uma transformação morfológica de abertura para remover ruídos
        kernel = np.ones((5, 5), np.uint8)
        opening = cv.morphologyEx(grayscale_img, cv.MORPH_OPEN, kernel, iterations=2)
        # Encontrar a região do fundo
        sure_bg = cv.dilate(opening, kernel, iterations=3)
        # Encontrar a região do primeiro plano
        dist_transform = cv.distanceTransform(opening, cv.DIST_L2, 5)
        _, sure_fg = cv.threshold(dist_transform, (intValue/10) * dist_transform.max(), 255, 0)
        # Subtrair a região do primeiro plano da região do fundo para obter a região desconhecida
        sure_fg = np.uint8(sure_fg)
        unknown = cv.subtract(sure_bg, sure_fg)
        # Etiquetar os componentes conectados
        _, markers = cv.connectedComponents(sure_fg)
        # Incrementar os valores dos marcadores em 1 para que o fundo seja 1
        markers = markers + 1
        # Definir os marcadores desconhecidos como 0
        markers[unknown == 255] = 0
        # Aplicar a transformação Watershed
        cv.watershed(img, markers)
        img[markers == -1] = [0, 0, 255]  # Marcar as bordas com vermelho
        
        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, img)
        
    elif algorithm == 'limiarização':
        
        img = cv.imread(file_path, cv.IMREAD_COLOR)
        imgToProcess = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        ret, thresh1 = cv.threshold(imgToProcess, 127, 255, cv.THRESH_BINARY)

        # Salvar a imagem processada
        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, thresh1)

        # Identificar e contar objetos na imagem limiarizada
        num_objects, labeled_image = cv.connectedComponents(thresh1)
        # Converter a imagem de rótulos em uma imagem colorida para marcação
        labeled_image_color = cv.cvtColor(labeled_image.astype(np.uint8), cv.COLOR_GRAY2BGR)
        # Desenhar contornos ao redor dos objetos e adicionar números
        contours, _ = cv.findContours(thresh1, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
        for i, contour in enumerate(contours, start=1):
            cv.drawContours(labeled_image_color, [contour], -1, (0, 255, 0), 2)  # Cor verde, espessura 2
            # Adicionar número de objeto à imagem
            x, y, _, _ = cv.boundingRect    (contour)
            cv.putText(labeled_image_color, str(i), (x, y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)


        processed_file_path = os.path.join(upload_folder, 'processed_' + file.filename)
        cv.imwrite(processed_file_path, labeled_image_color)

        

    return jsonify({'message': f'Arquivo {file.filename} enviado e processado com sucesso'}), 200

@api.route('/processed/<filename>')
def get_processed_image(filename):
    processed_file_path = os.path.join(upload_folder, 'processed_' + filename)
    return send_file(processed_file_path, mimetype='image/jpeg')

@api.route('/histogram/<filename>')
def get_histogram(filename):
    processed_file_path = os.path.join(upload_folder, 'processed_' + filename)
    
    img = cv.imread(processed_file_path, cv.IMREAD_GRAYSCALE)
    histogram = cv.calcHist([img], [0], None, [256], [0, 256])
    histogram = histogram.flatten().tolist()

    return jsonify({'histogram': histogram})

@api.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == "__main__":
    api.run(host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 888)))
