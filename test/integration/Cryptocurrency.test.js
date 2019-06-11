/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import {
	generatedQueries,
	generateQuery,
	queryTesterFactory,
	schema,
	variables,
	variablesFieldsTupleByPath
} from "./utilities";
import mapValues from "lodash.mapvalues";
import { snaps } from "../../src/constants";

const { cryptocurrency } = generatedQueries;

const cryptocurrencySchemaHook = schema.getQueryType().getFields().cryptocurrency;

const exchangeTimeSeriesQuery = generateQuery({
	field: cryptocurrencySchemaHook,
	skeleton: mapValues(snaps.crypto.exchangeTimeSeries, () => false)
});
const test = queryTesterFactory(cryptocurrency);

describe("crypto.exchangeTimeSeries", () => queryTesterFactory(exchangeTimeSeriesQuery)(...variablesFieldsTupleByPath('crypto.exchangeTimeSeries')));

describe("crypto combined", () =>
	describe.each(variables.crypto.exchangeRates)("%j", exchangeRates =>
		describe.each(variables.crypto.exchangeTimeSeries)("%j", exchangeTimeSeries =>
			test({
				...exchangeRates,
				...exchangeTimeSeries
			})
		)
	)
);