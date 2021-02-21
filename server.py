from app import create_app
from config import Config

config = Config('config.ini')
app = create_app(config)
