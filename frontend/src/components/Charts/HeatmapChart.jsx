/* frontend/src/components/Charts/HeatmapChart.jsx */
import React from "react";
import Plot from "react-plotly.js";

export default function HeatmapChart(){
  const z = [
    [1, .6, .2],
    [.6, 1, .4],
    [.2, .4, 1]
  ];
  return (
    <Plot
      data={[{ z, type:"heatmap", x:["Q","NO3","Temp"], y:["Q","NO3","Temp"] }]}
      layout={{ autosize:true, height:280, margin:{l:50,r:10,t:10,b:40} }}
      style={{width:"100%"}}
      config={{displayModeBar:false}}
    />
  );
}
