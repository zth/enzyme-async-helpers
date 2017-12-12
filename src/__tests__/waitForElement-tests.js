import * as React from 'react';
import { mount } from 'enzyme';
import { waitForElement } from '../waitForElement';

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
    if (this.state.waitForMe === false) {
      return null;
    }

    return this.props.children;
  }
}

describe('waitForElement', () => {
  describe('CSS selection', () => {
    it('should handle selection by CSS', async () => {
      const wrapper = mount(
        <MockComponent shouldTimeout={false}>
          <div id="test">Hej</div>
        </MockComponent>
      );

      await waitForElement(wrapper, '#test');

      expect(wrapper.find('#test').length).toBe(1);
    });

    it('should timeout if node cannot be found', async () => {
      const wrapper = mount(
        <MockComponent shouldTimeout={true}>
          <div id="test">Hej</div>
        </MockComponent>
      );

      expect.assertions(1);

      try {
        await waitForElement(wrapper, '#test');
      } catch (e) {
        expect(wrapper.find('#test').length).toBe(0);
      }
    });
  });

  describe('Component selection', () => {
    it('should handle selection by component', async () => {
      const wrapper = mount(
        <MockComponent shouldTimeout={false}>
          <Dummy />
        </MockComponent>
      );

      await waitForElement(wrapper, Dummy);

      expect(wrapper.find(Dummy).length).toBe(1);
    });

    it('should timeout if node cannot be found', async () => {
      const wrapper = mount(
        <MockComponent shouldTimeout={true}>
          <Dummy />
        </MockComponent>
      );

      expect.assertions(1);

      try {
        await waitForElement(wrapper, Dummy);
      } catch (e) {
        expect(wrapper.find(Dummy).length).toBe(0);
      }
    });
  });
});
