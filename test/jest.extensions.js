/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-04-26
*/
import { GraphQLList, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLInterfaceType, GraphQLNonNull } from 'graphql';

const okObject = {
	message: () => "Ok",
	pass: true
};
expect.extend({
	toBeType(received, argument) {
		if (argument === String && typeof received === 'string')
			return okObject;
		if (argument === Number && typeof received === 'number')
			return okObject;
		if (received instanceof argument) {
			return okObject;
		} 
		return {
			message: () => `expected ${received} to be ${argument} type or null`,
			pass: false
		};
		
	},

	toBeTypeOrNull(received, argument) {
		if (received === null) {
			return okObject;
		}
		expect(received).toBeType(argument);
		return okObject;
	},

	nothing() {
		return okObject
	},

	customObjectContaining(recived, target) {
		Object.entries(target).forEach(([name, value]) => {
			expect(recived).toHaveProperty(name);
			expect(recived[name]).toEqual(value);
		});
		return okObject;
	},

	toMatchSchema(received, node, depth, path=[]) {
		// schema.getQueryType().getFields().Stock.type.getFields().data.type.ofType.getFields().adjustedClose.type.name
		if (!(--depth < 0)) { // for >=0 or undefined true
			const rest = [depth,path];
			if (node instanceof GraphQLSchema) {
				expect(received).toHaveProperty('data');
				const { data } = received;
				const queriesNames = Object.keys(data);
				const queriesSchemas = node.getQueryType().getFields();
				queriesNames.forEach(queryName => {
					expect(queriesSchemas).toHaveProperty(queryName);
					expect(data[queryName]).toMatchSchema(queriesSchemas[queryName], depth,path.concat([queryName]));
				});
			} else if (node instanceof GraphQLList) {
				if(received===null) return okObject;
				expect(received).toEqual(expect.arrayContaining([expect.toMatchSchema(node.ofType, ...rest)]));
			} else if (node instanceof GraphQLObjectType) {
				const fragment = {};
				Object.entries(node.getFields()).forEach(([name, field]) => {
					fragment[name] = expect.toMatchSchema(field, depth,path.concat(name))
				});
				expect(received).toEqual(expect.customObjectContaining(fragment)); // return undefined or throws
			} else if (node instanceof GraphQLNonNull) {
				if(received === null) throw Error(`Found null in field of type ${node.inspect()}`);
				expect(received).toMatchSchema(node.ofType, ...rest);
			} else if (node instanceof GraphQLScalarType) {
				if(received===null) console.warn(`Field of type ${node} has value equal null`,path);
				node.parseValue(received);
			} else if (node instanceof GraphQLInterfaceType) {
				expect(received).toMatchSchema(node.getFields(), ...rest);
			} else if (node instanceof Object) {
				expect(received).toMatchSchema(node.type, ...rest);
			}
		}
		return okObject
	}
});