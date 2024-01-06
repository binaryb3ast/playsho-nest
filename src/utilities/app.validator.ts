export default class Validator {
  public static isString(value: any): boolean {
    return typeof value === 'string';
  }

  public static isNotNull(value: any): boolean {
    return value !== null && value !== undefined;
  }

  public static isNull(value: any): boolean {
    return !this.isNotNull(value);
  }

  public static isValidJson(data: any): boolean {
    try {
      const json = JSON.parse(data);
      if (typeof json === 'object' && json !== null) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }
}
