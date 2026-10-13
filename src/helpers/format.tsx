// avoid constant allocation

const Formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

export const Format = (val: number | bigint) => {
  if (typeof val === 'bigint') return Formatter.format(val)
  return Formatter.format(Math.round(val))
}

const PreserveFormatter = new Intl.NumberFormat('en-US', {
  notation: 'standard',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

export const PreserveFormat = (v: bigint | number) => PreserveFormatter.format(v)