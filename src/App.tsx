import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import "./App.css";

// const App: FC = () => {
function App() {
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
        type: "category",
        data: Array.from(Object.keys(seriesData!)),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: Array.from(Object.values(seriesData!)),
          type: "bar",
        },
      ],
    };

    chart.setOption(option);
  }, [seriesData]);

  return (
    <div style={{ width: "100%" }}>
      <div id="chart" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
}

export default App;
