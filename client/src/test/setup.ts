import '@testing-library/jest-dom';

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
} as Storage;

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

Object.defineProperty(window, 'HTMLMediaElement', {
  writable: true,
  value: class MockHTMLMediaElement {
    play = jest.fn();
    pause = jest.fn();
    load = jest.fn();
    volume = 1;
    muted = false;
  },
});

// Mock PointerEvent for Motion library
global.PointerEvent = class MockPointerEvent extends Event {
  pointerId: number;
  pointerType: string;

  constructor(type: string, eventInitDict?: PointerEventInit) {
    super(type, eventInitDict);
    this.pointerId = (eventInitDict as PointerEventInit)?.pointerId || 1;
    this.pointerType = (eventInitDict as PointerEventInit)?.pointerType || 'mouse';
  }
} as unknown as typeof PointerEvent;

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
