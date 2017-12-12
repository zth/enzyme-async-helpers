// @flow
import { DEFAULT_CONFIG, wait } from './wait';
import type { Config } from './wait';

type PropsValidatorFn = (props: Object) => boolean;

export function waitForProps(
  wrapper: any,
  propsValidatorFn: PropsValidatorFn,
  config?: Config = DEFAULT_CONFIG
): Promise<void> {
  return wait(
    wrapper,
    wrapper => propsValidatorFn(wrapper.instance().props),
    config
  );
}
