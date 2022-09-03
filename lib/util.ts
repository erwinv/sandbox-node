export function* range(start = 0, end = Infinity): Iterable<number> {
  for (let i = start; i < end; i++) yield i
}
