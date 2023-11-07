```bash
echo '''POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_NAME=postgres
DB_HOST=localhost
DB_PORT=5432
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=127.0.0.1 localhost
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000 http://127.0.0.1:3000
REDIS_LOCATION=redis://127.0.0.1:6379/1''' > .env
```
