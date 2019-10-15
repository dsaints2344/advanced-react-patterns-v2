// Flexible Compound Components with context

import React from 'react'
import {Switch} from '../switch'

// Right now our component can only clone and pass props to immediate children.
// So we need some way for our compound components to implicitly accept the on
// state and toggle method regardless of where they're rendered within the
// Toggle component's "posterity" :)
//
// The way we do this is through context. React.createContext is the API we
// want. Here's a simple example of that API:
//
// const defaultValue = 'light'
// const ThemeContext = React.createContext(defaultValue)
//
// ...
// <ThemeContext.Provider value={this.state}>
//   {this.props.children}
// </ThemeContext.Provider>
// ...
//
// ...
// <ThemeContext.Consumer>
//   {value => <div>The current theme is: {value}</div>}
// </ThemeContext.Consumer>
// ...

// 🐨 create a ToggleContext with React.createContext here
const ToogleContext = React.createContext({
  on: false,
  toogle: () => {}
});
class Toggle extends React.Component {
  // 🐨 each of these compound components will need to be changed to use
  // ToggleContext.Consumer and rather than getting `on` and `toggle`
  // from props, it'll get it from the ToggleContext.Consumer value.
  static On = ({on, children}) => <ToogleContext.Consumer>{(on ? children : null)}</ToogleContext.Consumer>
  static Off = ({on, children}) =><ToogleContext.Consumer>{(on ? null : children)}</ToogleContext.Consumer> 
  static Button = ({on, toggle, ...props}) => (
    <ToogleContext.Consumer>{<Switch on={on} onClick={toggle} {...props} />} </ToogleContext.Consumer>
  )
  // Because we'll be passing state into context, we need to 🐨 add the
  // toggle function to state.
  // 💰 You'll need to move this below the `toggle` function. See
  // if you can figure out why :)
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
    state = {on: false, toogle: this.toogle}
  render() {
    // Because this.props.children is _immediate_ children only, we need
    // to 🐨 remove this map function and render our context provider with
    // this.props.children as the children of the provider. Then we'll
    // expose the on state and toggle method as properties in the context
    // value (the value prop). 

    return <ToogleContext.Provider value = {this.state}>
      {this.props.children}
    </ToogleContext.Provider>
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
      <div>
        <Toggle.Button />
      </div>
    </Toggle>
  )
}
Usage.title = 'Flexible Compound Components'

export {Toggle, Usage as default}
