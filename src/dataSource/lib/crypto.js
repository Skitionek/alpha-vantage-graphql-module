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

	return {
		daily: series('DIGITAL_CURRENCY_DAILY'),
		weekly: series('DIGITAL_CURRENCY_WEEKLY'),
		monthly: series('DIGITAL_CURRENCY_MONTHLY'),

		cryptoExchangeTimeSeries: function ({ interval, ...rest }) {
			const intraday = interval.match(/\d+min/);
			if (intraday)
				return this.util.fn('FX_INTRADAY',
					'time_series',
					'data',
					'meta_data'
				).call(this, { ...rest, interval });
			return this.util.fn(`FX_${interval.toUpperCase()}`,
				'time_series',
				'data',
				'meta_data'
			).call(this, rest);
		},
		cryptoExchangeQuote: AlphaVantageAPI.prototype.forex.rate
	};
};