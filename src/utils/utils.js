import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format(".2f");


export const tooltipContent = (ys) => {
  return ({ currentItem, xAccessor }) => {
    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: "open",
          value: currentItem.open && numberFormat(currentItem.open),
        },
        {
          label: "high",
          value: currentItem.high && numberFormat(currentItem.high),
        },
        {
          label: "low",
          value: currentItem.low && numberFormat(currentItem.low),
        },
        {
          label: "close",
          value: currentItem.close && numberFormat(currentItem.close),
        },
      ]
        .concat(
          ys.map((each) => ({
            label: each.label,
            value: each.value(currentItem),
            stroke: each.stroke,
          }))
        )
        .filter((line) => line.value),
    };
  };
}




export const getParsedData = (d) => {
  const dataArray = d.split(",");
  const date = parseInt(dataArray[0]);
  const open = parseFloat(dataArray[1]);
  const high = parseFloat(dataArray[2]);
  const low = parseFloat(dataArray[3]);
  const close = parseFloat(dataArray[4]);
  const volume = parseFloat(dataArray[5]);
  return Object.assign({}, { date, open, high, low, close, volume });
}
