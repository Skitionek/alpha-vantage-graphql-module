'use strict';

module.exports = AlphaVantageAPI => {
  return{
    sector: AlphaVantageAPI.fn('SECTOR')
  };
};
