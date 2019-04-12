import React, { Component } from "react";
import {
  FlexibleXYPlot,
  Crosshair,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  XAxis,
  YAxis
} from "react-vis";
import "react-vis/dist/style.css";
import moment from "moment";

import { socket } from "./utils";
import Button, { ButtonGroup } from "./components/Button";
import { AppWrapper } from "./elements";

const modes = {
  temp: "temp",
  hum: "hum"
};

const themes = {
  temp: {
    light: "#01b5bf",
    primary: "#13939a"
  },
  hum: {
    primary: "#9200bf",
    light: "#b902f2"
  }
};

class App extends Component {
  state = {
    data: [],
    mode: modes.temp,
    crosshairValues: []
  };

  async componentDidMount() {
    const fetchData = await fetch("http://192.168.2.2:9000/sensor_data");
    const serverData = await fetchData.json();
    this.setState({ data: serverData }, () => {
      socket.on("sensor", data => {
        this.setState({ data: [...this.state.data, data] });
      });
    });
  }

  handleChangeMode = mode => {
    this.setState({ mode });
  };

  /**
   * Очищает значение для Crosshair при отстуствии наведения
   */
  _onMouseLeave = () => {
    this.setState({ crosshairValues: [] });
  };

  /**
   * Отображает Crosshair
   * @param {Object} value Значение
   * @param {index} index Индекс значения в массиве
   */
  _onNearestX = (value, { index }) => {
    this.setState({ crosshairValues: [value] });
  };

  render() {
    const { data, mode, crosshairValues } = this.state;

    const values = data.map(value => ({
      x: moment(value.date).toDate(),
      y: mode === modes.temp ? value.temperature : value.humidity
    }));
    return (
      <AppWrapper>
        <ButtonGroup>
          <Button
            theme={themes[mode]}
            onClick={() => this.handleChangeMode(modes.temp)}
            active={mode === modes.temp}
          >
            Температура
          </Button>
          <Button
            theme={themes[mode]}
            onClick={() => this.handleChangeMode(modes.hum)}
            active={mode === modes.hum}
          >
            Влажность
          </Button>
        </ButtonGroup>
        <FlexibleXYPlot onMouseLeave={this._onMouseLeave} animation={400}>
          <HorizontalGridLines style={{ stroke: "#363c47" }} />
          <VerticalGridLines style={{ stroke: "#363c47" }} />
          <XAxis
            title="Время"
            tickFormat={v => moment(v).format("DD.MM.YYYY hh:mm")}
            tickTotal={5}
            tickSize={2}
            style={{
              height: 100
            }}
          />
          <YAxis
            title={mode === modes.temp ? "Температура, °C" : "Влажность, %"}
            tickTotal={10}
          />
          <LineSeries
            onNearestX={this._onNearestX}
            curve="curveMonotoneX"
            data={values}
            style={{
              stroke: themes[mode].primary
            }}
          />
          <Crosshair values={crosshairValues} />
        </FlexibleXYPlot>
      </AppWrapper>
    );
  }
}

export default App;
