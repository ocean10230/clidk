// avoid constant allocation

const Formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

export const Format = (val: number) => {
  return Formatter.format(Math.round(val))
}