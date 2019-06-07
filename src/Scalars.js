/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-06-07
*/

import { GraphQLScalarType } from 'graphql';
import {timeFormat} from 'd3-time-format';

const formatDate = timeFormat("%Y-%m-%d");
export const Date_Scalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date - contain resolution up to days',
	serialize(value) {
		return value instanceof Date? formatDate(value) : value;
	},
	parseValue(value) {
		let result = new Date(value);
		result.toString = formatDate;
		return result;
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			return new Date(ast.value) // ast value is always in string format
		}
		return null;
	}
});
const formatDateTime = timeFormat("%Y-%m-%d %H:%M:%S");
export const DateTime = new GraphQLScalarType({
	name: 'DateTime',
	description: 'DateTime - potentially contain contains resolution up to seconds',
	serialize(value) {
		return formatDateTime(value);
	},
	parseValue(value) {
		let result = new Date(value);
		result.toString = formatDateTime;
		return result;
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			return new Date(ast.value) // ast value is always in string format
		}
		return null;
	}
});

const INTERVALS = [
	'1min', '5min', '15min' , '30min', '60min', 'daily', 'weekly', 'monthly'
];
function intervalValue(value) {
  return INTERVALS.indexOf(value)===-1?
	  new Error(`Interval must be one of predefined values: ${INTERVALS.join(', ')}`)
	  :
	  value;
}
export const Interval = new GraphQLScalarType({
  name: 'Interval',
	description: `One of the preset intervals: [${INTERVALS}]`,
  serialize: intervalValue,
  parseValue: intervalValue,
  parseLiteral(ast) {
      return intervalValue(ast.value);
  }
});

export default {
	Date: Date_Scalar, DateTime, Interval
};