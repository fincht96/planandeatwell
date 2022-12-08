import Fraction from 'fraction.js';

export const convertDecimalToFraction = (decimal: number, roundByOneDecimal?: boolean) => {
  return roundByOneDecimal ? new Fraction(Math.round(decimal * 10) / 10).toFraction() : new Fraction(decimal).toFraction();
};
