# Issue Tracker

A simplified full-stack issue tracker (similar to GitHub Issues) built with Django REST Framework and React. Features JWT authentication, CRUD operations for projects/issues/comments, and containerized deployment via Docker.

**Repository:** https://github.com/Harix143/issue_tracker.git

---

## Tech Stack

- **Backend:** Django 5.2, Django REST Framework, Simple JWT, WhiteNoise  
- **Frontend:** React (Create React App)  
- **Database:** SQLite (default; easily swapped to Postgres/MySQL)  
- **Containerization:** Docker, multi-stage Dockerfile, docker-compose  


---

## Prerequisites

- **Git**  
- **Python 3.11+**  
- **Node.js 18+** & **npm**  
- **Docker** & **docker-compose** (for containerized setup)

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/Harix143/issue_tracker.git
cd issue_tracker
```

### 2. Backend setup

```bash
cd backend
# 2.1 Create & activate a virtualenv
python -m venv .venv
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

# 2.2 Install Python dependencies
pip install -r requirements.txt

# 2.3 Apply migrations
python manage.py migrate
```

### 3. Frontend setup

```bash
cd ../frontend
# 3.1 Install JavaScript dependencies
npm install

# 3.2 (Dev only) Start React dev server
npm start
# → runs at http://localhost:3000 by default
```

> **Note:** In development mode, the React app proxies `/api/` calls to Django (via `proxy` in `package.json`).

### 4. Run both servers

- **API & static files**:  
  ```bash
  cd ../backend
  python manage.py runserver
  ```
- **React UI** (in another terminal):  
  ```bash
  cd frontend
  npm start
  ```

Browse:
- **API**:  http://127.0.0.1:8000/api/  
- **UI**:   http://localhost:3000  

---

## Production Build & Serve via Django

In production, we build the React bundle into `frontend/build` and let Django + WhiteNoise serve the SPA.

### 1. Build React

```bash
cd frontend
npm run build
```

### 2. Collect static files

```bash
cd ../backend
# Ensure your venv is activated
.\.venv\Scripts\Activate.ps1   # or source .venv/bin/activate
pip install whitenoise
python manage.py collectstatic --noinput
```

### 3. Run Django (serves both API & React)

```bash
python manage.py runserver
```

Visit **http://127.0.0.1:8000/** — you should see your production-built React app. API still lives under **/api/**.

---

## Dockerized Deployment

We provide a multi-stage Dockerfile and `docker-compose.prod.yml` for production.

### 1. Build & run containers

From the **repo root**:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### 2. Migrate & (optionally) create superuser

```bash
docker-compose -f docker-compose.prod.yml exec web python manage.py migrate
docker-compose -f docker-compose.prod.yml exec web python manage.py createsuperuser
```

### 3. Access the app

- **UI & API**: http://localhost:8000/  

Static files are served by WhiteNoise, API under **/api/**.

---



## Contributing

1. Fork the repo  
2. Create a feature branch: `git checkout -b feat/my-feature`  
3. Commit your changes: `git commit -m "Add my feature"`  
4. Push to your fork: `git push origin feat/my-feature`  
5. Open a Pull Request

---

## License

This project is released under the **MIT License**. See [`LICENSE`](LICENSE) for details.
