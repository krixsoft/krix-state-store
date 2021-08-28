
export class KrixHelper {

  /**
   * Creates a clone of value.
   *
   * @param  {V} obj
   * @return {V}
   */
  static cloneDeep <V> (obj: V): V {
    if (KrixHelper.isUndefined(obj) === true) {
      return undefined;
    }

    const clonedObj = JSON.stringify(obj);
    return JSON.parse(clonedObj);
  }

  /**
   * Gets the value at path of object. If the resolved value is undefined, the defaultValue
   * is returned in its place
   *
   * @param  {V} obj
   * @param  {string} path
   * @param  {any} [defValue=undefined]
   * @return {any}
   */
  static get <V extends Object> (
    obj: V,
    path: string,
    defValue: any = undefined,
  ): any {
    if (KrixHelper.isObject(obj) === false || KrixHelper.isNull(obj) === true) {
      return defValue;
    }

    if (KrixHelper.isString(path) === false || path === ``) {
      return defValue;
    }

    let nextValueInPath: any = obj;
    const pathParts: string[] = path.split(`.`);

    const pathLength = pathParts.length;
    for (let pathIndex = 0; pathIndex < pathLength; pathIndex++) {
      const pathPart = pathParts[pathIndex];
      const newNextValue = nextValueInPath[pathPart];

      const nextPathIndex = pathIndex + 1;
      if (KrixHelper.isObject(newNextValue) === false
          && nextPathIndex !== pathLength) {
        return defValue;
      }

      nextValueInPath = newNextValue;
    }

    return KrixHelper.isUndefined(nextValueInPath) === true
      ? defValue : nextValueInPath;
  }

  /**
   * Sets the value at path of object. If a portion of path doesn't exist, it's created.
   *
   * @param  {V} obj
   * @param  {string} path
   * @param  {any} value
   * @return {void}
   */
  static set <V extends Object> (
    obj: V,
    path: string,
    value: unknown,
  ): void {
    if (KrixHelper.isObject(obj) === false || KrixHelper.isNull(obj) === true) {
      return;
    }

    if (KrixHelper.isString(path) === false || path === ``) {
      return;
    }

    let nextValueInPath: any = obj;
    const pathParts: string[] = path.split(`.`);

    const lastPathPartIndex = pathParts.length - 1;
    for (let pathIndex = 0; pathIndex < lastPathPartIndex; pathIndex++) {
      const pathPart = pathParts[pathIndex];
      const nextValue = nextValueInPath[pathPart];

      if (!KrixHelper.isObject(nextValue)) {
        nextValueInPath[pathPart] = {};
      }

      nextValueInPath = nextValueInPath[pathPart];
    }

    const lastPathPart = pathParts[lastPathPartIndex];
    nextValueInPath[lastPathPart] = value;
  }

  /**
   * Checks if value is the language type of Object.
   *
   * @param  {any} value
   * @return {boolean}
   */
  static isObject (value: unknown): boolean {
    return typeof value === `object`;
  }

  /**
   * Checks if value is classified as a String primitive or object.
   *
   * @param  {any} value
   * @return {boolean}
   */
  static isString (value: unknown): boolean {
    return typeof value === `string`;
  }

  /**
   * Checks if value is undefined.
   *
   * @param  {any} value
   * @return {boolean}
   */
  static isUndefined (value: unknown): boolean {
    return typeof value === `undefined`;
  }

  /**
   * Checks if value is null.
   *
   * @param  {any} value
   * @return {boolean}
   */
  static isNull (value: unknown): boolean {
    return value === null;
  }
}
