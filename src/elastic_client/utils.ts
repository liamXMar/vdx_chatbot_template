export function transformObject(input: { [key: string]: any[] }): { [key: string]: any } {
	const result: { [key: string]: any } = {};

	for (const key in input) {
		if (Array.isArray(input[key]) && input[key].length > 0) {
			result[key] = input[key][0];
		} else {
			result[key] = input[key];
		}
	}

	return result;
}

export function renameFields(data: { [key: string]: any }, fieldMappings: { [oldKey: string]: string }): { [key: string]: any } {
	const result: { [key: string]: any } = {};

	for (const key in data) {
		const newKey = fieldMappings[key] || key; // Use the new name if it exists, otherwise keep the original
		result[newKey] = data[key];
	}

	return result;
}

export function sortObjectKeysAlphabetically(input: { [key: string]: any }): { [key: string]: any } {
	const sortedKeys = Object.keys(input).sort(); // Get and sort the keys alphabetically
	const sortedObject: { [key: string]: any } = {};
  
	// Construct a new object with keys in sorted order
	for (const key of sortedKeys) {
	  sortedObject[key] = input[key];
	}
  
	return sortedObject;
  }