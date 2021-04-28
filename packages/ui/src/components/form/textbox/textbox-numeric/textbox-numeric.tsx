/** @jsx h */
import {
  evaluateNumericExpression,
  isValidNumericInput,
  MIXED_NUMBER,
  MIXED_STRING
} from '@create-figma-plugin/utilities'
import classnames from '@sindresorhus/class-names'
import { ComponentChildren, h, JSX } from 'preact'
import { useCallback, useEffect } from 'preact/hooks'

import { OnChange, OnValueChange, Props } from '../../../../types'
import styles from '../textbox.css'
import { computeNextValue } from '../utilities/compute-next-value'
import { isKeyCodeCharacterGenerating } from '../utilities/is-keycode-character-generating'

export interface TextboxNumericProps<T extends string> {
  disabled?: boolean
  icon?: ComponentChildren
  incrementBig?: number
  incrementSmall?: number
  integer?: boolean
  maximum?: number
  minimum?: number
  name?: T
  noBorder?: boolean
  onChange?: OnChange<HTMLInputElement>
  onValueChange?: OnValueChange<string, T>
  onNumericValueChange?: (value: null | number, name?: T) => void
  placeholder?: string
  propagateEscapeKeyDown?: boolean
  value: string
}

const nonDigitRegex = /[^\d.]/

export function TextboxNumeric<T extends string>({
  disabled = false,
  icon,
  incrementBig = 10,
  incrementSmall = 1,
  integer = false,
  maximum,
  minimum,
  name,
  noBorder = false,
  onChange = function () {},
  onValueChange = function () {},
  onNumericValueChange,
  placeholder,
  propagateEscapeKeyDown = true,
  value,
  ...rest
}: Props<HTMLInputElement, TextboxNumericProps<T>>): JSX.Element {
  const handleFocus = useCallback(function (
    event: JSX.TargetedFocusEvent<HTMLInputElement>
  ) {
    event.currentTarget.select()
  },
  [])

  const handleInput = useCallback(
    function (event: JSX.TargetedEvent<HTMLInputElement>) {
      onValueChange(event.currentTarget.value, name, value)
      onChange(event)
    },
    [name, onChange, onValueChange, value]
  )

  const handleKeyDown = useCallback(
    function (event: JSX.TargetedKeyboardEvent<HTMLInputElement>) {
      const key = event.key
      if (key === 'Escape') {
        if (propagateEscapeKeyDown === false) {
          event.stopPropagation()
        }
        event.currentTarget.blur()
        return
      }
      const element = event.currentTarget
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault()
        if (value === MIXED_STRING) {
          const delta = event.shiftKey === true ? incrementBig : incrementSmall
          let newValue: number
          if (typeof minimum === 'undefined') {
            if (key === 'ArrowDown') {
              // decrement by `delta`
              newValue = 0 - delta
            } else {
              // increment by `delta`
              newValue = 0 + delta
            }
          } else {
            if (key === 'ArrowDown') {
              // can't go below minimum
              newValue = minimum
            } else {
              // increment by `delta` above the `minimum`
              newValue = minimum + delta
            }
          }
          const formattedValue = `${newValue}`
          element.value = formattedValue
          element.select()
          onValueChange(formattedValue, name, value)
          onChange(event)
          return
        }
        const evaluatedValue = evaluateNumericExpression(value)
        if (evaluatedValue === null) {
          return
        }
        if (
          (key === 'ArrowDown' &&
            typeof minimum !== 'undefined' &&
            evaluatedValue <= minimum) ||
          (key === 'ArrowUp' &&
            typeof maximum !== 'undefined' &&
            evaluatedValue >= maximum)
        ) {
          return
        }
        const delta = event.shiftKey === true ? incrementBig : incrementSmall
        const newValue =
          key === 'ArrowDown'
            ? typeof minimum === 'undefined'
              ? evaluatedValue - delta
              : Math.max(evaluatedValue - delta, minimum)
            : typeof maximum === 'undefined'
            ? evaluatedValue + delta
            : Math.min(evaluatedValue + delta, maximum)
        const significantFiguresCount = countSignificantFigures(
          nonDigitRegex.test(value) === true ? `${evaluatedValue}` : value
        )
        const formattedValue = formatSignificantFigures(
          newValue,
          significantFiguresCount
        )
        element.value = formattedValue
        element.select()
        onValueChange(formattedValue, name, value)
        onChange(event)
        return
      }
      if (event.ctrlKey === true || event.metaKey === true) {
        return
      }
      if (isKeyCodeCharacterGenerating(event.keyCode) === true) {
        const nextValue =
          value === MIXED_STRING
            ? event.key
            : computeNextValue(element, event.key)
        if (
          isValidNumericInput(nextValue, { integersOnly: integer }) === false
        ) {
          event.preventDefault()
          return
        }
        const evaluatedValue = evaluateNumericExpression(nextValue)
        if (evaluatedValue === null) {
          return
        }
        if (
          (typeof minimum !== 'undefined' && evaluatedValue < minimum) ||
          (typeof maximum !== 'undefined' && evaluatedValue > maximum)
        ) {
          event.preventDefault()
        }
      }
    },
    [
      incrementBig,
      incrementSmall,
      integer,
      maximum,
      minimum,
      name,
      onChange,
      onValueChange,
      propagateEscapeKeyDown,
      value
    ]
  )

  const handleMouseUp = useCallback(
    function (event: JSX.TargetedMouseEvent<HTMLInputElement>) {
      if (value !== MIXED_STRING) {
        return
      }
      event.preventDefault()
    },
    [value]
  )

  const handlePaste = useCallback(
    function (event: JSX.TargetedClipboardEvent<HTMLInputElement>) {
      if (event.clipboardData === null) {
        throw new Error('`event.clipboardData` is `null`')
      }
      const nextValue = computeNextValue(
        event.currentTarget,
        event.clipboardData.getData('Text')
      )
      if (isValidNumericInput(nextValue, { integersOnly: integer }) === false) {
        event.preventDefault()
      }
    },
    [integer]
  )

  useEffect(
    function () {
      if (typeof onNumericValueChange === 'undefined') {
        return
      }
      if (value === MIXED_STRING) {
        onNumericValueChange(MIXED_NUMBER, name)
        return
      }
      const evaluatedValue = evaluateNumericExpression(value)
      onNumericValueChange(evaluatedValue, name)
    },
    [name, onNumericValueChange, value]
  )

  return (
    <div
      class={classnames(
        styles.textbox,
        noBorder === true ? styles.noBorder : null,
        typeof icon === 'undefined' ? null : styles.hasIcon
      )}
    >
      <input
        {...rest}
        class={styles.input}
        disabled={disabled === true}
        name={name}
        onFocus={handleFocus}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        onPaste={handlePaste}
        placeholder={placeholder}
        tabIndex={disabled === true ? -1 : 0}
        type="text"
        value={value === MIXED_STRING ? 'Mixed' : value}
      />
      {typeof icon === 'undefined' ? null : (
        <div class={styles.icon}>{icon}</div>
      )}
    </div>
  )
}

const fractionalPartRegex = /\.([^.]+)/

function countSignificantFigures(value: string): number {
  const result = fractionalPartRegex.exec(value)
  if (result === null) {
    return 0
  }
  return result[1].length
}

function formatSignificantFigures(
  value: number,
  significantFiguresCount: number
): string {
  if (significantFiguresCount === 0) {
    return `${value}`
  }
  const result = fractionalPartRegex.exec(`${value}`)
  if (result === null) {
    return `${value}.${'0'.repeat(significantFiguresCount)}`
  }
  const fractionalPart = result[1]
  const count = significantFiguresCount - fractionalPart.length
  return `${value}${'0'.repeat(count)}`
}
