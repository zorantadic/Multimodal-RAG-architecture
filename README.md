# Controlled Multimodal RAG Architecture

This repository contains a working reference project for a controlled multimodal RAG (Retrieval-Augmented Generation) architecture over business documents.

The project demonstrates how an AI (Artificial Intelligence) system can move beyond simple text-only retrieval by combining:

- structured document preparation
- text and visual evidence handling
- Azure AI (Artificial Intelligence) Search
- Azure OpenAI
- controlled answer generation
- traceable retrieval results
- a simple web UI (User Interface)
- a lightweight demo API (Application Programming Interface)

The goal is not to present a generic chatbot. The goal is to show an architecture pattern for grounded AI (Artificial Intelligence) responses where the answer is based on retrieved evidence from prepared business documents.

---

## Project Purpose

Most basic RAG (Retrieval-Augmented Generation) implementations retrieve text chunks and send them directly to an LLM (Large Language Model).

That approach often misses important business evidence when the source documents contain:

- charts
- screenshots
- tables
- visual layouts
- diagrams
- structured sections
- page-level context
- mixed text and visual evidence

This project demonstrates a controlled multimodal RAG (Retrieval-Augmented Generation) pattern where documents are prepared, indexed, retrieved, and presented with a stronger focus on evidence quality.

---

## What This Project Shows

This project shows a practical architecture for:

- retrieving relevant document evidence
- separating answer generation from retrieval evidence
- exposing retrieved context to the user
- showing how the answer was grounded
- using Azure AI (Artificial Intelligence) Search as the retrieval layer
- using Azure OpenAI for answer generation
- using a lightweight web UI (User Interface) for demonstration
- keeping the architecture understandable and inspectable

---

## Architecture Overview

```text
User Question
    |
    v
Web UI (User Interface)
    |
    v
Demo API (Application Programming Interface)
    |
    v
Azure AI (Artificial Intelligence) Search
    |
    v
Retrieved Text and Evidence Context
    |
    v
Azure OpenAI
    |
    v
Grounded Answer + Retrieval Evidence
```

The API (Application Programming Interface) receives a user question, sends a retrieval request to Azure AI (Artificial Intelligence) Search, prepares the retrieved context, sends the grounded prompt to Azure OpenAI, and returns both the generated answer and the supporting evidence to the web UI (User Interface).

---

## Repository Structure

```text
Multimodal-RAG-architecture/
|
|-- apps/
|   |-- demo-api/
|   |   |-- index.js
|   |   |-- package.json
|   |   |-- package-lock.json
|   |   |-- .env.example
|   |
|   |-- web-ui/
|       |-- public/
|       |-- src/
|       |-- package.json
|       |-- package-lock.json
|       |-- index.html
|       |-- vite.config.js
|       |-- eslint.config.js
|
|-- data/
|   |-- sample-documents/
|
|-- docs/
|   |-- AZURE_RESOURCES.md
|   |-- DEMO_FLOW.md
|   |-- PROJECT_CANON.md
|
|-- infra/
|   |-- bicep/
|
|-- scripts/
|   |-- create_sample_pdfs.py
|
|-- .gitignore
|-- README.md
```

---

## Main Components

### 1. Web UI (User Interface)

Location:

```text
apps/web-ui
```

The web UI (User Interface) is a React and Vite application used to demonstrate the retrieval and response flow.

It provides a simple front end for asking questions and viewing the response returned by the demo API (Application Programming Interface).

### 2. Demo API (Application Programming Interface)

Location:

```text
apps/demo-api
```

The demo API (Application Programming Interface) is a Node.js and Express service.

It handles:

- health check endpoint
- user question input
- Azure AI (Artificial Intelligence) Search request
- retrieved context preparation
- Azure OpenAI request
- final response formatting

### 3. Sample Documents

Location:

```text
data/sample-documents
```

This folder is intended for sample business documents used in the demonstration.

The project is designed around controlled sample documents, not private or sensitive production data.

### 4. Documentation

Location:

```text
docs
```

The documentation folder contains supporting project notes:

- Azure resources
- demo flow
- project canon

### 5. Infrastructure

Location:

```text
infra/bicep
```

This folder is reserved for Azure Bicep infrastructure definitions.

Azure Bicep is used to describe Azure infrastructure as code.

### 6. Scripts

Location:

```text
scripts
```

This folder contains helper scripts, including sample document generation.

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML (HyperText Markup Language)
- CSS (Cascading Style Sheets)

### Backend

- Node.js
- Express
- CORS (Cross-Origin Resource Sharing)
- dotenv environment configuration

### Azure Services

- Azure AI (Artificial Intelligence) Search
- Azure OpenAI
- Azure infrastructure defined with Bicep

---

## Environment Configuration

The backend service uses environment variables for Azure service configuration.

Create a local `.env` file in:

```text
apps/demo-api/.env
```

Use the existing example file as the starting point:

```text
apps/demo-api/.env.example
```

Expected configuration values include:

```text
PORT=5050

AZURE_SEARCH_ENDPOINT=
AZURE_SEARCH_INDEX=
AZURE_SEARCH_API_VERSION=
AZURE_SEARCH_API_KEY=

AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT=
AZURE_OPENAI_API_VERSION=
AZURE_OPENAI_API_KEY=
```

Do not commit real keys, tokens, endpoints, or secrets.

---

## Local Setup

### Prerequisites

Install:

- Node.js
- npm
- Azure subscription
- Azure AI (Artificial Intelligence) Search service
- Azure OpenAI resource
- Azure OpenAI model deployment

---

## Run the Backend

Open terminal from the repository root, then run:

```bash
cd apps/demo-api
npm install
npm start
```

Expected local backend URL:

```text
http://localhost:5050
```

Health check endpoint:

```text
http://localhost:5050/api/health
```

Expected health check response:

```json
{
  "status": "ok",
  "service": "controlled-multimodal-rag-demo-api"
}
```

---

## Run the Web UI (User Interface)

Open a second terminal from the repository root, then run:

```bash
cd apps/web-ui
npm install
npm run dev
```

Vite will show the local web UI (User Interface) address in the terminal.

Typical local address:

```text
http://localhost:5173
```

---

## Expected Demo Flow

1. Open the web UI (User Interface).
2. Ask a question about the sample business documents.
3. The web UI (User Interface) sends the question to the demo API (Application Programming Interface).
4. The demo API (Application Programming Interface) queries Azure AI (Artificial Intelligence) Search.
5. Azure AI (Artificial Intelligence) Search returns relevant document evidence.
6. The demo API (Application Programming Interface) sends the retrieved context to Azure OpenAI.
7. Azure OpenAI generates a grounded answer.
8. The web UI (User Interface) displays the answer and supporting retrieval context.

---

## Why This Architecture Matters

This project is focused on controlled retrieval and grounded answer generation.

The key architectural point is that the model should not answer from general knowledge alone. The model should answer based on retrieved evidence from prepared business documents.

This pattern is important for enterprise AI (Artificial Intelligence) systems because enterprise users need:

- traceability
- source grounding
- repeatability
- controlled context
- lower hallucination risk
- clear separation between retrieval and generation
- a foundation for audit and governance

---

## Controlled Multimodal Retrieval Concept

The project is designed around the idea that document retrieval should account for more than plain text.

Business documents often communicate meaning through:

- page structure
- visual hierarchy
- images
- screenshots
- tables
- diagrams
- layout
- section grouping

A stronger RAG (Retrieval-Augmented Generation) architecture should preserve and expose enough document evidence so the answer can be grounded, inspected, and trusted.

---

## Current Scope

This repository is a demo and reference architecture.

It is intended to show:

- application structure
- retrieval flow
- Azure integration points
- sample document preparation
- web UI (User Interface) flow
- backend orchestration pattern

It is not intended to be a complete production product.

---

## Out of Scope

The current version does not claim to provide:

- full enterprise identity integration
- full RBAC (Role-Based Access Control)
- production-grade authorization
- production-grade observability
- production-grade monitoring
- production-grade deployment pipeline
- automated document ingestion at enterprise scale
- full compliance certification
- full security hardening

Those capabilities can be added as part of a production implementation.

---

## Possible Enterprise Extensions

This architecture can be extended with:

- identity integration
- RBAC (Role-Based Access Control)
- private network integration
- managed identity
- Azure Key Vault
- automated document ingestion pipeline
- document classification
- metadata-based retrieval filtering
- retrieval quality scoring
- answer evaluation
- audit logging
- source authority ranking
- adaptive retrieval control
- human review workflow
- deployment through Azure Container Apps
- CI/CD (Continuous Integration / Continuous Delivery) pipeline

---

## Security Notes

Before sharing, deploying, or extending this repository:

- do not commit real API (Application Programming Interface) keys
- do not commit Azure OpenAI keys
- do not commit Azure AI (Artificial Intelligence) Search admin keys
- do not commit private documents
- do not commit customer data
- do not commit PII (Personally Identifiable Information)
- use environment variables for secrets
- use Azure Key Vault for production secrets
- use managed identity where possible

---

## Recommended Next Improvements

Recommended next improvements for this repository:

1. Add screenshots of the web UI (User Interface).
2. Add an architecture diagram.
3. Add a sample `.env.example` with placeholder values only.
4. Add setup instructions for Azure AI (Artificial Intelligence) Search index creation.
5. Add setup instructions for Azure OpenAI deployment.
6. Add sample questions for the demo.
7. Add explanation of expected retrieval output.
8. Add deployment instructions for Azure Container Apps.
9. Add a license file.
10. Add a short demo video link.

---

## Suggested Demo Questions

Example questions for the demo:

```text
What evidence does the document provide for the main business risk?
```

```text
Which visual or structured evidence supports the answer?
```

```text
Summarize the key findings from the retrieved document context.
```

```text
Which document sections were used to answer the question?
```

---

## Project Status

Current status:

```text
Reference demo architecture
```

The repository is intended for learning, demonstration, architecture discussion, and technical review.

---

## Author

Zoran Tadic

Senior Cloud Solutions Architect  
AI (Artificial Intelligence) Solutions Architect  
Azure Cloud and Enterprise Architecture

---

## License

No license has been added yet.

Before using this repository in another project, add an explicit license file such as MIT, Apache 2.0, or another license appropriate for the intended use.

---

## Disclaimer

This project is a demonstration and reference architecture.

It is not a production-ready enterprise system without additional security, identity, monitoring, governance, deployment, and compliance controls.
