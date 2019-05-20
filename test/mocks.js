/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  24/04/2019
*/

// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&outputsize=full&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&outputsize=full&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=MSFT&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=MSFT&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=MSFT&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=MSFT&apikey=demo
// https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo
// https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=300135.SZ&apikey=demo
export const StockParamsSet = [
	{ symbol: "MSFT", interval: "5min" },
	{ symbol: "MSFT", interval: "5min", outputsize: "full" },
	{ symbol: "MSFT", interval: "daily" },
	{ symbol: "MSFT", interval: "daily", outputsize: "full" },
	{ symbol: "MSFT", interval: "weekly" },
	{ symbol: "MSFT", interval: "monthly" },
	{ symbol: "MSFT" },
	{ symbol: "300135.SZ" }
];

// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=Micro&apikey=demo
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=sony&apikey=demo
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=xiaomi&apikey=demo
export const SymbolSearchParamsSet = [
	{ keywords: "BA" },
	{ keywords: "Micro" },
	{ keywords: "sony" },
	{ keywords: "xiaomi" }
];

// https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=CNY&apikey=demo
// https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo
export const CryptocurrencyExchangeRateParamsSet = [
	{ from_currency: "BTC", to_currency: "CNY" },
	{ from_currency: "USD", to_currency: "JPY" }
];

// https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo
// https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&outputsize=full&apikey=demo
// https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=demo
// https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&outputsize=full&apikey=demo
// https://www.alphavantage.co/query?function=FX_WEEKLY&from_symbol=EUR&to_symbol=USD&apikey=demo
// https://www.alphavantage.co/query?function=FX_MONTHLY&from_symbol=EUR&to_symbol=USD&apikey=demo
export const ForeignExchangeSymbols = {
	from_symbol: "EUR",
	to_symbol: "USD"
};
export const ForeignExchangeParamsSet = [
	{ ...ForeignExchangeSymbols, interval: "5min" },
	{ ...ForeignExchangeSymbols, interval: "5min", outputsize: "full" },
	{ ...ForeignExchangeSymbols, interval: "daily" },
	{ ...ForeignExchangeSymbols, interval: "daily", outputsize: "full" },
	{ ...ForeignExchangeSymbols, interval: "weekly" },
	{ ...ForeignExchangeSymbols, interval: "monthly" }
];

// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=demo
// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=CNY&apikey=demo
// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=CNY&apikey=demo
export const CryptocurrencyParamsSet = [
	{ symbol: "BTC", market: "CNY", interval: "daily" },
	{ symbol: "BTC", market: "CNY", interval: "weekly" },
	{ symbol: "BTC", market: "CNY", interval: "monthly" }
];