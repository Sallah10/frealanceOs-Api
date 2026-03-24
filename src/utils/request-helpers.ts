import { ParsedQs } from 'qs';

/**
 * Safely extract a string from Express request params or query
 * Handles cases where the value might be a string, string[], or undefined
 */
export function getStringParam(
  value: string | string[] | ParsedQs | ParsedQs[] | undefined
): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }
  return undefined;
}

/**
 * Safely extract a number from Express request params or query
 */
export function getNumberParam(
  value: string | string[] | ParsedQs | ParsedQs[] | undefined,
  defaultValue?: number
): number | undefined {
  const str = getStringParam(value);
  if (!str) return defaultValue;
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Safely extract a boolean from Express request params or query
 */
export function getBooleanParam(
  value: string | string[] | ParsedQs | ParsedQs[] | undefined,
  defaultValue?: boolean
): boolean | undefined {
  const str = getStringParam(value);
  if (!str) return defaultValue;
  if (str === 'true' || str === '1') return true;
  if (str === 'false' || str === '0') return false;
  return defaultValue;
}

/**
 * Safely extract a string with default value
 */
export function getStringParamOrDefault(
  value: string | string[] | ParsedQs | ParsedQs[] | undefined,
  defaultValue: string = ''
): string {
  const str = getStringParam(value);
  return str ?? defaultValue;
}