import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin123')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', '09876543211234567890A')
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql+psycopg2://postgres:postgres@localhost:5432/logicquest')
API_PREFIX = '/api'
