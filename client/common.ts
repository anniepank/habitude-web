export function dateToInt (date: Date): number {
  return Math.floor(date.getTime() / 1000 / 24 / 3600)
}

export function intToDate (int: number): Date {
  return new Date(int * 3600 * 24 * 1000)
}

export function getToday (): number {
  return dateToInt(new Date())
}
