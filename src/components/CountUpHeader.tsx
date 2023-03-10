import { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStopwatch } from 'react-timer-hook'
import { useRecoilState, useRecoilValue } from 'recoil'
import { v4 as uuid } from 'uuid'

import EditIcon from '../assets/svg/EditIcon'
import Report from '../assets/svg/ReportIcon'
import Switch from '../assets/svg/Switch'
import { countUpTimerAtom, countUpTimerRecordsAtom, userAtom } from '../recoil/atoms'
import { totalCountUpTimerSecondsSelector } from '../recoil/selectors'
import ModalPortal from './ModalPortal'

const SECOUNDS_IN_ONE_MINUTE = 60
const MINUTES_IN_ONE_HOUR = 60

export const CountUpHeader = () => {
  const navigate = useNavigate()
  const user = useRecoilValue(userAtom)

  const [timer, setTimer] = useRecoilState(countUpTimerAtom)
  const [timerRecords, setTimerRecords] = useRecoilState(countUpTimerRecordsAtom)

  const totalCountUpTimerSeconds = useRecoilValue(totalCountUpTimerSecondsSelector(timer.id))
  const { isRunning: isTimerRunning, startTime } = timer

  const [modalVisible, setModalVisible] = useState(false)
  const [isTriggered, setIsTriggered] = useState(false)
  const [timeOffset, setTimeOffset] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const getLastTimeRecord = () => {
    const sortedTimerRecords = (timerRecords ?? [])
      .filter(timeRecord => timeRecord.timerId === timer.id)
      .sort((a, b) => {
        const aTime = new Date(a.startTime).getTime()
        const bTime = new Date(b.startTime).getTime()
        if (aTime > bTime) {
          return -1
        }
        if (aTime < bTime) {
          return 1
        }
        return 0
      })

    const lastRecord = sortedTimerRecords?.[0]
    return lastRecord
  }

  const openModal = () => {
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const [reportLoginModalVisible, setReportLoginModalVisible] = useState(false)

  const openReportLoginModal = () => {
    setReportLoginModalVisible(true)
  }

  const closeReportLoginModal = () => {
    setReportLoginModalVisible(false)
  }

  const modeButtonClickHandler = () => {
    if (user) {
      navigate('/countdown')

      return
    }

    openReportLoginModal()
  }

  const reportButtonClickHandler = () => {
    if (user) {
      navigate('/report')

      return
    }

    openReportLoginModal()
  }

  const { seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({
    autoStart: false,
  })
  let newHours = hours + timeOffset.hours
  let newMinutes = minutes + timeOffset.minutes
  let newSeconds = seconds + timeOffset.seconds
  if (newSeconds >= SECOUNDS_IN_ONE_MINUTE) {
    newMinutes += 1
    newSeconds -= SECOUNDS_IN_ONE_MINUTE
  }
  if (newMinutes >= MINUTES_IN_ONE_HOUR) {
    newHours += 1
    newMinutes -= MINUTES_IN_ONE_HOUR
  }

  useEffect(() => {
    if (!startTime || !timer.id) return
    const stopWatchAndRecordsSecondsDiff = totalCountUpTimerSeconds - hours * 3600 - minutes * 60 - seconds
    if (stopWatchAndRecordsSecondsDiff < 1) {
      setTimeOffset({ hours: 0, minutes: 0, seconds: 0 })
      return
    }

    const offsetHours = Math.floor(stopWatchAndRecordsSecondsDiff / 3600)
    const offsetMinutes = Math.floor((stopWatchAndRecordsSecondsDiff - offsetHours * 3600) / 60)
    const offsetSeconds = Math.floor(stopWatchAndRecordsSecondsDiff - offsetHours * 3600 - offsetMinutes * 60)
    setTimeOffset({ hours: offsetHours, minutes: offsetMinutes, seconds: offsetSeconds })

    setIsTriggered(true)
  }, [totalCountUpTimerSeconds])

  useEffect(() => {
    if (isTriggered && !isRunning && isTimerRunning) {
      start()
    }
    setIsTriggered(false)
  }, [isTriggered])

  if (!isTimerRunning && isRunning && !timer.id) {
    reset()
    setTimeOffset({ hours: 0, minutes: 0, seconds: 0 })
  }
  if (!isTimerRunning && isRunning && timer.id) pause()

  const startTimer = () => {
    start()
    const newId = new Date().getTime()
    setTimer(prev => ({ ...prev, id: newId, isRunning: true, startTime: new Date() }))
    setTimerRecords(prev => [
      ...prev,
      {
        id: new Date().getTime(),
        userId: timer?.makerId ?? 'LOCAL',
        timerId: newId,
        startTime: new Date(),
      },
    ])
  }

  const resetTimer = () => {
    const lastRecord = getLastTimeRecord()
    if (timer?.id && isRunning) {
      setTimerRecords(prev => [
        ...(prev.filter(timeRecord => timeRecord.id !== lastRecord.id) ?? []),
        { ...lastRecord, endTime: new Date() },
      ])
    }

    setTimer(prev => ({ ...prev, id: 0, endTime: new Date(), isRunning: false }))
    reset(undefined, false)
    setTimeOffset({ hours: 0, minutes: 0, seconds: 0 })
  }

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }))
    pause()

    if (!timer.id) return
    const lastRecord = getLastTimeRecord()
    setTimerRecords(prev => [
      ...(prev.filter(timeRecord => timeRecord.id !== lastRecord.id) ?? []),
      { ...lastRecord, endTime: new Date() },
    ])
  }

  const restartTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true }))
    setTimerRecords(prev => [
      ...prev,
      {
        id: new Date().getTime(),
        userId: timer?.makerId ?? 'LOCAL',
        timerId: timer.id,
        startTime: new Date(),
      },
    ])
    start()
  }

  const [isHoveringModeButton, setIsHoveringModeButton] = useState(false)

  return (
    <>
      <div className="relative h-full w-full bg-[url('/img/countuptimer.png')] bg-cover bg-center text-white">
        <div className="absolute top-0 left-0 flex w-full items-center justify-between px-5 py-6">
          <button
            onPointerEnter={() => setIsHoveringModeButton(true)}
            onPointerLeave={() => setIsHoveringModeButton(false)}
            onClick={modeButtonClickHandler}
            className="btn-primary btn-sm btn h-10 border-0 text-lg font-bold">
            <Switch classNames={isHoveringModeButton ? 'mr-2' : ''} />
            {isHoveringModeButton ? '????????????' : ''}
          </button>

          <button onClick={reportButtonClickHandler}>
            <Report />
          </button>
        </div>
        <div className="absolute bottom-0 mb-9 min-w-full text-center text-white">
          <div className="mb-3">
            <div className="mb-3">
              <TimerDisplayedNumbers hours={newHours} minutes={newMinutes} seconds={newSeconds} />
            </div>
          </div>
          <div className="mb-4 flex items-center justify-center text-xl font-semibold">
            <h1 onClick={openModal} className="mr-1">
              {timer.name}
            </h1>
            <button onClick={openModal}>
              <EditIcon />
            </button>
          </div>
          <TimerButtons
            hasStarted={Boolean(timer.id)}
            isRunning={isRunning}
            onStartClick={startTimer}
            onResetClick={resetTimer}
            onPauseClick={pauseTimer}
            onRestartAfterPauseClick={restartTimer}
          />
        </div>
      </div>

      {modalVisible && (
        <ModalPortal closePortal={() => setModalVisible(false)} isOpened={modalVisible}>
          <TimerTitleChangeModal
            name={timer.name}
            onClose={closeModal}
            onSubmit={newTitle => setTimer(prev => ({ ...prev, name: newTitle }))}
          />
        </ModalPortal>
      )}

      {reportLoginModalVisible && (
        <ModalPortal closePortal={closeReportLoginModal} isOpened={reportLoginModalVisible}>
          <div className="fixed right-1/2 bottom-1/2 w-[24.25rem] translate-x-1/2 translate-y-1/2 rounded-2xl bg-grey-850 px-[1.375rem] pb-[1.125rem] pt-[1.5625rem]">
            <div className="flex flex-col">
              <p className="mb-4 text-[1.375rem] font-bold leading-[140%] text-grey-200">???????????? ????????????</p>
              <p className="mb-[1.375rem] text-[1rem] font-semibold leading-[1.4375rem]">
                ????????? ??????????????? ??? ????????? ????????????
              </p>
              <div className="flex gap-[0.625rem]">
                <button
                  className="width-full flex-1 rounded-[0.625rem] bg-grey-800 py-[1.125rem] text-[1.25rem] font-semibold leading-[1.5rem] text-white"
                  onClick={closeReportLoginModal}>
                  ?????????
                </button>
                <button
                  className="width-full flex-1 rounded-[0.625rem] bg-primary py-[1.125rem] text-[1.25rem] font-semibold leading-[1.5rem] text-white"
                  onClick={() => navigate('/login')}>
                  ?????????
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  )
}

interface TimerButtonsProps {
  hasStarted: boolean
  isRunning: boolean
  onStartClick: () => void
  onResetClick: () => void
  onPauseClick: () => void
  onRestartAfterPauseClick: () => void
}

export const TimerButtons = ({
  hasStarted,
  isRunning,
  onStartClick,
  onResetClick,
  onPauseClick,
  onRestartAfterPauseClick,
}: TimerButtonsProps) => {
  if (!hasStarted)
    return (
      <div>
        <button onClick={onStartClick} className="btn-primary btn h-14 gap-2 rounded-full px-5 text-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clipRule="evenodd"
            />
          </svg>
          ????????? ????????????
        </button>
      </div>
    )

  return (
    <div className="flex items-center justify-center gap-3">
      {isRunning ? (
        <button onClick={onPauseClick} className="btn-primary btn h-14 rounded-full px-5 text-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path
              fillRule="evenodd"
              d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
              clipRule="evenodd"
            />
          </svg>
          ?????????
        </button>
      ) : (
        <button
          onClick={onRestartAfterPauseClick}
          className="btn-primary btn h-14 gap-2 rounded-full px-5 text-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clipRule="evenodd"
            />
          </svg>
          ?????????
        </button>
      )}

      <button
        onClick={onResetClick}
        className="btn-circle btn h-14 w-14 rounded-full border border-grey-850 bg-grey-900">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-8 w-8">
          <path
            fillRule="evenodd"
            d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

interface TimerTitleChangeModalProps {
  name: string
  onClose: () => void
  onSubmit: (name: string) => void
}

export const TimerTitleChangeModal = ({ name, onClose, onSubmit }: TimerTitleChangeModalProps) => {
  const [timerTitle, setTimerTitle] = useState(name)
  return (
    <div className="w-[24.25rem] rounded-2xl bg-grey-850 px-5 pb-[1.125rem] pt-6">
      <form
        className="flex flex-col"
        onSubmit={e => {
          e.preventDefault()
          onSubmit(timerTitle)
          onClose()
        }}>
        <label htmlFor="nickname" className="mb-[0.625rem] text-[0.875rem] font-bold leading-[0.875rem] text-grey-300">
          ????????? ??????
        </label>
        <input
          value={timerTitle}
          onChange={e => setTimerTitle(e.target.value)}
          type="text"
          id="nickname"
          className="mb-6 rounded-[0.625rem] border border-solid border-grey-800 bg-grey-900 px-[0.8125rem] pt-[1.1875rem] pb-[1.25rem] text-[1.125rem] font-medium leading-[1.3125rem] text-grey-300 focus:border-primary"
          autoFocus
        />
        <div className="flex w-full justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="width-full flex-1 rounded-[0.625rem] bg-grey-800  py-[1.125rem] text-[1.25rem] font-semibold leading-[1.5rem] text-white">
            ??????
          </button>
          <button
            type="submit"
            className="width-full flex-1 rounded-[0.625rem] bg-primary py-[1.125rem] text-[1.25rem] font-semibold leading-[1.5rem] text-white">
            ????????????
          </button>
        </div>
      </form>
    </div>
  )
}

interface TimerDisplayedNumbersProps {
  hours: number
  minutes: number
  seconds: number
}

const TimerDisplayedNumbers = ({ hours, minutes, seconds }: TimerDisplayedNumbersProps) => {
  return (
    <span className="countdown font-montserrat text-[4rem] font-bold">
      {/* @ts-ignore */}
      <span style={{ '--value': hours }}></span>:<span style={{ '--value': minutes }}></span>:{/* @ts-ignore */}
      <span style={{ '--value': seconds }}></span>
    </span>
  )
}
