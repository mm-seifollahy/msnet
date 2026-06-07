import { useState } from 'react'
import { ArrowLeftRight, Calendar, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JalaliDatePicker, type DateValue } from '@/components/ui/jalali-date-picker'
import { useDateConverter, type CalendarType } from './useDateConverter'
import jalaali from 'jalaali-js'

const calendarTypes: { value: CalendarType; label: string }[] = [
  { value: 'jalali', label: 'شمسی' },
  { value: 'gregorian', label: 'میلادی' },
  { value: 'unix', label: 'یونیکس' },
]

const resultLabels: { key: 'jalali' | 'gregorian' | 'unix'; label: string }[] = [
  { key: 'jalali', label: 'شمسی' },
  { key: 'gregorian', label: 'میلادی' },
  { key: 'unix', label: 'یونیکس تایم‌استمپ' },
]

export default function DateConverterTool() {
  const {
    inputType, setInputType,
    inputValue, setInputValue,
    result, error,
    convert, setToday,
  } = useDateConverter()

    const now = new Date()
    const { jy, jm, jd } = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate())

    const todayJalali: DateValue = { type: 'jalali', year: jy, month: jm, day: jd }
    const todayGregorian: DateValue = { type: 'gregorian', year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }

    const [datePickerValue, setDatePickerValue] = useState<DateValue | null>(todayJalali)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  async function copyValue(value: string, key: string) {
    await navigator.clipboard.writeText(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  function handleDatePickerChange(val: DateValue) {
    setDatePickerValue(val)
    const formatted = `${val.year}/${String(val.month).padStart(2, '0')}/${String(val.day).padStart(2, '0')}`
    setInputValue(formatted)
  }

  const showDatePicker = inputType === 'jalali' || inputType === 'gregorian'

  return (
    <div className="max-w-2xl mx-auto p-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
          <Calendar size={20} className="text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">تبدیل تاریخ</h1>
          <p className="text-sm text-muted-foreground">تبدیل بین تاریخ شمسی، میلادی و یونیکس</p>
        </div>
      </div>

      {/* Input Type */}
      <div className="flex flex-col gap-2 mb-6">
        <label className="text-sm font-medium text-foreground">نوع ورودی</label>
        <div className="flex gap-2">
          {calendarTypes.map((c) => (
            <button
              key={c.value}
                onClick={() => {
                setInputType(c.value)
                if (c.value === 'jalali') {
                    setDatePickerValue(todayJalali)
                    setInputValue(`${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`)
                } else if (c.value === 'gregorian') {
                    setDatePickerValue(todayGregorian)
                    setInputValue(`${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`)
                } else {
                    setDatePickerValue(null)
                    setInputValue(String(Math.floor(now.getTime() / 1000)))
                }
                }}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors border ${
                inputType === c.value
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">تاریخ</label>
          {inputType !== 'unix' && (
            <button
              onClick={setToday}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              امروز
            </button>
          )}
        </div>

        {showDatePicker ? (
          <JalaliDatePicker
            value={datePickerValue}
            onChange={handleDatePickerChange}
            calendarType={inputType as 'jalali' | 'gregorian'}
          />
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && convert()}
              placeholder="1710892800"
              className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
              dir="ltr"
            />
            <button
              onClick={setToday}
              className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              الان
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Convert Button */}
      <Button onClick={convert} className="w-full mb-8 gap-2">
        <ArrowLeftRight size={16} />
        تبدیل
      </Button>

      {/* Result */}
      {result && (
        <div className="flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit">نتیجه</Badge>
          {resultLabels.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground" dir="ltr">
                  {result[key]}
                </span>
              </div>
              <button
                onClick={() => copyValue(result[key], key)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedKey === key ? <Check size={14} /> : <Copy size={14} />}
                {copiedKey === key ? 'کپی شد!' : 'کپی'}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}