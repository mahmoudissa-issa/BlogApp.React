import '@testing-library/jest-dom'
import { server } from './mocks/server'

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset handlers between tests (so tests don't affect each other)
afterEach(() => server.resetHandlers());

// Clean up after all tests are done
afterAll(() => server.close());