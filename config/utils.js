/* eslint-disable max-len */
const { memomryConvertingUnit } = require('./constant');

const convertBytesToKB = (valueInBytes) => (valueInBytes / (memomryConvertingUnit.UNIT)).toFixed(2);
const convertBytesToMB = (valueInBytes) => (valueInBytes / (memomryConvertingUnit.UNIT ** 2)).toFixed(2);
const convertBytesToGB = (valueInBytes) => (valueInBytes / (memomryConvertingUnit.UNIT ** 3)).toFixed(2);

const convertToPercent = (value, totalValue) => ((value / totalValue) * 100).toFixed(2);

module.exports = {
  convertBytesToKB,
  convertBytesToMB,
  convertBytesToGB,
  convertToPercent,
};
