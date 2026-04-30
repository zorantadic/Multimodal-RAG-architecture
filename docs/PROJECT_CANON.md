# Controlled Multimodal RAG on Azure — Project Canon

## 1. Project Purpose

This project demonstrates a controlled multimodal RAG workflow on Azure.

The goal is to show how raw PDF documents stored in Azure Blob Storage can be indexed and used for grounded question-answering when those documents contain:

- text
- tables
- charts
- architecture diagrams
- dashboard screenshots
- real-world images

This project is focused on a demo-ready architecture, not on a full production implementation.

## 2. Project Position in the Series

This project is the next capability after:

1. Hyper-RAG
2. MCP
3. Text-to-SQL

The new capability is:

4. Multimodal RAG

The purpose is to show that enterprise RAG should not be limited to plain text. Real enterprise documents often include visual information that is important for answering business and technical questions.

## 3. Canonical Architecture

The canonical demo architecture is:

```text
Raw PDF documents
        ↓
Azure Blob Storage
        ↓
Azure AI Search indexing and retrieval
        ↓
AI Foundry / Azure OpenAI grounded Q&A
        ↓
Demo UI
        ↓
Answer + Evidence + Trace