import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
REPO_ROOT = os.path.dirname(BASE_DIR)

for env_path in (
    os.path.join(BASE_DIR, '.env'),
    os.path.join(REPO_ROOT, '.env'),
):
    if os.path.exists(env_path):
        load_dotenv(dotenv_path=env_path)
        break

ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin123')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', '09876543211234567890A')
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql+psycopg2://postgres:postgres@localhost:5432/logicquest')
API_PREFIX = '/api'
