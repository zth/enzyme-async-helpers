import * as React from 'react';
import { mount } from 'enzyme';
import { waitForState } from '../waitForState';

class MockComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      waitForMe: false
    };
  }

  componentDidMount() {
    if (!this.props.shouldTimeout) {
      setTimeout(() => {
        this.setState({ waitForMe: true });
      }, 500);
    }
  }

  render() {
    return null;
  }
}

describe('waitForProps', () => {
  it('should wait for state', async () => {
    const wrapper = mount(<MockComponent shouldTimeout={false} />);
    expect(wrapper.instance().state.waitForMe).toBe(false);

    await waitForState(wrapper, state => state.waitForMe === true);
    expect(wrapper.instance().state.waitForMe).toBe(true);
  });

  it('should throw error if waiting exceeds timeout', async () => {
    const wrapper = mount(<MockComponent shouldTimeout={true} />);

    expect.assertions(1);

    try {
      await waitForState(wrapper, state => state.waitForMe === true);
    } catch (e) {
      expect(wrapper.instance().state.waitForMe).toBe(false);
    }
  });
});
