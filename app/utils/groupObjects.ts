/**
    groups an array of unordered objects into a map and returns an array of nested arrays which contain two elements [key, [object, object]]
    e.g. 
        [
          ['John', [{id: 1, name: John}, {id: 2, name: John}]], 
          ['David', [{id: 1, name: David}, {id: 2, name: David}]]
        ]
 */

export const groupObjects = (arrayOfUngroupedObjects: Array<any>, key: string): Array<Array<any>> => {
    const groups = new Map();

    // iterate over the objects array
    arrayOfUngroupedObjects.forEach(object => {
    // check if a group with the same name property already exists
    if (groups.has(object[key])) {
      // if it does, add the object to the group
      groups.get(object[key]).push(object);
    } else {
      // if not, create a new group with the object
      groups.set(object[key], [object]);
    }
  });

  return Array.from(groups);
};
