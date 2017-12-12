// @flow
import { DEFAULT_CONFIG, wait } from './wait';
import type { Config } from './wait';

export function waitForElement(
  wrapper: any,
  elementSelector: any,
  config?: Config = DEFAULT_CONFIG
): Promise<void> {
  return wait(
    wrapper,
    wrapper => {
      wrapper.update();
      return wrapper.find(elementSelector).length > 0;
    },
    config
  );
}
