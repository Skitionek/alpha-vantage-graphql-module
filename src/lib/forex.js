'use strict';


const series = fn => function ({ from_symbol, to_symbol, interval, outputsize }) {
	return this.util.fn(
		fn,
		'time_series'
	).call(this, { from_symbol, to_symbol, interval, outputsize })
};

module.exports = AlphaVantageAPI => ({
	exchangeRates: AlphaVantageAPI.prototype.crypto.exchangeRates,
	intraday: series('FX_INTRADAY'),
	daily: series('FX_DAILY'),
	weekly: series('FX_WEEKLY'),
	monthly: series('FX_MONTHLY'),

	exchangeTimeSeries: function ({ from_symbol, to_symbol, interval, outputsize }) {
		const intraday = interval.match(/\d+min/);
		if (intraday)
			return this.util.fn('FX_INTRADAY',
				'time_series',
				'data',
				'meta_data'
			).call(this, { from_symbol, to_symbol, interval, outputsize });
		return this.util.fn(`FX_${interval.toUpperCase()}`,
			'time_series',
			'data',
			'meta_data'
		).call(this, { from_symbol, to_symbol, outputsize });
	}
});
