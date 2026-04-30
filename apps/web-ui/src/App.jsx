import { useState } from 'react'
import './App.css'
import { askQuestion } from './api/demoClient'

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [citations, setCitations] = useState([])
  const [trace, setTrace] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function getCitationContent(item) {
    return item.content || 'Citation content not available.'
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!question.trim()) {
      setError('Please enter a question.')
      setAnswer('')
      setCitations([])
      setTrace([])
      return
    }

    setIsLoading(true)
    setError('')
    setAnswer('')
    setCitations([])
    setTrace(['Question received in UI', 'Sending question to demo-api'])

    try {
      const result = await askQuestion(question)

      setAnswer(result.answer || '')
      setCitations(result.citations || [])
      setTrace(result.trace || [])
    } catch (err) {
      setError(err.message)
      setAnswer('')
      setCitations([])
      setTrace(['Question received in UI', 'API call failed'])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Controlled Multimodal RAG on Azure</p>
          <h1>Multimodal Document Q&amp;A Demo</h1>
          <p className="subtitle">
            Raw PDFs with text, tables, charts, diagrams, and real images are indexed
            through Azure AI Search and used for grounded answers.
          </p>
        </div>
      </header>

      <section className="layout-grid">
        <section className="panel main-panel">
          <h2>Question</h2>

          <form onSubmit={handleSubmit} className="question-form">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows="5"
              aria-label="Question"
              placeholder="Enter a business question..."
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Asking...' : 'Ask demo question'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <div className="answer-box">
            <h2>Answer</h2>
            {answer && <p>{answer}</p>}
          </div>
        </section>

        <aside className="panel">
          <h2>Citations / Grounding</h2>

          {citations.length > 0 && (
            <div className="evidence-list">
              {citations.map((item) => (
                <article key={item.id} className="evidence-card">
                  <div className="evidence-header">
                    <span>{item.document || 'Source document'}</span>
                    <small>{item.page || 'Page not returned'}</small>
                  </div>

                  <p>
                    <strong>Source type:</strong> {item.sourceType || 'unknown'}
                  </p>

                  <p>{getCitationContent(item)}</p>
                </article>
              ))}
            </div>
          )}
        </aside>

        <aside className="panel">
          <h2>Trace</h2>

          {trace.length > 0 && (
            <ol className="trace-list">
              {trace.map((step, index) => (
                <li key={`${step}-${index}`}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </section>
    </main>
  )
}

export default App