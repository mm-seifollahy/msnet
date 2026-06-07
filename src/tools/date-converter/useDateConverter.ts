import { useState } from 'react'
import jalaali from 'jalaali-js'

export type CalendarType = 'jalali' | 'gregorian' | 'unix'

export interface ConversionResult {
  jalali: string
  gregorian: string
  unix: string
}

function padZero(n: number) {
  return String(n).padStart(2, '0')
}

function gregorianToResult(year: number, month: number, day: number): ConversionResult {
  const { jy, jm, jd } = jalaali.toJalaali(year, month, day)
  const date = new Date(year, month - 1, day)
  const unixTs = Math.floor(date.getTime() / 1000)
  return {
    jalali: `${jy}/${padZero(jm)}/${padZero(jd)}`,
    gregorian: `${year}/${padZero(month)}/${padZero(day)}`,
    unix: String(unixTs),
  }
}

function jalaliToResult(jy: number, jm: number, jd: number): ConversionResult {
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd)
  return gregorianToResult(gy, gm, gd)
}

function unixToResult(unix: number): ConversionResult {
  const date = new Date(unix * 1000)
  return gregorianToResult(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

export function useDateConverter() {
  const [inputType, setInputType] = useState<CalendarType>('jalali')
const now = new Date()
const { jy, jm, jd } = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate())
const [inputValue, setInputValue] = useState(`${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`)
const [result, setResult] = useState<ConversionResult | null>(() => {
  return jalaliToResult(jy, jm, jd)
})
  const [error, setError] = useState('')

  function convert() {
    setError('')
    setResult(null)

    try {
      if (inputType === 'unix') {
        const unix = parseInt(inputValue.trim())
        if (isNaN(unix)) throw new Error('عدد معتبر وارد کنید')
        setResult(unixToResult(unix))

      } else if (inputType === 'gregorian') {
        const parts = inputValue.trim().split(/[-/]/)
        if (parts.length !== 3) throw new Error('فرمت باید YYYY/MM/DD باشد')
        const [y, m, d] = parts.map(Number)
        if (y < 1 || m < 1 || m > 12 || d < 1 || d > 31) throw new Error('تاریخ میلادی معتبر نیست')
        setResult(gregorianToResult(y, m, d))

      } else {
        const parts = inputValue.trim().split(/[-/]/)
        if (parts.length !== 3) throw new Error('فرمت باید YYYY/MM/DD باشد')
        const [jy, jm, jd] = parts.map(Number)
        if (!jalaali.isValidJalaaliDate(jy, jm, jd)) throw new Error('تاریخ شمسی معتبر نیست')
        setResult(jalaliToResult(jy, jm, jd))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطای ناشناخته')
    }
  }

  function setToday() {
    const now = new Date()
    if (inputType === 'unix') {
      setInputValue(String(Math.floor(now.getTime() / 1000)))
    } else if (inputType === 'gregorian') {
      setInputValue(`${now.getFullYear()}/${padZero(now.getMonth() + 1)}/${padZero(now.getDate())}`)
    } else {
      const { jy, jm, jd } = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate())
      setInputValue(`${jy}/${padZero(jm)}/${padZero(jd)}`)
    }
    setResult(null)
    setError('')
  }

  return {
    inputType, setInputType,
    inputValue, setInputValue,
    result, error,
    convert, setToday,
  }
}