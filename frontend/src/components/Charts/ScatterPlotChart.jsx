//frontend/src/components/Charts/ScatterPlotChart.jsx
import React from "react";
import Plot from "react-plotly.js";

export default function ScatterPlotChart(){
  const x = [10,20,30,40,50,60];
  const y = [9,22,27,41,49,58];
  return (
    <Plot
      data={[{ x, y, mode:"markers", type:"scatter" }]}
      layout={{ autosize:true, height:280, margin:{l:50,r:10,t:10,b:40}, xaxis:{title:"SWAT"}, yaxis:{title:"WASP"} }}
      style={{width:"100%"}}
      config={{displayModeBar:false}}
    />
  );
}
