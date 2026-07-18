import { afterEach, vi } from 'vitest';

// Jasmine automatically restored spies after each spec. Vitest does not do this by
// default, which lets spies on globals (e.g. window.setTimeout) leak across tests
// and even across spec files when tests run non-isolated in browser mode.
// Restore all mocks after each test to keep the Jasmine-era semantics.
afterEach(() => {
    vi.restoreAllMocks();
});
