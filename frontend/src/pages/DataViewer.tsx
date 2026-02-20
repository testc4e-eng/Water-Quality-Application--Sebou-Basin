/* frontend/src/pages/DataViewer.tsx */
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  listRawTables,
  getRawData,
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
  Download,
  Search,
  Filter,
  RefreshCw,
  Pencil,
  Trash2,
  PlusCircle,
  FileDown,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
        if (data.length && !selected) {
          setSelected({ schema: data[0].schema, table: data[0].table });
        }
      } catch (err) {
        console.error("Erreur listRawTables:", err);
        setRawTables([]);
      }
    };
    loadTables();
  }, [selected]);

  /* ===============================
     2️⃣ Charger les données
  =============================== */
  const fetchData = useCallback(async () => {
    if (!selected) return;
    setLoading(true);
    setLoadError(null);
    try {
      const raw = (await getRawData(selected.schema, selected.table, 300)) as GenericRow[];
      if (!Array.isArray(raw) || raw.length === 0) {
        setRows([]);
        setColumns([]);
        setVisibleCols([]);
        return;
      }
      const detectedCols = Object.keys(raw[0]);
      setColumns(detectedCols);
      setVisibleCols(detectedCols);
      setRows(raw);
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
    const payload: GenericRow = {};
    for (const [key, value] of Object.entries(newRow)) {
      if (key.toLowerCase() === "id" || key.endsWith("_id")) continue;
      payload[key] = value === "" ? null : value;
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
    const idKey = columns.find((c) => c === "id" || c.endsWith("_id"));
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
    const idKey = columns.find((c) => c === "id" || c.endsWith("_id"));
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
    doc.text(`Export - ${selected?.schema}.${selected?.table}`, 40, 30);
    const tableData = rows.map((r) => visibleCols.map((c) => r[c] ?? ""));
    const tableHeaders = visibleCols.map((c) => ({
      content: c,
      styles: { fillColor: [230, 230, 230] as [number, number, number] },
    })) as CellInput[];
    autoTable(doc, { head: [tableHeaders], body: tableData, startY: 50 });
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

  /* ===============================
     6️⃣ Modals
  =============================== */
  const AddRowModal = () => (
    <Dialog open={adding} onOpenChange={setAdding}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter une ligne</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">


          {columns
  // ✅ On exclut les colonnes non éditables ou de type géométrie
  .filter(
    (c) =>
      !c.toLowerCase().includes("id") &&
      !c.toLowerCase().includes("geom") &&
      !c.toLowerCase().includes("geometry") &&
      !c.toLowerCase().includes("shape")
  )
  .map((col) => (
    <div key={col} className="flex flex-col text-sm">
      <label className="font-medium mb-1">{col}</label>
      <Input
        value={String(newRow[col] ?? "")}
        onChange={(e) =>
          setNewRow((prev) => ({ ...prev, [col]: e.target.value }))
        }
        placeholder={`Valeur pour ${col}`}
      />
    </div>
  ))}

        </div>
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setAdding(false)}>
            Annuler
          </Button>
          <Button onClick={handleAddRow}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const EditRowModal = () => (
    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier une ligne</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          {columns.map((col) => (
            <div key={col} className="flex flex-col text-sm">
              <label className="font-medium mb-1">{col}</label>
              <Input
                value={String(editBuffer[col] ?? "")}
                onChange={(e) =>
                  setEditBuffer((prev) => ({
                    ...prev,
                    [col]: e.target.value,
                  }))
                }
                disabled={col.toLowerCase() === "id" || col.endsWith("_id")}
              />
            </div>
          ))}
        </div>
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleEditSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  /* ===============================
     7️⃣ Interface utilisateur
  =============================== */
  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 bg-gradient-hero text-center text-primary-foreground">
        <h1 className="text-4xl font-bold mb-2">Données Brutes</h1>
        <p>Exploration, édition et export dynamiques</p>
      </section>

      <div className="container mx-auto px-6 py-8">
        {/* FILTRES */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                value={selected ? `${selected.schema}.${selected.table}` : ""}
                onValueChange={(v) => {
                  const [schema, table] = v.split(".");
                  setSelected({ schema, table });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une table" />
                </SelectTrigger>
                <SelectContent>
                  {rawTables.map((t) => (
                    <SelectItem
                      key={`${t.schema}.${t.table}`}
                      value={`${t.schema}.${t.table}`}
                    >
                      {t.schema}.{t.table}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="ghost" onClick={() => setSearchTerm("")}>
              <RefreshCw className="h-4 w-4 mr-2" /> Réinitialiser
            </Button>
          </CardContent>
        </Card>

        {/* ✅ COLONNES À AFFICHER */}
        {columns.length > 0 && (
          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Colonnes à afficher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {columns.map((col) => (
                  <label
                    key={col}
                    className="flex items-center gap-2 text-sm bg-muted/30 px-2 py-1 rounded-md hover:bg-muted/50 transition"
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
                    />
                    <span className="truncate">{col}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 flex gap-3">
                <Button size="sm" onClick={() => setVisibleCols(columns)}>
                  Tout afficher
                </Button>
                <Button size="sm" onClick={() => setVisibleCols([])}>
                  Tout masquer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MODALS */}
        <AddRowModal />
        <EditRowModal />

        {/* TABLEAU PRINCIPAL */}
        <Card className="shadow-card">
          <CardHeader className="flex justify-between items-center flex-wrap gap-2">
            <CardTitle className="text-xl">Tableau des Données</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setAdding(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> Ajouter une ligne
              </Button>
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" /> Export Excel
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileDown className="h-4 w-4 mr-2" /> Export PDF
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loadError && <div className="text-destructive">{loadError}</div>}
            {loading ? (
              <div className="text-muted-foreground">Chargement…</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleCols.map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={visibleCols.length + 1}
                          className="text-center text-muted-foreground"
                        >
                          Aucune donnée à afficher.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row, i) => (
                        <TableRow key={i}>
                          {visibleCols.map((col) => (
                            <TableCell key={col}>
                              {String(row[col] ?? "")}
                            </TableCell>
                          ))}
                          <TableCell className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditBuffer({ ...row });
                                setEditModalOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(row)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataViewer;
