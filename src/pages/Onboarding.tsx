import { putUser } from '../api/user'
import OnboardingAnimation from '../components/OnboardingLotties'
import { useNavigate } from 'react-router-dom'
import React, { useRef, useState } from 'react'

const Onboarding = () => {
  const [dotActive, setDotActive] = useState(0)
  const targetPost = useRef<HTMLDivElement>(null)
  const userInfo = localStorage.getItem('user')
  const userId = JSON.parse(userInfo as string).id
  const navigate = useNavigate()
  // eslint-disable-next-line react/jsx-key
  const children = [<OnboardingAnimation />, <OnboardingAnimation.Second />]

  const handleScroll = (e: React.FormEvent) => {
    const currentScrollPosition = e.currentTarget.scrollLeft
    const scrollWidth = e.currentTarget.scrollWidth / React.Children.toArray(children).length
    setDotActive(Math.round(currentScrollPosition / scrollWidth))
  }

  const handleClickDot = (index: number) => {
    const postCount = React.Children.toArray(children).length
    targetPost.current?.scrollTo({
      left: (index * targetPost.current.scrollWidth) / postCount,
      behavior: 'smooth',
    })
  }

  const handleClickNext = async () => {
    const postCount = React.Children.toArray(children).length
    targetPost.current?.scrollTo({
      left: (targetPost.current.scrollWidth + 1) / postCount,
      behavior: 'smooth',
    })
  }

  const handleSkipClickEvent = async () => {
    const response = await putUser({
      userId: userId,
      data: {
        onBoarding: true,
      },
    })
    navigate('/')
    return response
  }

  return (
    <>
      <header className="absolute z-10 flex w-full p-5">
        <div className="flex h-6">
          {React.Children.toArray(children).map((value, index) => (
            // eslint-disable-next-line react/jsx-key
            <div
              className={`mr-2 h-2 w-2 rounded-3xl opacity-80 bg-${index === dotActive ? 'primary' : `[#ffffff]`}`}
              onClick={() => handleClickDot(index)}
            />
          ))}
        </div>
        <div className="w-1/2 flex-1"></div>
        <button type="button" onClick={handleSkipClickEvent} className="text-body4 font-bold text-grey-300">
          {`Skip >`}
        </button>
      </header>
      <div className="w-full">
        <div ref={targetPost} onScroll={e => handleScroll(e)} className="carousel w-full snap-mandatory">
          <div className="carousel-item w-full">
            <OnboardingAnimation />
          </div>
          <div className="carousel-item w-full">
            <OnboardingAnimation.Second />
          </div>
        </div>
      </div>
      <div className="p-5 text-right">
        <button className="btn-primary btn w-24 text-title2 font-bold text-white" onClick={handleClickNext}>
          ??????
        </button>
      </div>
    </>
  )
}

export default Onboarding
