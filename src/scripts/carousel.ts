export function carousel(element: HTMLElement | null, fullWidth: boolean = true) {
  const items: HTMLElement | null = element!.querySelector('.slider__items')
  const width = element!.getBoundingClientRect().width
  const slides: NodeListOf<Element> = items!.querySelectorAll('.slider__item')
  let slideSize: number
  const slidesLength: number = slides.length

  for (const slide of slides)
    (slide as HTMLElement).style.width = `${width}px`

  element!.classList.add('loaded')

  if (slidesLength > 1) {
    const firstSlide: Element = slides[0]
    const lastSlide: Element = slides[slidesLength - 1]
    const cloneFirst: Node = firstSlide.cloneNode(true)
    const cloneLast: Node = lastSlide.cloneNode(true)

    if (fullWidth) {
      slideSize = width
      items!.style.left = '-100%'
      items!.appendChild(cloneFirst)
      items!.insertBefore(cloneLast, firstSlide)
    }
    else {
      slideSize = slides[0].clientWidth + 8
      items!.style.left = `-${slideSize}px`

      items!.appendChild(cloneFirst)
      items!.insertBefore(cloneLast, firstSlide)

      for (const slide of slides) {
        (slide as HTMLElement).style.width = `${slideSize}px`

        const cloneSlide: Node = slide.cloneNode(true)
        items!.insertBefore(cloneSlide, firstSlide)
      }
    }

    let posX1: number = 0
    let posX2: number = 0
    let posInitial: number
    let posFinal: number
    const threshold: number = 100
    let index: number = 0
    let allowShift: boolean = true

    const prev: HTMLAnchorElement = document.createElement('a')
    const next: HTMLAnchorElement = document.createElement('a')

    prev.className = 'control prev'
    next.className = 'control next'

    element!.appendChild(prev)
    element!.appendChild(next)

    // Mouse and Touch events
    items!.onmousedown = dragStart
    // const isTouchCapable: boolean = 'ontouchstart' in window
    //   || (window.DocumentTouch && document instanceof window.DocumentTouch)
    //   || navigator.maxTouchPoints > 0
    //   || window.navigator.msMaxTouchPoints > 0
    //
    // if (isTouchCapable)
    //   items!.onmousedown = dragStart

    // Touch events
    items!.addEventListener('touchstart', dragStart)
    items!.addEventListener('touchend', dragEnd)
    items!.addEventListener('touchmove', dragAction)

    // Click events
    prev!.addEventListener('click', () => {
      shiftSlide(-1)
    })
    next!.addEventListener('click', () => {
      shiftSlide(1)
    })

    // Transition events
    items!.addEventListener('transitionend', checkIndex)

    function dragStart(e: MouseEvent | TouchEvent): void {
      posInitial = items!.offsetLeft
      if (e.type === 'touchstart') {
        const touchEvent = e as TouchEvent
        posX1 = touchEvent.touches[0].clientX
      }
      else {
        const mouseEvent = e as MouseEvent
        posX1 = mouseEvent.clientX
        document.onmouseup = dragEnd
        document.onmousemove = dragAction
      }
    }

    function dragAction(e: MouseEvent | TouchEvent): void {
      if (e.type === 'touchmove') {
        const touchEvent = e as TouchEvent
        posX2 = posX1 - touchEvent.touches[0].clientX
        posX1 = touchEvent.touches[0].clientX
      }
      else {
        const mouseEvent = e as MouseEvent
        posX2 = posX1 - mouseEvent.clientX
        posX1 = mouseEvent.clientX
      }
      items!.style.left = `${items!.offsetLeft - posX2}px`
    }

    function dragEnd(): void {
      posFinal = items!.offsetLeft
      if (posFinal - posInitial < -threshold)
        shiftSlide(1, 'drag')
      else if (posFinal - posInitial > threshold)
        shiftSlide(-1, 'drag')
      else items!.style.left = `${posInitial}px`

      document.onmouseup = null
      document.onmousemove = null
    }

    function shiftSlide(dir: number, action?: string): void {
      items!.classList.add('shifting')
      if (allowShift) {
        if (!action)
          posInitial = items!.offsetLeft
        if (dir === 1) {
          items!.style.left = `${posInitial - slideSize}px`
          index++
        }
        else if (dir === -1) {
          items!.style.left = `${posInitial + slideSize}px`
          index--
        }
      }
      allowShift = false
    }

    function checkIndex(): void {
      items!.classList.remove('shifting')
      if (index === -1) {
        items!.style.left = `-${slidesLength * slideSize}px`
        index = slidesLength - 1
      }
      if (index === slidesLength) {
        items!.style.left = `-${slideSize}px`
        index = 0
      }
      allowShift = true
    }
  }
}
