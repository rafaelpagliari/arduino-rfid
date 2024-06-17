import serial
import requests
import time

# Configurar a porta serial
ser = serial.Serial('/dev/cu.usbmodem14101', 9600, timeout=1)

# URLs da API onde os dados serão enviados e verificados
url_registrar_leitura = 'http://186.237.57.106:3001/api/cartao/registrar-leitura'
url_verificar_cartao = 'http://186.237.57.106:3001/api/cartao/ultimo-cartao'  # Alterado para o endpoint 'ultimo-cartao'

def send_data(card_data):
    try:
        response = requests.post(url_registrar_leitura, json={'uuid': card_data})
        if response.status_code == 201:
            print(f"Data sent successfully: {card_data}")
        else:
            print(f"Failed to send data: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

def verificar_cartao():
    try:
        response = requests.get(url_verificar_cartao)
        if response.status_code == 200:
            cartao_info = response.json()
            uuid = cartao_info.get('uuid')
            cartao_status = cartao_info.get('status')

            if uuid and cartao_status:
                return uuid, cartao_status
            else:
                print(f"Resposta da API não contém UUID ou status válidos: {response.text}")
                return None, None
        else:
            print(f"Falha ao obter informações do cartão: {response.status_code}")
            return None, None
    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição ao verificar cartão: {e}")
        return None, None

def main():
    print("Pronto para receber dados. Aproxime o cartão...")
    while True:
        try:
            if ser.in_waiting > 0:
                card_data = ser.readline().decode('utf-8').strip()
                if card_data.startswith('UID:'):
                    uuid = card_data.split(':')[1].strip()  # Extrai apenas o UUID
                    print(f"Card data read: {uuid}")

                    # Remove espaço do final do UUID (caso haja)
                    uuid = uuid.replace(" ", "")

                    # Envia os dados do cartão para o backend
                    send_data(uuid)

                    # Verifica o status do cartão no backend
                    uuid_api, status_cartao = verificar_cartao()
                    if uuid_api == uuid and status_cartao is not None:
                        print(f"Status do cartão: {status_cartao}")

                        # Envia o status de volta para o Arduino via porta serial
                        ser.write(status_cartao.encode())

                        # Aguarda confirmação de recebimento do Arduino
                        while ser.in_waiting == 0:
                            time.sleep(0.1)
                        confirmation = ser.read().decode('utf-8').strip()
                        if confirmation == 'r':
                            print("Recebido com sucesso pelo Arduino.")
                        else:
                            print("Falha ao receber pelo Arduino.")
                    else:
                        print("Não foi possível obter o status do cartão ou UUID não corresponde.")

                    # Adiciona um espaço no final do retorno impresso
                    print("")  # Apenas imprime uma linha em branco para adicionar espaço

        except Exception as e:
            print(f"Error: {e}")
        time.sleep(0.1)

if __name__ == "__main__":
    main()
