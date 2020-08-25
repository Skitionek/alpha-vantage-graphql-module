import AlphaVantage from "alpha-vantage-data-source";
import { GraphQLModule } from '@graphql-modules/core';
import { alphaVantageInterface } from "./constants";
import typeDefs from './schema.graphql';
import { forward } from "./utils";

import Stock from './Types/Stock';
import ForeignExchange from './Types/ForeignExchange';
import CryptocurrencyExchangeRate from './Types/CryptocurrencyExchangeRate';
import Cryptocurrency from "./Types/Cryptocurrency";
import SymbolSearch from "./Types/SymbolSearch"
import Technical from "./Types/Technical"
import Scalars from "./Scalars";
import Performance from "./Types/Performance"

export const alphaVantageProviderFactory = (API_TOKEN, params) => ({
	provide: alphaVantageInterface,
	useFactory: () => new AlphaVantage({ key: API_TOKEN }), // Init database connector
	...params
});
export const alphaVantageProvider = alphaVantageProviderFactory();

export const alphaVantageModuleFactory = options => new GraphQLModule({
	typeDefs,
	resolvers: {
		...Scalars,
		Query: {
			symbolSearch: SymbolSearch,
			stock: forward,
			cryptocurrency: Cryptocurrency,
			cryptocurrencyExchangeRate: CryptocurrencyExchangeRate,
			foreignExchange: forward,
			technical: forward,
			sectorPerformance: Performance
		},
		Company: {
			stock: forward
		},
		Technical,
		Performance,
		Cryptocurrency,
		ForeignExchange,
		Stock,
		CryptocurrencyExchangeRate
	},
	providers: [
		alphaVantageProvider
	],
	...options
});

export default alphaVantageModuleFactory();
