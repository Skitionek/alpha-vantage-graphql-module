/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-06-03
*/

const jsonic = require('jsonic');
import intersection from 'lodash.intersection';
import { mapValues, mergeWith } from 'lodash';

import { integrationSnapshots as rsponsesSnaps } from 'alpha-vantage-data-source/lib/test';

const types = {};

function shallowMapStructureToType(obj, key) {
	if (Array.isArray(obj)) {
		return [shallowMapStructureToType(obj[0], key)];
	} else if (typeof obj === 'object' && obj !== null) {
		Object.entries(obj).forEach(([k, v]) => {
			obj[k] = shallowMapStructureToType(v, `${key}_${k}`);
		});
		const ordered = {};
		Object.keys(obj).sort().forEach( inner_key => {
			ordered[inner_key] = obj[inner_key];
		});
		const type = jsonic.stringify(obj, { depth: 1, maxitems: Infinity, maxchars: Infinity });
		if (!types[type]) {
			types[type] = new Map([[key, obj]]);
		} else {
			types[type].set(key, obj);
		}
	}
	return obj
}

// eslint-disable-next-line no-shadow
(function populateBasedOnResponsesSnaps(rsponsesSnaps) {
	Object.keys(rsponsesSnaps).forEach(key1 => {
		Object.keys(rsponsesSnaps[key1]).forEach(key2 => {
			if (key2.match(/TimeSeries/)) return;
			let f_key = [key1, key2];
			if (f_key[0] === 'data') f_key[0] = 'stock';
			f_key = f_key.join('_');
			shallowMapStructureToType(rsponsesSnaps[key1][key2], f_key)
		});
	});
})(rsponsesSnaps);

const ordered_types = types;

// eslint-disable-next-line no-shadow
(function resolveNames(ordered_types) {
	const names = new Map();

	function assignName(k, typeName, v) {
		if (names.has(typeName)) {
			const old = names.get(typeName);
			assignName(k, typeName + String.fromCharCode(old.used++), v);
		} else {
			ordered_types[k] = {
				name: typeName,
				v, used: 65,
				interfaces: new Set()
			};
			names.set(typeName, ordered_types[k]);
		}
	}

	Object.entries(ordered_types).sort((a, b) => b[1].size - a[1].size).forEach(([k, v]) => {
		const typeName = intersection(...Array.from(v.keys()).map(d => d.split('_').map(capitalizeFirstLetter))).join('');
		assignName(k, typeName, v);
	});
})(ordered_types);

// eslint-disable-next-line no-shadow
(function resolveNestedTypes(ordered_types) {
	Object.values(ordered_types).forEach(typeObject => {
		const typeArray = Array.from(typeObject.v.values());
		typeArray.forEach(obj => {
			// eslint-disable-next-line max-nested-callbacks
			Object.keys(obj).forEach(param => {
				if (typeof obj[param] !== 'object' || obj[param] === null) return;
				if (Array.isArray(obj[param])) {
					const type = jsonic.stringify(obj[param][0], { depth: 1, maxitems: Infinity, maxchars: Infinity });
					if (!ordered_types[type]) {
						console.error("type does not exist", type);
					} else {
						obj[param] = `[${ordered_types[type].name}]`;
					}

				} else {
					const type = jsonic.stringify(obj[param], { depth: 1, maxitems: Infinity, maxchars: Infinity });
					if (!ordered_types[type]) {
						console.error("type does not exist", type);
					} else {
						obj[param] = ordered_types[type].name
					}

				}

			})
		});

		function customizer(objValue, srcValue) {
			if (objValue !== srcValue) {
				const values = new Set(srcValue.split('|'));
				values.add(objValue);
				return Array.from(values).join('|');
			}
			return objValue
		}

		typeObject.keyRecalculated = typeArray.reduce((o, n) =>
			mergeWith(n, o, customizer)
		, {});
	});

})(ordered_types);

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function objectSimilarities(a, b) {
	return Object.keys(a).reduce((o, n) => {
		if (a[n] === b[n]) o.push(n);
		return o;
	}, [])
}

let interfaces = {};
// eslint-disable-next-line no-shadow
(function suggestInterfaces(ordered_types) {
	Object.entries(ordered_types).forEach(([ka, a]) => {
		Object.entries(ordered_types).forEach(([kb, b]) => {
			if (ka !== kb) {
				const sim = objectSimilarities(a.keyRecalculated, b.keyRecalculated);
				if (sim.length > 5) {
					const key = JSON.stringify(sim.sort());
					if (interfaces[key]) {
						interfaces[key].types.add(a.name);
						interfaces[key].types.add(b.name);
						interfaces[key].multiplier++;
					} else {
						interfaces[key] = {
							types: new Set([a.name, b.name]),
							multiplier: 1,
							fields: sim
						};
						a.interfaces.add(key);
						b.interfaces.add(key);
					}
				}
			}
		});
	});
	interfaces = mapValues(interfaces, o => ({
		...o,
		name: Array.from(o.types).join('_')
	}))
})(ordered_types);

const interfaceList = Object.values(interfaces).sort((a, b) => b.fields.length - a.fields.length || b.multiplier - a.multiplier);

let output = "";
const queries = {};
output += "type Query {\n";
Object.values(ordered_types).forEach(type => {
	Array.from(type.v.keys()).forEach(key => {
		queries[key] = type.name;
		output += `\t${key}:\t ${type.name}\n`;
	})
});
output += "}\n";

Object.values(interfaceList).forEach(inter => {
	output += `interface ${
		inter.name
	} ${
		jsonic.stringify(inter.fields,
			{ depth: 1, maxitems: Infinity, maxchars: Infinity })
			.replace(/\[/g, '{\n\t')
			.replace(/,/g, ':\t String,\n\t')
			.replace(/]/, ':\t String\n}')
	}\n`;
});

Object.values(ordered_types).forEach(type => {
	output += `type ${
		type.name
	}${
		type.interfaces.size ? ` implements ${Array.from(type.interfaces).map(key => interfaces[key].name).join(', ')}` : ''
	} ${
		jsonic.stringify(type.keyRecalculated,
			{ depth: 1, maxitems: Infinity, maxchars: Infinity })
			.replace(/([{,])/g, '$1\n\t')
			.replace(/null/g, '\t String')
			.replace(/}/, '\n}')
	}\n`;
});

console.log(output);

it("", () => undefined);