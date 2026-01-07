# Distributed System Architecture Guide

## How the Distributed System Works (Plain Explanation)

This project uses **Django, RabbitMQ, Celery, and Redis** together to form a simple but correct distributed system. Each tool has a clear responsibility, and none of them overlap.

---

## The Core Idea

Instead of doing slow or risky work inside an HTTP request (like sending emails), the system:

1. **Records what should happen**
2. **Notifies other parts of the system**
3. **Processes the work asynchronously**
4. **Guarantees it happens only once**

The database is the source of truth. Everything else reacts to it.

---

## Step-by-Step Flow

### 1. A request hits Django

A user action happens, for example:
- Checkout completed
- Order placed

Django handles the request synchronously and must respond fast.

---

### 2. Django creates an Activity (PENDING)

Django writes an `Activity` row to the database:
- What happened (e.g. `order.completed`)
- Who caused it
- Any required data (order id, total, etc.)
- Status = `PENDING`

At this point:
- No email is sent
- No background work runs
- The intent is safely stored

This database record is the **source of truth**.

---

### 3. Django publishes the activity ID to RabbitMQ

Django sends a small message to RabbitMQ:

```json
{ "activity_id": "uuid" }
```

Important:
- RabbitMQ does not store business state
- The message is just a pointer
- If RabbitMQ fails, the Activity still exists

RabbitMQ's job is delivery, not correctness.

---

### 4. RabbitMQ delivers the message to a consumer

RabbitMQ routes the message to the appropriate queue and delivers it to a long-running consumer process.

RabbitMQ:
- Does not care what the event means
- Does not execute business logic
- Only guarantees message delivery

---

### 5. The consumer loads the Activity from the database

The consumer:
- Reads `activity_id` from the message
- Fetches the Activity from Django's database

This step is critical:
- Duplicate messages are safe
- Delayed messages are safe
- Restarts are safe

The database decides whether work should happen.

---

### 6. The consumer triggers the side effect via Celery

If the Activity is still `PENDING`, the consumer:
- Sends a task to Celery
- Celery places the task in Redis
- A Celery worker executes the task (email, image resize, webhook)

Why this split exists:
- **RabbitMQ** = event delivery
- **Celery** = background execution + retries
- **Redis** = fast task buffering and retry state

---

### 7. Activity is marked PROCESSED

After the side effect is successfully triggered:
- Django updates the Activity status to `PROCESSED`

From now on:
- Duplicate messages do nothing
- Retries are safe
- The system knows the work already happened

---

## Why RabbitMQ and Redis Are Both Needed

### RabbitMQ
- Delivers domain events
- Supports routing and fan-out
- Decouples producers and consumers

**RabbitMQ answers:** "Who needs to know this happened?"

### Redis
- Buffers Celery tasks
- Tracks retries and failures
- Enables fast background processing

**Redis answers:** "How do we run this work reliably?"

They solve different problems and are not redundant.

---

## Responsibilities Summary

| Component    | Responsibility                               |
| ------------ | -------------------------------------------- |
| **Django**   | Business logic, database, idempotency, truth |
| **Database** | Authoritative state                          |
| **RabbitMQ** | Event delivery                               |
| **Celery**   | Background execution and retries             |
| **Redis**    | Task buffering and retry bookkeeping         |