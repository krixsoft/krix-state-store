
export class KrixHelper {
  static cloneDeep <V> (obj: V): V {
    if (KrixHelper.isUndefined(obj)) {
      return undefined;
    }

    const clonedObj = JSON.stringify(obj);
    return JSON.parse(clonedObj);
  }

  static get <V extends Object> (
    obj: V,
    path: string,
    defValue: any = undefined,
  ): any {
    if (!KrixHelper.isObject(obj) || KrixHelper.isNull(obj)) {
      return defValue;
    }

    if (!KrixHelper.isString(path) || path === ``) {
      return defValue;
    }

    let nextValueInPath: any = obj;
    const pathParts: string[] = path.split(`.`);

    const pathLength = pathParts.length;
    for (let pathIndex = 0; pathIndex < pathLength; pathIndex++) {
      const pathPart = pathParts[pathIndex];
      const newNextValue = nextValueInPath[pathPart];

      const nextPathIndex = pathIndex + 1;
      if (!KrixHelper.isObject(newNextValue)
          && nextPathIndex !== pathLength) {
        return defValue;
      }

      nextValueInPath = newNextValue;
    }

    return KrixHelper.isUndefined(nextValueInPath)
      ? defValue : nextValueInPath;
  }

  static set <V extends Object> (
    obj: V,
    path: string,
    value: any,
  ): void {
    if (!KrixHelper.isObject(obj) || KrixHelper.isNull(obj)) {
      return;
    }

    if (!KrixHelper.isString(path) || path === ``) {
      return;
    }

    let nextValueInPath: any = obj;
    const pathParts: string[] = path.split(`.`);

    const lastPathPartIndex = pathParts.length - 1;
    for (let pathIndex = 0; pathIndex < lastPathPartIndex; pathIndex++) {
      const pathPart = pathParts[pathIndex];
      const newNextValue = nextValueInPath[pathPart];

      if (!KrixHelper.isObject(newNextValue)) {
        nextValueInPath[pathPart] = {};
      }

      nextValueInPath = newNextValue;
    }

    const lastPathPart = pathParts[lastPathPartIndex];
    nextValueInPath[lastPathPart] = value;
  }

  static isObject (value: any): boolean {
    return typeof value === `object`;
  }

  static isString (value: any): boolean {
    return typeof value === `string`;
  }

  static isUndefined (value: any): boolean {
    return typeof value === `undefined`;
  }

  static isNull (value: any): boolean {
    return value === null;
  }
}
