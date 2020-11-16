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


## Terminology
**Store** - a common JS object used to store states.    
**@krix/state-store** - ORM. It creates a store and provides an interface to manage this store.    
**state-store.service** - an implementation of the bridge pattern, aims at converting ORM (WORM) to an abstraction of your system.    

> The introduction of such an abstraction allows you to change your state store library at a lower cost.

**Command** - function which uses ORM (WORM) to store data to your state store.

> It's not recommended to implement a buisnes logic within an "Command" abstraction because it can aggravate a system consistency. We recomend to move your buisnes logic to a service layer and call commands in the service layer.    

**<store-name>.store** - abstaction, what combines a set of commands to manage a specific store.

## Setup

> The package uses a "lite" version of RxJS v6. We strongly advise to install your own version of RxJS and wrap `select` calls using a `from` create operator. Therefore, your logic will recognize our Observables as Observable-like objects.

> In order to recognize correctly Observables from the `select` method in your RxJS packages, you should define a `Symbol.observable`. You can read about it in more details here "[how to use interop observables](https://ncjamieson.com/how-to-use-interop-observables)".
