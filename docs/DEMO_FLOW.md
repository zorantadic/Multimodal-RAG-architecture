# Demo Flow

## Goal

Show how raw PDF documents with text, tables, charts, diagrams, and real images can be used for grounded question-answering on Azure.

## Demo Flow

1. Raw PDF files are stored in Azure Blob Storage.
2. Azure AI Search indexes the documents.
3. AI Foundry / Azure OpenAI uses the search index as grounding data.
4. User asks a question in the demo UI.
5. The system returns an answer with evidence.
6. The UI displays answer, evidence, and trace.

## Demo Questions

1. What issue is visible in the field inspection image, and what does the report recommend?
2. Which chart supports the reported decline?
3. What risk is visible in the architecture diagram?

## UI Panels

1. Question and Answer
2. Evidence
3. Trace

## Trace Steps

1. Question received in UI
2. Question sent to AI Foundry / Azure OpenAI
3. Azure AI Search used as grounding source
4. Evidence returned
5. Answer generated
6. Answer and evidence displayed in UI