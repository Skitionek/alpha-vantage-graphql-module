import AlphaVantage from "alpha-vantage-data-source";
import { GraphQLModule } from '@graphql-modules/core';
import 'graphql-import-node';
import * as typeDefs from './schema.graphql';
import { alphaVantageInterface, API_TOKEN } from "./constants";
import { forward } from "./utilities";

import Stock from './Types/Stock';
import ForeignExchange from './Types/ForeignExchange';
import CryptocurrencyExchangeRate from './Types/CryptocurrencyExchangeRate';
import Cryptocurrency from "./Types/Cryptocurrency";
import SymbolSearch from "./Types/SymbolSearch"
import Technical from "./Types/Technical"
import StockData from "./Types/StockData";
import Scalars from "./Scalars";


export const alphaVantageProviderFactory = (API_TOKEN, params) => ({
	provide: alphaVantageInterface,
	useFactory: () => new AlphaVantage({ key: API_TOKEN }), // Init database connector
	...params
});
const alphaVantageProvider = alphaVantageProviderFactory(API_TOKEN);

export default new GraphQLModule({
	typeDefs,
	resolvers: {
		...Scalars,
		Query: {
			symbolSearch: SymbolSearch,
			stock: forward,
			cryptocurrency: Cryptocurrency,
			cryptocurrencyExchangeRate: forward,
			foreignExchange: forward,
			technical: forward
		},
		Technical,
		Cryptocurrency,
		ForeignExchange,
		Stock,
		StockData,
		CryptocurrencyExchangeRate,
		Company: {
			stock: forward
		}
	},
	providers: [
		alphaVantageProvider
	]
});
