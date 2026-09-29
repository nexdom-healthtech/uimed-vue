/**
 * Compares two values in depth, as a form would: key order doesn't matter, a key holding
 * `undefined` equals a missing key, dates are compared by their time and arrays item by item, in
 * order. Only plain objects are compared by their keys: other objects (e.g. `File`, `Map`, `Set`
 * or class instances) and the remaining values are compared with `Object.is`, so `NaN` equals
 * `NaN`, `0` differs from `-0`, and `null`, `""` and `undefined` differ from each other.
 */
export default function isDeepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;

  if (a instanceof Date && b instanceof Date) return Object.is(a.getTime(), b.getTime());

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => isDeepEqual(item, b[index]));
  }

  if (!isPlainObject(a) || !isPlainObject(b)) return false;

  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].every((key) => isDeepEqual(a[key], b[key]));
}

/**
 * Whether the value is an object literal or an object without prototype. Checks the prototype's
 * prototype instead of comparing it to `Object.prototype`, since objects from other realms (e.g.
 * iframes, or `structuredClone` in some test environments) have their own `Object.prototype`.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value == null) return false;

  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}
