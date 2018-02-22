# enzyme-async-helpers
A library to aid in testing async React components and methods using Enzyme.

## Installation
This library was built with React 16 and Enzyme 3 in mind. It *might* work on lower versions
as well, but the lib is developed for and tested on those versions.
```
yarn add --dev enzyme-async-helpers
```

## Usage
I recommend checking out the tests to see more examples than the ones below. 
The lib exposes the following methods:

### waitForElement
*Signature*: `(wrapper: EnzymeWrapper, elementSelector: EnzymeSelector, config?: Config) => Promise<void>`

Wait for an element to appear. You can use any valid Enzyme selector (a component, CSS selector, etc). 

```javascript
import { waitForElement } from 'enzyme-async-helpers';
...

it('should wait for MyComponent to appear', async () => {
    const wrapper = mount(<Wrapper />);
    
    await waitForElement(wrapper, MyComponent);
    expect(wrapper.find(MyComponent).length).toBe(1);
});
``` 

### waitForState
*Signature*: `(wrapper: EnzymeWrapper, stateValidationFn: (state: Object) => boolean, config?: Config) => Promise<void>`

Wait for your component's state to update to something.

```javascript
import { waitForState } from 'enzyme-async-helpers';
...

it('should wait for loading to stop', async () => {
    const wrapper = mount(<MyComponent />);
    
    await waitForState(wrapper, state => state.loading === false);
    expect(wrapper.instance().state.loading).toBe(false);
});
```

### waitForProps
*Signature*: `(wrapper: EnzymeWrapper, propsValidationFn: (props: Object) => boolean, config?: Config) => Promise<void>`

Wait for your component's props to update to something.

```javascript
import { waitForProps } from 'enzyme-async-helpers';
...

it('should wait for someProp to be valid', async () => {
    const wrapper = mount(<Wrapper />); // Wrapper renders SomeComponent and passes in props
    const componentWrapper = wrapper.find(SomeComponent);
    
    await waitForProps(componentWrapper, props => props.someProp === 'test');
    expect(componentWrapper.instance().props.someProp).toBe('test');
});
```  

### config
All the methods listed above take a third `config` argument of the following shape:
```javascript
type Config = {
    interval: number, // Default: 50, how often to check for validity
    timeout: number, // Default: 2000 (2 seconds), how long to wait before timing out
    logStructureOnTimeout?: boolean, // Default: true, logs the wrapper's rendered structure when the wait times out. An attempt to help out in finding what's wrong.
    logStructureOnSuccess?: boolean // Default: false, logs the wrapper's rendered structure on success.
}
```
