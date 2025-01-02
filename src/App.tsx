import * as echarts from "echarts";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import LightDarkSwitch from "./componenets/LightDarkSwitch";

function App() {
  const languages: Array<string> = [
    "Python",
    "Java",
    "C++",
    "Rust",
    "C",
    "JS",
    "TS",
    "Golang",
  ];

  const socketRef = useRef<null | WebSocket>(null);
  const [seriesData, setSeriesData] = useState<null | Record<string, number>>(
    null
  );

  useEffect(() => {
    setSeriesData({
      python: 0,
      "c++": 0,
      java: 0,
      c: 0,
      kbd: 0,
      rust: 0,
      golang: 0,
      javascript: 0,
    });
  }, []);

  useEffect(() => {
    socketRef.current = new WebSocket(
      (import.meta.env.VITE_BASE_URL as string).replace("http", "ws") +
        "stream/"
    );

    socketRef.current.onclose = (e): void => {};

    socketRef.current.onerror = (e): void => {
      console.log(e);
    };

    socketRef.current.onmessage = (e): void => {
      const message = JSON.parse(e.data);

      setSeriesData((prev) => {
        if (!prev) {
          return prev;
        }

        const data = { ...prev };

        const labels = Object.keys(prev).map((label) => label.toLowerCase());

        // Update the data
        message["languages"].forEach((item) => {
          const lowerCaseItem = item.toLowerCase();
          if (labels.includes(lowerCaseItem)) {
            data[lowerCaseItem] += 1;
          }
        });

        return data;
      });
    };
  }, []);

  useEffect(() => {
    if (!seriesData) {
      return;
    }

    console.log(1);

    var chartDom: HTMLDivElement = (document.getElementById(
      "chart"
    ) as HTMLDivElement)!;
    var chart = echarts.init(chartDom);

    const option: echarts.EChartOption = {
      xAxis: {
        name: "occurence",
        max: "dataMaax",
        type: "value",
        axisLabel: {
          show: true,
          formatter: "{value}",
        },
      },
      yAxis: {
        name: "language",
        inverse: true,
        type: "category",
        data: Object.keys(seriesData),
      },
      series: [
        {
          realtimeSort: true,
          type: "bar",
          name: "X",
          data: Object.values(seriesData),
          label: {
            show: true,
            position: "right",
            valueAniation: true,
          },
        },
      ],
    };

    chart.setOption(option);
    window.addEventListener("resize", () => {
      chart.resize();
    });
  }, [seriesData]);

  return (
    <>
      <LightDarkSwitch />
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div id="chart" style={{ width: "100%", height: "500px" }}></div>
      </div>
      {/* <div
        className=""
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="grid-container" style={{ width: "50%" }}>
          {languages.map((language, ind) => (
            <div className="grid-item" key={ind}>
              <i
                className={`fa-brands fa-${language.toLowerCase()}`}
                style={{ fontSize: "5rem" }}
              ></i>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
}

export default App;
