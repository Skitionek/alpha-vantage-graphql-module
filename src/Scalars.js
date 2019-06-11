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
		const result = new Date(value);
		result.toString = formatDate;
		return result;
	},
	parseLiteral(ast) {
		return ast.match(/\d{4}-\d{2}-\d{2}/)?this.parseValue(ast):new Error(`Could not parse ${ast}, date should be written in format 'YYYY-MM-DD'`);
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
		const result = new Date(value);
		result.toString = formatDateTime;
		return result;
	},
	parseLiteral(ast) {
		return ast.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)?this.parseValue(ast):new Error(`Could not parse ${ast}, dateTime should be written in format 'YYYY-MM-DD hh:mm:ss'`);
	}
});

const INTERVALS = [
	'1min', '5min', '15min' , '30min', '60min', 'daily', 'weekly', 'monthly'
];
function intervalValue(value) {
	return INTERVALS.includes(value)?
	  value
		:
	  new Error(`Interval must be one of predefined values: ${INTERVALS.join(', ')}`);
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