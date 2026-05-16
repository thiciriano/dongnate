import pytest
import sys
import os

if __name__ == "__main__":
    # acha os arquivos
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    
    print("🚀 Iniciando a suíte de testes do DongNate...")
    
    # roda os testes
    exit_code = pytest.main(["-v", "-s", os.path.dirname(__file__)])
    
    if exit_code == 0:
        print("\n✅ Todos os testes passaram com sucesso!")
    else:
        print("\n❌ Alguns testes falharam. Verifique os logs acima.")
    
    sys.exit(exit_code)
