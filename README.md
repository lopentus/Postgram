# Postgram

## Start the project:

### Clone the repository
```bash
git clone git@github.com:lopentusska/postgram.git
```

### Create .env file with the following script
```bash
cd postgram/
echo '''DB_NAME=postgram_db
POSTGRES_USER=postgram_user
POSTGRES_PASSWORD=postgram_password
DB_HOST=localhost
DB_PORT=5432
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=127.0.0.1 localhost
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000 http://127.0.0.1:3000
REDIS_LOCATION=redis://127.0.0.1:6379/1''' > .env
```

# Run project in docker:
```bash
docker compose up -d
```
#### wait some time to let docker build containers

#### logs:
```bash
docker logs <container_name> -f
```

#### stop containers:
```bash
docker compose down
```

# Run locally:

## Start backend

### postgresql
```bash
sudo su postgres
psql
CREATE DATABASE postgram_db;
CREATE USER postgram_user WITH PASSWORD 'postgram_password';
GRANT ALL PRIVILEGES ON DATABASE postgram_db TO postgram_user;
ALTER USER postgram_user CREATEDB;
```

### Create venv and install requirements.txt
```bash
cd backend/
python -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Run migrations and start server
```bash
cd django_project/
python manage.py migrate
python manage.py runserver
```

### Optionally create superuser
```bash
python manage.py createsuperuser
```

## Start frontend
```bash
cd frontend/
yarn install
yarn build
yarn start
```
