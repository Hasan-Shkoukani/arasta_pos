import { useState, useCallback, useEffect, useRef } from "react";

const LIRA_TO_EURO = 51;
const STORAGE_KEY = "arasta_atesi_v2_light";
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzr_VVD9dEoy9vrD2pP-FE1CTezNnfPr5lc1ka5f5KvABf9SPQXdhAA5zNN0KADXfK8cw/exec";

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
  { id: 43, name: "Ayran", nameEn: "Ayran", category: "İçecek", price: 30 },
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

// ── Retry queue for failed log attempts ──────────────────────────────────────
const failedLogs = [];
let retryIntervalId = null;

// Formats items array into string like "Adana x2, Cola x1"
function formatItems(items) {
  return items.map(i => `${i.name} x${i.qty}`).join(", ");
}

// Reusable function to log closed table to Google Apps Script.
// Handles retries on failure and doesn't block the UI.
async function logClosedTable(tableId, items, total) {
  const payload = {
    action: "close",
    time: new Date().toISOString(),
    items: formatItems(items),
    total_tl: total,
  };

  const attemptLog = async () => {
    try {
      const res = await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      // With no-cors mode, we can't read the response
      // But that's OK - Google Apps Script will process the request
      
      console.log("✓ Table closed logged to Sheets:", { tableId, items: payload.items, total });
      return true;
    } catch (err) {
      console.warn(`✗ Failed to log closed table ${tableId}:`, err.message);
      return false;
    }
  };

  // Try immediately
  const success = await attemptLog();
  
  // If failed, add to retry queue
  if (!success) {
    failedLogs.push(payload);
    console.log(`Added table ${tableId} to retry queue. Pending: ${failedLogs.length}`);
    
    // Start retry interval if not already running
    if (!retryIntervalId) {
      retryIntervalId = setInterval(async () => {
        if (failedLogs.length === 0) {
          clearInterval(retryIntervalId);
          retryIntervalId = null;
          return;
        }
        
        const toRetry = failedLogs.shift();
        try {
          const res = await fetch(SHEETS_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toRetry),
          });
          
          // With no-cors mode, we can't check response status
          // Assume success for retry loop
          
          console.log("✓ Retried log successful:", toRetry);
        } catch (err) {
          failedLogs.push(toRetry);
          console.warn(`Retry error for table close:`, err.message);
        }
      }, 10000); // Retry every 10 seconds
    }
  }
}

// Sheets sync helpers (for live updates - not critical for closing)
async function syncTableToSheets(tableId, status, guests, openedAt, items, total) {
  const products = items.map(i => `${i.name} x${i.qty}`).join(", ");
  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        table: tableId,
        status,
        guests,
        products,
        total_tl: total,
        opened_at: openedAt,
      }),
    });
  } catch (err) { console.warn("Sheets sync error:", err); }
}

// ── Removed: LiveView component

// ── Main component ───────────────────────────────────────────────────────────
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
  const [adjLabel, setAdjLabel] = useState("");
  const [adjAmount, setAdjAmount] = useState("");

  const isFirstRender = useRef(true);
  const syncDebounceRef = useRef({});

  // ── Persist to localStorage ──
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    saveState(tables, orders, adjustments);
  }, [tables, orders, adjustments]);

  // ── Debounced Sheets sync on order/adjustment change ──
  const scheduleSync = useCallback((tableId, tablesSnapshot, ordersSnapshot, adjustmentsSnapshot) => {
    if (syncDebounceRef.current[tableId]) clearTimeout(syncDebounceRef.current[tableId]);
    syncDebounceRef.current[tableId] = setTimeout(() => {
      const table = tablesSnapshot.find(t => t.id === tableId);
      if (!table || table.status === "free") return;
      const items = ordersSnapshot[tableId] || [];
      const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
      const adjTot = (adjustmentsSnapshot[tableId] || []).reduce((s, a) => s + a.amount, 0);
      syncTableToSheets(tableId, table.status, table.guests, table.openedAt, items, subtotal + adjTot);
    }, 2000);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  // ── Table actions ──
  const openTable = (tableId) => {
    const guests = parseInt(guestInput) || 2;
    const openedAt = new Date().toISOString();
    const newTables = tables.map(t => t.id === tableId ? { ...t, status: "occupied", guests, openedAt } : t);
    const newOrders = { ...orders, [tableId]: [] };
    const newAdj = { ...adjustments, [tableId]: [] };
    setTables(newTables);
    setOrders(newOrders);
    setAdjustments(newAdj);
    setGuestInput("2");
    syncTableToSheets(tableId, "occupied", guests, openedAt, [], 0);
    showToast(`Masa ${tableId} açıldı / Table ${tableId} opened`);
  };

  const closeTable = async (tableId) => {
    const items = orders[tableId] || [];
    const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
    const adjTot = (adjustments[tableId] || []).reduce((s, a) => s + a.amount, 0);
    const total = subtotal + adjTot;

    // Log closed table (non-blocking - doesn't wait for response)
    logClosedTable(tableId, items, total);

    // Reset table state immediately - UI remains responsive
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: "free", guests: 0, openedAt: null } : t));
    setOrders(prev => { const n = { ...prev }; delete n[tableId]; return n; });
    setAdjustments(prev => { const n = { ...prev }; delete n[tableId]; return n; });
    setSelectedTable(null);
    showToast(`Masa ${tableId} kapatıldı / Table ${tableId} closed`);
  };

  const requestBill = (tableId) => {
    const newTables = tables.map(t => t.id === tableId ? { ...t, status: "bill" } : t);
    setTables(newTables);
    // Sync bill status immediately
    const table = newTables.find(t => t.id === tableId);
    const items = orders[tableId] || [];
    const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
    const adjTot = (adjustments[tableId] || []).reduce((s, a) => s + a.amount, 0);
    syncTableToSheets(tableId, "bill", table.guests, table.openedAt, items, subtotal + adjTot);
    showToast(`Masa ${tableId} hesap / Table ${tableId} bill requested`);
  };

  // ── Order actions ──
  const addItem = (tableId, menuItem) => {
    setOrders(prev => {
      const current = prev[tableId] || [];
      const existing = current.find(i => i.menuId === menuItem.id);
      const newOrders = existing
        ? { ...prev, [tableId]: current.map(i => i.menuId === menuItem.id ? { ...i, qty: i.qty + 1 } : i) }
        : { ...prev, [tableId]: [...current, { id: Date.now(), menuId: menuItem.id, name: menuItem.name, nameEn: menuItem.nameEn, price: menuItem.price, qty: 1, note: "", status: "pending" }] };
      scheduleSync(tableId, tables, newOrders, adjustments);
      return newOrders;
    });
    showToast(`${menuItem.name} eklendi / added`);
  };

  const updateQty = (tableId, itemId, delta) => {
    setOrders(prev => {
      const newOrders = { ...prev, [tableId]: (prev[tableId] || []).map(i => i.id === itemId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0) };
      scheduleSync(tableId, tables, newOrders, adjustments);
      return newOrders;
    });
  };

  const removeItem = (tableId, itemId) => {
    setOrders(prev => {
      const newOrders = { ...prev, [tableId]: (prev[tableId] || []).filter(i => i.id !== itemId) };
      scheduleSync(tableId, tables, newOrders, adjustments);
      return newOrders;
    });
  };

  const updateNote = (tableId, itemId, note) => {
    setOrders(prev => ({ ...prev, [tableId]: (prev[tableId] || []).map(i => i.id === itemId ? { ...i, note } : i) }));
  };

  const markServed = (tableId, itemId) => {
    setOrders(prev => ({ ...prev, [tableId]: (prev[tableId] || []).map(i => i.id === itemId ? { ...i, status: "served" } : i) }));
  };

  // ── Adjustment actions ──
  const addAdjustment = (tableId, label, amount) => {
    setAdjustments(prev => {
      const newAdj = { ...prev, [tableId]: [...(prev[tableId] || []), { id: Date.now(), label, amount }] };
      scheduleSync(tableId, tables, orders, newAdj);
      return newAdj;
    });
  };

  const removeAdjustment = (tableId, adjId) => {
    setAdjustments(prev => {
      const newAdj = { ...prev, [tableId]: (prev[tableId] || []).filter(a => a.id !== adjId) };
      scheduleSync(tableId, tables, orders, newAdj);
      return newAdj;
    });
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

  // ── Totals ──
  const getSubtotal = (tableId) => (orders[tableId] || []).reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  const getAdjTotal = (tableId) => (adjustments[tableId] || []).reduce((s, a) => s + a.amount, 0);
  const getTotal = (tableId) => getSubtotal(tableId) + getAdjTotal(tableId);

  // ── Export / Reset ──
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

  // ── Derived ──
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
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .section-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #9a8e7e; font-family: 'DM Mono', monospace; margin-bottom: 10px; }
        .mono { font-family: 'DM Mono', monospace; }
        
        /* RESPONSIVE DESIGN */
        @media (max-width: 1024px) {
          .btn.sm { padding: 5px 12px; font-size: 12px; }
          input[type="text"], input[type="number"] { padding: 6px 10px; font-size: 14px; }
        }
        
        @media (max-width: 768px) {
          .btn { padding: 8px 12px; font-size: 13px; }
          .btn.sm { padding: 6px 12px; font-size: 12px; }
          .qty-btn { width: 28px; height: 28px; font-size: 16px; }
          input[type="text"], input[type="number"] { padding: 8px 12px; font-size: 16px; }
          .tab { padding: 8px 12px; font-size: 13px; }
          .cat-btn { padding: 6px 12px; font-size: 12px; }
          .toast { bottom: 10px; right: 10px; font-size: 12px; padding: 8px 14px; }
        }
        
        @media (max-width: 480px) {
          .btn { padding: 10px 12px; font-size: 14px; }
          .btn.sm { padding: 8px 12px; font-size: 13px; }
          .qty-btn { width: 32px; height: 32px; font-size: 18px; }
          .tab { padding: 8px 10px; font-size: 12px; }
          .cat-btn { padding: 6px 10px; font-size: 11px; }
          input[type="text"], input[type="number"] { padding: 10px 12px; font-size: 16px; }
          .toast { font-size: 13px; padding: 10px 16px; bottom: 10px; right: 10px; }
        }
      `}</style>

      {toast && <div className="toast">{toast}</div>}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #d8d0c0", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 64, flexShrink: 0, boxShadow: "0 1px 8px rgba(0,0,0,0.05)", flexWrap: "wrap", gap: 12 }}>
        <div style={{ minWidth: 200 }}>
          <div style={{ fontSize: "clamp(8px, 2vw, 9px)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9a8e7e" }}>Mersin · Türkiye</div>
          <div style={{ fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 500, color: "#8b6914", letterSpacing: "0.08em", lineHeight: 1 }}>ARASTA ATEŞİ</div>
          <div style={{ fontSize: "clamp(9px, 2vw, 10px)", color: "#9a8e7e", fontStyle: "italic" }}>Ateşin Gerçek Lezzeti</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "#b0a898", fontFamily: "'DM Mono',monospace", display: "none" }}>● Auto-save</span>
          <button className="btn danger sm" onClick={clearAll} style={{ fontSize: "clamp(11px, 3vw, 12px)", padding: "clamp(4px, 2vh, 6px) clamp(8px, 3vw, 12px)" }}>Sıfırla</button>
          <button className="btn sm" onClick={exportCSV} style={{ fontSize: "clamp(11px, 3vw, 12px)", padding: "clamp(4px, 2vh, 6px) clamp(8px, 3vw, 12px)" }}>↓ CSV</button>
          <div style={{ display: "flex", background: "#f3f0ea", border: "1px solid #e8e2d8", borderRadius: 6, padding: 3, gap: 2 }}>
            {[
              { key: "floor", labelTr: "Masalar", labelEn: "Tables" },
              { key: "kitchen", labelTr: "Mutfak", labelEn: "Kitchen" },
            ].map(v => (
              <button key={v.key} className={`tab${view === v.key ? " active" : ""}`} onClick={() => setView(v.key)} style={{ padding: "clamp(6px, 2vh, 8px) clamp(8px, 2vw, 12px)", fontSize: "clamp(10px, 2vw, 12px)" }}>
                <span style={{ display: window.innerWidth < 640 ? "none" : "inline" }}>{v.labelTr} / </span>{v.labelEn}
                {v.key === "kitchen" && pendingCount > 0 && <span className="badge">{pendingCount}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 8, padding: "clamp(8px, 2vh, 12px) clamp(12px, 3vw, 24px)", background: "#fff", borderBottom: "1px solid #ece8df", flexShrink: 0, flexWrap: "wrap", overflowX: "auto" }}>
        {[
          { tr: "Dolu Masa", en: "Occupied", val: `${occupiedCount} / ${TABLE_COUNT}` },
          { tr: "Bekleyen", en: "Pending", val: pendingCount },
          { tr: "Toplam Ciro", en: "Revenue", val: `₺${totalRevenue.toLocaleString()}` },
        ].map(s => (
          <div key={s.tr} style={{ background: "#f3f0ea", border: "1px solid #e8e2d8", borderRadius: 6, padding: "clamp(8px, 2vh, 10px) clamp(12px, 2vw, 16px)", minWidth: "clamp(120px, 25vw, 140px)" }}>
            <div className="section-label" style={{ marginBottom: 4, fontSize: "clamp(8px, 1.5vw, 9px)" }}>{s.tr} / {s.en}</div>
            <div style={{ fontSize: "clamp(16px, 4vw, 18px)", color: "#8b6914", fontWeight: 500 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Floor View */}
      {view === "floor" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: window.innerWidth < 1024 ? "column" : "row" }}>

          {/* Left: Table grid */}
          <div style={{ width: window.innerWidth < 1024 ? "100%" : 280, minWidth: window.innerWidth < 1024 ? "auto" : 280, background: "#fff", borderRight: window.innerWidth < 1024 ? "none" : "1px solid #d8d0c0", borderBottom: window.innerWidth < 1024 ? "1px solid #d8d0c0" : "none", overflowY: window.innerWidth < 1024 ? "auto" : "auto", padding: "clamp(12px, 3vw, 16px)", maxHeight: window.innerWidth < 1024 ? 200 : "auto" }}>
            <div className="section-label">Plan · Floor</div>
            <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 480 ? "repeat(4, 1fr)" : window.innerWidth < 768 ? "repeat(5, 1fr)" : "repeat(3, 1fr)", gap: "clamp(5px, 2vw, 7px)" }}>
              {tables.map(table => {
                const dot = table.status === "bill" ? "#b06060" : table.status === "occupied" ? "#8b6914" : "#b0c0b0";
                return (
                  <div key={table.id} className={`table-card ${table.status}${selectedTable === table.id ? " selected" : ""}`} onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)} style={{ fontSize: "clamp(12px, 3vw, 16px)", padding: "clamp(8px, 2vh, 10px)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 2 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, display: "inline-block" }} />
                      <span style={{ fontSize: "clamp(14px, 4vw, 16px)", fontWeight: 500, color: "#5a5040" }}>{table.id}</span>
                    </div>
                    {table.status !== "free"
                      ? <><div style={{ fontSize: "clamp(9px, 2vw, 10px)", color: "#9a8e7e", fontFamily: "'DM Mono',monospace" }}>{table.guests} kişi</div>
                          <div style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: "#8b6914", fontFamily: "'DM Mono',monospace", marginTop: 2 }}>₺{getTotal(table.id).toLocaleString()}</div></>
                      : <div style={{ fontSize: "clamp(9px, 2vw, 10px)", color: "#c0bab0" }}>Boş</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Middle: Order panel */}
          <div style={{ flex: 1, overflowY: "auto", background: "#f3f0ea", borderRight: window.innerWidth < 1024 ? "none" : "1px solid #d8d0c0" }}>
            <div style={{ padding: "clamp(12px, 3vw, 20px)" }}>
              {!selectedTable
                ? <div style={{ textAlign: "center", padding: "40px 16px", color: "#9a8e7e" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🪑</div>
                    <p style={{ fontStyle: "italic", fontSize: "clamp(12px, 3vw, 14px)" }}>Bir masa seçin · Select a table</p>
                  </div>
                : selectedTableData?.status === "free"
                ? <div style={{ background: "#fff", border: "1px solid #d8d0c0", borderRadius: 8, padding: "clamp(20px, 5vh, 28px)", textAlign: "center" }}>
                    <div style={{ fontSize: "clamp(18px, 5vw, 22px)", color: "#8b6914", marginBottom: 4 }}>Masa {selectedTable}</div>
                    <p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#9a8e7e", fontStyle: "italic", marginBottom: 16 }}>Misafir sayısı</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                      <input type="number" min={1} max={30} value={guestInput} onChange={e => setGuestInput(e.target.value)} style={{ width: "clamp(70px, 20vw, 80px)" }} />
                      <button className="btn primary" onClick={() => openTable(selectedTable)} style={{ fontSize: "clamp(12px, 3vw, 13px)" }}>Masayı Aç</button>
                    </div>
                  </div>
                : <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: "clamp(16px, 5vw, 20px)", color: "#8b6914", fontWeight: 500 }}>Masa {selectedTable}</div>
                        <div style={{ fontSize: "clamp(11px, 2vw, 12px)", color: "#9a8e7e", fontFamily: "'DM Mono',monospace" }}>{selectedTableData?.guests} misafir</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button className="btn warn sm" onClick={() => requestBill(selectedTable)} style={{ fontSize: "clamp(11px, 2vw, 12px)" }}>Hesap</button>
                        <button className="btn danger sm" onClick={() => closeTable(selectedTable)} style={{ fontSize: "clamp(11px, 2vw, 12px)" }}>Kapat</button>
                      </div>
                    </div>

                    <div style={{ background: "#fff", border: "1px solid #e8e2d8", borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
                      <div style={{ padding: "clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)", borderBottom: "1px solid #ece8df", background: "#faf8f4", display: "flex", justifyContent: "space-between" }}>
                        <span className="mono" style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#9a8e7e", letterSpacing: "0.08em" }}>SİPARİŞ</span>
                        <span className="mono" style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#9a8e7e" }}>{selectedOrders.length} kalem</span>
                      </div>
                      {selectedOrders.length === 0
                        ? <div style={{ padding: 16, textAlign: "center", color: "#9a8e7e", fontStyle: "italic", fontSize: "clamp(12px, 3vw, 13px)" }}>Henüz sipariş yok</div>
                        : selectedOrders.map(item => (
                          <div key={item.id} className="order-item">
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "clamp(12px, 3vw, 14px)" }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "clamp(13px, 3vw, 14px)" }}>{item.name}</div>
                                <div style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#9a8e7e", fontStyle: "italic" }}>{item.nameEn}</div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                <button className="qty-btn" onClick={() => updateQty(selectedTable, item.id, -1)}>−</button>
                                <span style={{ minWidth: 20, textAlign: "center", fontFamily: "'DM Mono',monospace", fontSize: "clamp(12px, 3vw, 13px)", color: "#8b6914" }}>{item.qty}</span>
                                <button className="qty-btn" onClick={() => updateQty(selectedTable, item.id, 1)}>+</button>
                              </div>
                              <button className="qty-btn" style={{ color: "#c09090" }} onClick={() => removeItem(selectedTable, item.id)}>✕</button>
                            </div>
                            <div style={{ display: "flex", gap: 4, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
                              <input
                                type="text"
                                placeholder="Not"
                                defaultValue={item.note}
                                onBlur={e => updateNote(selectedTable, item.id, e.target.value)}
                                style={{ flex: 1, fontSize: "clamp(11px, 3vw, 12px)", minWidth: 80 }}
                              />
                              {item.status === "pending" && (
                                <button className="btn green sm" onClick={() => markServed(selectedTable, item.id)} style={{ fontSize: "clamp(10px, 2vw, 11px)" }}>✓</button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    <div style={{ background: "#fff", border: "1px solid #e8e2d8", borderRadius: 8, padding: "clamp(12px, 3vw, 16px)" }}>
                      <div className="section-label">Fiyat Düzenleme</div>
                      {selectedAdj.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          {selectedAdj.map(a => (
                            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", fontSize: "clamp(11px, 2vw, 12px)" }}>
                              <span style={{ color: "#5a5040" }}>{a.label}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span className="mono" style={{ fontSize: "clamp(11px, 2vw, 12px)", color: a.amount >= 0 ? "#2a6040" : "#8b2020" }}>
                                  {a.amount >= 0 ? "+" : ""}₺{a.amount.toLocaleString()}
                                </span>
                                <span style={{ cursor: "pointer", color: "#9a8e7e", fontSize: 14 }} onClick={() => removeAdjustment(selectedTable, a.id)}>✕</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                        <input type="text" placeholder="Açıklama" value={adjLabel} onChange={e => setAdjLabel(e.target.value)} style={{ flex: 1, minWidth: 150, fontSize: "clamp(12px, 3vw, 13px)" }} />
                        <input type="number" placeholder="₺" value={adjAmount} onChange={e => setAdjAmount(e.target.value)} style={{ width: "clamp(60px, 20vw, 100px)", flexShrink: 0 }} />
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
                        <span className="mono" style={{ fontSize: "clamp(9px, 2vw, 10px)", color: "#9a8e7e" }}>Hızlı:</span>
                        {QUICK_ADJ.map(v => (
                          <span key={v} className="adj-chip" onClick={() => quickAdj(selectedTable, v)} style={{ fontSize: "clamp(10px, 2vw, 11px)" }}>{v > 0 ? "+" : ""}₺{v}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <button className="btn green sm" onClick={() => applyAdj(selectedTable, 1)} style={{ fontSize: "clamp(10px, 2vw, 11px)" }}>+ Ekle</button>
                        <button className="btn warn sm" onClick={() => applyAdj(selectedTable, -1)} style={{ fontSize: "clamp(10px, 2vw, 11px)" }}>− İndir</button>
                      </div>
                      <div style={{ height: 1, background: "#e8e2d8", margin: "10px 0" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: "clamp(11px, 2vw, 12px)" }}>
                        <span className="mono" style={{ color: "#9a8e7e" }}>Ara Toplam</span>
                        <span className="mono" style={{ color: "#5a5040" }}>₺{subtotal.toLocaleString()}</span>
                      </div>
                      {adjTotal !== 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: "clamp(11px, 2vw, 12px)" }}>
                          <span className="mono" style={{ color: "#9a8e7e" }}>Düzenleme</span>
                          <span className="mono" style={{ color: adjTotal >= 0 ? "#2a6040" : "#8b2020" }}>
                            {adjTotal >= 0 ? "+" : ""}₺{adjTotal.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid #e8e2d8", marginTop: 8, paddingTop: 8 }}>
                        <span className="mono" style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#1a1710", fontWeight: 500 }}>TOPLAM</span>
                        <div style={{ textAlign: "right" }}>
                          <div className="mono" style={{ fontSize: "clamp(18px, 5vw, 22px)", color: "#8b6914" }}>₺{total.toLocaleString()}</div>
                          <div className="mono" style={{ fontSize: "clamp(11px, 2vw, 13px)", color: "#9a8e7e" }}>€{(total / LIRA_TO_EURO).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </>
              }
            </div>
          </div>

          {/* Right: Menu panel */}
          <div style={{ width: window.innerWidth < 1024 ? "100%" : 320, minWidth: window.innerWidth < 1024 ? "auto" : 280, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden", borderTop: window.innerWidth < 1024 ? "1px solid #d8d0c0" : "none" }}>
            <div style={{ padding: "clamp(10px, 2vw, 14px) clamp(12px, 3vw, 16px)", borderBottom: "1px solid #e8e2d8", background: "#faf8f4", flexShrink: 0 }}>
              <div className="section-label" style={{ marginBottom: 8 }}>Menü</div>
              <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
                {CATEGORIES.map(c => (
                  <button key={c} className={`cat-btn${categoryFilter === c ? " active" : ""}`} onClick={() => setCategoryFilter(c)} style={{ fontSize: "clamp(10px, 2vw, 11px)", padding: "4px 8px" }}>{c.split(" /")[0]}</button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {Object.entries(menuByCat).map(([cat, items]) => (
                <div key={cat}>
                  <div style={{ padding: "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px) clamp(2px, 1vw, 4px)", fontSize: "clamp(8px, 2vw, 9px)", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e7e", fontFamily: "'DM Mono',monospace", background: "#f3f0ea", borderTop: "1px solid #e8e2d8", borderBottom: "1px solid #e8e2d8" }}>{cat}</div>
                  {items.map(item => (
                    <div key={item.id} className="menu-row" onClick={() => {
                      if (selectedTable && selectedTableData?.status !== "free") { addItem(selectedTable, item); }
                      else { showToast("Önce bir masa seçin"); }
                    }} style={{ padding: "clamp(8px, 2vw, 9px) clamp(12px, 3vw, 16px)" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "clamp(12px, 3vw, 14px)" }}>{item.name}</div>
                        <div style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#9a8e7e", fontStyle: "italic", marginTop: 1 }}>{item.nameEn}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                        {item.price
                          ? <><div className="mono" style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#8b6914" }}>₺{item.price.toLocaleString()}</div>
                              <div className="mono" style={{ fontSize: "clamp(9px, 2vw, 10px)", color: "#9a8e7e" }}>€{(item.price / LIRA_TO_EURO).toFixed(1)}</div></>
                          : <span className="mono" style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#9a8e7e" }}>Sor</span>}
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
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(12px, 3vw, 20px)" }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Mutfak Görünümü · Kitchen View</div>
          {Object.keys(orders).filter(tid => (orders[tid] || []).length > 0).length === 0
            ? <div style={{ textAlign: "center", padding: "40px 16px", color: "#9a8e7e" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>
                <p style={{ fontStyle: "italic", fontSize: "clamp(12px, 3vw, 14px)" }}>Aktif sipariş yok · No active orders</p>
              </div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(240px, 70vw, 280px), 1fr))", gap: "clamp(10px, 3vw, 12px)" }}>
                {Object.entries(orders).filter(([, items]) => items.length > 0).map(([tid, items]) => {
                  const table = tables.find(t => t.id === parseInt(tid));
                  const tot = getTotal(parseInt(tid));
                  return (
                    <div key={tid} style={{ background: "#fff", border: "1px solid #d8d0c0", borderRadius: 8, overflow: "hidden" }}>
                      <div style={{ padding: "clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)", borderBottom: "1px solid #ece8df", background: "#faf8f4", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <span style={{ fontSize: "clamp(14px, 4vw, 16px)", color: "#8b6914", fontWeight: 500 }}>Masa {tid}</span>
                          <span className="mono" style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#9a8e7e", marginLeft: 8 }}>{table?.guests} kişi</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="mono" style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#8b6914" }}>₺{tot.toLocaleString()}</div>
                          <div className="mono" style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#9a8e7e" }}>€{(tot / LIRA_TO_EURO).toFixed(1)}</div>
                        </div>
                      </div>
                      {items.map(item => (
                        <div key={item.id} style={{ padding: "clamp(8px, 2vw, 9px) clamp(12px, 3vw, 16px)", borderBottom: "1px solid #ece8df", display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(11px, 2vw, 13px)" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.status === "served" ? "#2a6040" : "#8b6914", flexShrink: 0, display: "inline-block" }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "clamp(12px, 3vw, 13px)" }}>{item.qty}× {item.name}</div>
                            <div style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#9a8e7e", fontStyle: "italic" }}>{item.nameEn}</div>
                            {item.note && <div className="mono" style={{ fontSize: "clamp(9px, 2vw, 10px)", color: "#9a8e7e", marginTop: 2 }}>📝 {item.note}</div>}
                          </div>
                          {item.status === "pending"
                            ? <button className="btn primary sm" onClick={() => markServed(parseInt(tid), item.id)} style={{ fontSize: "clamp(10px, 2vw, 11px)", flexShrink: 0 }}>✓</button>
                            : <span className="mono" style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#2a6040", flexShrink: 0 }}>Geldi</span>}
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