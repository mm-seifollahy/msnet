import { useState, useCallback } from 'react'
import { loremData } from './data'

export type Language = 'fa' | 'en' | 'mixed'
export type OutputType = 'paragraphs' | 'sentences' | 'words'

interface UseLoremOptions {
  language: Language
  outputType: OutputType
  count: number
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateWords(sentences: string[], count: number): string {
  const allWords = sentences.join(' ').split(' ')
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    result.push(getRandomItem(allWords))
  }
  return result.join(' ')
}

function generateSentences(sentences: string[], count: number): string {
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    result.push(getRandomItem(sentences))
  }
  return result.join(' ')
}

function generateParagraphs(sentences: string[], count: number): string {
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    const sentenceCount = Math.floor(Math.random() * 3) + 3
    const paragraph: string[] = []
    for (let j = 0; j < sentenceCount; j++) {
      paragraph.push(getRandomItem(sentences))
    }
    result.push(paragraph.join(' '))
  }
  return result.join('\n\n')
}

export function useLorem({ language, outputType, count }: UseLoremOptions) {
  const [output, setOutput] = useState(() => generateParagraphs(loremData.fa, 3))
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    // eslint-disable-next-line no-useless-assignment
    let sentences: string[] = []

    if (language === 'fa') sentences = loremData.fa
    else if (language === 'en') sentences = loremData.en
    else sentences = [...loremData.fa, ...loremData.en]

    // eslint-disable-next-line no-useless-assignment
    let result = ''
    if (outputType === 'words') result = generateWords(sentences, count)
    else if (outputType === 'sentences') result = generateSentences(sentences, count)
    else result = generateParagraphs(sentences, count)

    setOutput(result)
  }, [language, outputType, count])

  const copy = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  return { output, copied, generate, copy }
}