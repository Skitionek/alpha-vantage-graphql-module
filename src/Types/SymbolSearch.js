/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { alphaVantageInterface } from "../constants";

export default (parent, args, { injector }, ...rest) =>
				injector.get(alphaVantageInterface).data.search(args);