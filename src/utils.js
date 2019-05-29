export function required(argumentsObj) {
	const argumentMap = Object.entries(argumentsObj);
	argumentMap.forEach(([key, value]) => {
		if (!value)
			throw new Error(`Argument '${key}' is required on either query or parent but not provided.`);
	});
	return (argumentMap.length === 1) ? argumentMap[0][1] : argumentsObj;
}

export function tryAccess(obj, arg, ...args) {
	switch (typeof arg) {
		case 'function':
			return tryAccess(obj.find(arg) || [], ...args);
		case 'undefined':
			return obj;
		default:
			return obj && tryAccess(obj[arg], ...args);
	}
}