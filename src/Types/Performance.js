/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { alphaVantageInterface } from "../constants";

export default (p, a, { injector }) => injector.get(alphaVantageInterface).performance.sector();