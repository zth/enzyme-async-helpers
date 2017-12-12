// @flow
import { DEFAULT_CONFIG, wait } from './wait';
import type { Config } from './wait';

type StateValidatorFn = (state: Object) => boolean;

export function waitForState(
  wrapper: any,
  stateValidatorFn: StateValidatorFn,
  config?: Config = DEFAULT_CONFIG
): Promise<void> {
  return wait(
    wrapper,
    wrapper => stateValidatorFn(wrapper.instance().state),
    config
  );
}
