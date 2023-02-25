interface Props {}

const WhiteHeart = ({}: Props) => {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_ii_1443_8887)">
        <path
          d="M19.8807 2.41016C19.3676 1.88043 18.7583 1.46022 18.0878 1.17352C17.4172 0.886822 16.6985 0.739258 15.9727 0.739258C15.2468 0.739258 14.5281 0.886822 13.8576 1.17352C13.187 1.46022 12.5778 1.88043 12.0646 2.41016L10.9997 3.509L9.93482 2.41016C8.89834 1.34065 7.49258 0.739812 6.02679 0.739812C4.56099 0.739812 3.15523 1.34065 2.11876 2.41016C1.08229 3.47966 0.5 4.93021 0.5 6.44272C0.5 7.95522 1.08229 9.40578 2.11876 10.4753L3.18367 11.5741L10.6407 19.2688C10.8371 19.4715 11.1623 19.4715 11.3588 19.2688L18.8158 11.5741L19.8807 10.4753C20.3941 9.94581 20.8013 9.31715 21.0791 8.62523C21.357 7.93331 21.5 7.19168 21.5 6.44272C21.5 5.69375 21.357 4.95213 21.0791 4.2602C20.8013 3.56828 20.3941 2.93963 19.8807 2.41016Z"
          fill="url(#paint0_linear_1443_8887)"
        />
      </g>
      <defs>
        <filter
          id="filter0_ii_1443_8887"
          x="-0.5"
          y="-0.260742"
          width="23"
          height="20.6816"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="1" dy="-1" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.419608 0 0 0 0 0.462745 0 0 0 0 0.517647 0 0 0 1 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1443_8887" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-1" dy="1" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.898039 0 0 0 0 0.909804 0 0 0 0 0.921569 0 0 0 1 0" />
          <feBlend mode="normal" in2="effect1_innerShadow_1443_8887" result="effect2_innerShadow_1443_8887" />
        </filter>
        <linearGradient
          id="paint0_linear_1443_8887"
          x1="11"
          y1="0.739258"
          x2="11"
          y2="19.6393"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F9FAFB" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default WhiteHeart
