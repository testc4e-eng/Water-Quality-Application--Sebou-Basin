<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.34" styleCategories="Symbology">
  <renderer-v2 type="categorizedSymbol" attr="direction_status" symbollevels="0" enableorderby="0">
    <categories>
      <category render="true" symbol="0" value="FLOW_CONFIRMED" label="Confirmé"/>
      <category render="true" symbol="1" value="FLOW_REVERSED_SUSPECTED" label="Inversion suspectée"/>
      <category render="true" symbol="2" value="FLAT_SEGMENT" label="Segment plat"/>
      <category render="true" symbol="3" value="LOW_SLOPE_UNCERTAIN" label="Pente faible incertaine"/>
      <category render="true" symbol="4" value="NEED_MANUAL_REVIEW" label="Revue manuelle"/>
      <category render="true" symbol="5" value="MNT_NO_DATA" label="NoData MNT"/>
      <category render="true" symbol="6" value="OUTSIDE_MNT" label="Hors MNT"/>
    </categories>
    <symbols>
    <symbol name="0" type="line" alpha="1" clip_to_extent="1">
      <layer class="SimpleLine" enabled="1" pass="0" locked="0">
        <prop k="line_color" v="0,150,70,255"/>
        <prop k="line_width" v="0.55"/>
        <prop k="line_width_unit" v="MM"/>
      </layer>
    </symbol>
    <symbol name="1" type="line" alpha="1" clip_to_extent="1">
      <layer class="SimpleLine" enabled="1" pass="0" locked="0">
        <prop k="line_color" v="220,30,30,255"/>
        <prop k="line_width" v="0.95"/>
        <prop k="line_width_unit" v="MM"/>
      </layer>
    </symbol>
    <symbol name="2" type="line" alpha="1" clip_to_extent="1">
      <layer class="SimpleLine" enabled="1" pass="0" locked="0">
        <prop k="line_color" v="255,150,0,255"/>
        <prop k="line_width" v="0.8"/>
        <prop k="line_width_unit" v="MM"/>
      </layer>
    </symbol>
    <symbol name="3" type="line" alpha="1" clip_to_extent="1">
      <layer class="SimpleLine" enabled="1" pass="0" locked="0">
        <prop k="line_color" v="245,220,0,255"/>
        <prop k="line_width" v="0.8"/>
        <prop k="line_width_unit" v="MM"/>
      </layer>
    </symbol>
    <symbol name="4" type="line" alpha="1" clip_to_extent="1">
      <layer class="SimpleLine" enabled="1" pass="0" locked="0">
        <prop k="line_color" v="140,60,180,255"/>
        <prop k="line_width" v="0.8"/>
        <prop k="line_width_unit" v="MM"/>
      </layer>
    </symbol>
    <symbol name="5" type="line" alpha="1" clip_to_extent="1">
      <layer class="SimpleLine" enabled="1" pass="0" locked="0">
        <prop k="line_color" v="150,150,150,255"/>
        <prop k="line_width" v="0.7"/>
        <prop k="line_width_unit" v="MM"/>
      </layer>
    </symbol>
    <symbol name="6" type="line" alpha="1" clip_to_extent="1">
      <layer class="SimpleLine" enabled="1" pass="0" locked="0">
        <prop k="line_color" v="0,0,0,255"/>
        <prop k="line_width" v="0.7"/>
        <prop k="line_width_unit" v="MM"/>
      </layer>
    </symbol>
    </symbols>
  </renderer-v2>
</qgis>
