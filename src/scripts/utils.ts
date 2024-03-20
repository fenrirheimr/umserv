export function copyToClipboard(e: Event): void {
  const el: HTMLTextAreaElement = document.createElement('textarea')
  const target = e.target as HTMLElement | null

  const text: string | '' = (target ?? {}).textContent!

  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()

  if (!navigator.clipboard) {
    document.execCommand('copy')
  }
  else {
    navigator.clipboard.writeText(text).then(
      () => {
        target?.blur()
      },
    )
  }
  document.body.removeChild(el)
}

export function getOffset(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  }
}

export function inViewport(el: Element, height: number) {
  // TODO: добавить логику если контейнер больше высоты вьюпрота или виден только заголовок
  const f = () => {
    const rect = el.getBoundingClientRect()
    const inView = (
      rect.top >= 0
      && rect.left >= 0
      && rect.bottom - height <= (window.innerHeight || document.documentElement.clientHeight)
      && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
    if (inView) {
      window.removeEventListener('scroll', f)
      return true
    }
    else {
      window.addEventListener('scroll', f)
      return false
    }
  }
  window.addEventListener('scroll', f)
  return f()
}
