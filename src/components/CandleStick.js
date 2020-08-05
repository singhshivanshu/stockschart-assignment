import React, { Component } from "react";

import { scaleTime } from "d3-scale";
import { utcDay, utcMinute, utcHour, utcSecond } from "d3-time";

import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { ema } from "react-stockcharts/lib/indicator";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format(".2f");

const xAccessor = (d) => d && d.date;
const margin = {
  left: 50,
  right: 30,
  top: 75,
  bottom: 30,
};

const candleWidth = {
  hour: utcHour,
  minute: utcMinute,
  day: utcDay,
  second: utcSecond,
};

class CandleStick extends Component {
  componentWillMount() {
    this.setState({
      suffix: 1,
    });
  }

  handleReset() {
    this.setState({
      suffix: this.state.suffix + 1,
    });
  }

  render() {
    const { interval, latest } = this.props;
    const newData = latest ? this.props.data.slice(-latest) : this.props.data;

    if (!newData || newData.length === 0) {
      return <div className="-candle-stick-chart">Loading data ...</div>;
    }

    const xExtents = [xAccessor(last(newData)), xAccessor(newData[0])];

    const ema50 = ema()
      .id(2)
      .options({ windowSize: 60 })
      .merge((d, c) => {
        d.ema50 = c;
      })
      .accessor((d) => d.ema50);

    return (
      <div className="candleStick">
        {newData.length > 1 && (
          <ChartCanvas
            width={600}
            height={500}
            margin={margin}
            type="svg"
            seriesName={`MSFT_${this.state.suffix}`}
            data={newData}
            xScale={scaleTime()}
            xAccessor={xAccessor}
            xExtents={xExtents}
            displayXAccessor={xAccessor}
            zoomEvent={true}
            ratio={2}
          >
            <Chart id={1} yExtents={(d) => [d.high, d.low]}>
              <XAxis
                axisAt="bottom"
                orient="bottom"
                ticks={6}
                zoomEnabled={true}
              />
              <YAxis axisAt="left" orient="left" ticks={5} zoomEnabled={true} />
              <CandlestickSeries
                width={timeIntervalBarWidth(candleWidth[interval])}
              />
              <OHLCTooltip origin={[-40, -25]} />
              <ZoomButtons onReset={this.handleReset.bind(this)} />
            </Chart>
            <HoverTooltip
              yAccessor={ema50.accessor()}
              tooltipContent={tooltipContent([])}
              fontSize={10}
            />
          </ChartCanvas>
        )}
      </div>
    );
  }
}

CandleStick = fitWidth(CandleStick);

export default CandleStick;

function tooltipContent(ys) {
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
