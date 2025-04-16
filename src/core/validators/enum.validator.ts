export class EnumValidator {
  validateEnumValue<T extends string>(
    value: string,
    enumObj: Record<string, T>
  ): boolean {
    return Object.values(enumObj).includes(value as T)
  }

  validateEnumArray<T extends string>(
    values: string[],
    enumObj: Record<string, T>
  ): boolean {
    return values.every((value) => this.validateEnumValue(value, enumObj))
  }
}
