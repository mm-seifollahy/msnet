import { useState, useMemo } from 'react'
import jalaali from 'jalaali-js'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DateValue {
  type: 'jalali' | 'gregorian'
  year: number
  month: number
  day: number
}

interface JalaliDatePickerProps {
  value: DateValue | null
  onChange: (value: DateValue) => void
  calendarType: 'jalali' | 'gregorian'
}

const jalaliMonths = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند',
]

const gregorianMonths = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December',
]

function getJalaliDaysInMonth(year: number, month: number): number {
  if (month <= 6) return 31
  if (month <= 11) return 30
  return jalaali.isLeapJalaaliYear(year) ? 30 : 29
}

function getGregorianDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function JalaliDatePicker({ value, onChange, calendarType }: JalaliDatePickerProps) {
  const [open, setOpen] = useState(false)

  const now = new Date()
  const { jy: currentJY, jm: currentJM, jd: currentJD } = jalaali.toJalaali(
    now.getFullYear(), now.getMonth() + 1, now.getDate()
  )

  const defaultYear = calendarType === 'jalali' ? currentJY : now.getFullYear()
  const defaultMonth = calendarType === 'jalali' ? currentJM : now.getMonth() + 1
  const defaultDay = calendarType === 'jalali' ? currentJD : now.getDate()

  const [selectedYear, setSelectedYear] = useState(value?.year ?? defaultYear)
  const [selectedMonth, setSelectedMonth] = useState(value?.month ?? defaultMonth)
  const [selectedDay, setSelectedDay] = useState(value?.day ?? defaultDay)

  const years = useMemo(() => {
    if (calendarType === 'jalali') {
      return Array.from({ length: 100 }, (_, i) => currentJY - 50 + i)
    }
    return Array.from({ length: 100 }, (_, i) => now.getFullYear() - 50 + i)
  }, [calendarType])

  const months = calendarType === 'jalali' ? jalaliMonths : gregorianMonths

  const daysInMonth = useMemo(() => {
    if (calendarType === 'jalali') {
      return getJalaliDaysInMonth(selectedYear, selectedMonth)
    }
    return getGregorianDaysInMonth(selectedYear, selectedMonth)
  }, [calendarType, selectedYear, selectedMonth])

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  function handleConfirm() {
    onChange({ type: calendarType, year: selectedYear, month: selectedMonth, day: selectedDay })
    setOpen(false)
  }

  function formatDisplay() {
    if (!value) return calendarType === 'jalali' ? 'انتخاب تاریخ' : 'Select date'
    return `${value.year}/${String(value.month).padStart(2, '0')}/${String(value.day).padStart(2, '0')}`
  }

  const selectClass = 'flex-1 px-2 py-1.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-between font-normal', !value && 'text-muted-foreground')}
        >
          <span dir="ltr">{formatDisplay()}</span>
          <CalendarIcon size={16} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <div className="flex flex-col gap-4">

          {/* Year & Month */}
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={e => { setSelectedMonth(Number(e.target.value)); setSelectedDay(1) }}
              className={selectClass}
              dir={calendarType === 'jalali' ? 'rtl' : 'ltr'}
            >
              {months.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={e => { setSelectedYear(Number(e.target.value)); setSelectedDay(1) }}
              className={selectClass}
              dir="ltr"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={cn(
                  'h-8 w-full rounded-md text-sm transition-colors',
                  selectedDay === d
                    ? 'bg-foreground text-background'
                    : 'hover:bg-muted text-foreground'
                )}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleConfirm} className="flex-1" size="sm">
              تایید
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              انصراف
            </Button>
          </div>

        </div>
      </PopoverContent>
    </Popover>
  )
}