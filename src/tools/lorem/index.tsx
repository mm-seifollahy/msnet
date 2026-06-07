import { useState } from 'react'
import { Copy, Check, RefreshCw, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLorem, type Language, type OutputType } from './useLorem.ts'

const languages: { value: Language; label: string }[] = [
  { value: 'fa', label: 'فارسی' },
  { value: 'en', label: 'انگلیسی' },
  { value: 'mixed', label: 'ترکیبی' },
]

const outputTypes: { value: OutputType; label: string }[] = [
  { value: 'paragraphs', label: 'پاراگراف' },
  { value: 'sentences', label: 'جمله' },
  { value: 'words', label: 'کلمه' },
]

const counts = [1, 2, 3, 5, 8, 10]

export default function LoremTool() {
  const [language, setLanguage] = useState<Language>('fa')
  const [outputType, setOutputType] = useState<OutputType>('paragraphs')
  const [count, setCount] = useState(3)

  const { output, copied, generate, copy } = useLorem({ language, outputType, count })

  return (
    <div className="max-w-3xl mx-auto p-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
          <FileText size={20} className="text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Lorem Ipsum</h1>
          <p className="text-sm text-muted-foreground">تولید متن آزمایشی فارسی و انگلیسی</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6 mb-8">

        {/* Language */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">زبان</label>
          <div className="flex gap-2">
            {languages.map((l) => (
              <button
                key={l.value}
                onClick={() => setLanguage(l.value)}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors border ${
                  language === l.value
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Output Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">نوع خروجی</label>
          <div className="flex gap-2">
            {outputTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setOutputType(t.value)}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors border ${
                  outputType === t.value
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">تعداد</label>
          <div className="flex gap-2">
            {counts.map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className={`w-10 h-9 rounded-md text-sm transition-colors border ${
                  count === c
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Generate Button */}
      <Button onClick={generate} className="mb-6 gap-2 py-5">
        <RefreshCw size={16} />
        تولید متن
      </Button>

      {/* Output */}
      {output && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">خروجی</Badge>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'کپی شد!' : 'کپی'}
            </button>
          </div>
          <div
            className="p-4 rounded-lg bg-muted text-sm text-foreground leading-8 whitespace-pre-wrap"
            style={{ direction: language === 'en' ? 'ltr' : 'rtl' }}
          >
            {output}
          </div>
        </div>
      )}

    </div>
  )
}