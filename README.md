# Django + React Ecommerce (Distributed Architecture)

This repository contains an ecommerce application built with **Django** and **React**, extended with a **distributed, event-driven backend architecture**. 

**⚠️ This repository is an old project, re-purposed to showcase simple distributed architecture.**

The backend uses **Django REST Framework** and is enhanced with:
- **Celery** for background task processing
- **Redis** for task buffering and caching
- **RabbitMQ** as a domain event bus
- **Kombu** for event publishing and consumption
- **Commands** for seeding and running consumer threads

The frontend is built with **React, Redux, and Tailwind**.

---

## Architecture Overview

- **Django** handles HTTP requests and business logic
- **Redis** buffers Celery tasks and caches frequently accessed data
- **Celery Workers** execute background jobs (emails, image resizing, webhooks)
- **RabbitMQ** publishes domain events (e.g. `order.completed`)
- **Event Consumers** react to events and trigger async work
- **Idempotency** prevents duplicate side effects during retries

---

## Backend Setup

```bash
python -m venv .venv
source .venv/bin/activate
cd server
pip install -r requirements.txt
python manage.py runserver

# Seed products
python manage.py seed_products
```

## Run background process
```bash
cd server
celery -A project worker -l info
python manage.py run_notifications_consumer
```

## Run Backend Test
```bash
pytest
```

## Frontend development workflow

Duplicate the `.env.example` file, rename the copy to `.env` and add your own stripe and paystack keys.

Then run the following
```bash
cd client
npm i
npm start
```


## Docker (WIP)

### Local (development)

```bash
# 1. Build frontend
sh ./scripts/build_client.sh

# 2. Merge environemnt variables
sh ./scripts/build_client.sh

# 3. Run local stack
docker compose up --build
```

### Production

```bash
# 1. Build frontend
sh ./scripts/build_client.sh

# 2. Merge environemnt variables
sh ./scripts/build_client.sh

# 2. Run production stack
docker compose -f docker-compose.prod.yml up -d
```
<!-- docker compose down -v -->