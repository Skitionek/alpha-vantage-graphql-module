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
	else return p[alias].then(r=>r[field]);
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
	if (!Array.isArray(fields)) return fieldResolver(call, alias, fields);
	const typeResolver = {};
	fields.forEach(field => {
		typeResolver[field] = fieldResolver(call, alias, field)
	});
	return typeResolver;
};

export const forward = (parent,args) => ({...parent,...args});