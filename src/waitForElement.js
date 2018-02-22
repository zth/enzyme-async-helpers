// @flow
import { DEFAULT_CONFIG, wait } from './wait';
import type { Config } from './wait';
import type { ComponentType } from 'react';

export function waitForElement(
  wrapper: any,
  elementSelector: ComponentType<any> | string,
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
