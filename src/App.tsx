import React, { type ReactNode, useMemo, useState } from 'react';
import {
  Area,
  BollingerBands,
  Candlesticks,
  Chart,
  MACD,
  OhlcBars,
  Panel,
  SMA,
  Stochastic,
  VolumeBars,
  exampleData,
} from 'react-candlesticks';
import 'react-candlesticks/style.css';
import './App.css';

type SeriesType = 'candles' | 'ohlc' | 'area';
type LayerSet = 'volume' | 'indicators' | 'panels';
type ThemeName = 'dark' | 'light';

const seriesOptions: Array<{ id: SeriesType; label: string }> = [
  { id: 'candles', label: 'Candles' },
  { id: 'ohlc', label: 'OHLC' },
  { id: 'area', label: 'Area' },
];

const layerOptions: Array<{ id: LayerSet; label: string }> = [
  { id: 'volume', label: 'Volume' },
  { id: 'indicators', label: 'Indicators' },
  { id: 'panels', label: 'Panels' },
];

const themeOptions: Array<{ id: ThemeName; label: string }> = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
];

export default function App() {
  const [series, setSeries] = useState<SeriesType>('candles');
  const [layerSet, setLayerSet] = useState<LayerSet>('volume');
  const [theme, setTheme] = useState<ThemeName>('dark');

  const panels = useMemo(() => {
    let priceLayer: ReactNode = <Candlesticks />;

    if (series === 'area') {
      priceLayer = (
        <Area
          key="area"
          series={{
            value: {
              line: { color: '#38bdf8', width: 2, endDotSize: 5 },
              fill: {
                topColor: '#38bdf855',
                bottomColor: 'transparent',
              },
            },
          }}
        />
      );
    }

    if (series === 'ohlc') {
      priceLayer = <OhlcBars key="ohlc" />;
    }

    if (layerSet === 'panels') {
      return [
        <Panel heightRatio={3} key="price">
          {priceLayer}
          <SMA period={50} />
          <BollingerBands />
        </Panel>,
        <Panel key="stochastic">
          <Stochastic />
        </Panel>,
        <Panel key="macd">
          <MACD />
        </Panel>,
      ];
    }

    return [
      <Panel heightRatio={3} key="price">
        {priceLayer}
        {layerSet === 'indicators' ? <SMA period={50} /> : null}
        {layerSet === 'indicators' ? <BollingerBands /> : null}
      </Panel>,
      <Panel key="volume">
        <VolumeBars />
      </Panel>,
    ];
  }, [layerSet, series]);

  return (
    <main className="demo-page">
      <section className="demo-shell" aria-label="React Candlesticks demo">
        <div className={`demo-widget demo-widget--${theme}`}>
          <div className="demo-widget__toolbar" aria-label="Demo chart controls">
            <div className="demo-control-group" role="group" aria-label="Series type">
              {seriesOptions.map((item) => (
                <button
                  className={item.id === series ? 'is-active' : ''}
                  key={item.id}
                  type="button"
                  onClick={() => setSeries(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="demo-control-group" role="group" aria-label="Chart layers">
              {layerOptions.map((item) => (
                <button
                  className={item.id === layerSet ? 'is-active' : ''}
                  key={item.id}
                  type="button"
                  onClick={() => setLayerSet(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="demo-control-group demo-control-group--theme" role="group" aria-label="Theme">
              {themeOptions.map((item) => (
                <button
                  className={item.id === theme ? 'is-active' : ''}
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="demo-widget__chart">
            <Chart
              data={exampleData}
              theme={theme}
              initialScrollToLatest
              intervalWidthPx={6}
              scaleSmoothing
            >
              {panels}
            </Chart>
          </div>
        </div>
      </section>
    </main>
  );
}
