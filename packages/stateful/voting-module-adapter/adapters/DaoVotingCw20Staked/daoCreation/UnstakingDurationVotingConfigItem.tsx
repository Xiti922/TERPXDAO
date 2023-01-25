import { useTranslation } from 'react-i18next'

import { ClockEmoji, NumberInput, SelectInput } from '@dao-dao/stateless'
import {
  DaoCreationVotingConfigItem,
  DaoCreationVotingConfigItemInputProps,
  DaoCreationVotingConfigItemReviewProps,
  DurationUnitsValues,
} from '@dao-dao/types'
import {
  convertDurationWithUnitsToHumanReadableString,
  validateNonNegative,
  validateRequired,
} from '@dao-dao/utils'

import { DaoCreationConfig } from '../types'

export const UnstakingDurationInput = ({
  data: { unstakingDuration },
  register,
  setValue,
  errors,
}: DaoCreationVotingConfigItemInputProps<DaoCreationConfig>) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-row gap-2">
      <NumberInput
        containerClassName="grow"
        error={errors?.unstakingDuration?.value}
        fieldName="unstakingDuration.value"
        onMinus={() =>
          setValue(
            'unstakingDuration.value',
            Math.max(unstakingDuration.value - 1, 0)
          )
        }
        onPlus={() =>
          setValue(
            'unstakingDuration.value',
            Math.max(unstakingDuration.value + 1, 0)
          )
        }
        register={register}
        sizing="sm"
        step={1}
        validation={[validateNonNegative, validateRequired]}
      />

      <SelectInput
        error={errors?.unstakingDuration?.units}
        fieldName="unstakingDuration.units"
        register={register}
        validation={[validateRequired]}
      >
        {DurationUnitsValues.map((type, idx) => (
          <option key={idx} value={type}>
            {t(`unit.${type}`, {
              count: unstakingDuration?.value,
            }).toLocaleLowerCase()}
          </option>
        ))}
      </SelectInput>
    </div>
  )
}

export const UnstakingDurationReview = ({
  data: { unstakingDuration },
}: DaoCreationVotingConfigItemReviewProps<DaoCreationConfig>) => {
  const { t } = useTranslation()
  return (
    <>{convertDurationWithUnitsToHumanReadableString(t, unstakingDuration)}</>
  )
}

export const UnstakingDurationVotingConfigItem: DaoCreationVotingConfigItem<DaoCreationConfig> =
  {
    Icon: ClockEmoji,
    nameI18nKey: 'form.unstakingDurationTitle',
    descriptionI18nKey: 'form.unstakingDurationDescription',
    Input: UnstakingDurationInput,
    getInputError: ({ unstakingDuration } = {}) =>
      unstakingDuration?.value || unstakingDuration?.units,
    Review: UnstakingDurationReview,
  }
