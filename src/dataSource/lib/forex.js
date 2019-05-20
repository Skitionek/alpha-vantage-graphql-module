'use strict';

const polish_realtime_currency_exchange_rate = data => data.realtime_currency_exchange_rate;

module.exports = {
	rate: function ({ from_currency, to_currency }) {
		return this.util.fn('CURRENCY_EXCHANGE_RATE', polish_realtime_currency_exchange_rate).call(this, {
			from_currency,
			to_currency
		})
	}
};
