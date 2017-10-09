export function toSequelizeDate (x: Date): string {
  return x.toISOString().split('T')[0]
}
