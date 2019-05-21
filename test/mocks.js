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

// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=Micro&apikey=demo
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=sony&apikey=demo
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=xiaomi&apikey=demo
const intraday = [
	{ symbol: "MSFT", interval: "5min" },
	{ symbol: "MSFT", interval: "5min", outputsize: "full" }
];
const daily = [{ symbol: "MSFT" },
	{ symbol: "MSFT", outputsize: "full" }];
const weekly = { symbol: "MSFT" };
const monthly = { symbol: "MSFT" };
const timeSeries = [
	...daily.map(d => ({ ...d, interval: 'daily' })),
	{ ...weekly, interval: 'weekly' },
	{ ...monthly, interval: 'monthly' },
];
export const data = {
	intraday,
	daily,
	daily_adjusted: daily,
	weekly,
	weekly_adjusted: weekly,
	monthly,
	monthly_adjusted: monthly,
	quote: [{ symbol: "MSFT" },
		{
			symbol: "300135.SZ"
		}],
	search: [
		{ keywords: "BA" },
		{ keywords: "Micro" },
		{ keywords: "sony" },
		{ keywords: "xiaomi" }
	],

	exchangeTimeSeries: [
		...intraday,
		...timeSeries
	],
	exchangeTimeSeries_adjusted: timeSeries
};

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
export const forex = {
	exchangeRates: [
		{ from_currency: "BTC", to_currency: "CNY" },
		{ from_currency: "USD", to_currency: "JPY" }
	],

	intraday: [
		{ ...ForeignExchangeSymbols, interval: "5min" },
		{ ...ForeignExchangeSymbols, interval: "5min", outputsize: "full" }
	],
	daily: [
		ForeignExchangeSymbols,
		{ ...ForeignExchangeSymbols, outputsize: "full" }
	],
	weekly: ForeignExchangeSymbols,
	monthly: ForeignExchangeSymbols,

	exchangeTimeSeries: [
		{ ...ForeignExchangeSymbols, interval: "5min" },
		{ ...ForeignExchangeSymbols, interval: "5min", outputsize: "full" },
		{ ...ForeignExchangeSymbols, interval: "daily" },
		{ ...ForeignExchangeSymbols, interval: "daily", outputsize: "full" },
		{ ...ForeignExchangeSymbols, interval: "weekly" },
		{ ...ForeignExchangeSymbols, interval: "monthly" }
	]
};

// https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=CNY&apikey=demo
// https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo
// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=demo
// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=CNY&apikey=demo
// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=CNY&apikey=demo
export const CurrencyExchangeSymbols = {
	symbol: "BTC",
	market: "CNY"
};
export const crypto = {
	exchangeRates: forex.exchangeRates,

	daily: CurrencyExchangeSymbols,
	weekly: CurrencyExchangeSymbols,
	monthly: CurrencyExchangeSymbols,

	exchangeTimeSeries: [
		{ ...CurrencyExchangeSymbols, interval: "daily" },
		{ ...CurrencyExchangeSymbols, interval: "daily", outputsize: "full" },
		{ ...CurrencyExchangeSymbols, interval: "weekly" },
		{ ...CurrencyExchangeSymbols, interval: "monthly" }
	]
};

// https://www.alphavantage.co/query?function=SMA&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=SMA&symbol=USDEUR&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=EMA&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=EMA&symbol=USDEUR&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=WMA&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=DEMA&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo
// TEMA
// https://www.alphavantage.co/query?function=TEMA&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo
// TRIMA
// https://www.alphavantage.co/query?function=TRIMA&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=KAMA&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=MAMA&symbol=MSFT&interval=daily&series_type=close&fastlimit=0.02&apikey=demo
// https://www.alphavantage.co/query?function=VWAP&symbol=MSFT&interval=15min&apikey=demo
// T3
// https://www.alphavantage.co/query?function=T3&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=MACD&symbol=MSFT&interval=daily&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=MACD&symbol=USDEUR&interval=weekly&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=MACDEXT&symbol=MSFT&interval=daily&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=STOCH&symbol=MSFT&interval=daily&apikey=demo
// https://www.alphavantage.co/query?function=STOCH&symbol=USDEUR&interval=weekly&apikey=demo
// https://www.alphavantage.co/query?function=STOCHF&symbol=MSFT&interval=daily&apikey=demo
// https://www.alphavantage.co/query?function=RSI&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=RSI&symbol=USDEUR&interval=weekly&time_period=10&series_type=open&apikey=demo
// https://www.alphavantage.co/query?function=STOCHRSI&symbol=MSFT&interval=daily&time_period=10&series_type=close&fastkperiod=6&fastdmatype=1&apikey=demo
// https://www.alphavantage.co/query?function=WILLR&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=ADX&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=ADX&symbol=USDEUR&interval=weekly&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=ADXR&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=APO&symbol=MSFT&interval=daily&series_type=close&fastperiod=10&matype=1&apikey=demo
// PPO
// https://www.alphavantage.co/query?function=PPO&symbol=MSFT&interval=daily&series_type=close&fastperiod=10&matype=1&apikey=demo
// https://www.alphavantage.co/query?function=MOM&symbol=MSFT&interval=daily&time_period=10&series_type=close&apikey=demo
// https://www.alphavantage.co/query?function=BOP&symbol=MSFT&interval=daily&apikey=demo
// https://www.alphavantage.co/query?function=CCI&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=CCI&symbol=USDEUR&interval=weekly&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=CMO&symbol=MSFT&interval=weekly&time_period=10&series_type=close&apikey=demo
// https://www.alphavantage.co/query?function=ROC&symbol=MSFT&interval=weekly&time_period=10&series_type=close&apikey=demo
// https://www.alphavantage.co/query?function=ROCR&symbol=MSFT&interval=daily&time_period=10&series_type=close&apikey=demo
// https://www.alphavantage.co/query?function=AROON&symbol=MSFT&interval=daily&time_period=14&apikey=demo
// https://www.alphavantage.co/query?function=AROON&symbol=USDEUR&interval=weekly&time_period=14&apikey=demo
// https://www.alphavantage.co/query?function=AROONOSC&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=MFI&symbol=MSFT&interval=weekly&time_period=10&apikey=demo
// TRIX
// https://www.alphavantage.co/query?function=TRIX&symbol=MSFT&interval=daily&time_period=10&series_type=close&apikey=demo
// https://www.alphavantage.co/query?function=ULTOSC&symbol=MSFT&interval=daily&timeperiod1=8&apikey=demo
// https://www.alphavantage.co/query?function=DX&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=MINUS_DI&symbol=MSFT&interval=weekly&time_period=10&apikey=demo
// PLUS_DI
// https://www.alphavantage.co/query?function=PLUS_DI&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=MINUS_DM&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// PLUS_DM
// https://www.alphavantage.co/query?function=PLUS_DM&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=BBANDS&symbol=MSFT&interval=weekly&time_period=5&series_type=close&nbdevup=3&nbdevdn=3&apikey=demo
// https://www.alphavantage.co/query?function=BBANDS&symbol=USDEUR&interval=weekly&time_period=5&series_type=close&nbdevup=3&nbdevdn=3&apikey=demo
// https://www.alphavantage.co/query?function=MIDPOINT&symbol=MSFT&interval=daily&time_period=10&series_type=close&apikey=demo
// https://www.alphavantage.co/query?function=MIDPRICE&symbol=MSFT&interval=daily&time_period=10&apikey=demo
// https://www.alphavantage.co/query?function=SAR&symbol=MSFT&interval=weekly&acceleration=0.05&maximum=0.25&apikey=demo
// TRANGE
// https://www.alphavantage.co/query?function=TRANGE&symbol=MSFT&interval=daily&apikey=demo
// https://www.alphavantage.co/query?function=ATR&symbol=MSFT&interval=daily&time_period=14&apikey=demo
// https://www.alphavantage.co/query?function=NATR&symbol=MSFT&interval=weekly&time_period=14&apikey=demo
// https://www.alphavantage.co/query?function=AD&symbol=MSFT&interval=daily&apikey=demo
// https://www.alphavantage.co/query?function=ADOSC&symbol=MSFT&interval=daily&fastperiod=5&apikey=demo
// https://www.alphavantage.co/query?function=OBV&symbol=MSFT&interval=weekly&apikey=demo
// HT_TRENDLINE
// https://www.alphavantage.co/query?function=HT_TRENDLINE&symbol=MSFT&interval=daily&series_type=close&apikey=demo
// HT_SINE
// https://www.alphavantage.co/query?function=HT_SINE&symbol=MSFT&interval=daily&series_type=close&apikey=demo
// HT_TRENDMODE
// https://www.alphavantage.co/query?function=HT_TRENDMODE&symbol=MSFT&interval=weekly&series_type=close&apikey=demo
// HT_DCPERIOD
// https://www.alphavantage.co/query?function=HT_DCPERIOD&symbol=MSFT&interval=daily&series_type=close&apikey=demo
// HT_DCPHASE
// https://www.alphavantage.co/query?function=HT_DCPHASE&symbol=MSFT&interval=daily&series_type=close&apikey=demo
// HT_PHASOR
// https://www.alphavantage.co/query?function=HT_PHASOR&symbol=MSFT&interval=weekly&series_type=close&apikey=demo
export const technical = {
	sma: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open' },
	ema: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open' },
	wma: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open' },
	dema: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open' },
	tema: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open' },
	trima: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open' },
	kama: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open' },
	mama: { symbol: 'MSFT', interval: 'daily', series_type: 'close', fastlimit: 0.02 },
	vwap: { symbol: 'MSFT', interval: '15min' },
	t3: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open' },
	macd: { symbol: 'MSFT', interval: 'daily', series_type: 'open' },
	macdext: { symbol: 'MSFT', interval: 'daily', series_type: 'open' },
	stoch: { symbol: 'MSFT', interval: 'daily' },
	stochf: { symbol: 'MSFT', interval: 'daily' },
	rsi: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open' },
	stochrsi: {
		symbol: 'MSFT',
		interval: 'daily',
		time_period: 10,
		series_type: 'close',
		fastkperiod: 6,
		fastdmatype: 1
	},
	willr: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	adx: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	adxr: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	apo: { symbol: 'MSFT', interval: 'daily', series_type: 'close', fastperiod: 10, matype: 1 },
	ppo: { symbol: 'MSFT', interval: 'daily', series_type: 'close', fastperiod: 10, matype: 1 },
	mom: { symbol: 'MSFT', interval: 'daily', time_period: 10, series_type: 'close' },
	bop: { symbol: 'MSFT', interval: 'daily' },
	cci: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	cmo: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'close' },
	roc: { symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'close' },
	rocr: { symbol: 'MSFT', interval: 'daily', time_period: 10, series_type: 'close' },
	aroon: { symbol: 'MSFT', interval: 'daily', time_period: 14 },
	aroonosc: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	mfi: { symbol: 'MSFT', interval: 'weekly', time_period: 10 },
	trix: { symbol: 'MSFT', interval: 'daily', time_period: 10, series_type: 'close' },
	ultosc: { symbol: 'MSFT', interval: 'daily', timeperiod: 8 },
	dx: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	minus_di: { symbol: 'MSFT', interval: 'weekly', time_period: 10 },
	plus_di: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	minus_dm: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	plus_dm: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	bbands: { symbol: 'MSFT', interval: 'weekly', time_period: 5, series_type: 'close', nbdevup: 3, nbdevdn: 3 },
	midpoint: { symbol: 'MSFT', interval: 'daily', time_period: 10, series_type: 'close' },
	midprice: { symbol: 'MSFT', interval: 'daily', time_period: 10 },
	sar: { symbol: 'MSFT', interval: 'weekly', acceleration: 0.05, maximum: 0.25 },
	trange: { symbol: 'MSFT', interval: 'daily' },
	atr: { symbol: 'MSFT', interval: 'daily', time_period: 14 },
	natr: { symbol: 'MSFT', interval: 'weekly', time_period: 14 },
	ad: { symbol: 'MSFT', interval: 'daily' },
	adosc: { symbol: 'MSFT', interval: 'daily', fastperiod: 5 },
	obv: { symbol: 'MSFT', interval: 'weekly' },
	ht_trendline: { symbol: 'MSFT', interval: 'daily', series_type: 'close' },
	ht_sine: { symbol: 'MSFT', interval: 'daily', series_type: 'close' },
	ht_trendmode: { symbol: 'MSFT', interval: 'weekly', series_type: 'close' },
	ht_dcperiod: { symbol: 'MSFT', interval: 'daily', series_type: 'close' },
	ht_dcphase: { symbol: 'MSFT', interval: 'daily', series_type: 'close' },
	ht_phasor: { symbol: 'MSFT', interval: 'weekly', series_type: 'close' }
};

export const performance = {
	sector: {}
};