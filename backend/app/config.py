from dotenv import load_dotenv
from os import getenv
load_dotenv(override=True)
class Setting():
    ENVIRONMENT: str = getenv("ENVIRONMENT")
    BACKEND_CORS_ORIGINS: str
    SECRET_KEY: str
    POSTGRES_SERVER: str
    POSTGRES_PORT: str
    POSTGRES_DB: str
    POSTGRES_PASSWORD: str
    POSTGRES_USER: str
    def __new__(cls):
        cls.DOMAIN = getenv("DOMAIN")
        cls.SECRET_KEY = getenv("SECRET_KEY")
        cls.POSTGRES_SERVER = getenv("POSTGRES_SERVER")
        cls.POSTGRES_PORT = getenv("POSTGRES_PORT")
        cls.POSTGRES_DB = getenv("POSTGRES_DB")
        cls.POSTGRES_PASSWORD = getenv("POSTGRES_PASSWORD")
        cls.POSTGRES_USER = getenv("POSTGRES_USER")
        return super().__new__(cls)
        
    def get_connection_string(self):
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_PORT}:{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
    
setting = Setting()