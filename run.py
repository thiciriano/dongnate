import subprocess
import os
import sys
import time
import signal

def run():
    # Caminhos absolutos baseados no diretório deste script
    root_dir = os.path.dirname(os.path.abspath(__file__))
    server_dir = os.path.join(root_dir, "app-server")
    client_dir = os.path.join(root_dir, "app-client")

    print("🚀 Iniciando ecossistema DongNate...")

    # 1. Iniciar o Servidor FastAPI
    print("📂 Iniciando Backend (FastAPI) em http://localhost:8000...")
    server_process = subprocess.Popen(
        [sys.executable, "main.py"],
        cwd=server_dir,
        shell=True if os.name == 'nt' else False
    )

    # Pequena pausa para o servidor subir
    time.sleep(2)

    # 2. Iniciar o Cliente Vite
    print("📂 Iniciando Frontend (Vite) em http://localhost:5173...")
    try:
        client_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=client_dir,
            shell=True if os.name == 'nt' else False
        )
    except FileNotFoundError:
        print("❌ Erro: 'npm' não encontrado. Certifique-se de ter o Node.js instalado.")
        server_process.terminate()
        return

    print("\n✅ Sistema rodando! Pressione CTRL+C para encerrar ambos.\n")

    try:
        # Mantém o script rodando enquanto os processos estiverem ativos
        while True:
            time.sleep(1)
            if server_process.poll() is not None or client_process.poll() is not None:
                break
    except KeyboardInterrupt:
        print("\n🛑 Encerrando processos...")
    finally:
        # Garante que ambos os processos sejam encerrados ao sair
        if os.name == 'nt':
            # No Windows, subprocess.terminate() às vezes não mata processos filhos do shell
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(server_process.pid)], capture_output=True)
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(client_process.pid)], capture_output=True)
        else:
            server_process.terminate()
            client_process.terminate()
        print("👋 Até logo!")

if __name__ == "__main__":
    run()
