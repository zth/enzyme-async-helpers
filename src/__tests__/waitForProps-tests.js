import * as React from 'react';
import { mount } from 'enzyme';
import { waitForProps } from '../waitForProps';

class Dummy extends React.Component {
  render() {
    return null;
  }
}

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
    return <Dummy waitForMe={this.state.waitForMe} />;
  }
}

describe('waitForProps', () => {
  it('should wait for props', async () => {
    const wrapper = mount(<MockComponent shouldTimeout={false} />);
    const dummyWrapper = wrapper.find(Dummy);
    expect(dummyWrapper.instance().props.waitForMe).toBe(false);

    await waitForProps(dummyWrapper, props => props.waitForMe === true);
    expect(dummyWrapper.instance().props.waitForMe).toBe(true);
  });

  it('should throw error if waiting exceeds timeout', async () => {
    const wrapper = mount(<MockComponent shouldTimeout={true} />);
    const dummyWrapper = wrapper.find(Dummy);

    expect.assertions(1);

    try {
      await waitForProps(dummyWrapper, props => props.waitForMe === true);
    } catch (e) {
      expect(dummyWrapper.instance().props.waitForMe).toBe(false);
    }
  });
});
