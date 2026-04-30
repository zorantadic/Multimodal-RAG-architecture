# Azure Resources

## Purpose

This file defines the Azure resources required for the Controlled Multimodal RAG demo.

## Region

East US 2

## Resource Group

rg-controlled-multimodal-rag-demo

## Storage Account

Purpose: Store raw PDF documents.

Name: TBD

Container: raw-documents

Access: Private

## Azure AI Search

Purpose: Index and retrieve content from PDF documents.

Name: TBD

Tier: Basic

Index name: multimodal-documents-index

## Azure AI Foundry / Azure OpenAI

Purpose: Use a model for grounded question-answering over Azure AI Search.

Project name: controlled-multimodal-rag

Model deployment: TBD

Embedding deployment: TBD if required

## Optional Web Hosting

For version 1, the UI can run locally from VS Code.

Hosting: Local

Azure hosting: Not required for version 1

## Optional Application Insights

Status: Optional

Not required for version 1.

## Cost Control

Resources will be deleted after demo recording.

Expected runtime: Maximum 2 days

Expected cost range: $10-$50

Main cost driver: Azure AI Search if left running continuously.

## Delete After Demo

Delete the full resource group after recording:

rg-controlled-multimodal-rag-demo

This should remove:

- Storage Account
- Blob container
- Azure AI Search
- Azure AI Foundry / Azure OpenAI resources created only for this demo
- Any optional hosting or monitoring resources created only for this demo
Storage Account name: controlledragdemo<unique>
Azure AI Search name: srch-controlled-multimodal-rag
Index name: multimodal-documents-index
Blob container: raw-documents