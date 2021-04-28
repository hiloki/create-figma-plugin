/** @jsx h */
import classnames from '@sindresorhus/class-names'
import { ComponentChildren, h, JSX } from 'preact'
import { useCallback } from 'preact/hooks'

import { OnChange, OnValueChange, Props } from '../../../types'
import { Stack, StackSpace } from '../../layout/stack/stack'
import styles from './radio-buttons.css'

export interface RadioButtonsOption<S extends boolean | number | string> {
  disabled?: boolean
  children?: ComponentChildren
  value: S
}
export interface RadioButtonsProps<
  N extends string,
  V extends boolean | number | string
> {
  disabled?: boolean
  name?: N
  onChange?: OnChange<HTMLInputElement>
  onValueChange?: OnValueChange<V, N, null | V>
  options: Array<RadioButtonsOption<V>>
  propagateEscapeKeyDown?: boolean
  space?: StackSpace
  value: null | V
}

const ITEM_ID_DATA_ATTRIBUTE = 'data-radio-buttons-item-id'

export function RadioButtons<
  T extends string,
  S extends boolean | number | string
>({
  disabled = false,
  name,
  onChange = function () {},
  onValueChange = function () {},
  options,
  propagateEscapeKeyDown = true,
  space = 'small',
  value,
  ...rest
}: Props<HTMLInputElement, RadioButtonsProps<T, S>>): JSX.Element {
  const handleChange = useCallback(
    function (event: JSX.TargetedEvent<HTMLInputElement>) {
      const id = event.currentTarget.getAttribute(
        ITEM_ID_DATA_ATTRIBUTE
      ) as string
      const newValue = options[parseInt(id, 10)].value
      onValueChange(newValue, name, value)
      onChange(event)
    },
    [name, onChange, onValueChange, options, value]
  )

  const handleKeyDown = useCallback(
    function (event: JSX.TargetedKeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Escape') {
        if (propagateEscapeKeyDown === false) {
          event.stopPropagation()
        }
        event.currentTarget.blur()
      }
      if (event.key === 'Enter') {
        const id = event.currentTarget.getAttribute(
          ITEM_ID_DATA_ATTRIBUTE
        ) as string
        const newValue = options[parseInt(id, 10)].value
        onValueChange(newValue, name, value)
        onChange(event)
      }
    },
    [name, onChange, onValueChange, options, propagateEscapeKeyDown, value]
  )

  return (
    <Stack space={space}>
      {options.map(function (option, index) {
        const children =
          typeof option.children === 'undefined'
            ? `${option.value}`
            : option.children
        const isOptionDisabled = disabled === true || option.disabled === true
        return (
          <label
            key={index}
            class={classnames(
              styles.label,
              isOptionDisabled === true ? styles.disabled : null
            )}
          >
            <input
              {...rest}
              checked={value === option.value}
              class={styles.input}
              disabled={isOptionDisabled === true}
              name={name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              tabIndex={isOptionDisabled === true ? -1 : 0}
              type="radio"
              {...{ [ITEM_ID_DATA_ATTRIBUTE]: `${index}` }}
            />
            <div class={styles.children}>{children}</div>
          </label>
        )
      })}
    </Stack>
  )
}
