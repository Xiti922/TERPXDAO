import { ArrowDropUp } from '@mui/icons-material'
import clsx from 'clsx'

import { Tooltip } from '../tooltip/Tooltip'

export interface ProgressBarProps {
  rows: {
    backgroundColor?: string
    thickness: number
    data?: {
      value: number
      color: string
    }[]
  }[]
  caretPosition?: number
  caretTooltip?: string
  alignEnd?: boolean
}

export const ProgressBar = ({
  rows,
  caretPosition,
  caretTooltip,
  alignEnd,
}: ProgressBarProps) => (
  <div className="relative w-full">
    <div
      className={`flex w-full flex-col items-stretch overflow-hidden rounded-full`}
    >
      {rows.map(({ backgroundColor, data, thickness }, rowIndex) => (
        <div
          key={rowIndex}
          className={clsx(
            'flex flex-row items-stretch',
            !backgroundColor && 'bg-background-secondary',
            alignEnd && 'justify-end'
          )}
          style={{
            backgroundColor,
            height: thickness,
          }}
        >
          {data?.map(({ value, color }, index) => (
            <div
              key={index}
              className="h-full"
              style={{ width: `${value}%`, backgroundColor: color }}
            ></div>
          ))}
        </div>
      ))}
    </div>

    {caretPosition !== undefined && (
      <Tooltip title={caretTooltip}>
        <ArrowDropUp
          className="absolute bottom-[-0.825rem] z-10 !h-6 !w-6 text-icon-primary"
          style={{
            left: `${caretPosition}%`,
          }}
        />
      </Tooltip>
    )}
  </div>
)
