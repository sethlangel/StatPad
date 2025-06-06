// Global test setup
global.console = {
  ...console,
  // Suppress console.log in tests unless specifically needed
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
