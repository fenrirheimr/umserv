/**
 * @param {string} options.elem - HTML id of the tabs container
 * @param {number} [options.open = 0] - Render the tabs with this item open
 */
interface TabsOptions {
  elem: string
  open?: number
}
interface TabsInstance {
  open: (n: number) => void
  update: (n: number) => void
  destroy: () => void
}
export function Tabs(options: TabsOptions): TabsInstance {
  const elem = document.getElementById(options.elem) as HTMLElement | null
  const open: number = options.open || 0
  const titleClass: string = 'tabs__title'
  const activeClass: string = 'tabs__title--active'
  const contentClass: string = 'tabs__content'
  const tabsNum: number = elem!.querySelectorAll(`.${titleClass}`).length

  render()

  /**
   * Initial rendering of the tabs.
   */
  function render(n?: number): void {
    elem?.addEventListener('click', onClick)

    const init: number = (n == null) ? checkTab(open) : checkTab(n)

    for (let i = 0; i < tabsNum; i++) {
      elem?.querySelectorAll(`.${titleClass}`)[i].setAttribute('data-index', i.toString())
      if (i === init)
        openTab(i)
    }
  }

  /**
   * Handle clicks on the tabs.
   *
   * @param {object} e - Element the click occured on.
   */
  function onClick(e: MouseEvent): void {
    if (!(e.target as HTMLElement).className.includes(titleClass))
      return
    e.preventDefault()
    openTab(Number((e.target as HTMLElement).getAttribute('data-index')))
  }

  /**
   * Hide all tabs and re-set tab titles.
   */
  function reset(): void {
    [].forEach.call(elem?.querySelectorAll(`.${contentClass}`), (item: HTMLElement) => {
      item.style.display = 'none'
    });

    [].forEach.call(elem?.querySelectorAll(`.${titleClass}`), (item: HTMLElement) => {
      item.className = removeClass(item.className, activeClass)
    })
  }

  /**
   * Utility function to remove the open class from tab titles.
   *
   * @param {string} str - Current class.
   * @param {string} cls - The class to remove.
   */
  function removeClass(str: string, cls: string): string {
    const reg: RegExp = new RegExp(`(\ )${cls}(\)`, 'g')
    return str.replace(reg, '')
  }

  /**
   * Utility function to remove the open class from tab titles.
   *
   * @param n - Tab to open.
   */
  function checkTab(n: number): number {
    return (n < 0 || Number.isNaN(n) || n > tabsNum) ? 0 : n
  }

  /**
   * Opens a tab by index.
   *
   * @param {number} n - Index of tab to open. Starts at 0.
   *
   * @public
   */
  function openTab(n: number): void {
    reset()

    const titles: NodeListOf<Element> = elem!.querySelectorAll(`.${titleClass}`)
    const tabs: NodeListOf<Element> = elem!.querySelectorAll(`.${contentClass}`)

    const i: number = checkTab(n)

    titles[i].className += ` ${activeClass}`;
    (tabs[i] as HTMLElement).style.display = ''
  }

  /**
   * Updates the tabs.
   *
   * @param {number} n - Index of tab to open. Starts at 0.
   *
   * @public
   */
  function update(n: number): void {
    destroy()
    reset()
    render(n)
  }

  /**
   * Removes the listeners from the tabs.
   *
   * @public
   */
  function destroy(): void {
    elem?.removeEventListener('click', onClick)
  }

  return {
    open: openTab,
    update,
    destroy,
  }
}
