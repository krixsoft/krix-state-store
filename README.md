**krix/state-store** - a library to store states of hight load applications in JavaScript language. It's an independent part of Krix ecosystem and it's based on usage of the RxJS to implement Observable-like pattern to observe changes of states.

# Installation
```
npm install @krix/state-store
```

# Introduction
## What for?
Considering a series of projects in Angular, React and Vue, our teams have often run up against the issues of implementing and using a state store. There are the main issues:
1. A state store is transformed to a service code-monolite and centralizes the buisnes logic of an application. This approach looks realy nice at the early stage of the application and greatly complicates the development of the system at the later stage. Sometimes the amount of the buisnes logic is so large that this approach creates huge file trees with a lot of actions at each store.
2. A state store loses its objective function of the storage and implements some buisnel logic. The allocation of objective functions in logic is neccessery to support a logical consistency. Controller will never use a database directly, will it?
3. The redundancy in the number of abstractions. If you use a state store at the objective function - to store data, you can notice that action-event-reducer system can be implemented in a single abstraction.


## Concepts
**Store** - regular JS object used to store states.    

**State** - data of any type which corresponds to some abstraction in your application.    

**Command** - function which uses a **state-store ORM** to store states to your store.

> It's not recommended to implement a buisnes logic within an "Command" abstraction because it can aggravate a system consistency. We recomend to move your buisnes logic to a service layer and call commands in the service layer.    

**\[store-name\].store** - abstaction, what combines a set of commands to manage some store (highlevel state).

> Highlevel state - state which serves as the pseudo-storage. Create 3 and more levels of stores isn't recommended.    

**state-store.service** - implementation of the bridge pattern, aims at converting a library ORM to an abstraction of your system. For example, you can create an Angular service and use its DI to share the store between all substores.    

> The introduction of "State Store" service allows you to replace your state store library at a lower cost.

**@krix/state-store** - library which provides **Krix ORM**, interfaces and enums. ORM creates an instance of the **store** and provides the logical interface to manage this store.   

## Setup

It's pretty easy to integrate **Krix state-store** to your application. At first you need to create your own state-store. Example:

```typescript
import * as KrixStateStore from '@krix/state-store';

export const krixStateStore = KrixStateStore.StateStore.create();
```

Further, you need to create some store. We recommend you to use OOP classes as an abstraction for your **\[store-name\].store** entities but you can use namespaces, files and etc. Example:

```typescript
import type * as KrixStateStore from './index';

export interface SessionState {
  /**
   * Defines the app's fullscreen mode.
   * false - event isn't in the fullscreen.
   */
  fullscreenMode: boolean;
  /**
   * There is the current user's id.
   */
  userId: string;
  /**
   * Stores the last command which the user did.
   * FYI: Hook system. Allows us to send collect all user's actions.
   *
   * @signal
   */
  lastUserCommand: any;
  /**
   * Stores the user's browser screen zoom.
   * FYI: We use this state to recalculate sizes of fonts and elements.
   */
  screenZoom: number;
}

export class SessionStore {
  private stateStore: KrixStateStore.StateStore;

  constructor (
    stateStore: KrixStateStore.StateStore,
  ) {
    this.stateStore = stateStore;

    const initialState: SessionState = {
      fullscreenMode: false,
      userId: null,
      lastUserCommand: null,
      screenZoom: null,
    };

    this.stateStore.setState({
      state: [ 'session' ],
      value: initialState,
    });
  }

  /**
   * Enables the app's fullscreen.
   *
   * @return {void}
   */
  enableFullscreen (
  ): void {
    this.stateStore.setState({
      state: [ 'session', 'fullscreenMode' ],
      value: true,
    });
  }

  /**
   * Disables the app's fullscreen.
   *
   * @return {void}
   */
  disableFullscreen (
  ): void {
    this.stateStore.setState({
      state: [ 'session', 'fullscreenMode' ],
      value: false,
    });
  }

  /**
   * Emits the last user's command to all commands' observers.
   *
   * @param  {<UserCommandType>} command
   * @return {void}
   */
  emitUserCommand <UserCommandType> (
    command: UserCommandType,
  ): void {
    this.stateStore.setState({
      state: [ 'session', 'lastUserCommand' ],
      value: command,
      options: {
        signal: true,
      },
    });
  }

  /**
   * Sets the new screen zoom.
   *
   * @param  {number} screenZoom
   * @return {void}
   */
  setScreenZoom (
    screenZoom: number,
  ): void {
    this.stateStore.setState({
      state: [ 'session', 'screenZoom' ],
      value: screenZoom,
      options: {
        compare: true,
      },
    });
  }
}
```

And this is where we create the `session` store instance:

```typescript
import { krixStateStore } from './state-store';
import { SessionStore } from './session.store';

export const sessionStore = new SessionStore(krixStateStore);
```

That's all. These are some examples how you can use created abstractions:

```typescript
import { krixStateStore } from './state-store';
import { sessionStore } from './session.store';

// Get the `fullscreenMode` state from the `session` store.   
let fullscreenMode = krixStateStore.getState([ 'session', 'fullscreenMode' ]);
console.log(`--- PT-1-[fullscreenMode]:`, fullscreenMode);

// Subscribe to changes of the `screenZoom` state from the `session` store.   
// Every change of `screenZoom` state will trigger callback in the subscribe method (RxJS).
const screenZoom$ = krixStateStore.select([ 'session', 'screenZoom' ])
  .subscribe((screenZoom) => {
    console.log(`--- PT-2-[screenZoom]:`, screenZoom);
    // Do something...
  });

// Subscribe to changes of the `lastUserCommand` state from the `session` store.   
// This state is a signal so it won't be saved in the 'session' store but we will get all 
// updates in the `subscribe` method.
const lastUserCommand$ = krixStateStore.select([ 'session', 'lastUserCommand' ])
  .subscribe((lastUserCommand) => {
    console.log(`--- PT-3-[lastUserCommand]:`, lastUserCommand);
    // Do something...
  });

sessionStore.setScreenZoom(2);
sessionStore.enableFullscreen();

console.log(`--- PT-4-[fullscreenMode]:`, fullscreenMode);
fullscreenMode = krixStateStore.getState([ 'session', 'fullscreenMode' ]);
console.log(`--- PT-5-[fullscreenMode]:`, fullscreenMode);

const sessionLastUserCommand = krixStateStore.getState([ 'session', 'lastUserCommand' ]);
console.log(`--- PT-6-[lastUserCommand]:`, sessionLastUserCommand);
sessionStore.emitUserCommand({ type: 'update-user' });
sessionLastUserCommand = krixStateStore.getState([ 'session', 'lastUserCommand' ]);
console.log(`--- PT-7-[lastUserCommand]:`, sessionLastUserCommand);

sessionStore.setScreenZoom(2);
sessionStore.setScreenZoom(1.5);
```

Output:

```
--- PT-1-[fullscreenMode]: false
--- PT-2-[screenZoom]: 1
--- PT-3-[lastUserCommand]: null
--- PT-2-[screenZoom]: 2
--- PT-4-[fullscreenMode]: false
--- PT-5-[fullscreenMode]: true
--- PT-6-[lastUserCommand]: null
--- PT-3-[lastUserCommand]: { type: 'update-user' }
--- PT-7-[lastUserCommand]: null
--- PT-2-[screenZoom]: 1.5
```

## API

```typescript
KrixStateStore..StateStore.create(): void;
```

Creates an instance of **Krix state-store** and returns it.

___

```typescript
getState <StateValueType = any> (
  stateSelector?: string[]|string,
): StateValueType;
```

Returns a value for the state from the state-store by the state selector. If state selector isn't provided, method will return the root state (full store).

___

```typescript
select <StateValueType = any> (
  stateSelector: string[],
  onlyChanges: boolean = false,
): RxJS.Observable<StateValueType>;
```

Subscribes to changes of the state from the state-store by the state selector. If state selector isn't provided, method will subscribe to the root state (full store).

> The package uses a "lite" version of RxJS v6. We strongly advise to install your own version of RxJS and wrap `select` calls using a `from` create operator. Therefore, your logic will recognize our Observables as Observable-like objects.

> In order to recognize correctly Observables from the `select` method in your RxJS packages, you should define a `Symbol.observable`. You can read about it in more details here "[how to use interop observables](https://ncjamieson.com/how-to-use-interop-observables)".

___

```typescript
setState (
  stateAction: KrixStateStore.Interfaces.StateAction,
): void;
```
Sets a new value in the state using the state action. The state action consists of:   
`state` - the full path to the state in the state-store.   
`value` - a new value which we set in the state.   
`[options]` - a new value which we set in the state.   

Options:   
`signal` - if it's enabled, `setState` won't save the new state to the state-store.   
`compare` - if it's enabled and the state isn't changed, `setState` won't do anything.   
`merge` - if it's enabled, `setState` will merge the state instead of replacing it.   