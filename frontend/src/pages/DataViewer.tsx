// /* frontend/src/pages/DataViewer.tsx */
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   listRawTables,
//   getRawData,
//   getRawColumns,
//   type RawColumnMeta,
//   updateRawRow,
//   deleteRawRow,
//   createRawRow,
// } from "@/api/client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Download,
//   Search,
//   Filter,
//   RefreshCw,
//   Pencil,
//   Trash2,
//   PlusCircle,
//   FileDown,
// } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";

// import jsPDF from "jspdf";
// import autoTable, { CellInput } from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// /* ===============================
//    🔹 Types
// =============================== */
// type GenericValue = string | number | null;
// type GenericRow = Record<string, GenericValue>;

// interface RawTable {
//   schema: string;
//   table: string;
// }

// /* ===============================
//    🔹 Composant principal
// =============================== */
// const DataViewer = () => {
//   // --- États principaux ---
//   const [rawTables, setRawTables] = useState<RawTable[]>([]);
//   const [selected, setSelected] = useState<RawTable | null>(null);
//   const [columns, setColumns] = useState<string[]>([]);
//   const [visibleCols, setVisibleCols] = useState<string[]>([]);
//   const [rows, setRows] = useState<GenericRow[]>([]);
//   const [primaryKey, setPrimaryKey] = useState<string | null>(null);
//   const [columnMeta, setColumnMeta] = useState<RawColumnMeta[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadError, setLoadError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // --- États pour les modals ---
//   const [adding, setAdding] = useState(false);
//   const [newRow, setNewRow] = useState<GenericRow>({});
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editBuffer, setEditBuffer] = useState<GenericRow>({});

//   /* ===============================
//      1️⃣ Charger la liste des tables
//   =============================== */
//   useEffect(() => {
//     const loadTables = async () => {
//       try {
//         const data = await listRawTables();
//         setRawTables(data);
//         setSelected((prev) =>
//           prev ?? (data.length ? { schema: data[0].schema, table: data[0].table } : null)
//         );
//       } catch (err) {
//         console.error("Erreur listRawTables:", err);
//         setRawTables([]);
//       }
//     };
//     loadTables();
//   }, []);

//   /* ===============================
//      2️⃣ Charger les données
//   =============================== */
//   const fetchData = useCallback(async () => {
//     if (!selected) return;
//     setLoading(true);
//     setLoadError(null);
//     try {
//       const colsMeta = await getRawColumns(selected.schema, selected.table);
//       setColumnMeta(colsMeta);

//       const { rows: raw, primaryKey: detectedPk } = await getRawData(
//         selected.schema,
//         selected.table,
//         300
//       );
//       setPrimaryKey(detectedPk);
//       if (!Array.isArray(raw) || raw.length === 0) {
//         setRows([]);
//         setColumns([]);
//         setVisibleCols([]);
//         return;
//       }
//       const detectedCols = Object.keys(raw[0]);
//       setColumns(detectedCols);
//       setVisibleCols(detectedCols);
//       setRows(raw as GenericRow[]);
//     } catch (err) {
//       console.error(err);
//       setLoadError("Erreur lors du chargement des données");
//       setRows([]);
//       setColumns([]);
//       setVisibleCols([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [selected]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   /* ===============================
//      3️⃣ Recherche
//   =============================== */
//   const filteredData = useMemo(() => {
//     const q = searchTerm.toLowerCase();
//     if (!q) return rows;
//     return rows.filter((row) =>
//       Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
//     );
//   }, [rows, searchTerm]);

//   /* ===============================
//      4️⃣ CRUD
//   =============================== */
//   const handleAddRow = async () => {

//     if (!selected) return;
//     const requiredCols = columnMeta
//       .filter(
//         (c) =>
//           c.is_nullable === "NO" &&
//           !c.column_default &&
//           !c.column_name.toLowerCase().includes("geom") &&
//           !c.column_name.toLowerCase().includes("geometry") &&
//           !c.column_name.toLowerCase().includes("shape")
//       )
//       .map((c) => c.column_name);

//     const missing = requiredCols.filter((c) => {
//       const val = newRow[c];
//       return val === undefined || val === null || String(val).trim() === "";
//     });
//     if (missing.length > 0) {
//       alert(`Champs obligatoires manquants: ${missing.join(", ")}`);
//       return;
//     }

//     const payload: GenericRow = {};
//     for (const [key, value] of Object.entries(newRow)) {
//       const val = String(value ?? "").trim();
//       if (val !== "") {
//         payload[key] = value;
//       }
//     }
//     if (Object.keys(payload).length === 0) {
//       alert("Veuillez remplir au moins un champ !");
//       return;
//     }
//     try {
//       await createRawRow(selected.schema, selected.table, payload);
//       await fetchData();
//       alert("✅ Ligne ajoutée !");
//       setAdding(false);
//       setNewRow({});


//     } catch (e: unknown) {
//       console.error("Erreur création :", e);
//       const msg =
//         (e as any)?.response?.data?.detail ||
//         (e as Error).message ||
//         "Erreur inconnue";
//       alert("⚠️ Impossible d’ajouter la ligne : " + msg);
//     }
//   };

  
//   const handleEditSave = async () => {
//     if (!selected) return;
//     const idKey = primaryKey ?? columns.find((c) => c === "id" || c.endsWith("_id")) ?? columns[0];
//     if (!idKey) {
//       alert("Impossible de modifier : aucune clé primaire détectée");
//       return;
//     }
//     const id = editBuffer[idKey];
//     try {
//       await updateRawRow(selected.schema, selected.table, String(id), editBuffer);
//       await fetchData();
//       alert("✅ Ligne mise à jour !");
//       setEditModalOpen(false);
//     } catch (e: unknown) {
//       console.error(e);
//       alert("❌ Erreur lors de la mise à jour");
//     }
//   };

//   const handleDelete = async (row: GenericRow) => {
//     if (!selected) return;
//     const idKey = primaryKey ?? columns.find((c) => c === "id" || c.endsWith("_id")) ?? columns[0];
//     if (!idKey) {
//       alert("Impossible de supprimer : aucune clé primaire détectée");
//       return;
//     }
//     const id = row[idKey];
//     if (!window.confirm("Supprimer cet enregistrement ?")) return;
//     try {
//       await deleteRawRow(selected.schema, selected.table, String(id));
//       await fetchData();
//       alert("✅ Ligne supprimée !");
//     } catch (e: unknown) {
//       console.error(e);
//       alert("❌ Erreur lors de la suppression");
//     }
//   };

//   /* ===============================
//      5️⃣ Export PDF / Excel
//   =============================== */
//   const handleExportPDF = () => {
//     if (rows.length === 0 || visibleCols.length === 0) {
//       alert("⚠️ Rien à exporter !");
//       return;
//     }
//     const doc = new jsPDF("l", "pt", "a4");
//     doc.text(`Export - ${selected?.schema}.${selected?.table}`, 40, 30);
//     const tableData = rows.map((r) => visibleCols.map((c) => r[c] ?? ""));
//     const tableHeaders = visibleCols.map((c) => ({
//       content: c,
//       styles: { fillColor: [230, 230, 230] as [number, number, number] },
//     })) as CellInput[];
//     autoTable(doc, { head: [tableHeaders], body: tableData, startY: 50 });
//     doc.save(`${selected?.table}.pdf`);
//   };

//   const handleExportExcel = () => {
//     if (rows.length === 0 || visibleCols.length === 0) {
//       alert("⚠️ Rien à exporter !");
//       return;
//     }
//     const exportData = rows.map((r) => {
//       const filtered: Record<string, GenericValue> = {};
//       visibleCols.forEach((c) => (filtered[c] = r[c]));
//       return filtered;
//     });
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Données");
//     const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(
//       new Blob([wbout], { type: "application/octet-stream" }),
//       `${selected?.table}.xlsx`
//     );
//   };

//   /* ===============================
//      7️⃣ Interface utilisateur
//   =============================== */
//   return (
//     <div className="min-h-screen bg-background">
//       <section className="py-12 bg-gradient-hero text-center text-primary-foreground">
//         <h1 className="text-4xl font-bold mb-2">Données Brutes</h1>
//         <p>Exploration, édition et export dynamiques</p>
//       </section>

//       <div className="container mx-auto px-6 py-8">
//         {/* FILTRES */}
//         <Card className="shadow-card mb-8">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Filter className="h-5 w-5" /> Filtres et Recherche
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <Select
//                 value={selected ? `${selected.schema}.${selected.table}` : ""}
//                 onValueChange={(v) => {
//                   const [schema, table] = v.split(".");
//                   setSelected({ schema, table });
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choisir une table" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {rawTables.map((t) => (
//                     <SelectItem
//                       key={`${t.schema}.${t.table}`}
//                       value={`${t.schema}.${t.table}`}
//                     >
//                       {t.schema}.{t.table}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Rechercher..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <Button variant="ghost" onClick={() => setSearchTerm("")}>
//               <RefreshCw className="h-4 w-4 mr-2" /> Réinitialiser
//             </Button>
//           </CardContent>
//         </Card>

//         {/* ✅ COLONNES À AFFICHER */}
//         {columns.length > 0 && (
//           <Card className="shadow-card mb-6">
//             <CardHeader>
//               <CardTitle className="text-lg">Colonnes à afficher</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
//                 {columns.map((col) => (
//                   <label
//                     key={col}
//                     className="flex items-center gap-2 text-sm bg-muted/30 px-2 py-1 rounded-md hover:bg-muted/50 transition"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={visibleCols.includes(col)}
//                       onChange={(e) =>
//                         setVisibleCols((prev) =>
//                           e.target.checked
//                             ? [...prev, col]
//                             : prev.filter((c) => c !== col)
//                         )
//                       }
//                     />
//                     <span className="truncate">{col}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className="mt-3 flex gap-3">
//                 <Button size="sm" onClick={() => setVisibleCols(columns)}>
//                   Tout afficher
//                 </Button>
//                 <Button size="sm" onClick={() => setVisibleCols([])}>
//                   Tout masquer
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* MODAL AJOUT */}
//         <Dialog open={adding} onOpenChange={setAdding}>
//           <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Ajouter une ligne</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-3 mt-2">
//               {columns
//                 .filter(
//                   (c) =>
//                     !c.toLowerCase().includes("geom") &&
//                     !c.toLowerCase().includes("geometry") &&
//                     !c.toLowerCase().includes("shape")
//                 )
//                 .map((col) => (
//                   <div key={col} className="flex flex-col text-sm">
//                     <label className="font-medium mb-1">{col}</label>
//                     <Input
//                       value={String(newRow[col] ?? "")}
//                       onChange={(e) =>
//                         setNewRow((prev) => ({ ...prev, [col]: e.target.value }))
//                       }
//                       placeholder={`Valeur pour ${col}${
//                         columnMeta.some(
//                           (m) =>
//                             m.column_name === col &&
//                             m.is_nullable === "NO" &&
//                             !m.column_default
//                         )
//                           ? " *"
//                           : ""
//                       }`}
//                     />
//                   </div>
//                 ))}
//             </div>
//             <DialogFooter className="mt-6 flex justify-end gap-2">
//               <Button variant="secondary" onClick={() => setAdding(false)}>
//                 Annuler
//               </Button>
//               <Button onClick={handleAddRow}>Enregistrer</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* MODAL EDITION */}
//         <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
//           <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Modifier une ligne</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-3 mt-2">
//               {columns.map((col) => (
//                 <div key={col} className="flex flex-col text-sm">
//                   <label className="font-medium mb-1">{col}</label>
//                   <Input
//                     value={String(editBuffer[col] ?? "")}
//                     onChange={(e) =>
//                       setEditBuffer((prev) => ({
//                         ...prev,
//                         [col]: e.target.value,
//                       }))
//                     }
//                     disabled={col === primaryKey}
//                   />
//                 </div>
//               ))}
//             </div>
//             <DialogFooter className="mt-6 flex justify-end gap-2">
//               <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
//                 Annuler
//               </Button>
//               <Button onClick={handleEditSave}>Enregistrer</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* TABLEAU PRINCIPAL */}
//         <Card className="shadow-card">
//           <CardHeader className="flex justify-between items-center flex-wrap gap-2">
//             <CardTitle className="text-xl">Tableau des Données</CardTitle>
//             <div className="flex gap-2 flex-wrap">
//               <Button onClick={() => setAdding(true)}>
//                 <PlusCircle className="h-4 w-4 mr-2" /> Ajouter une ligne
//               </Button>
//               <Button variant="outline" onClick={handleExportExcel}>
//                 <Download className="h-4 w-4 mr-2" /> Export Excel
//               </Button>
//               <Button variant="outline" onClick={handleExportPDF}>
//                 <FileDown className="h-4 w-4 mr-2" /> Export PDF
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent>
//             {loadError && <div className="text-destructive">{loadError}</div>}
//             {loading ? (
//               <div className="text-muted-foreground">Chargement…</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       {visibleCols.map((col) => (
//                         <TableHead key={col}>{col}</TableHead>
//                       ))}
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredData.length === 0 ? (
//                       <TableRow>
//                         <TableCell
//                           colSpan={visibleCols.length + 1}
//                           className="text-center text-muted-foreground"
//                         >
//                           Aucune donnée à afficher.
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       filteredData.map((row, i) => (
//                         <TableRow key={i}>
//                           {visibleCols.map((col) => (
//                             <TableCell key={col}>
//                               {String(row[col] ?? "")}
//                             </TableCell>
//                           ))}
//                           <TableCell className="space-x-2">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => {
//                                 setEditBuffer({ ...row });
//                                 setEditModalOpen(true);
//                               }}
//                             >
//                               <Pencil className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="destructive"
//                               onClick={() => handleDelete(row)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default DataViewer;



/* frontend/src/pages/DataViewer.tsx */
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  listRawTables,
  getRawData,
  getRawColumns,
  type RawColumnMeta,
  updateRawRow,
  deleteRawRow,
  createRawRow,
} from "@/api/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Download,
  Search,
  Filter,
  RefreshCw,
  Pencil,
  Trash2,
  PlusCircle,
  FileDown,
  Database,
  Table2,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ===============================
   🔹 Types
=============================== */
type GenericValue = string | number | null;
type GenericRow = Record<string, GenericValue>;

interface RawTable {
  schema: string;
  table: string;
}

/* ===============================
   🔹 Composant principal
=============================== */
const DataViewer = () => {
  // --- États principaux ---
  const [rawTables, setRawTables] = useState<RawTable[]>([]);
  const [selected, setSelected] = useState<RawTable | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [visibleCols, setVisibleCols] = useState<string[]>([]);
  const [rows, setRows] = useState<GenericRow[]>([]);
  const [primaryKey, setPrimaryKey] = useState<string | null>(null);
  const [columnMeta, setColumnMeta] = useState<RawColumnMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- États pour les modals ---
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState<GenericRow>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBuffer, setEditBuffer] = useState<GenericRow>({});

  /* ===============================
     1️⃣ Charger la liste des tables
  =============================== */
  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await listRawTables();
        setRawTables(data);
        setSelected((prev) =>
          prev ?? (data.length ? { schema: data[0].schema, table: data[0].table } : null)
        );
      } catch (err) {
        console.error("Erreur listRawTables:", err);
        setRawTables([]);
      }
    };
    loadTables();
  }, []);

  /* ===============================
     2️⃣ Charger les données
  =============================== */
  const fetchData = useCallback(async () => {
    if (!selected) return;
    setLoading(true);
    setLoadError(null);
    try {
      const colsMeta = await getRawColumns(selected.schema, selected.table);
      setColumnMeta(colsMeta);

      const { rows: raw, primaryKey: detectedPk } = await getRawData(
        selected.schema,
        selected.table,
        300
      );
      setPrimaryKey(detectedPk);
      if (!Array.isArray(raw) || raw.length === 0) {
        setRows([]);
        setColumns([]);
        setVisibleCols([]);
        return;
      }
      const detectedCols = Object.keys(raw[0]);
      setColumns(detectedCols);
      setVisibleCols(detectedCols);
      setRows(raw as GenericRow[]);
    } catch (err) {
      console.error(err);
      setLoadError("Erreur lors du chargement des données");
      setRows([]);
      setColumns([]);
      setVisibleCols([]);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ===============================
     3️⃣ Recherche
  =============================== */
  const filteredData = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [rows, searchTerm]);

  /* ===============================
     4️⃣ CRUD
  =============================== */
  const handleAddRow = async () => {
    if (!selected) return;
    const requiredCols = columnMeta
      .filter(
        (c) =>
          c.is_nullable === "NO" &&
          !c.column_default &&
          !c.column_name.toLowerCase().includes("geom") &&
          !c.column_name.toLowerCase().includes("geometry") &&
          !c.column_name.toLowerCase().includes("shape")
      )
      .map((c) => c.column_name);

    const missing = requiredCols.filter((c) => {
      const val = newRow[c];
      return val === undefined || val === null || String(val).trim() === "";
    });
    if (missing.length > 0) {
      alert(`Champs obligatoires manquants: ${missing.join(", ")}`);
      return;
    }

    const payload: GenericRow = {};
    for (const [key, value] of Object.entries(newRow)) {
      const val = String(value ?? "").trim();
      if (val !== "") {
        payload[key] = value;
      }
    }
    if (Object.keys(payload).length === 0) {
      alert("Veuillez remplir au moins un champ !");
      return;
    }
    try {
      await createRawRow(selected.schema, selected.table, payload);
      await fetchData();
      alert("✅ Ligne ajoutée !");
      setAdding(false);
      setNewRow({});
    } catch (e: unknown) {
      console.error("Erreur création :", e);
      const msg =
        (e as any)?.response?.data?.detail ||
        (e as Error).message ||
        "Erreur inconnue";
      alert("⚠️ Impossible d’ajouter la ligne : " + msg);
    }
  };

  const handleEditSave = async () => {
    if (!selected) return;
    const idKey = primaryKey ?? columns.find((c) => c === "id" || c.endsWith("_id")) ?? columns[0];
    if (!idKey) {
      alert("Impossible de modifier : aucune clé primaire détectée");
      return;
    }
    const id = editBuffer[idKey];
    try {
      await updateRawRow(selected.schema, selected.table, String(id), editBuffer);
      await fetchData();
      alert("✅ Ligne mise à jour !");
      setEditModalOpen(false);
    } catch (e: unknown) {
      console.error(e);
      alert("❌ Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (row: GenericRow) => {
    if (!selected) return;
    const idKey = primaryKey ?? columns.find((c) => c === "id" || c.endsWith("_id")) ?? columns[0];
    if (!idKey) {
      alert("Impossible de supprimer : aucune clé primaire détectée");
      return;
    }
    const id = row[idKey];
    if (!window.confirm("Supprimer cet enregistrement ?")) return;
    try {
      await deleteRawRow(selected.schema, selected.table, String(id));
      await fetchData();
      alert("✅ Ligne supprimée !");
    } catch (e: unknown) {
      console.error(e);
      alert("❌ Erreur lors de la suppression");
    }
  };

  /* ===============================
     5️⃣ Export PDF / Excel
  =============================== */
  const handleExportPDF = () => {
    if (rows.length === 0 || visibleCols.length === 0) {
      alert("⚠️ Rien à exporter !");
      return;
    }
    const doc = new jsPDF("l", "pt", "a4");
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(18);
    doc.text(`📊 Export - ${selected?.schema}.${selected?.table}`, 40, 30);
    const tableData = rows.map((r) => visibleCols.map((c) => r[c] ?? ""));
    const tableHeaders = visibleCols.map((c) => ({
      content: c,
      styles: { fillColor: [52, 152, 219] as [number, number, number], textColor: 255, fontStyle: 'bold' },
    })) as CellInput[];
    autoTable(doc, { 
      head: [tableHeaders], 
      body: tableData, 
      startY: 50,
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 50 }
    });
    doc.save(`${selected?.table}.pdf`);
  };

  const handleExportExcel = () => {
    if (rows.length === 0 || visibleCols.length === 0) {
      alert("⚠️ Rien à exporter !");
      return;
    }
    const exportData = rows.map((r) => {
      const filtered: Record<string, GenericValue> = {};
      visibleCols.forEach((c) => (filtered[c] = r[c]));
      return filtered;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Données");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `${selected?.table}.xlsx`
    );
  };

  // Fonction pour obtenir la classe de couleur de fond alternée
  const getRowColor = (index: number) => {
    return index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30';
  };

  /* ===============================
     7️⃣ Interface utilisateur
  =============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section avec dégradé moderne */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90"></div>
        <div className="relative container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full backdrop-blur-sm mb-6">
            <Database className="h-6 w-6 text-white mr-2" />
            <span className="text-white/90 text-sm font-medium">Explorateur de données</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Données Brutes
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Exploration, édition et export dynamiques avec une interface moderne
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <CheckCircle2 className="h-5 w-5" />
              <span>Visualisation en temps réel</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles className="h-5 w-5" />
              <span>Édition intuitive</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8 -mt-8 relative z-10">
        {/* FILTRES - Design moderne avec glassmorphism */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
              <span>Filtres et Recherche</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Table2 className="h-4 w-4" /> Sélectionner une table
                </label>
                <Select
                  value={selected ? `${selected.schema}.${selected.table}` : ""}
                  onValueChange={(v) => {
                    const [schema, table] = v.split(".");
                    setSelected({ schema, table });
                  }}
                >
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400 transition-all">
                    <SelectValue placeholder="Choisir une table" />
                  </SelectTrigger>
                  <SelectContent>
                    {rawTables.map((t) => (
                      <SelectItem
                        key={`${t.schema}.${t.table}`}
                        value={`${t.schema}.${t.table}`}
                      >
                        <span className="font-mono text-sm">
                          <span className="text-blue-600">{t.schema}</span>.
                          <span className="text-indigo-600">{t.table}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Rechercher</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans toutes les colonnes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setSearchTerm("")}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Réinitialiser la recherche
            </Button>
          </CardContent>
        </Card>

        {/* ✅ COLONNES À AFFICHER - Design interactif */}
        {columns.length > 0 && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
                <span>Colonnes à afficher</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {columns.map((col) => (
                  <label
                    key={col}
                    className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-all cursor-pointer
                      ${visibleCols.includes(col) 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'}`}
                  >
                    <input
                      type="checkbox"
                      checked={visibleCols.includes(col)}
                      onChange={(e) =>
                        setVisibleCols((prev) =>
                          e.target.checked
                            ? [...prev, col]
                            : prev.filter((c) => c !== col)
                        )
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`truncate font-mono text-xs ${visibleCols.includes(col) ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
                      {col}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <Button 
                  size="sm" 
                  onClick={() => setVisibleCols(columns)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
                >
                  <Eye className="h-4 w-4 mr-1" /> Tout afficher
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setVisibleCols([])}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  <EyeOff className="h-4 w-4 mr-1" /> Tout masquer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MODAL AJOUT - Style moderne */}
        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 -mt-6 -mx-6 px-6 py-4 rounded-t-lg">
              <DialogTitle className="text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Ajouter une nouvelle ligne
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {columns
                .filter(
                  (c) =>
                    !c.toLowerCase().includes("geom") &&
                    !c.toLowerCase().includes("geometry") &&
                    !c.toLowerCase().includes("shape")
                )
                .map((col) => {
                  const isRequired = columnMeta.some(
                    (m) => m.column_name === col && m.is_nullable === "NO" && !m.column_default
                  );
                  return (
                    <div key={col} className="flex flex-col text-sm">
                      <label className="font-medium mb-1 text-gray-700">
                        {col}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <Input
                        value={String(newRow[col] ?? "")}
                        onChange={(e) =>
                          setNewRow((prev) => ({ ...prev, [col]: e.target.value }))
                        }
                        placeholder={`Valeur pour ${col}`}
                        className={`border-2 focus:border-blue-400 transition-all ${isRequired ? 'border-red-200 focus:border-red-400' : 'border-gray-200'}`}
                      />
                    </div>
                  );
                })}
            </div>
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setAdding(false)}
                className="border-gray-300"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleAddRow}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL EDITION */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-amber-500 to-orange-500 -mt-6 -mx-6 px-6 py-4 rounded-t-lg">
              <DialogTitle className="text-white flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Modifier la ligne
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {columns.map((col) => (
                <div key={col} className="flex flex-col text-sm">
                  <label className="font-medium mb-1 text-gray-700">{col}</label>
                  <Input
                    value={String(editBuffer[col] ?? "")}
                    onChange={(e) =>
                      setEditBuffer((prev) => ({
                        ...prev,
                        [col]: e.target.value,
                      }))
                    }
                    disabled={col === primaryKey}
                    className={`border-2 ${col === primaryKey 
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
                      : 'border-gray-200 focus:border-blue-400'}`}
                  />
                </div>
              ))}
            </div>
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setEditModalOpen(false)}
                className="border-gray-300"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleEditSave}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* TABLEAU PRINCIPAL */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full translate-x-32 -translate-y-32 opacity-20"></div>
          
          <CardHeader className="flex justify-between items-center flex-wrap gap-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <span>Tableau des Données</span>
              {selected && (
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-mono">
                  {selected.schema}.{selected.table}
                </span>
              )}
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => setAdding(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg shadow-green-500/25"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Nouvelle ligne
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportExcel}
                className="border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all"
              >
                <Download className="h-4 w-4 mr-2" /> Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                className="border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
              >
                <FileDown className="h-4 w-4 mr-2" /> PDF
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loadError && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                {loadError}
              </div>
            )}
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <span className="ml-4 text-gray-600">Chargement des données...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-100 to-gray-50 sticky top-0">
                    <TableRow>
                      {visibleCols.map((col) => (
                        <TableHead 
                          key={col} 
                          className="font-semibold text-gray-700 py-3 px-4 border-b-2 border-gray-200"
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate max-w-[150px]">{col}</span>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="font-semibold text-gray-700 py-3 px-4 border-b-2 border-gray-200 text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={visibleCols.length + 1}
                          className="text-center py-12 text-gray-500"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Database className="h-12 w-12 text-gray-300" />
                            <span>Aucune donnée à afficher</span>
                            <Button 
                              onClick={() => setAdding(true)}
                              size="sm"
                              className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                            >
                              <PlusCircle className="h-4 w-4 mr-1" /> Ajouter une ligne
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row, i) => (
                        <TableRow 
                          key={i} 
                          className={`${getRowColor(i)} hover:bg-blue-100/50 transition-colors group`}
                        >
                          {visibleCols.map((col) => (
                            <TableCell 
                              key={col} 
                              className="py-2 px-4 border-b border-gray-100 font-mono text-sm"
                            >
                              {String(row[col] ?? "")}
                            </TableCell>
                          ))}
                          <TableCell className="py-2 px-4 border-b border-gray-100">
                            <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditBuffer({ ...row });
                                  setEditModalOpen(true);
                                }}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(row)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
                {/* Indicateur de nombre de lignes */}
                {filteredData.length > 0 && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 flex justify-between items-center">
                    <span>
                      Affichage de <span className="font-semibold">{filteredData.length}</span> ligne{filteredData.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-gray-400">
                      Double-cliquez sur une ligne pour modifier
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataViewer;