// @flow
import React from 'react';
import enzymeToJson from 'enzyme-to-json';
import prettyFormat from 'pretty-format';
const { ReactElement, ReactTestComponent } = prettyFormat.plugins;

export type ValidatorFn = (wrapper: any) => boolean;
export type Config = {
  interval: number,
  timeout: number,
  timeoutMessage: string,
  logStructureOnTimeout?: boolean,
  logStructureOnSuccess?: boolean
};

export const DEFAULT_CONFIG: Config = {
  interval: 50,
  timeout: 2000,
  timeoutMessage: 'Timed out.',
  logStructureOnTimeout: true,
  logStructureOnSuccess: false
};

function printWrapper(
  wrapper: any,
  type: 'warn' | 'log',
  message: string
): void {
  if (console[type]) {
    const wrapperAsJson = enzymeToJson(wrapper, { noKey: true });
    console[type](
      message,
      prettyFormat(wrapperAsJson, {
        plugins: [ReactTestComponent, ReactElement],
        printFunctionName: true
      })
    );

    console[type]('As JSON:\n', wrapperAsJson);
  }
}

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
        if (config.logStructureOnSuccess) {
          printWrapper(
            wrapper,
            'log',
            'The render tree at the time of success:\n'
          );
        }
        resolve();
      } else {
        retries -= 1;

        if (retries < 0) {
          clearInterval(intervalInstance);

          if (config.logStructureOnTimeout) {
            printWrapper(
              wrapper,
              'warn',
              'The render tree at the time of timeout:\n'
            );
          }

          reject(config.timeoutMessage || DEFAULT_CONFIG.timeoutMessage);
        }
      }
    }, interval);
  });
}
