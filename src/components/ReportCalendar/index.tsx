import { useCalendar } from '@h6s/calendar'
import { format, getDate, getMonth, getYear, isEqual, isThisYear, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useEffect } from 'react'
import cx from 'classnames'
import ChevronRight from '../../assets/svg/ChevronRight'
import ChevronLeft from '../../assets/svg/ChevronLeft'
import GreenDot from '../../assets/svg/GreenDot'
import { TimeBlock } from '../../api/profile'

const getDayColorClassName = (hour: number) => {
  if (hour > 0 && hour < 4) {
    return 'bg-[#282651]'
  }

  if (hour >= 4 && hour < 7) {
    return 'bg-[#3E388B]'
  }

  if (hour >= 7 && hour < 10) {
    return 'bg-[#554AC5]'
  }

  if (hour >= 10) {
    return 'bg-[#6C5CFF]'
  }

  return 'bg-grey-1000'
}

const today = new Date(new Date().toDateString())
const todayYear = getYear(today)
const todayMonth = getMonth(today) + 1

interface ReportCalendarProps {
  useCalendarHook: ReturnType<typeof useCalendar>
  timeBlocks: Record<string, TimeBlock>
  totalDuration: string
  hoveredDate: Date | null
  selectedDate: Date | null
  onMouseEnterDate: (date: Date) => void
  onMouseLeaveDate: (date: Date) => void
  onClickDate: (date: Date) => void
}

const ReportCalendar: React.FC<ReportCalendarProps> = ({
  useCalendarHook,
  timeBlocks,
  totalDuration,
  hoveredDate,
  selectedDate,
  onMouseEnterDate,
  onMouseLeaveDate,
  onClickDate,
}) => {
  const { headers, body, view, navigation, cursorDate } = useCalendarHook

  const cursorYear = getYear(cursorDate)
  const cursorMonth = getMonth(cursorDate) + 1
  const isEndMonth = cursorYear === todayYear && cursorMonth === todayMonth

  const prevButtonClickHandler = () => {
    navigation.toPrev()
  }

  const nextButtonClickHandler = () => {
    navigation.toNext()
  }

  const dateMouseEnterHandler = (date: Date, enabled: boolean) => {
    if (!enabled) return

    onMouseEnterDate(date)
  }

  const dateMouseLeaveHandler = (date: Date, enabled: boolean) => {
    if (!enabled) return

    onMouseLeaveDate(date)
  }

  const dateClickHandler = (date: Date, enabled: boolean) => {
    if (!enabled) return

    onClickDate(date)
  }

  useEffect(() => {
    view.setWeekStartsOn(1)
  }, [])

  return (
    <div className="mx-auto my-0 flex max-w-[24.25rem] flex-col gap-[1.25rem]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[0.3125rem]">
          <button type="button" onClick={prevButtonClickHandler}>
            <ChevronLeft />
          </button>
          <span className="text-[1.4375rem] font-semibold text-grey-200">
            {format(cursorDate, isThisYear(cursorDate) ? 'M월' : 'yy년 M월')}
          </span>
          <button type="button" onClick={nextButtonClickHandler} disabled={isEndMonth}>
            {isEndMonth ? <ChevronRight stroke="#333D4B" /> : <ChevronRight />}
          </button>
        </div>
        <p className="text-[1.25rem] font-semibold text-grey-200">🔥{totalDuration} 작업중</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-7 gap-1 leading-[1.125rem]">
          {headers.weekDays.map(({ key, value }) => (
            <div key={key} className="font-grey-400 text-center text-[0.9375rem] font-semibold">
              {format(value, 'E', { locale: ko })}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {body.value.map(({ value: days }) =>
            days.map(({ key, value }) => {
              const valueMonth = getMonth(value) + 1
              const isCursorMonth = cursorMonth === valueMonth
              const valueDateString = format(value, 'yyyy-MM-dd')

              const timeBlockHour = timeBlocks[valueDateString] ? timeBlocks[valueDateString].hour : 0
              const timeBlockMinute = timeBlocks[valueDateString] ? timeBlocks[valueDateString].minute : 0
              const timeBlockHourString = timeBlocks[valueDateString] ? `${timeBlockHour}`.padStart(2, '0') : '00'
              const timeBlockMinuteString = timeBlocks[valueDateString] ? `${timeBlockMinute}`.padStart(2, '0') : '00'
              const hourMinute = `${timeBlockHourString}:${timeBlockMinuteString}`

              const isTimeNone = hourMinute === '00:00'
              const isInGroupTimer = timeBlocks[valueDateString] ? timeBlocks[valueDateString].inGroupTimer : false

              if (isCursorMonth && selectedDate && isEqual(selectedDate, value)) {
                return (
                  <div
                    key={key}
                    className={`relative flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[0.625rem] border-2 border-primary bg-grey-900 text-[0.9375rem] font-semibold leading-[1.125rem] ${
                      isCursorMonth ? 'text-grey-200' : 'text-grey-800'
                    }`}>
                    {isCursorMonth && isInGroupTimer && (
                      <div className="absolute right-[-0.125rem] top-[-0.125rem] translate-x-[2px] translate-y-[-2px]">
                        <GreenDot />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <span className="relative self-start opacity-60">
                        {getDate(value)}
                        {isToday(value) && (
                          <div className="absolute top-[0.0625rem] right-[-0.25rem] h-1 w-1 rounded-full bg-grey-300" />
                        )}
                      </span>
                      <span className={`${isTimeNone ? 'text-grey-700' : ''}`}>{hourMinute}</span>
                    </div>
                  </div>
                )
              }

              if (isCursorMonth && hoveredDate && isEqual(hoveredDate, value)) {
                return (
                  <div
                    key={key}
                    className={`h-[3.25rem] w-[3.25rem] rounded-[0.625rem] ${getDayColorClassName(
                      timeBlockHour,
                    )} relative flex cursor-pointer items-center justify-center text-[0.9375rem] font-semibold leading-[1.125rem] ${
                      isCursorMonth ? 'text-grey-200' : 'text-grey-800'
                    }`}
                    onMouseLeave={() => dateMouseLeaveHandler(value, isCursorMonth)}
                    onClick={() => dateClickHandler(value, isCursorMonth)}>
                    {isCursorMonth && isInGroupTimer && (
                      <div className="absolute right-[-0.125rem] top-[-0.125rem]">
                        <GreenDot />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <span className="relative self-start opacity-60">
                        {getDate(value)}
                        {isToday(value) && (
                          <div className="absolute top-[0.0625rem] right-[-0.25rem] h-1 w-1 rounded-full bg-grey-300" />
                        )}
                      </span>
                      <span className={`${isTimeNone ? 'text-grey-700' : ''}`}>{hourMinute}</span>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={key}
                  className={`h-[3.25rem] w-[3.25rem] rounded-[0.625rem] ${cx({
                    [getDayColorClassName(timeBlockHour)]: isCursorMonth,
                  })} relative flex items-center justify-center text-[1.5625rem] font-semibold ${
                    isCursorMonth ? 'text-grey-300' : 'text-grey-800'
                  }`}
                  onMouseEnter={() => dateMouseEnterHandler(value, isCursorMonth)}>
                  {isCursorMonth && isInGroupTimer && (
                    <div className="absolute right-[-0.125rem] top-[-0.125rem]">
                      <GreenDot />
                    </div>
                  )}
                  {isToday(value) && (
                    <div className="absolute top-[0.3125rem] left-auto right-auto h-[0.375rem] w-[0.375rem] rounded-full bg-grey-300" />
                  )}
                  {getDate(value)}
                </div>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportCalendar
