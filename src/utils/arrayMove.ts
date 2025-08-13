// Utility to move an item in an array from one index to another
export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  const [moved] = newArray.splice(from, 1);
  newArray.splice(to, 0, moved);
  return newArray;
}
