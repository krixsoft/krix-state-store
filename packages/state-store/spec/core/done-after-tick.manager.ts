import * as _ from 'lodash';

type DoneFunction = (error?: any)=> void;

export class DoneAfterTickManager {
  private doneFunction: DoneFunction;
  private doneFunctionIsCalled: boolean;
  private tick: number;

  static create (
    doneFunction: DoneFunction,
  ): DoneAfterTickManager {
    const inst = new DoneAfterTickManager();
    inst.setDoneFunction(doneFunction);
    return inst;
  }

  constructor () {
    this.tick = 0;
  }

  /**
   * Sets the `done` function to internal property.
   *
   * @param  {DoneFunction} doneFunction
   * @return {void}
   */
  setDoneFunction (
    doneFunction: DoneFunction,
  ): void {
    this.doneFunction = doneFunction;
  }

  /**
   * Increates `tick` counter.
   *
   * @return {void}
   */
  nextTick (
  ): void {
    if (this.doneFunctionIsCalled === true) {
      throw new Error(`Something went wrong. You have alredy call 'done' function.`);
    }

    this.tick++;
  }

  /**
   * Returns current `tick`.
   *
   * @return {number}
   */
  getTick (
  ): number {
    return this.tick;
  }

  /**
   * Complets tick counter and invokes `done` function.
   *
   * @param  {string} error
   * @return {number}
   */
  done (
    error?: string,
  ): void {
    if (_.isNil(error) === false) {
      this.doneFunction(new Error(`Tick (${this.tick}) error: ${error}`));
      return;
    }

    if (this.doneFunctionIsCalled === true) {
      return;
    }
    this.doneFunctionIsCalled = true;
    this.doneFunction();
  }
}
