/** Okay so the following works if you set --env=jsdom when running tests 
 * (Either in package.json or using npm run test)
 * HOWEVER, jsdom environment seem to cause tests to run significantly slower
 */

// const mockScroll = () => {};
// Object.defineProperty(window, 'scroll', { value: mockScroll, writable: true });