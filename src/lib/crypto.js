'use strict';


module.exports = AlphaVantageAPI => {
	/**
	 * Util function to get the crypto data.
	 *
	 * @param {String} fn
	 *   The enum fn available for crypto data.
	 *
	 * @returns {Function}
	 *   A data function to accept user input and returns a promise.
	 */
	const series = fn => function ({ symbol, market }) {
		return this.util.fn(
			fn,
			'time_series'
		).call(this, {
			symbol,
			market
		})
	};

	const polish_realtime_currency_exchange_rate = data => data.realtime_currency_exchange_rate;

	return {
		exchangeRates: function ({ from_currency, to_currency }) {
			return this.util.fn('CURRENCY_EXCHANGE_RATE', polish_realtime_currency_exchange_rate).call(this, {
				from_currency,
				to_currency
			})
		},
		daily: series('DIGITAL_CURRENCY_DAILY'),
		weekly: series('DIGITAL_CURRENCY_WEEKLY'),
		monthly: series('DIGITAL_CURRENCY_MONTHLY'),

		exchangeTimeSeries: function ({ symbol, market, interval }) {
			return this.util.fn(`DIGITAL_CURRENCY_${interval.toUpperCase()}`,
				'time_series'
			).call(this, { symbol, market });
		}
	};
};