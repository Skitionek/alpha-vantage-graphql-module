# AlphaVantage

[Alpha Vantage API](https://www.alphavantage.co/documentation/) implemented as plug and play GraphQL module. Hosted on [NPM](https://www.npmjs.com/package/alpha-vantage-graphql-module). It is a hobby project, first version was written out of need for my work later polished in overhours (I have no affiliation with AlphaVantage).

Originally it was fork of [https://github.com/zackurben/alphavantage](https://github.com/zackurben/alphavantage) yet this module does not directly inherit any related source code. Instead I developed a fork of zackurben project (covers whole API, is not )


All contributions are welcome! This is an open source project under the MIT license.

## Installation
```bash
npm i alpha-vantage-graphql-module
```

## Usage

```javascript
import { GraphQLModule } from '@graphql-modules/core';
import alphaVantage from 'alpha-vantage-graphql-module';

export const AppModule = new GraphQLModule({
	imports: [
		alphaVantage,
		//your modules	
	]
});
```
or as standalone application:
```js
import { GraphQLServer } from 'graphql-yoga';
import alphaVantage from 'alpha-vantage-graphql-module';
const {schema} = alphaVantage;

const server = new GraphQLServer({
	schema,
	context: r => r
});

server.start(graphQL_options, ({ port }) =>
	console.log(`Server is running on http://localhost:${  port}`)
);
```

Please check [graphQL schema](src/schema.graphql) for more documentation.

## Schema

## Data

See [Alpha Vantage](https://www.alphavantage.co/documentation/#time-series-data) for the parameters.
```javascript
alpha.data.intraday(symbol, outputsize, datatype, interval)
alpha.data.daily(symbol, outputsize, datatype, interval)
alpha.data.daily_adjusted(symbol, outputsize, datatype, interval)
alpha.data.weekly(symbol, outputsize, datatype, interval)
alpha.data.weekly_adjusted(symbol, outputsize, datatype, interval)
alpha.data.monthly(symbol, outputsize, datatype, interval)
alpha.data.monthly_adjusted(symbol, outputsize, datatype, interval)
alpha.data.quote(symbol, outputsize, datatype, interval)
alpha.data.search(keywords)
alpha.data.batch([symbol1, symbol2..])
```

## Forex

See [Alpha Vantage](https://www.alphavantage.co/documentation/#fx) for the parameters.
```javascript
alpha.forex.rate(from_currency, to_currency)
```

## Crypto

See [Alpha Vantage](https://www.alphavantage.co/documentation/#digital-currency) for the parameters.
```javascript
alpha.crypto.daily(symbol, market)
alpha.crypto.weekly(symbol, market)
alpha.crypto.monthly(symbol, market)
```

## Technicals

See [Alpha Vantage](https://www.alphavantage.co/documentation/#technical-indicators) for the parameters.
```javascript
alpha.technical.sma(symbol, interval, time_period, series_type)
alpha.technical.ema(symbol, interval, time_period, series_type)
alpha.technical.wma(symbol, interval, time_period, series_type)
alpha.technical.dema(symbol, interval, time_period, series_type)
alpha.technical.tema(symbol, interval, time_period, series_type)
alpha.technical.trima(symbol, interval, time_period, series_type)
alpha.technical.kama(symbol, interval, time_period, series_type)
alpha.technical.mama(symbol, interval, series_type, fastlimit, slowlimit)
alpha.technical.t3(symbol, interval, time_period, series_type)
alpha.technical.macd(symbol, interval, series_type, fastperiod, slowperiod, signalperiod)
alpha.technical.macdext(symbol, interval, series_type, fastperiod, slowperiod, signalperiod, fastmatype, slowmatype, signalmatype)
alpha.technical.stoch(symbol, interval, fastkperiod, slowkperiod, slowdperiod, slowkmatype, slowdmatype)
alpha.technical.stochf(symbol, interval, fastkperiod, fastdperiod, fastdmatype)
alpha.technical.rsi(symbol, interval, time_period, series_type)
alpha.technical.stochrsi(symbol, interval, time_period, series_type, fastkperiod, slowdperiod, fastdmatype)
alpha.technical.willr(symbol, interval, time_period)
alpha.technical.adx(symbol, interval, time_period)
alpha.technical.adxr(symbol, interval, time_period)
alpha.technical.apo(symbol, interval, series_type, fastperiod, slowperiod, matype)
alpha.technical.ppo(symbol, interval, series_type, fastperiod, slowperiod, matype)
alpha.technical.mom(symbol, interval, time_period, series_type)
alpha.technical.bop(symbol, interval)
alpha.technical.cci(symbol, interval, time_period)
alpha.technical.cmo(symbol, interval, time_period, series_type)
alpha.technical.roc(symbol, interval, time_period, series_type)
alpha.technical.rocr(symbol, interval, time_period, series_type)
alpha.technical.aroon(symbol, interval, time_period)
alpha.technical.aroonosc(symbol, interval, time_period)
alpha.technical.mfi(symbol, interval, time_period)
alpha.technical.trix(symbol, interval, time_period, series_type)
alpha.technical.ultosc(symbol, interval, timeperiod1, timeperiod2, timeperiod3)
alpha.technical.dx(symbol, interval, time_period)
alpha.technical.minus_di(symbol, interval, time_period)
alpha.technical.plus_di(symbol, interval, time_period)
alpha.technical.minus_dm(symbol, interval, time_period)
alpha.technical.plus_dm(symbol, interval, time_period)
alpha.technical.bbands(symbol, interval, time_period, series_type, nbdevup, nbdevdn)
alpha.technical.midpoint(symbol, interval, time_period, series_type)
alpha.technical.midprice(symbol, interval, time_period)
alpha.technical.sar(symbol, interval, acceleration, maximum)
alpha.technical.trange(symbol, interval)
alpha.technical.atr(symbol, interval, time_period)
alpha.technical.natr(symbol, interval, time_period)
alpha.technical.ad(symbol, interval)
alpha.technical.adosc(symbol, interval, fastperiod, slowperiod)
alpha.technical.obv(symbol, interval)
alpha.technical.ht_trendline(symbol, interval, series_type)
alpha.technical.ht_sine(symbol, interval, series_type)
alpha.technical.ht_trendmode(symbol, interval, series_type)
alpha.technical.ht_dcperiod(symbol, interval, series_type)
alpha.technical.ht_dcphase(symbol, interval, series_type)
alpha.technical.ht_dcphasor(symbol, interval, series_type)
```

## Performance

See [Alpha Vantage](https://www.alphavantage.co/documentation/#sector-information) for the parameters.
```javascript
alpha.performance.sector()
```

## Contributing

All contributions are welcome! The purpose of this library is to keep function parity with the Alpha Vantage API, while keeping a slim and intuitive programming interface. Before any pull requests are made, please run `npm run lint` to fix style issues and ensure that all test are passing `npm test`. The codebase should always remain at 100% test coverage.

Core has been forked from: [zackurben/alphavantage](https://github.com/zackurben/alphavantage)