// @flow
import * as React from 'react';

export type ValidatorFn = (wrapper: any) => boolean;
export type Config = {
  interval: number,
  timeout: number,
  timeoutMessage: string
};

export const DEFAULT_CONFIG: Config = {
  interval: 50,
  timeout: 2000,
  timeoutMessage: 'Timed out.'
};

export function wait(
  wrapper: any,
  validatorFn: ValidatorFn,
  config?: Config = DEFAULT_CONFIG
): Promise<void> {
  const interval = config.interval || DEFAULT_CONFIG.interval;
  const timeout = config.timeout || DEFAULT_CONFIG.timeout;

  return new Promise((resolve, reject) => {
    let retries = timeout / interval;

    let intervalInstance;

    intervalInstance = setInterval(() => {
      if (validatorFn(wrapper) === true) {
        clearInterval(intervalInstance);
        resolve();
      } else {
        retries -= 1;

        if (retries < 0) {
          clearInterval(intervalInstance);
          reject(config.timeoutMessage || DEFAULT_CONFIG.timeoutMessage);
        }
      }
    }, interval);
  });
}
