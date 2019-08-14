/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-06-03
*/

import intersection from 'lodash.intersection';
import { mapValues } from 'lodash';

import { integrationSnapshots as responsesSnaps } from 'alpha-vantage-data-source/lib/test';
import { Date_Scalar, DateTime, Interval } from "../src/Scalars";
import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString, print } from "graphql";

const jsonic = require('jsonic');

const types = {};

function mapStructureToType(obj, key) {
	if (Array.isArray(obj)) {
		return [mapStructureToType(obj[0], key)];
	} else if (typeof obj === 'object' && obj !== null) {
		Object.entries(obj).forEach(([k, v]) => {
			obj[k] = mapStructureToType(v, `${key}_${k}`);
		});
		const ordered = {};
		Object.keys(obj).sort().forEach(innerKey => {
			ordered[innerKey] = obj[innerKey];
		});
		const type = jsonic.stringify(obj, { depth: Infinity, maxitems: Infinity, maxchars: Infinity });
		if (!types[type]) {
			types[type] = new Map([[key, obj]]);
		} else {
			types[type].set(key, obj);
		}
	}
	return obj
}

// eslint-disable-next-line no-shadow
(function populateBasedOnResponsesSnaps(responsesSnaps) {
	Object.keys(responsesSnaps).forEach(key1 => {
		Object.keys(responsesSnaps[key1]).forEach(key2 => {
			if (key2.match(/TimeSeries/)) return;
			let f_key = [key1, key2];
			if (f_key[0] === 'data') f_key[0] = 'stock';
			f_key = f_key.join('_');
			mapStructureToType(responsesSnaps[key1][key2], f_key)
		});
	});
})(responsesSnaps);

const ordered_types = types;

const names = new Map();
// eslint-disable-next-line no-shadow
(function resolveNames(ordered_types) {

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

const FIELD_TYPES = {
	TIMESTAMP: "Timestamp",
	STRING: "String",
	FLOAT: "Float",
	DATE: "Date",
	INTERVAL: "Interval"
};

const relations = [];

function typeDescToObject(field) {
	switch (field) {
	case FIELD_TYPES.TIMESTAMP:
		return DateTime;
	case FIELD_TYPES.STRING:
		return GraphQLString;
	case FIELD_TYPES.FLOAT:
		return GraphQLFloat;
	case FIELD_TYPES.DATE:
		return Date_Scalar;
	case FIELD_TYPES.INTERVAL:
		return Interval;
	default:
		if (Array.isArray(field)) return new GraphQLList(typeDescToObject(field[0]));
		if (typeof field === 'object' && field !== null) {
			const key = jsonic.stringify(field, {
				depth: Infinity,
				maxitems: Infinity,
				maxchars: Infinity
			});
			const type = ordered_types[key];
			// eslint-disable-next-line no-return-assign
			return ordered_types[key].c = ordered_types[key].c || new GraphQLObjectType({
				name: type.name,
				fields: mapValues(type.v.values().next().value, inner_field => ({
					type: typeDescToObject(inner_field)
				}))
			})
		}
		console.warn("no reach");

	}
}

let graphQLObjectTypes = mapValues(ordered_types, type => new GraphQLObjectType({
	name: type.name,
	fields: mapValues(type.v.values().next().value, field => ({
		type: typeDescToObject(field)
	}))
}));

relations.forEach(f => f());

mapValues(graphQLObjectTypes, v => console.log(print(v.astNode)));

// eslint-disable-next-line no-shadow
function resolveNestedTypes(graphQLObjectTypes) {
	function resolveNestedTypesRecursive(obj) {
		if (typeof obj !== 'object' || obj === null) return obj;
		if (obj.getFields) {
			return mapValues(obj.getFields(), field => {
				if (field.type && field.type.parseLiteral) return field;
				return resolveNestedTypesRecursive(field.type);
			});
		}
		if (Array.isArray(obj)) {
			return new GraphQLList(resolveNestedTypesRecursive(obj[0]));
		}
		const type = jsonic.stringify(obj, {
			depth: Infinity,
			maxitems: Infinity,
			maxchars: Infinity
		});
		if (!graphQLObjectTypes[type]) {
			console.error("type does not exist", type);
		} else {
			return graphQLObjectTypes[type];
		}
		console.assert(false);
	}

	return mapValues(graphQLObjectTypes, resolveNestedTypesRecursive)
}
graphQLObjectTypes = resolveNestedTypes(graphQLObjectTypes);

console.log(graphQLObjectTypes);

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