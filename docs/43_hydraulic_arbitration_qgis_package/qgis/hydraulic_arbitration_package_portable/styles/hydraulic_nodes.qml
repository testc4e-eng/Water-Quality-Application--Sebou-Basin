<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.34" styleCategories="Symbology">
  <renderer-v2 type="categorizedSymbol" attr="node_type" symbollevels="0" enableorderby="0">
    <categories>
      <category render="true" symbol="0" value="ISOLE_DEGRE_1" label="Noeud degre 1 / isolé"/>
      <category render="true" symbol="1" value="PASSAGE" label="Passage"/>
      <category render="true" symbol="2" value="CONFLUENCE_BIFURCATION" label="Confluence / bifurcation"/>
      <category render="true" symbol="3" value="NON_CONNECTE" label="Non connecté"/>
    </categories>
    <symbols>
    <symbol name="0" type="marker" alpha="1" clip_to_extent="1">
      <layer class="SimpleMarker" enabled="1" pass="0" locked="0">
        <prop k="color" v="160,160,160,255"/>
        <prop k="outline_color" v="255,255,255,255"/>
        <prop k="outline_width" v="0.3"/>
        <prop k="size" v="2.5"/>
        <prop k="size_unit" v="MM"/>
      </layer>
    </symbol>
    <symbol name="1" type="marker" alpha="1" clip_to_extent="1">
      <layer class="SimpleMarker" enabled="1" pass="0" locked="0">
        <prop k="color" v="60,120,220,255"/>
        <prop k="outline_color" v="255,255,255,255"/>
        <prop k="outline_width" v="0.3"/>
        <prop k="size" v="2.0"/>
        <prop k="size_unit" v="MM"/>
      </layer>
    </symbol>
    <symbol name="2" type="marker" alpha="1" clip_to_extent="1">
      <layer class="SimpleMarker" enabled="1" pass="0" locked="0">
        <prop k="color" v="130,50,180,255"/>
        <prop k="outline_color" v="255,255,255,255"/>
        <prop k="outline_width" v="0.3"/>
        <prop k="size" v="3.2"/>
        <prop k="size_unit" v="MM"/>
      </layer>
    </symbol>
    <symbol name="3" type="marker" alpha="1" clip_to_extent="1">
      <layer class="SimpleMarker" enabled="1" pass="0" locked="0">
        <prop k="color" v="0,0,0,255"/>
        <prop k="outline_color" v="255,255,255,255"/>
        <prop k="outline_width" v="0.3"/>
        <prop k="size" v="2.5"/>
        <prop k="size_unit" v="MM"/>
      </layer>
    </symbol>
    </symbols>
  </renderer-v2>
</qgis>
