import { RouletteNumber } from '../types/roulette'

export const isValidRouletteNumber = (num: number): num is RouletteNumber => {
  return Number.isInteger(num) && num >= 0 && num <= 36
}

export const validateRouletteNumber = (num: number): RouletteNumber => {
  if (!isValidRouletteNumber(num)) {
    throw new Error(`Invalid roulette number: ${num}`)
  }
  return num
}