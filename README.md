# trustPlate – Recensisci ristoranti con fiducia (backend Flask + AI)

## Panoramica

**trustPlate** è una piattaforma web che permette agli utenti di **lasciare recensioni** sui ristoranti, **visualizzarle** e **interagire** con esse attraverso un sistema di like/dislike (gradimento/contrasto).  
Il backend è realizzato in **Flask** e offre un’API RESTful. Le recensioni vengono perseguitate in un file JSON.  
Una funzionalità distintiva è l’integrazione con **Ollama** (modello `gemma3:4b`) che analizza l’**umore generale** delle recensioni di ciascun ristorante, fornendo un riassunto testuale della soddisfazione dei clienti.

---

## Funzionalità principali

- **Lista recensioni** – GET `/api/reviews` restituisce tutte le recensioni (con nome, cognome, testo, id ristorante).
- **Aggiunta recensione** – POST `/api/reviews` crea una nuova recensione (salvata su `reviews.json`).
- **Like/Dislike** – PUT `/api/reviews/<id>/gradimento` e `/contrasto` incrementano/decrementano i contatori.
- **Seed dati** – GET `/api/seed/<numero>` genera recensioni casuali (con Faker) usando frasi positive/neutre/negative predefinite.
- **Analisi NLP con spaCy** – modulo pronto per elaborare testi in italiano (es. estrazione entità, sentiment base).
- **Analisi umore con Ollama** – endpoint dedicato che interroga il modello `gemma3:4b` per restituire un riassunto del sentiment aggregato di un ristorante.

---

## Come funziona (step logici)

### 1. Gestione recensioni
- Le recensioni sono memorizzate in una lista globale e persistite su `reviews.json`.
- Ogni recensione ha: `id`, `nome`, `cognome`, `testoRecensione`, `idRistorante`, `gradimento` (like), `contrasto` (dislike).
- Le operazioni CRUD di base sono implementate (lettura, scrittura, cancellazione di massa).

### 2. Seed automatico
- L’endpoint `/api/seed/<numero>` genera recensioni sintetiche con nomi e cognomi casuali (Faker) e testi selezionati casualmente da tre liste predefinite: positive, neutre, negative.
- Utile per popolare il database di test.

### 3. Like/Dislike
- Gli utenti (frontend) possono esprimere gradimento o contrarietà su una recensione.
- Ogni click aggiorna il contatore corrispondente nel file JSON.

### 4. Analisi umore con Ollama (AI)
- Il frontend (o un chiamante) può richiedere un riassunto dell’umore generale di un ristorante (es. tutti i testi delle recensioni associate a un `idRistorante`).
- Il backend raccoglie i testi, li invia a Ollama con un prompt appropriato, e restituisce una frase riassuntiva (es. *"I clienti apprezzano il cibo ma lamentano il servizio lento"*).

---

## Stack tecnologico

| Componente      | Tecnologia utilizzata                               |
|----------------|------------------------------------------------------|
| Backend        | Python 3.8+ + Flask                                 |
| CORS           | flask_cors                                          |
| Persistenza    | JSON (file `reviews.json`)                          |
| Generazione dati| Faker (italiano) + liste manuali                    |
| NLP base       | spaCy + modello `it_core_news_sm`                   |
| AI (umore)     | Ollama (modello `gemma3:4b`)                        |
| Frontend (suggerito)| HTML/CSS/JS (React, Vue, o semplice jQuery)    |

---

## API Endpoints (dettaglio)

| Metodo | Endpoint                              | Descrizione |
|--------|---------------------------------------|-------------|
| GET    | `/api/isUp`                           | Health check → `{stato: "ok"}` |
| GET    | `/api/reviews`                        | Restituisce tutte le recensioni |
| POST   | `/api/reviews`                        | Aggiunge una recensione (body JSON con `nome`, `cognome`, `testoRecensione`, `idRistorante`) |
| DELETE | `/api/clear`                          | Cancella tutte le recensioni (svuota il JSON) |
| PUT    | `/api/reviews/<review_id>/gradimento` | Incrementa il like di una recensione (body: `{"incremento": 1}`) |
| PUT    | `/api/reviews/<review_id>/contrasto`  | Decrementa il dislike (body: `{"decremento": 1}`) |
| GET    | `/api/seed/<int:numero>`              | Genera `numero` recensioni casuali e le aggiunge |
| GET    | `/api/sentiment/<ristorante_id>`      | **(da implementare)** – Chiama Ollama per analizzare l’umore delle recensioni di quel ristorante |


---

## Installazione e avvio (backend)

```bash
# Clona il repository
git clone https://github.com/tuo-username/trustPlate.git
cd trustPlate/backend

# Crea un ambiente virtuale
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

# Installa le dipendenze
pip install flask flask_cors faker spacy
python -m spacy download it_core_news_sm

# (Opzionale) Installa Ollama e scarica il modello gemma3:4b
# Segui le istruzioni su https://ollama.com
ollama pull gemma3:4b

# Avvia il server Flask
python app.py   # il file si chiama app.py (o come hai nominato lo script)
