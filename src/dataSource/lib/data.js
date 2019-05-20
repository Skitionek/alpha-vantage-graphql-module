'use strict';

/**
 * Util function to get the timeseries data.
 *
 * @TODO: Add input validation.
 *
 * @param {String} fn
 *   The enum fn available for timeseries data.
 *
 * @returns {Function}
 *   A timeseries function to accept user data that returns a promise.
 */
const series = (fn, polisher = 'time_series') => function ({ symbol, outputsize, datatype, interval }) {
	return this.util.fn(
		fn,
		polisher
	).call(this, {
		symbol,
		interval,
		outputsize,
		datatype
	});
};

const polish_bestmatches = data => {
	if (data.bestmatches) {
		return data.bestmatches;
	}
	return data;
};

/**
 * Util function to get the symbol search data.
 *
 * @TODO: Add input validation.
 *
 * @param {String} fn
 *   The enum fn available for search data.
 *
 * @returns {Function}
 *   A search function to accept user data that returns a promise.
 */
const search = (fn) => function ({ keywords }) {
	return this.util.fn(fn, polish_bestmatches).call(this, {
		keywords
	});
};


const polish_global_quote = data => {
	data = data.global_quote;
	delete data.global_quote;

	data.date = data.latest_trading_day;
	delete data.latest_trading_day;
	data.close = data.prev_close;
	delete data.prev_close;
	return data;
};

module.exports = {
	intraday: series('TIME_SERIES_INTRADAY'),
	daily: series('TIME_SERIES_DAILY'),
	daily_adjusted: series('TIME_SERIES_DAILY_ADJUSTED'),
	weekly: series('TIME_SERIES_WEEKLY'),
	weekly_adjusted: series('TIME_SERIES_WEEKLY_ADJUSTED'),
	monthly: series('TIME_SERIES_MONTHLY'),
	monthly_adjusted: series('TIME_SERIES_MONTHLY_ADJUSTED'),
	quote: series('GLOBAL_QUOTE', polish_global_quote),
	search: search('SYMBOL_SEARCH'),
	batch: function ({ symbols }) {
		// Convert array to csv string.
		if (symbols instanceof Array) {
			symbols = symbols.join(',');
		}

		return this.util.fn('BATCH_STOCK_QUOTES').call(this, { symbols });
	}
};
