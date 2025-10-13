# Dockerfile per Printing Capacity
# Usa Python come base
FROM python:3.11-slim

# Imposta la directory di lavoro
WORKDIR /app

# Copia tutti i file nel container
COPY . /app

# Installa le dipendenze Python
RUN pip install --no-cache-dir -r requirements.txt

# Espone la porta 8001 (usata da server.py)
EXPOSE 8001

# Avvia il server Python custom
CMD ["python", "server.py"]
