const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5050

app.use(cors())
app.use(express.json())

const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT
const searchIndex = process.env.AZURE_SEARCH_INDEX
const searchApiVersion = process.env.AZURE_SEARCH_API_VERSION || '2025-11-01-preview'
const searchApiKey = process.env.AZURE_SEARCH_API_KEY

const openAiEndpoint = process.env.AZURE_OPENAI_ENDPOINT
const openAiDeployment = process.env.AZURE_OPENAI_DEPLOYMENT
const openAiApiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview'
const openAiApiKey = process.env.AZURE_OPENAI_API_KEY

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'controlled-multimodal-rag-demo-api',
  })
})

function cleanText(value) {
  if (!value) {
    return ''
  }

  return String(value)
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s?/g, '')
    .replace(/^\s*[-•]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildGroundingContext(citations) {
  return citations
    .map((item, index) => {
      const sourceType = item.sourceType || 'unknown'
      const page = item.page || 'Page not returned'
      const document = item.document || 'Unknown document'
      const content = cleanText(item.content) || 'No content returned.'

      if (sourceType === 'image') {
        return [
          `Grounding record ${index + 1}:`,
          `Document: ${document}`,
          `Page: ${page}`,
          'Source type: image',
          `Image description: ${content}`,
        ].join('\n')
      }

      return [
        `Grounding record ${index + 1}:`,
        `Document: ${document}`,
        `Page: ${page}`,
        'Source type: text',
        `Evidence: ${content}`,
      ].join('\n')
    })
    .join('\n\n')
}

async function generateModelAnswer(question, citations) {
  if (!openAiEndpoint || !openAiDeployment || !openAiApiKey) {
    return 'Model configuration is missing in .env. Azure AI Search retrieval completed, but answer generation could not run.'
  }

  const chatUrl = `${openAiEndpoint}/openai/deployments/${openAiDeployment}/chat/completions?api-version=${openAiApiVersion}`

  const groundingContext = buildGroundingContext(citations)

  const messages = [
    {
      role: 'system',
      content: [
        'You are an enterprise AI assistant for a controlled multimodal RAG demo.',
        'Answer only from the provided grounding records.',
        'Clearly state whether the conclusion is supported by text evidence, image evidence, or both.',
        'If image evidence is present, use the provided image description as the visual grounding.',
        'Do not claim visual details that are not present in the image description.',
        'Do not use Markdown formatting.',
        'Do not use asterisks, bullet symbols, headings, or bold formatting.',
        'Write in clean plain text.',
        'Keep the answer concise, business-focused, and actionable.',
      ].join('\n'),
    },
    {
      role: 'user',
      content: [
        `Business question: ${question}`,
        '',
        'Retrieved grounding records:',
        groundingContext || 'No grounding records returned.',
      ].join('\n'),
    },
  ]

  const response = await fetch(chatUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': openAiApiKey,
    },
    body: JSON.stringify({
      messages,
      max_completion_tokens: 500,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Azure OpenAI request failed: ${errorText}`)
  }

  const result = await response.json()
  const answer = result.choices?.[0]?.message?.content || 'Model did not return an answer.'

  return cleanText(answer)
}

app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body

    if (!question) {
      return res.status(400).json({
        error: 'Question is required.',
      })
    }

    if (!searchEndpoint || !searchIndex || !searchApiKey) {
      return res.status(500).json({
        error: 'Azure Search configuration is missing in .env.',
      })
    }

    const searchUrl = `${searchEndpoint}/indexes/${searchIndex}/docs/search?api-version=${searchApiVersion}`

    const searchBody = {
      search: question,
      vectorQueries: [
        {
          kind: 'text',
          text: question,
          fields: 'content_embedding',
          k: 8,
        },
      ],
      select: 'document_title,content_text,image_description,content_path,location_metadata',
      top: 8,
    }

    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': searchApiKey,
      },
      body: JSON.stringify(searchBody),
    })

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()

      return res.status(searchResponse.status).json({
        error: 'Azure Search request failed.',
        details: errorText,
      })
    }

    const searchResult = await searchResponse.json()
    const rawResults = searchResult.value || []

    const firstTextRecord = rawResults.find((item) => item.content_text && !item.content_path)
    const primaryDocument = firstTextRecord?.document_title || rawResults[0]?.document_title

    const filteredResults = rawResults
      .filter((item) => item.document_title === primaryDocument)
      .sort((a, b) => {
        if (a.content_text && !a.content_path && b.content_path) return -1
        if (a.content_path && b.content_text && !b.content_path) return 1

        return (b['@search.score'] || 0) - (a['@search.score'] || 0)
      })

    const citations = filteredResults.map((item, index) => {
      const isImageRecord = Boolean(item.content_path)
      const content =
        item.image_description ||
        item.content_text ||
        item.content_path ||
        'No content returned.'

      return {
        id: index + 1,
        document: item.document_title || 'Unknown document',
        page: item.location_metadata?.page_number
          ? `Page ${item.location_metadata.page_number}`
          : 'Page not returned',
        content: cleanText(content),
        sourceType: isImageRecord ? 'image' : 'text',
        contentPath: item.content_path || null,
        score: item['@search.score'],
      }
    })

    const answer = await generateModelAnswer(question, citations)

    res.json({
      question,
      answer,
      citations,
      trace: [
        'Question received by demo-api',
        'Azure AI Search hybrid retrieval executed',
        `Primary document selected: ${primaryDocument || 'No document selected'}`,
        'Relevant text/image grounding records prepared',
        'Image descriptions included when image records are returned',
        'Grounding records sent to Azure OpenAI model',
        'Model answer returned to web-ui',
      ],
    })
  } catch (error) {
    res.status(500).json({
      error: 'Unexpected server error.',
      details: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`demo-api running on http://localhost:${port}`)
})