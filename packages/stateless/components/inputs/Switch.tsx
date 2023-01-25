import clsx from 'clsx'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { BooleanFieldNames } from '@dao-dao/types'

import {
  TooltipInfoIcon,
  TooltipInfoIconProps,
} from '../tooltip/TooltipInfoIcon'

export interface SwitchProps {
  enabled: boolean
  onClick?: () => void
  className?: string
  sizing?: 'sm' | 'lg'
  readOnly?: boolean
}

export const Switch = ({
  enabled,
  onClick,
  className,
  sizing = 'lg',
  readOnly,
}: SwitchProps) => (
  <div
    className={clsx(
      'relative flex flex-none items-center rounded-full',
      {
        'cursor-pointer hover:opacity-90': !readOnly,
        'bg-background-button-active': enabled,
        'border border-border-interactive-focus bg-transparent': !enabled,
        // Sizing.
        'h-[16px] w-[28px]': sizing === 'sm',
        'h-[38px] w-[67px]': sizing === 'lg',
      },
      className
    )}
    onClick={readOnly ? undefined : onClick}
  >
    <div
      className={clsx(
        'absolute rounded-full bg-background-button transition-all',
        // Sizing.
        {
          // Small
          'h-[10px] w-[10px]': sizing === 'sm',
          'left-[15px]': sizing === 'sm' && enabled,
          'left-[2px]': sizing === 'sm' && !enabled,
          // Large
          'h-[28px] w-[28px]': sizing === 'lg',
          'left-[33px]': sizing === 'lg' && enabled,
          'left-[4.5px]': sizing === 'lg' && !enabled,
        }
      )}
    ></div>
  </div>
)

export interface SwitchCardProps extends SwitchProps {
  containerClassName?: string
  // Fallback for both on and off. Use if label should not change.
  label?: string
  onLabel?: string
  offLabel?: string
  tooltip?: string
  tooltipIconSize?: TooltipInfoIconProps['size']
}

export const SwitchCard = ({
  containerClassName,
  label,
  onLabel: _onLabel,
  offLabel: _offLabel,
  tooltip,
  tooltipIconSize,
  ...props
}: SwitchCardProps) => {
  const { t } = useTranslation()

  const onLabel = _onLabel ?? label ?? t('info.enabled')
  const offLabel = _offLabel ?? label ?? t('info.disabled')

  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-between gap-4 rounded-md bg-background-secondary py-2 px-3',
        containerClassName
      )}
    >
      <div className="flex flex-row items-center gap-1">
        {tooltip && <TooltipInfoIcon size={tooltipIconSize} title={tooltip} />}

        <p className="secondary-text min-w-[5rem]">
          {props.enabled ? onLabel : offLabel}
        </p>
      </div>

      <Switch {...props} />
    </div>
  )
}

export type FormSwitchWrapperProps<
  Props,
  FV extends FieldValues,
  BooleanFieldName extends BooleanFieldNames<FV>
> = Omit<Props, 'enabled' | 'onClick'> & {
  fieldName: BooleanFieldName
  value: boolean | undefined
  setValue: UseFormSetValue<FV>
  onToggle?: (newValue: boolean) => void
}

export const FormSwitch = <
  FV extends FieldValues,
  BooleanFieldName extends BooleanFieldNames<FV>
>({
  fieldName,
  value,
  setValue,
  onToggle,
  ...props
}: FormSwitchWrapperProps<SwitchProps, FV, BooleanFieldName>) => (
  <Switch
    enabled={!!value}
    onClick={() => {
      const newValue = !value
      setValue(fieldName, newValue as any)
      onToggle?.(newValue)
    }}
    {...props}
  />
)

export const FormSwitchCard = <
  FV extends FieldValues,
  BooleanFieldName extends BooleanFieldNames<FV>
>({
  fieldName,
  value,
  setValue,
  onToggle,
  ...props
}: FormSwitchWrapperProps<SwitchCardProps, FV, BooleanFieldName>) => (
  <SwitchCard
    enabled={!!value}
    onClick={() => {
      const newValue = !value
      setValue(fieldName, newValue as any)
      onToggle?.(newValue)
    }}
    sizing="sm"
    tooltipIconSize="sm"
    {...props}
  />
)
