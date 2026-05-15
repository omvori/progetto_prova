# trustPlate – Rate restaurants with confidence (Flask + AI backend)

## Overview

**trustPlate** is a web platform that allows users to **leave reviews** on restaurants, **view them**, and **interact** via a like/dislike system (gradimento/contrasto).  
The backend is built with **Flask** and provides a RESTful API. Reviews are persisted in a JSON file.  
A distinctive feature is the integration with **Ollama** (model `gemma3:4b`), which analyzes the **general mood** of all reviews for each restaurant, returning a textual summary of customer satisfaction.

---

## Main Features

- **List reviews** – GET `/api/reviews` returns all reviews (with first name, last name, text, restaurant id).
- **Add review** – POST `/api/reviews` creates a new review (saved to `reviews.json`).
- **Like/Dislike** – PUT `/api/reviews/<id>/gradimento` and `/contrasto` increase/decrease counters.
- **Seed data** – GET `/api/seed/<number>` generates random reviews using Faker and predefined positive/neutral/negative sentences.
- **NLP with spaCy** – module ready to process Italian text (e.g., entity extraction, basic sentiment).
- **Mood analysis with Ollama** – dedicated endpoint that queries the `gemma3:4b` model to return an aggregated sentiment summary for a restaurant.

---

## How It Works (logical steps)

### 1. Review management
- Reviews are stored in a global list and persisted to `reviews.json`.
- Each review has: `id`, `nome`, `cognome`, `testoRecensione`, `idRistorante`, `gradimento` (likes), `contrasto` (dislikes).
- Basic CRUD operations are implemented (read, write, bulk delete).

### 2. Automatic seeding
- The endpoint `/api/seed/<number>` generates synthetic reviews with random first/last names (Faker) and texts randomly chosen from three predefined lists: positive, neutral, negative.
- Useful for populating the test database.

### 3. Like / Dislike
- Users (frontend) can express appreciation or disagreement on a review.
- Each click updates the corresponding counter in the JSON file.

### 4. Mood analysis with Ollama (AI)
- The frontend (or any caller) can request a summary of the general mood of a restaurant (i.e., all review texts associated with an `idRistorante`).
- The backend collects the texts, sends them to Ollama with an appropriate prompt, and returns a summary phrase (e.g., *"Customers appreciate the food but complain about slow service"*).

---

## Technology Stack

| Component       | Technology used                                       |
|-----------------|-------------------------------------------------------|
| Backend         | Python 3.8+ + Flask                                  |
| CORS            | flask_cors                                           |
| Persistence     | JSON file (`reviews.json`)                           |
| Data generation | Faker (Italian) + manual lists                       |
| Base NLP        | spaCy + model `it_core_news_sm`                      |
| AI (mood)       | Ollama (model `gemma3:4b`)                           |
| Frontend        | Angular workflow                     |

---

## API Endpoints (detailed)

| Method | Endpoint                                 | Description |
|--------|------------------------------------------|-------------|
| GET    | `/api/isUp`                              | Health check → `{stato: "ok"}` |
| GET    | `/api/reviews`                           | Returns all reviews |
| POST   | `/api/reviews`                           | Adds a review (JSON body with `nome`, `cognome`, `testoRecensione`, `idRistorante`) |
| DELETE | `/api/clear`                             | Deletes all reviews (empties the JSON file) |
| PUT    | `/api/reviews/<review_id>/gradimento`    | Increments like counter (body: `{"incremento": 1}`) |
| PUT    | `/api/reviews/<review_id>/contrasto`     | Decrements dislike counter (body: `{"decremento": 1}`) |
| GET    | `/api/seed/<int:numero>`                 | Generates `numero` random reviews and appends them |
| GET    | `/api/sentiment/<ristorante_id>`         | **(to be implemented)** – Calls Ollama to analyze mood for that restaurant |

---

## Installation and startup (backend)

```bash
# Clone the repository
git clone https://github.com/omvori/TrustPlate.git
cd trustPlate/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

# Install dependencies
pip install flask flask_cors faker spacy
python -m spacy download it_core_news_sm

# (Optional) Install Ollama and pull the gemma3:4b model
# Follow instructions at https://ollama.com
ollama pull gemma3:4b

# The project is easily started using the two scripts:
./1backEndRun.bat
./2TrustPilotRun.bat
