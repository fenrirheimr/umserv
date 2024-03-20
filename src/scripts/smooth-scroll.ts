export function smoothScroll(elementY: number, duration: number, offset: number): void {
  const startingY: number = window.scrollY
  const diff: number = elementY - startingY - offset
  let start: number

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  window.requestAnimationFrame(function step(timestamp: number) {
    if (!start)
      start = timestamp
    // Elapsed milliseconds since start of scrolling.
    const time: number = timestamp - start
    // Get percent of completion in range [0, 1].
    const percent: number = Math.min(time / duration, 1)

    window.scrollTo(0, startingY + diff * percent)

    // Proceed with animation as long as we wanted it to.
    if (time < duration)
      window.requestAnimationFrame(step)
  })
}
