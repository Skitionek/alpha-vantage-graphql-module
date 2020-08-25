/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { alphaVantageInterface, fields, snaps } from "../constants";
import { required } from "../utils";

export default Array.from(fields(snaps.technical)).reduce((o, n) => {
	o[n] = (p, a, { injector }, i) => {
		const { symbol, interval, ...rest } = { ...p, ...a };
		return injector.get(alphaVantageInterface).technical[n]({
			...required({
				symbol, interval
			}),
			...rest
		}).then(d=>console.log(d)||d);
	};
	return o;
}, {});