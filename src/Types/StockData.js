/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { crossSearch } from "../utilities";

const StockData = {};
StockData.__resolveType = (data) => {
	return crossSearch(Object.keys(data), ['adjusted_close', 'dividend_amount']) ? 'StockAdjustedTimeSeriesData' : 'StockTimeSeriesData';
};
export default StockData;