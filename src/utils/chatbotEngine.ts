import { portfolioKnowledgeBase } from '../data/portfolioData'

export type ChatHistoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

const MIN_SIMILARITY = 0.08
const STREAM_CHUNK_SIZE = 12
const STREAM_DELAY_MS = 12

const STOP_WORDS = new Set([
  'the', 'and', 'a', 'an', 'of', 'in', 'on', 'for', 'to', 'with', 'is', 'are', 'it', 'its', 'by', 'from', 'that', 'this', 'as', 'be', 'will', 'can', 'do', 'does'
])

const SYNONYM_MAP: Record<string, string> = {
  tech: 'technology',
  technologies: 'technology',
  technology: 'technology',
  stack: 'technology',
  skill: 'skills',
  skills: 'skills',
  framework: 'frameworks',
  frameworks: 'frameworks',
  tool: 'tools',
  tools: 'tools',
  cloud: 'cloud',
  database: 'databases',
  databases: 'databases',
  ai: 'ai',
  artificial: 'ai',
  intelligence: 'ai',
  resume: 'resume',
  contact: 'contact',
  email: 'email',
  linkedin: 'linkedin',
  github: 'github',
  project: 'projects',
  projects: 'projects',
  experience: 'experience',
  achievements: 'achievements',
  certificates: 'certificates',
  education: 'education',
  college: 'education',
  degree: 'education',
  openai: 'ai',
  generative: 'ai'
}

let cachedKnowledgeIndex: {
  id: string
  entry: (typeof portfolioKnowledgeBase)[0]
  vector: Record<string, number>
}[] | null = null
let cachedIdf: Record<string, number> | null = null

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text: string) {
  return normalizeText(text)
    .split(' ')
    .filter((token) => token.length > 0 && !STOP_WORDS.has(token))
}

function expandTokens(tokens: string[]) {
  return tokens.map((token) => SYNONYM_MAP[token] ?? token)
}

function buildFrequency(tokens: string[]) {
  return tokens.reduce<Record<string, number>>((acc, token) => {
    acc[token] = (acc[token] ?? 0) + 1
    return acc
  }, {})
}

function computeIdf(documents: string[][]) {
  const documentCount = documents.length
  const df: Record<string, number> = {}

  documents.forEach((tokens) => {
    const seen = new Set<string>()
    tokens.forEach((token) => {
      if (seen.has(token)) return
      seen.add(token)
      df[token] = (df[token] ?? 0) + 1
    })
  })

  const idf: Record<string, number> = {}
  Object.keys(df).forEach((token) => {
    idf[token] = Math.log((documentCount + 1) / (df[token] + 1)) + 1
  })

  return idf
}

function buildTfIdfVector(freqs: Record<string, number>, idf: Record<string, number>) {
  const vector: Record<string, number> = {}
  Object.entries(freqs).forEach(([token, count]) => {
    vector[token] = count * (idf[token] ?? 1)
  })
  return vector
}

function cosineSimilarity(a: Record<string, number>, b: Record<string, number>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  let dot = 0
  let normA = 0
  let normB = 0

  keys.forEach((key) => {
    const av = a[key] ?? 0
    const bv = b[key] ?? 0
    dot += av * bv
    normA += av * av
    normB += bv * bv
  })

  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function buildKnowledgeIndex() {
  if (cachedKnowledgeIndex && cachedIdf) {
    return { index: cachedKnowledgeIndex, idf: cachedIdf }
  }

  const documents = portfolioKnowledgeBase.map((entry) => {
    const tokens = expandTokens(tokenize(`${entry.title} ${entry.category} ${entry.content}`))
    return tokens
  })

  const idf = computeIdf(documents)

  const index = portfolioKnowledgeBase.map((entry, _idx) => {
    const tokens = expandTokens(tokenize(`${entry.title} ${entry.category} ${entry.content}`))
    const freqs = buildFrequency(tokens)
    return {
      id: entry.id,
      entry,
      vector: buildTfIdfVector(freqs, idf)
    }
  })

  cachedKnowledgeIndex = index
  cachedIdf = idf
  return { index, idf }
}

function findRelevantKnowledge(query: string) {
  const normalized = normalizeText(query)
  const queryTokens = expandTokens(tokenize(normalized))
  if (!queryTokens.length) {
    return []
  }

  const { index, idf } = buildKnowledgeIndex()
  const queryFreqs = buildFrequency(queryTokens)
  const queryVector = buildTfIdfVector(queryFreqs, idf)

  const scored = index
    .map(({ entry, vector }) => ({ entry, similarity: cosineSimilarity(queryVector, vector) }))
    .sort((a, b) => b.similarity - a.similarity)

  const candidateScore = scored[0]?.similarity ?? 0
  if (candidateScore < MIN_SIMILARITY) {
    const exactMatches = portfolioKnowledgeBase.filter((entry) =>
      normalizeText(`${entry.title} ${entry.content} ${entry.category}`).split(' ').some((token) => queryTokens.includes(token))
    )
    return exactMatches.slice(0, 3)
  }

  return scored.slice(0, 3).filter((item) => item.similarity > MIN_SIMILARITY).map((item) => item.entry)
}

function buildAnswer(relevantKnowledge: (typeof portfolioKnowledgeBase)[0][]) {
  if (relevantKnowledge.length === 0) {
    return "I don't have information about that in Ankit's portfolio."
  }

  const sections = relevantKnowledge.map((entry) => {
    return `**${entry.title}**\n${entry.content}`
  })

  return `Here is what I found in Ankit's portfolio:\n\n${sections.join('\n\n')}`
}

async function streamLocalResponse(
  answer: string,
  onDelta: (delta: string) => void,
  signal?: AbortSignal
) {
  let buffer = ''

  for (let i = 0; i < answer.length; i += STREAM_CHUNK_SIZE) {
    if (signal?.aborted) {
      throw new Error('Response aborted')
    }

    buffer = answer.slice(i, i + STREAM_CHUNK_SIZE)
    onDelta(buffer)
    await new Promise((resolve) => setTimeout(resolve, STREAM_DELAY_MS))
  }
}

export async function getAssistantResponse(
  query: string,
  onUpdate: (delta: string) => void,
  signal?: AbortSignal
) {
  const relevantKnowledge = findRelevantKnowledge(query)

  if (!relevantKnowledge.length) {
    const fallback = "I don't have information about that in Ankit's portfolio."
    await streamLocalResponse(fallback, onUpdate, signal)
    return null
  }

  const answer = buildAnswer(relevantKnowledge)
  await streamLocalResponse(answer, onUpdate, signal)
  return null
}
