import { useState, useCallback, useEffect, useRef } from "react";

const LIRA_TO_EURO = 51;
const STORAGE_KEY = "arasta_atesi_v2_light";

const MENU_ITEMS = [
  { id: 1, name: "Et Pirzola", nameEn: "Lamb Chops", category: "Kebap", price: 600 },
  { id: 2, name: "Şeftali Kebabı", nameEn: "Şeftali Kebab", category: "Kebap", price: 600 },
  { id: 3, name: "Kuşbaşı", nameEn: "Diced Lamb Kebab", category: "Kebap", price: 500 },
  { id: 4, name: "Patlıcan Kebap", nameEn: "Eggplant Kebab", category: "Kebap", price: 600 },
  { id: 5, name: "Domatesli Kebap", nameEn: "Tomato Kebab", category: "Kebap", price: 500 },
  { id: 6, name: "Beyti", nameEn: "Beyti Kebab", category: "Kebap", price: 500 },
  { id: 7, name: "Adana", nameEn: "Adana Kebab", category: "Kebap", price: 500 },
  { id: 8, name: "Urfa", nameEn: "Urfa Kebab", category: "Kebap", price: 500 },
  { id: 9, name: "Kuzu Ciğer", nameEn: "Lamb Liver", category: "Kebap", price: 500 },
  { id: 10, name: "Ali Nazik", nameEn: "Ali Nazik Kebab", category: "Kebap", price: 500 },
  { id: 11, name: "İskender Kebap", nameEn: "Iskender Kebab", category: "Kebap", price: 500 },
  { id: 12, name: "Tavuk Kanat", nameEn: "Chicken Wings", category: "Kebap", price: 450 },
  { id: 13, name: "Tavuk Pirzola", nameEn: "Chicken Chops", category: "Kebap", price: 500 },
  { id: 14, name: "Parça Tavuk", nameEn: "Chicken Pieces", category: "Kebap", price: 500 },
  { id: 15, name: "Tavuk Şiş", nameEn: "Chicken Shish", category: "Kebap", price: 450 },
  { id: 18, name: "Hellim Kebap", nameEn: "Halloumi Kebab", category: "Kebap", price: 500 },
  { id: 19, name: "Pastırma Kebap", nameEn: "Pastrami Kebab", category: "Kebap", price: 500 },
  { id: 20, name: "Adana Dürüm", nameEn: "Adana Wrap", category: "Dürüm", price: 250 },
  { id: 21, name: "Kuşbaşı Dürüm", nameEn: "Diced Lamb Wrap", category: "Dürüm", price: 250 },
  { id: 22, name: "Tavuk Şiş Dürüm", nameEn: "Chicken Shish Wrap", category: "Dürüm", price: 250 },
  { id: 23, name: "Şeftali Dürüm", nameEn: "Şeftali Wrap", category: "Dürüm", price: 250 },
  { id: 24, name: "Arasta Ateşi Tabağı", nameEn: "Arasta Fire Platter", category: "Özel Menü", price: 1500 },
  { id: 25, name: "Çipura", nameEn: "Sea Bream", category: "Balık", price: null },
  { id: 26, name: "Kalamar", nameEn: "Calamari", category: "Balık", price: null },
  { id: 27, name: "Çoban Salata", nameEn: "Shepherd's Salad", category: "Salata", price: 200 },
  { id: 28, name: "Mevsim Salata", nameEn: "Seasonal Salad", category: "Salata", price: 200 },
  { id: 29, name: "Hellim Salata", nameEn: "Halloumi Salad", category: "Salata", price: 250 },
  { id: 30, name: "Kelle Paça Çorba", nameEn: "Head & Trotter Soup", category: "Çorba", price: 250 },
  { id: 31, name: "Ezogelin Çorba", nameEn: "Ezogelin Soup", category: "Çorba", price: 200 },
  { id: 32, name: "Tavuk Çorba", nameEn: "Chicken Soup", category: "Çorba", price: 200 },
  { id: 33, name: "Mercimek Çorba", nameEn: "Lentil Soup", category: "Çorba", price: 200 },
  { id: 34, name: "Humus", nameEn: "Hummus", category: "Meze", price: 100 },
  { id: 35, name: "Ezme", nameEn: "Spicy Tomato Dip", category: "Meze", price: 100 },
  { id: 36, name: "Patlıcan Ezme", nameEn: "Mashed Eggplant", category: "Meze", price: 100 },
  { id: 37, name: "Süzme Yoğurt", nameEn: "Strained Yogurt", category: "Meze", price: 100 },
  { id: 38, name: "Cola", nameEn: "Cola", category: "İçecek", price: 60 },
  { id: 39, name: "Fanta", nameEn: "Fanta", category: "İçecek", price: 60 },
  { id: 40, name: "Seven Up", nameEn: "Seven Up", category: "İçecek", price: 60 },
  { id: 41, name: "Sıkma Portakal Suyu", nameEn: "Fresh Orange Juice", category: "İçecek", price: 100 },
  { id: 42, name: "Şalgam", nameEn: "Turnip Juice", category: "İçecek", price: 60 },
  { id: 42, name: "Ayran", nameEn: "Ayran", category: "İçecek", price: 30 },
];

const CATEGORIES = ["Tümü / All", "Kebap", "Dürüm", "Özel Menü", "Balık", "Salata", "Çorba", "Meze", "İçecek"];
const TABLE_COUNT = 20;
const QUICK_ADJ = [-500, -200, -100, 100, 200, 500];

function initTables() {
  return Array.from({ length: TABLE_COUNT }, (_, i) => ({
    id: i + 1, status: "free", guests: 0, openedAt: null,
  }));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(tables, orders, adjustments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tables, orders, adjustments, savedAt: new Date().toISOString() }));
  } catch (e) { console.warn("localStorage save failed:", e); }
}

export default function ArastaAtesi() {
  const saved = loadState();

  const [tables, setTables] = useState(() => saved?.tables ?? initTables());
  const [orders, setOrders] = useState(() => saved?.orders ?? {});
  const [adjustments, setAdjustments] = useState(() => saved?.adjustments ?? {});

  const [selectedTable, setSelectedTable] = useState(null);
  const [view, setView] = useState("floor");
  const [categoryFilter, setCategoryFilter] = useState("Tümü / All");
  const [toast, setToast] = useState(null);
  const [guestInput, setGuestInput] = useState("2");
  const [noteInputs, setNoteInputs] = useState({});
  const [adjLabel, setAdjLabel] = useState("");
  const [adjAmount, setAdjAmount] = useState("");

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    saveState(tables, orders, adjustments);
  }, [tables, orders, adjustments]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  // --- Table actions ---
  const openTable = (tableId) => {
    const guests = parseInt(guestInput) || 2;
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: "occupied", guests, openedAt: new Date().toISOString() } : t));
    setOrders(prev => ({ ...prev, [tableId]: [] }));
    setAdjustments(prev => ({ ...prev, [tableId]: [] }));
    setGuestInput("2");
    showToast(`Masa ${tableId} açıldı / Table ${tableId} opened`);
  };

  const closeTable = async (tableId) => {
  const items = orders[tableId] || [];

  const products = items
    .map(i => `${i.name} x${i.qty}`)
    .join(", ");

  const total = getTotal(tableId);

  try {
    await fetch("https://script.google.com/macros/s/AKfycbwF_prRa9qPRcS2RwZYO1zfKgFS3mJlncJSXvCxrSSJ8iFQR6eJj4iApmkb2F1hQtU0XA/exec", {
      method: "POST",
      body: JSON.stringify({
        time: new Date().toISOString(),
        table: tableId,
        products,
        total_price: total,
      }),
    });
  } catch (err) {
    console.error("Google Sheets error:", err);
  }

  setTables(prev =>
    prev.map(t =>
      t.id === tableId
        ? { ...t, status: "free", guests: 0, openedAt: null }
        : t
    )
  );

  setOrders(prev => {
    const n = { ...prev };
    delete n[tableId];
    return n;
  });

  setAdjustments(prev => {
    const n = { ...prev };
    delete n[tableId];
    return n;
  });

  setSelectedTable(null);

  showToast(`Masa ${tableId} kapatıldı / Table ${tableId} closed`);
};

  const requestBill = (tableId) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: "bill" } : t));
    showToast(`Masa ${tableId} hesap / Table ${tableId} bill requested`);
  };

  // --- Order actions ---
  const addItem = (tableId, menuItem) => {
    setOrders(prev => {
      const current = prev[tableId] || [];
      const existing = current.find(i => i.menuId === menuItem.id);
      if (existing) {
        return { ...prev, [tableId]: current.map(i => i.menuId === menuItem.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...prev, [tableId]: [...current, { id: Date.now(), menuId: menuItem.id, name: menuItem.name, nameEn: menuItem.nameEn, price: menuItem.price, qty: 1, note: "", status: "pending" }] };
    });
    showToast(`${menuItem.name} eklendi / added`);
  };

  const updateQty = (tableId, itemId, delta) => {
    setOrders(prev => ({
      ...prev,
      [tableId]: (prev[tableId] || []).map(i => i.id === itemId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0),
    }));
  };

  const removeItem = (tableId, itemId) => {
    setOrders(prev => ({ ...prev, [tableId]: (prev[tableId] || []).filter(i => i.id !== itemId) }));
  };

  const updateNote = (tableId, itemId, note) => {
    setOrders(prev => ({ ...prev, [tableId]: (prev[tableId] || []).map(i => i.id === itemId ? { ...i, note } : i) }));
  };

  const markServed = (tableId, itemId) => {
    setOrders(prev => ({ ...prev, [tableId]: (prev[tableId] || []).map(i => i.id === itemId ? { ...i, status: "served" } : i) }));
  };

  // --- Adjustment actions ---
  const addAdjustment = (tableId, label, amount) => {
    setAdjustments(prev => ({
      ...prev,
      [tableId]: [...(prev[tableId] || []), { id: Date.now(), label, amount }],
    }));
  };

  const removeAdjustment = (tableId, adjId) => {
    setAdjustments(prev => ({ ...prev, [tableId]: (prev[tableId] || []).filter(a => a.id !== adjId) }));
  };

  const applyAdj = (tableId, sign) => {
    const amt = parseFloat(adjAmount);
    if (!amt || amt <= 0) { showToast("Geçerli bir tutar girin · Enter a valid amount"); return; }
    addAdjustment(tableId, adjLabel || (sign > 0 ? "Ekleme / Addition" : "İndirim / Discount"), sign * Math.abs(amt));
    setAdjLabel(""); setAdjAmount("");
  };

  const quickAdj = (tableId, amount) => {
    addAdjustment(tableId, amount > 0 ? "Ekleme / Addition" : "İndirim / Discount", amount);
  };

  // --- Totals ---
  const getSubtotal = (tableId) => (orders[tableId] || []).reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  const getAdjTotal = (tableId) => (adjustments[tableId] || []).reduce((s, a) => s + a.amount, 0);
  const getTotal = (tableId) => getSubtotal(tableId) + getAdjTotal(tableId);

  // --- Export / Reset ---
  const exportCSV = () => {
    const rows = [["Masa/Table", "Durum/Status", "Misafir/Guests", "Ürün/Item", "İng./En", "Adet/Qty", "Fiyat TL", "Fiyat EUR", "Not/Note", "Durum/Status"]];
    tables.forEach(t => {
      const items = orders[t.id] || [];
      if (items.length === 0) { rows.push([t.id, t.status, t.guests, "", "", "", "", "", "", ""]); }
      else { items.forEach(item => { rows.push([t.id, t.status, t.guests, item.name, item.nameEn, item.qty, item.price || "-", item.price ? (item.price / LIRA_TO_EURO).toFixed(2) : "-", item.note, item.status]); }); }
    });
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `arasta_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV indirildi / downloaded");
  };

  const clearAll = () => {
    if (!window.confirm("Tüm veriler silinsin mi?\nDelete all data?")) return;
    setTables(initTables()); setOrders({}); setAdjustments({}); setSelectedTable(null);
    localStorage.removeItem(STORAGE_KEY);
    showToast("Veriler temizlendi / Data cleared");
  };

  // --- Derived ---
  const pendingCount = Object.values(orders).flat().filter(i => i.status === "pending").length;
  const occupiedCount = tables.filter(t => t.status !== "free").length;
  const totalRevenue = Object.keys(orders).reduce((s, tid) => s + getTotal(parseInt(tid)), 0);
  const selectedTableData = tables.find(t => t.id === selectedTable);
  const selectedOrders = selectedTable ? orders[selectedTable] || [] : [];
  const selectedAdj = selectedTable ? adjustments[selectedTable] || [] : [];
  const subtotal = selectedTable ? getSubtotal(selectedTable) : 0;
  const adjTotal = selectedTable ? getAdjTotal(selectedTable) : 0;
  const total = selectedTable ? getTotal(selectedTable) : 0;

  const catKey = categoryFilter === "Tümü / All" ? null : categoryFilter;
  const filteredMenu = catKey ? MENU_ITEMS.filter(m => m.category === catKey) : MENU_ITEMS;
  const menuByCat = filteredMenu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", minHeight: "100vh", background: "#faf8f4", color: "#1a1710", display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #f0ece4; } ::-webkit-scrollbar-thumb { background: #d0c8b8; border-radius: 2px; }
        .btn { border: 1px solid #d8d0c0; cursor: pointer; border-radius: 5px; padding: 6px 14px; font-size: 12px; font-family: 'DM Mono', monospace; background: #fff; color: #5a5040; letter-spacing: 0.04em; transition: all 0.15s; white-space: nowrap; }
        .btn:hover { border-color: #8b6914; color: #8b6914; }
        .btn.primary { background: #8b6914; color: #fff; border-color: #8b6914; }
        .btn.primary:hover { background: #7a5e10; }
        .btn.danger { color: #8b2020; border-color: #ecc; }
        .btn.danger:hover { border-color: #8b2020; }
        .btn.warn { color: #b06010; border-color: #f0d8b0; }
        .btn.warn:hover { border-color: #b06010; }
        .btn.green { color: #2a6040; border-color: #b0d8c0; }
        .btn.green:hover { border-color: #2a6040; }
        .btn.sm { padding: 4px 10px; font-size: 11px; }
        .tab { border: none; background: none; cursor: pointer; padding: 6px 14px; font-size: 12px; border-radius: 4px; font-family: 'DM Mono', monospace; color: #9a8e7e; letter-spacing: 0.04em; transition: all 0.18s; white-space: nowrap; }
        .tab.active { background: #fff; color: #1a1710; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .tab:hover:not(.active) { color: #5a5040; }
        .badge { background: #8b2020; color: #fff; border-radius: 3px; font-size: 10px; padding: 1px 5px; margin-left: 4px; }
        .table-card { border-radius: 6px; padding: 10px 8px; cursor: pointer; border: 1.5px solid #e8e2d8; background: #faf8f4; transition: all 0.18s; text-align: center; }
        .table-card:hover { border-color: #c4a84a; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .table-card.selected { border-color: #8b6914; box-shadow: 0 0 0 2px rgba(139,105,20,0.15); }
        .table-card.occupied { background: #faf3e0; border-color: #d4b840; }
        .table-card.bill { background: #fdf0f0; border-color: #d09090; }
        .qty-btn { width: 22px; height: 22px; border: 1px solid #d8d0c0; background: #faf8f4; cursor: pointer; border-radius: 4px; font-size: 14px; color: #5a5040; display: flex; align-items: center; justify-content: center; transition: all 0.12s; }
        .qty-btn:hover { border-color: #8b6914; color: #8b6914; }
        .cat-btn { padding: 4px 11px; border-radius: 4px; border: 1px solid #e8e2d8; font-size: 11px; cursor: pointer; background: #fff; color: #9a8e7e; transition: all 0.12s; font-family: 'DM Mono', monospace; white-space: nowrap; }
        .cat-btn.active { background: #8b6914; color: #fff; border-color: #8b6914; }
        .cat-btn:hover:not(.active) { border-color: #c4a84a; color: #5a5040; }
        .menu-row { display: flex; align-items: center; gap: 8px; padding: 9px 16px; border-bottom: 1px solid #ece8df; cursor: pointer; transition: background 0.12s; }
        .menu-row:hover { background: #faf3e0; }
        .menu-row:hover .add-icon { opacity: 1; }
        .add-icon { opacity: 0; font-size: 18px; color: #8b6914; flex-shrink: 0; transition: opacity 0.12s; }
        .order-item { border-bottom: 1px solid #ece8df; padding: 10px 16px; }
        .order-item:last-child { border-bottom: none; }
        .adj-chip { background: #f3f0ea; border: 1px solid #e8e2d8; border-radius: 4px; padding: 3px 8px; font-size: 11px; color: #5a5040; cursor: pointer; font-family: 'DM Mono', monospace; transition: all 0.12s; }
        .adj-chip:hover { border-color: #8b6914; color: #8b6914; }
        input[type="text"], input[type="number"] { border: 1px solid #e8e2d8; border-radius: 4px; padding: 5px 9px; font-family: 'Cormorant Garamond', serif; font-size: 13px; outline: none; background: #faf8f4; color: #1a1710; transition: border 0.15s; }
        input[type="text"]:focus, input[type="number"]:focus { border-color: #8b6914; background: #fff; }
        .toast { position: fixed; bottom: 20px; right: 20px; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-family: 'DM Mono', monospace; z-index: 9999; border: 1px solid #d8d0c0; background: #fff; color: #5a5040; box-shadow: 0 4px 16px rgba(0,0,0,0.1); animation: toastIn 0.2s ease; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .section-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #9a8e7e; font-family: 'DM Mono', monospace; margin-bottom: 10px; }
        .mono { font-family: 'DM Mono', monospace; }
      `}</style>

      {toast && <div className="toast">{toast}</div>}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #d8d0c0", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, flexShrink: 0, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9a8e7e" }}>Mersin · Türkiye</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "#8b6914", letterSpacing: "0.08em", lineHeight: 1 }}>ARASTA ATEŞİ</div>
          <div style={{ fontSize: 10, color: "#9a8e7e", fontStyle: "italic" }}>Ateşin Gerçek Lezzeti · The True Taste of Fire</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#b0a898", fontFamily: "'DM Mono',monospace" }}>● Auto-save</span>
          <button className="btn danger sm" onClick={clearAll}>Sıfırla / Reset</button>
          <button className="btn sm" onClick={exportCSV}>↓ CSV</button>
          <div style={{ display: "flex", background: "#f3f0ea", border: "1px solid #e8e2d8", borderRadius: 6, padding: 3, gap: 2 }}>
            {["floor", "kitchen"].map(v => (
              <button key={v} className={`tab${view === v ? " active" : ""}`} onClick={() => setView(v)}>
                {v === "floor" ? "Masalar / Tables" : "Mutfak / Kitchen"}
                {v === "kitchen" && pendingCount > 0 && <span className="badge">{pendingCount}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 10, padding: "12px 24px", background: "#fff", borderBottom: "1px solid #ece8df", flexShrink: 0 }}>
        {[
          { tr: "Dolu Masa", en: "Occupied Tables", val: `${occupiedCount} / ${TABLE_COUNT}` },
          { tr: "Bekleyen Sipariş", en: "Pending Orders", val: pendingCount },
          { tr: "Toplam Ciro", en: "Total Revenue", val: `₺${totalRevenue.toLocaleString()} · €${(totalRevenue / LIRA_TO_EURO).toFixed(0)}` },
        ].map(s => (
          <div key={s.tr} style={{ background: "#f3f0ea", border: "1px solid #e8e2d8", borderRadius: 6, padding: "10px 16px", minWidth: 140 }}>
            <div className="section-label" style={{ marginBottom: 4 }}>{s.tr} / {s.en}</div>
            <div style={{ fontSize: 18, color: "#8b6914", fontWeight: 500 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Floor View */}
      {view === "floor" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Left: Table grid */}
          <div style={{ width: 280, minWidth: 280, background: "#fff", borderRight: "1px solid #d8d0c0", overflowY: "auto", padding: 16 }}>
            <div className="section-label">Plan · Floor</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
              {tables.map(table => {
                const dot = table.status === "bill" ? "#b06060" : table.status === "occupied" ? "#8b6914" : "#b0c0b0";
                return (
                  <div key={table.id} className={`table-card ${table.status}${selectedTable === table.id ? " selected" : ""}`} onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 2 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, display: "inline-block" }} />
                      <span style={{ fontSize: 16, fontWeight: 500, color: "#5a5040" }}>{table.id}</span>
                    </div>
                    {table.status !== "free"
                      ? <><div style={{ fontSize: 10, color: "#9a8e7e", fontFamily: "'DM Mono',monospace" }}>{table.guests} kişi</div>
                          <div style={{ fontSize: 11, color: "#8b6914", fontFamily: "'DM Mono',monospace", marginTop: 2 }}>₺{getTotal(table.id).toLocaleString()}</div></>
                      : <div style={{ fontSize: 10, color: "#c0bab0" }}>Boş/Free</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Middle: Order panel */}
          <div style={{ flex: 1, overflowY: "auto", background: "#f3f0ea", borderRight: "1px solid #d8d0c0" }}>
            <div style={{ padding: 20 }}>
              {!selectedTable
                ? <div style={{ textAlign: "center", padding: "60px 20px", color: "#9a8e7e" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🪑</div>
                    <p style={{ fontStyle: "italic", fontSize: 14 }}>Bir masa seçin · Select a table</p>
                  </div>
                : selectedTableData?.status === "free"
                ? <div style={{ background: "#fff", border: "1px solid #d8d0c0", borderRadius: 8, padding: 28, textAlign: "center" }}>
                    <div style={{ fontSize: 22, color: "#8b6914", marginBottom: 4 }}>Masa {selectedTable} · Table {selectedTable}</div>
                    <p style={{ fontSize: 13, color: "#9a8e7e", fontStyle: "italic", marginBottom: 20 }}>Misafir sayısını girin · Enter guest count</p>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
                      <input type="number" min={1} max={30} value={guestInput} onChange={e => setGuestInput(e.target.value)} style={{ width: 80 }} />
                      <button className="btn primary" onClick={() => openTable(selectedTable)}>Masayı Aç · Open Table</button>
                    </div>
                  </div>
                : <>
                    {/* Table header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 20, color: "#8b6914", fontWeight: 500 }}>Masa {selectedTable} · Table {selectedTable}</div>
                        <div style={{ fontSize: 12, color: "#9a8e7e", fontFamily: "'DM Mono',monospace" }}>{selectedTableData?.guests} misafir · guests</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn warn sm" onClick={() => requestBill(selectedTable)}>Hesap · Bill</button>
                        <button className="btn danger sm" onClick={() => closeTable(selectedTable)}>Kapat · Close</button>
                      </div>
                    </div>

                    {/* Orders */}
                    <div style={{ background: "#fff", border: "1px solid #e8e2d8", borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid #ece8df", background: "#faf8f4", display: "flex", justifyContent: "space-between" }}>
                        <span className="mono" style={{ fontSize: 11, color: "#9a8e7e", letterSpacing: "0.08em" }}>SİPARİŞ · ORDERS</span>
                        <span className="mono" style={{ fontSize: 11, color: "#9a8e7e" }}>{selectedOrders.length} kalem · items</span>
                      </div>
                      {selectedOrders.length === 0
                        ? <div style={{ padding: 20, textAlign: "center", color: "#9a8e7e", fontStyle: "italic", fontSize: 13 }}>Henüz sipariş yok · No orders yet</div>
                        : selectedOrders.map(item => (
                          <div key={item.id} className="order-item">
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14 }}>{item.name}</div>
                                <div style={{ fontSize: 11, color: "#9a8e7e", fontStyle: "italic" }}>{item.nameEn}</div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <button className="qty-btn" onClick={() => updateQty(selectedTable, item.id, -1)}>−</button>
                                <span style={{ minWidth: 20, textAlign: "center", fontFamily: "'DM Mono',monospace", fontSize: 13, color: "#8b6914" }}>{item.qty}</span>
                                <button className="qty-btn" onClick={() => updateQty(selectedTable, item.id, 1)}>+</button>
                              </div>
                              <div style={{ textAlign: "right", minWidth: 90 }}>
                                <div className="mono" style={{ fontSize: 12, color: "#5a5040" }}>{item.price ? `₺${(item.price * item.qty).toLocaleString()}` : "—"}</div>
                                <div className="mono" style={{ fontSize: 10, color: "#9a8e7e" }}>{item.price ? `€${((item.price * item.qty) / LIRA_TO_EURO).toFixed(1)}` : ""}</div>
                              </div>
                              <span style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", padding: "2px 6px", borderRadius: 3, background: item.status === "served" ? "#f0faf4" : "#faf3e0", color: item.status === "served" ? "#2a6040" : "#8b6914" }}>
                                {item.status === "served" ? "✓ Geldi" : "⏳ Bekl."}
                              </span>
                              <button className="qty-btn" style={{ color: "#c09090" }} onClick={() => removeItem(selectedTable, item.id)}>✕</button>
                            </div>
                            <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                              <input
                                type="text"
                                placeholder="Not · Note..."
                                defaultValue={item.note}
                                onBlur={e => updateNote(selectedTable, item.id, e.target.value)}
                                style={{ flex: 1, fontSize: 12 }}
                              />
                              {item.status === "pending" && (
                                <button className="btn green sm" onClick={() => markServed(selectedTable, item.id)}>✓ Geldi/Served</button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Adjustments + Total */}
                    <div style={{ background: "#fff", border: "1px solid #e8e2d8", borderRadius: 8, padding: 16 }}>
                      <div className="section-label">Fiyat Düzenleme · Price Adjustment</div>

                      {selectedAdj.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          {selectedAdj.map(a => (
                            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                              <span style={{ fontSize: 12, color: "#5a5040" }}>{a.label}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span className="mono" style={{ fontSize: 12, color: a.amount >= 0 ? "#2a6040" : "#8b2020" }}>
                                  {a.amount >= 0 ? "+" : ""}₺{a.amount.toLocaleString()} · €{(a.amount / LIRA_TO_EURO).toFixed(1)}
                                </span>
                                <span style={{ cursor: "pointer", color: "#9a8e7e", fontSize: 14 }} onClick={() => removeAdjustment(selectedTable, a.id)}>✕</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                        <input type="text" placeholder="Açıklama · Description" value={adjLabel} onChange={e => setAdjLabel(e.target.value)} style={{ flex: 2 }} />
                        <input type="number" placeholder="₺ tutar" value={adjAmount} onChange={e => setAdjAmount(e.target.value)} style={{ width: 100, flexShrink: 0 }} />
                      </div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
                        <span className="mono" style={{ fontSize: 10, color: "#9a8e7e" }}>Hızlı/Quick:</span>
                        {QUICK_ADJ.map(v => (
                          <span key={v} className="adj-chip" onClick={() => quickAdj(selectedTable, v)}>{v > 0 ? "+" : ""}₺{v}</span>
                        ))}
                        <button className="btn green sm" onClick={() => applyAdj(selectedTable, 1)}>+ Ekle/Add</button>
                        <button className="btn warn sm" onClick={() => applyAdj(selectedTable, -1)}>− İndir/Discount</button>
                      </div>

                      <div style={{ height: 1, background: "#e8e2d8", margin: "12px 0" }} />

                      <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                        <span className="mono" style={{ fontSize: 12, color: "#9a8e7e" }}>Ara Toplam / Subtotal</span>
                        <span className="mono" style={{ fontSize: 13, color: "#5a5040" }}>₺{subtotal.toLocaleString()} · €{(subtotal / LIRA_TO_EURO).toFixed(1)}</span>
                      </div>
                      {adjTotal !== 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                          <span className="mono" style={{ fontSize: 12, color: "#9a8e7e" }}>Düzenleme / Adjustments</span>
                          <span className="mono" style={{ fontSize: 13, color: adjTotal >= 0 ? "#2a6040" : "#8b2020" }}>
                            {adjTotal >= 0 ? "+" : ""}₺{adjTotal.toLocaleString()} · €{(adjTotal / LIRA_TO_EURO).toFixed(1)}
                          </span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid #e8e2d8", marginTop: 8, paddingTop: 8 }}>
                        <span className="mono" style={{ fontSize: 13, color: "#1a1710", fontWeight: 500 }}>TOPLAM / TOTAL</span>
                        <div style={{ textAlign: "right" }}>
                          <div className="mono" style={{ fontSize: 22, color: "#8b6914" }}>₺{total.toLocaleString()}</div>
                          <div className="mono" style={{ fontSize: 13, color: "#9a8e7e" }}>€{(total / LIRA_TO_EURO).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </>
              }
            </div>
          </div>

          {/* Right: Menu panel */}
          <div style={{ width: 320, minWidth: 280, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #e8e2d8", background: "#faf8f4", flexShrink: 0 }}>
              <div className="section-label" style={{ marginBottom: 8 }}>Menü · Menu</div>
              <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}>
                {CATEGORIES.map(c => (
                  <button key={c} className={`cat-btn${categoryFilter === c ? " active" : ""}`} onClick={() => setCategoryFilter(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {Object.entries(menuByCat).map(([cat, items]) => (
                <div key={cat}>
                  <div style={{ padding: "8px 16px 4px", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e7e", fontFamily: "'DM Mono',monospace", background: "#f3f0ea", borderTop: "1px solid #e8e2d8", borderBottom: "1px solid #e8e2d8" }}>{cat}</div>
                  {items.map(item => (
                    <div key={item.id} className="menu-row" onClick={() => {
                      if (selectedTable && selectedTableData?.status !== "free") { addItem(selectedTable, item); }
                      else { showToast("Önce bir masa seçin · Select a table first"); }
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "#9a8e7e", fontStyle: "italic", marginTop: 1 }}>{item.nameEn}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {item.price
                          ? <><div className="mono" style={{ fontSize: 13, color: "#8b6914" }}>₺{item.price.toLocaleString()}</div>
                              <div className="mono" style={{ fontSize: 10, color: "#9a8e7e" }}>€{(item.price / LIRA_TO_EURO).toFixed(1)}</div></>
                          : <span className="mono" style={{ fontSize: 11, color: "#9a8e7e" }}>Sor/Ask</span>}
                      </div>
                      <span className="add-icon">+</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kitchen View */}
      {view === "kitchen" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Mutfak Görünümü · Kitchen View</div>
          {Object.keys(orders).filter(tid => (orders[tid] || []).length > 0).length === 0
            ? <div style={{ textAlign: "center", padding: "60px 20px", color: "#9a8e7e" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>
                <p style={{ fontStyle: "italic", fontSize: 14 }}>Aktif sipariş yok · No active orders</p>
              </div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                {Object.entries(orders).filter(([, items]) => items.length > 0).map(([tid, items]) => {
                  const table = tables.find(t => t.id === parseInt(tid));
                  const total = getTotal(parseInt(tid));
                  return (
                    <div key={tid} style={{ background: "#fff", border: "1px solid #d8d0c0", borderRadius: 8, overflow: "hidden" }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid #ece8df", background: "#faf8f4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: 16, color: "#8b6914", fontWeight: 500 }}>Masa {tid} · Table {tid}</span>
                          <span className="mono" style={{ fontSize: 11, color: "#9a8e7e", marginLeft: 8 }}>{table?.guests} kişi/guests</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="mono" style={{ fontSize: 13, color: "#8b6914" }}>₺{total.toLocaleString()}</div>
                          <div className="mono" style={{ fontSize: 10, color: "#9a8e7e" }}>€{(total / LIRA_TO_EURO).toFixed(1)}</div>
                        </div>
                      </div>
                      {items.map(item => (
                        <div key={item.id} style={{ padding: "9px 16px", borderBottom: "1px solid #ece8df", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.status === "served" ? "#2a6040" : "#8b6914", flexShrink: 0, display: "inline-block" }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13 }}>{item.qty}× {item.name}</div>
                            <div style={{ fontSize: 11, color: "#9a8e7e", fontStyle: "italic" }}>{item.nameEn}</div>
                            {item.note && <div className="mono" style={{ fontSize: 10, color: "#9a8e7e", marginTop: 2 }}>📝 {item.note}</div>}
                          </div>
                          {item.status === "pending"
                            ? <button className="btn primary sm" onClick={() => markServed(parseInt(tid), item.id)}>✓</button>
                            : <span className="mono" style={{ fontSize: 11, color: "#2a6040" }}>Geldi/Served</span>}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>}
        </div>
      )}
    </div>
  );
}