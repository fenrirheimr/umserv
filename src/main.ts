import '@/assets/sass/main.sass'
import { carousel } from '@/scripts/carousel'
import { copyToClipboard, getOffset, inViewport } from '@/scripts/utils'
import { Tabs } from '@/scripts/tabs'
import { smoothScroll } from '@/scripts/smooth-scroll'

// попап с телефонами
const phone_icon: HTMLElement | null = document.getElementById('phone-icon-btn')
const popup: HTMLElement | null = document.getElementById('phones-list-area')

phone_icon?.addEventListener('click', togglePopup)
function togglePopup(): void {
  popup!.classList.toggle('hidden')
}
// промо слайдер
const slider: HTMLElement | null = document.querySelector('.promo-slider')
if (slider)
  carousel(slider)

// валидация формы в промо
const phone_input: HTMLInputElement | null = document.querySelector('input[type=tel]')
const parent = phone_input!.parentNode as HTMLElement
const error = parent!.parentNode!.querySelector('.error-message') as HTMLElement
const button = parent!.parentNode!.querySelector('button') as HTMLElement
const checkbox = parent!.parentNode!.parentNode!.querySelector('input[type=checkbox]') as HTMLInputElement

if (!checkbox.checked)
  button!.setAttribute('disabled', '')

checkbox?.addEventListener('click', () => {
  button!.toggleAttribute('disabled')
})
phone_input?.addEventListener('input', () => {
  if (phone_input.checkValidity()) {
    parent.classList.remove('error')
    error!.classList.add('hidden')
    error!.innerHTML = ''
    button!.removeAttribute('disabled')
  }
})
phone_input?.addEventListener('invalid', () => {
  parent.classList.add('error')
  button!.setAttribute('disabled', '')

  error!.classList.remove('hidden')
  if (phone_input.value === '')
    error!.innerHTML = 'Enter phone number!'
  else
    error!.innerHTML = 'Enter phone number in this format: 81234567890'
})

// модалка
const root: HTMLElement | null = document.querySelector('html')
const modal: HTMLElement | null = document.querySelector('.from-promo')
const closeButton: HTMLElement | null = document.querySelector('.from-promo .modal__close')
function toggleModal(event: MouseEvent, target: any): void {
  event.preventDefault()
  // event.stopImmediatePropagation()
  root?.classList.toggle('clipped')
  target?.classList.toggle('show-modal')
}

closeButton?.addEventListener('click', event => toggleModal(event, modal))
window.addEventListener('click', windowOnClick)

const servButton: HTMLElement | null = document.querySelector('.services .link')
const modalServ: HTMLElement | null = document.querySelector('.from-services')
const closeServ: HTMLElement | null = document.querySelector('.from-services .modal__close')

servButton?.addEventListener('click', event => toggleModal(event, modalServ))
closeServ?.addEventListener('click', event => toggleModal(event, modalServ))

function windowOnClick(event: MouseEvent): void {
  if (event.target === modal)
    toggleModal(event, modal)
  if (event.target === modalServ)
    toggleModal(event, modalServ)
}

button?.addEventListener('click', (event) => {
  if (phone_input!.checkValidity()) {
    parent.classList.remove('error')
    error!.classList.add('hidden')
    error!.innerHTML = ''
    button!.removeAttribute('disabled')
    toggleModal(event, modal)
  }
})

// отключаем html5 сообщения об ошибках валидации
document.addEventListener('invalid', (function () {
  return function (e: Event) {
    e.preventDefault()
  }
})(), true)

document.querySelectorAll('.copy-text').forEach((button: Element) => {
  button?.addEventListener('click', copyToClipboard)
})

// свернуть/развернуть блоки
document.querySelectorAll('.expand-button').forEach((button: Element) => {
  const expandButtonTextContainer = button?.querySelector('.text') as HTMLElement
  const expandButtonText = expandButtonTextContainer.textContent as string

  button.addEventListener('click', () => {
    let expandContainer = button?.parentElement?.querySelector('.expand-container') as HTMLElement
    const expandContainerWrapper = button?.parentElement?.querySelector('.expand-wrapper') as HTMLElement

    // TODO: отрефакторить этот костыль, я перестал понимать что тут написано
    if (!expandContainer)
      expandContainer = button?.closest('.content-wrapper')?.querySelector('.expand-container') as HTMLElement

    if (!expandContainer && !expandContainerWrapper)
      expandContainer = button?.closest('.expand-wrapper')?.querySelector('.expand-container') as HTMLElement

    button.classList.toggle('open')
    expandContainer?.classList.toggle('show')
    expandButtonTextContainer.textContent = expandButtonTextContainer.textContent === expandButtonText ? 'Свернуть' : expandButtonText
    checkScroll()
  })
})

const logoSlider: HTMLElement | null = document.querySelector('.logo-slider')
if (logoSlider)
  carousel(logoSlider, false)

function toNumber(str: string) {
  return Number.parseFloat(str)
}

// range
const range = document.querySelector('.range-wrapper') as HTMLElement
if (range) {
  const minInput = range.querySelector('#minamount') as HTMLInputElement
  const maxInput = range.querySelector('#maxamount') as HTMLInputElement
  const minSlider = range.querySelector('#lower') as HTMLInputElement
  const maxSlider = range.querySelector('#upper') as HTMLInputElement
  const minV = range.querySelector('#minV') as HTMLElement
  const maxV = range.querySelector('#maxV') as HTMLElement

  let minVal: number = 300
  let maxVal: number = 700

  if (minInput && maxInput) {
    minInput.value = minVal.toString()
    maxInput.value = maxVal.toString()
  }

  minSlider.value = minVal.toString()
  maxSlider.value = maxVal.toString()

  function setValue(): void {
    minVal = Number.parseInt(minSlider.value)
    maxVal = Number.parseInt(maxSlider.value)

    if (minV && maxV) {
      const newMinValue: number = (minVal - toNumber(minSlider.min)) * 100 / (toNumber(minSlider.max) - toNumber(minSlider.min))
      const newMinPosition: number = 10 - (newMinValue * 0.2)
      minV.innerHTML = `<span>${minSlider.value}</span>`
      minV.style.left = `calc(${newMinValue}% + (${newMinPosition}px))`

      const newMaxValue: number = (maxVal - toNumber(maxSlider.min)) * 100 / (toNumber(maxSlider.max) - toNumber(maxSlider.min))
      const newMaxPosition: number = 10 - (newMaxValue * 0.2)
      maxV.innerHTML = `<span>${maxSlider.value}</span>`
      maxV.style.left = `calc(${newMaxValue}% + (${newMaxPosition}px))`
    }

    if (minVal >= maxVal - 1) {
      maxSlider.value = String(minVal + 1)
      maxInput.value = maxSlider.value
    }

    if (maxVal <= minVal + 1) {
      minSlider.value = String(maxVal - 1)
      minInput.value = minSlider.value
    }

    if (minInput && maxInput) {
      minInput.value = minVal.toString()
      maxInput.value = maxVal.toString()
    }
  }

  minSlider.addEventListener('input', () => setValue())
  maxSlider.addEventListener('input', () => setValue())

  if (minInput && maxInput) {
    minInput.addEventListener('keyup', (event: KeyboardEvent) => {
      const target = event?.target as HTMLInputElement
      if (event.key === 'Backspace')
        minSlider.value = target.value.slice(0, -1)

      if (target.value.length === 0) {
        minSlider.value = '0'
        setValue()
      }

      minSlider.value = target.value
      setValue()
    })
    maxInput.addEventListener('keyup', (event: KeyboardEvent) => {
      const target = event?.target as HTMLInputElement
      if (event.key === 'Backspace')
        maxSlider.value = target.value.slice(0, -1)

      if (target.value.length === 0) {
        maxSlider.value = '0'
        setValue()
      }

      maxSlider.value = target.value
      setValue()
    })
  }

  document.addEventListener('DOMContentLoaded', setValue)
}

// плавный ScrollTop вне зависимости от высоты страницы
function handleScrollTop(e: Event | null): void {
  e?.preventDefault()
  if (window.scrollY !== 0) {
    setTimeout(() => {
      window.scrollTo(0, window.scrollY - 30)
      handleScrollTop(null)
    }, 2)
  }
}
document.querySelectorAll('.item__goTop').forEach((button: Element) => {
  button?.addEventListener('click', (e: Event) => {
    handleScrollTop(e)
  })
})

// табы
document.querySelectorAll('.tabs').forEach((container: Element) => {
  const id = container.getAttribute('id') as string

  Tabs({ elem: id })
})

// scroll to hash elements
document.querySelectorAll('.scroll-button').forEach((button: Element) => {
  button?.addEventListener('click', (e: Event) => {
    e?.preventDefault()
    const hash = (e?.target as HTMLLinkElement).getAttribute('href')?.split('#')[1] as string
    const target = document.getElementById(hash) as HTMLElement

    button?.parentElement?.querySelectorAll('.isActive').forEach((elem: Element) =>
      elem.classList.remove('isActive'))

    button?.classList.add('isActive')

    const posY = getOffset(target).top

    smoothScroll(posY, 500, 140)
  })
})

// plus/minus
const quantityContainer = document.querySelector('.quantity') as HTMLElement

if (quantityContainer) {
  const minusBtn = quantityContainer?.querySelector('.minus') as HTMLButtonElement
  const plusBtn = quantityContainer?.querySelector('.plus') as HTMLButtonElement
  const inputBox = quantityContainer?.querySelector('.input-box') as HTMLInputElement


  updateButtonStates()
  quantityContainer.addEventListener('click', handleButtonClick)
  inputBox.addEventListener('input', handleQuantityChange)

  function updateButtonStates() {
    const value = Number.parseInt(inputBox.value)
    minusBtn.disabled = value <= 1
    plusBtn.disabled = value >= Number.parseInt(inputBox.max)
  }

  function handleButtonClick(event: Event) {
    if ((event?.target as HTMLElement)?.classList.contains('minus'))
      decreaseValue()
    else if ((event?.target as HTMLElement)?.classList.contains('plus'))
      increaseValue()
  }

  function decreaseValue() {
    let value = Number.parseInt(inputBox.value)
    value = Number.isNaN(value) ? 1 : Math.max(value - 1, 1)
    inputBox.value = value.toString()
    updateButtonStates()
    handleQuantityChange()
  }

  function increaseValue() {
    let value = Number.parseInt(inputBox.value)
    value = Number.isNaN(value) ? 1 : Math.min(value + 1, Number.parseInt(inputBox.max))
    inputBox.value = value.toString()
    updateButtonStates()
    handleQuantityChange()
  }

  function handleQuantityChange() {
    let value = Number.parseInt(inputBox.value)
    value = Number.isNaN(value) ? 1 : value
  }
}

// Аккордеон
const accordionWrapper = document.querySelectorAll('.accordion') as NodeListOf<Element>
accordionWrapper.forEach((container: Element) => {
  const accordionItems = container.querySelectorAll('.accordion__item')

  accordionItems.item(0).querySelector('.caption')?.classList.add('open')
  accordionItems.item(0).querySelector('.content')?.classList.add('open')
  accordionItems.item(1).querySelector('.caption')?.classList.add('open')
  accordionItems.item(1).querySelector('.content')?.classList.add('open')

  accordionItems.forEach((item: Element) => {
    const button = item.querySelector('.caption') as HTMLElement

    button.addEventListener('click', () => {
      const container = button?.nextSibling as HTMLElement
      button.classList.toggle('open')
      container?.classList.toggle('open')
    })
  })
})

////////////////////////////////////////////////////////////////////////////////
// TODO: переделать  в плагин
const galleryContainer = document.querySelectorAll('.product-gallery') as NodeListOf<HTMLElement>
galleryContainer.forEach((container: HTMLElement) => {
  const mainImage = container.querySelector('.large-img') as HTMLImageElement
  const thumbsContainer = container.querySelector('.thumbs-wrapper') as HTMLElement
  const thumbs = thumbsContainer.querySelectorAll('.thumb-img-item .thumb-img') as NodeListOf<HTMLImageElement>
  const visibleCount: number = Number.parseInt(container.getAttribute('data-counter') as string) || 3
  const thumbsArray = [...thumbs]

  container.classList.remove('fixed')
  container.classList.remove('toBottom')

  thumbs.forEach((image: HTMLImageElement) => {
    image.addEventListener('click', (event: MouseEvent) => changeImageOnClick(event))
  })

  if (thumbs.length > visibleCount) {
    thumbsArray.forEach((thumb: HTMLElement, index: number) => {
      const num = (index + 1) % 10
      if (num <= visibleCount && num > 0)
        thumb.parentElement?.classList.add('visible')
    })

    const countBlock = thumbsArray[visibleCount].parentElement as HTMLElement
    countBlock?.classList.add('show-button')

    const showButtonText: HTMLElement = document.createElement('span')
    showButtonText.className = 'text'
    showButtonText.innerHTML = `+ ${thumbs.length - visibleCount}`
    countBlock?.appendChild(showButtonText)

    countBlock?.addEventListener('click', (event: MouseEvent) => showAllImages(event))
  }

  function showAllImages(event: MouseEvent) {
    const block = (event?.target as HTMLElement)?.parentNode as HTMLElement
    block?.parentNode?.querySelectorAll('.thumb-img-item').forEach((el: Element) => {
      el.classList.add('visible')
    })
    block.classList.remove('show-button')
  }
  function changeImageOnClick(event: MouseEvent) {
    const targetElement: HTMLImageElement = event.target as HTMLImageElement
    if (targetElement.tagName === 'IMG') {
      mainImage.classList.add('focus')
      setTimeout(() => {
        mainImage.classList.remove('focus')
      }, 500)

      mainImage.src = targetElement.getAttribute('src') as string
    }
  }

  const productGalleryHeight = container.getBoundingClientRect().height
  const productTop: number = container.offsetTop
  const scrollPane = (container?.closest('.product-card') as HTMLElement)?.offsetHeight as number
  const scrollPaneBottom = (container?.closest('.product-card') as HTMLElement)?.getBoundingClientRect().bottom

  function stickyGallery() {
    if (window.scrollY >= productTop && window.scrollY <= scrollPane)
      container.classList.add('fixed')
    else
      container.classList.remove('fixed')

    if (productGalleryHeight + window.scrollY >= scrollPaneBottom)
      container.classList.add('toBottom')
    else
      container.classList.remove('toBottom')
  }
  window.addEventListener('scroll', stickyGallery)
})

////////////////////////////////////////////////////////////////////////////////

// stickyNavigation
const nav = document.querySelector('#middleNav') as HTMLElement
if (nav) {
  const productPane = document.querySelector('.product-pane') as HTMLElement
  const navTop = nav.offsetTop
  const navHeight = Number.parseInt(window.getComputedStyle(nav).height) + Number.parseInt(window.getComputedStyle(nav).marginBottom)

  function stickyNavigation() {
    if (window.scrollY >= navTop) {
      document.body.style.paddingTop = `${navHeight}px`
      nav.classList.add('fixed')
      productPane.classList.add('fixed')
    }
    else {
      document.body.style.paddingTop = '0'
      nav.classList.remove('fixed')
      productPane.classList.remove('fixed')
    }
    return null
  }
  window.addEventListener('scroll', stickyNavigation)
}

// имитация тэгов
document.querySelectorAll('.tag').forEach((tag: Element) => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('isActive')
  })
})

function checkScroll() {
  const scroll = document.querySelectorAll('.scroll-container') as NodeListOf<Element>
  const navWrapper = document.querySelector('.middle-nav') as HTMLElement
  scroll.forEach((container: Element) => {
    const height = (container as HTMLElement).offsetHeight
    const hash = container.getAttribute('id') as string
    const target = navWrapper.querySelector(`a[href*="#${hash}"]`) as HTMLElement
    if (inViewport(container, height))
      target.classList.add('isActive')
    else
      target.classList.remove('isActive')
  })
}

window.addEventListener('load', checkScroll)
window.addEventListener('scroll', checkScroll)

// dropdown
const dropdownWrappers: NodeListOf<Element> = document.querySelectorAll('.dropdown')

dropdownWrappers.forEach((dropdownWrapper: Element) => {
  const dropdownBtn = dropdownWrapper.querySelector('.dropdown__button') as Element
  const dropdownList = dropdownWrapper.querySelector('.dropdown__list') as Element
  const dropdownItems = dropdownList.querySelectorAll('.dropdown__list-item') as NodeListOf<Element>
  const dropdownInput = dropdownWrapper.querySelector('.dropdown__input_hidden') as HTMLInputElement

  const clickHandler: EventListenerOrEventListenerObject = function (this: any) {
    dropdownList.classList.toggle('dropdown__list_visible')
    this.classList.toggle('dropdown__button_active')
  }

  dropdownBtn.addEventListener('click', clickHandler)

  dropdownItems.forEach((listItem: Element) => {
    const listItemHandler: EventListenerOrEventListenerObject = function (this: any, e: Event): void {
      dropdownItems.forEach((el: Element) => {
        el.classList.remove('dropdown__list-item_active')
      })
      const evTarget = e?.target as HTMLElement
      evTarget.classList.add('dropdown__list-item_active')
      dropdownBtn.textContent = this.textContent
      dropdownInput.value = this.dataset.value
      dropdownList.classList.remove('dropdown__list_visible')
    }

    listItem.addEventListener('click', listItemHandler)
  })

  const documentClickHandler = function (e: Event) {
    if (e.target !== dropdownBtn) {
      dropdownBtn.classList.remove('dropdown__button_active')
      dropdownList.classList.remove('dropdown__list_visible')
    }
  } as EventListenerOrEventListenerObject

  document.addEventListener('click', documentClickHandler)

  const documentKeydownHandler = function (e: KeyboardEvent) {
    if (e.key === 'Tab' || e.key === 'Escape') {
      dropdownBtn.classList.remove('dropdown__button_active')
      dropdownList.classList.remove('dropdown__list_visible')
    }
  } as EventListenerOrEventListenerObject

  document.addEventListener('keydown', documentKeydownHandler)
})

// config checked
function checkedConfigContainer(container: HTMLElement) {
  container?.closest('.item')?.classList.add('checked')

  container?.parentNode?.querySelectorAll('.item').forEach((el: Element) => {
    if (el !== container)
      el.classList.remove('checked')
  })
}
document.querySelectorAll('.radio-button').forEach((radioButton: Element) => {
  const container = radioButton.closest('.item') as HTMLElement
  if ((radioButton as HTMLInputElement).checked)
    container?.classList.add('checked')

  radioButton.addEventListener('click', () => checkedConfigContainer(container))
})

const reviewsSlider: HTMLElement | null = document.querySelector('.reviews-slider')
if (reviewsSlider)
  carousel(reviewsSlider, false)

const newsSlider: HTMLElement | null = document.querySelector('.news-slider')
if (newsSlider)
  carousel(newsSlider, false)

// Star rating

const stars = document.querySelectorAll('.star') as NodeListOf<Element>
const starContainer = document.querySelector('.star-container') as HTMLElement

if (stars && starContainer) {
  starContainer.addEventListener('click', starRating)

  function starRating(e: MouseEvent): void {
    stars.forEach((star: Element) => star.classList.remove('star__checked'))
    const i: number = [...stars].indexOf(e.target as Element)
    if (i > -1)
      stars[i].classList.add('star__checked')
  }
}

//

const popupButton = document.querySelectorAll('.popup-button .icon') as NodeListOf<HTMLElement>
popupButton.forEach((button: HTMLElement) => {
  const popupContainer = button.parentNode?.nextSibling as HTMLElement

  function toggle(): void {
    button.classList.toggle('active')
    popupContainer!.classList.toggle('hidden')
  }

  button.addEventListener('click', () => toggle())
})
