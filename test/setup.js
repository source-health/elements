import '@testing-library/jest-dom'

class MockIntersectionObserver {
  constructor() {
    this.root = null
    this.rootMargin = ''
    this.thresholds = []
    this.disconnect = () => {}
    this.observe = () => {}
    this.takeRecords = () => {}
    this.unobserve = () => {}
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})
