'use strict';

module.exports = AlphaVantageAPI => {

	const formatKey = key => {
		try {
			return key.match(/[a-z]\w*/ig).join('_').toLowerCase();
		} catch (e) {
			return key;
		}
	};

	/**
	 * Recursively walk the data tree and replace weird keys with a normalized set.
	 *
	 * @param {Object|String|Number} data
	 *   The data to normalize.
	 *
	 * @returns {Object|String|Number}
	 *   Normalized data.
	 */
	function polishKeys(obj) {
		if (Array.isArray(obj)) {
			return obj.map(polishKeys)
		} else if (obj instanceof Object) {
			const result = {};
			Object.entries(obj).forEach(([k, v]) => result[formatKey(k)] = polishKeys(v));
			return result
		} else return obj;
	};

	const polish = () => {
	};
	polish.time_series = data => {
		Object.keys(data).forEach(e => {
			if (e.match(/technical_analysis/)) {
				data.data = Object.entries(data[e]).map(([key, value]) => {
					const keys = Object.keys(value);
					if (keys.length === 1) value = { value: value[keys[0]] };
					return { date: key, ...value }
				});
				delete data[e];

			}
			if (e.match(/time_series/)) {
				data.data = Object.entries(data[e]).map(([key, value]) => ({ date: key, ...value }));
				delete data[e];

			}
		});
		Object.assign(data, data.meta_data);
		delete data.meta_data;

		return data;
	}


	/**
	 * Wrapper function generator for any endpoint.
	 *
	 * @param {String} type
	 *   The API function type to use
	 *
	 * @returns {Function}
	 *   The callback function to use in the sdk.
	 */
	const fn = function (type, ...additionalPolishers) {
		return function (params) {
			const paramsWithFunction = [
				['function', type],
				...Object.entries(params).filter(([k, v]) => v),
				['apikey', this.apikey]
			];
			let url = `${this.baseURL}?${paramsWithFunction.map(([key, value]) => `${key}=${value}`).join('&')}`;
			console.log(url);
			let result = this
				.get(url)
				.then(data => {
					if (
						data['Meta Data'] === undefined &&
						data['Realtime Currency Exchange Rate'] === undefined &&
						data['Global Quote'] === undefined &&
						data.bestMatches === undefined
					) {
						throw Error(`An AlphaVantage error occurred while querying ${url} . ${data.Information || JSON.stringify(data)}`);
					}


					return data;
				})
				.then(polishKeys);
			additionalPolishers.forEach(polisher =>
				result = result.then(
					typeof polisher === 'function' ? polisher
						: polish[polisher])
			);
			return result
		}
	};

	Object.assign(AlphaVantageAPI, { fn }); //assign static method
	return {
		polish,
		fn
	};

};
