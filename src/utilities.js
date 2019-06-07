/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-01
*/
import AlphaVantageAPI from "alpha-vantage-data-source";

export const production_flag = process.env.NODE_ENV === 'production';

// eslint-disable-next-line
export const contains = (array, element) => array.indexOf(element) !== -1;

const fieldResolver = (call, alias, field) => (p,a,c,i) => {
	if(p[field]) return p[field];
	if (!(p instanceof Object)) throw new Error("Fragment resolver can be only called within associated parent object.");
	if(typeof p[alias] === 'undefined') p[alias] = call(p,{...p,...a},c,i);
	if(p[alias]===null) return null;
	else return p[alias].then(r=>r[field]=r[field]||r[field]);
};

export const fragmentResolver = (
	call,
	alias = (
		call.name !== '' ?
			call.name
			: call.toString()
	),
	fields
) => {
	if (!fields instanceof Array) return fieldResolver(call, alias, fields);
	const typeResolver = {};
	fields.forEach(field => {
		typeResolver[field] = fieldResolver(call, alias, field)
	});
	return typeResolver;
};

export const forward = (parent,args) => ({...parent,...args});

export const crossSearch = (arr1, arr2) => arr1.some(r => arr2.includes(r));

export const setType = type => r => (r.type = type) && r;

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