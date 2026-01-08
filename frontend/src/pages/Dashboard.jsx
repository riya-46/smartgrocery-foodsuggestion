import { useEffect, useMemo, useState } from "react";  
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

/*  Charts  */
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const MODES = ["Family", "Party", "Festival", "Guest"];

const MODE_COLORS = {
  Family: "#eab83aff",    
  Party: "#16a34a",     
  Festival: "#c576d8ff",  
  Guest: "#dc2626",     
};


const emptyForm = {
  itemName: "",
  quantity: 1,
  unit: "kg",
  price: "",
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
  },
};

const getMonthKey = (date) => date.slice(0, 7);

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("sg_user"));

  const [allItems, setAllItems] = useState([]);
  const [mode, setMode] = useState("Family");
  const [showAllItems, setShowAllItems] = useState(false);

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  /*  CHART STATES  */
  const [pieMode, setPieMode] = useState("daily");      // default daily
  const [lineMode, setLineMode] = useState("monthly"); // default monthly

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  /*  Auth Guard  */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  /*  Fetch Items  */
  const fetchItems = async () => {
    if (!user?.email) return;
    const res = await api.get(`/tx/get/${user.email}`);
    setAllItems(res.data || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /*  Filters  */
  const filteredDayItems = useMemo(() => {
    return allItems
      .filter((i) => i.date === selectedDate && i.mode === mode)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [allItems, selectedDate, mode]);

  const visibleItems = showAllItems
    ? filteredDayItems
    : filteredDayItems.slice(0, 5);

  /*  Totals  */
  const monthItems = useMemo(
    () => allItems.filter((i) => getMonthKey(i.date) === month),
    [allItems, month]
  );

  const monthlyTotal = useMemo(
    () => monthItems.reduce((s, i) => s + Number(i.price || 0), 0),
    [monthItems]
  );

  /*  PIE DATA  */
  const pieData = useMemo(() => {
    const totals = { Family: 0, Party: 0, Festival: 0, Guest: 0 };
    const source = pieMode === "daily" ? allItems.filter((i) => i.date === selectedDate)
      : monthItems;

    source.forEach((i) => {
      totals[i.mode] += Number(i.price || 0);
    });

    return {
      labels: MODES,
      datasets: [
        {
          data: MODES.map((m) => totals[m]),
          backgroundColor: ["#eab83aff", "#16a34a", "#c576d8ff", "#dc2626"],
        },
      ],
    };
  }, [pieMode, allItems, selectedDate, monthItems]);

  /*  LINE DATA  */
  const monthlyLineData = useMemo(() => {
    const map = {};
    allItems.forEach((i) => {
      const m = getMonthKey(i.date);
      map[m] = (map[m] || 0) + Number(i.price || 0);
    });

    const labels = Object.keys(map).sort();
    return {
      labels,
      datasets: [
        {
          label: "Monthly Expense (₹)",
          data: labels.map((l) => map[l]),
          borderColor: "#2563eb",
          tension: 0.4,
        },
      ],
    };
  }, [allItems]);

  const dailyLineData = useMemo(() => {
    const map = {};
    monthItems.forEach((i) => {
      const d = i.date.slice(8, 10);
      map[d] = (map[d] || 0) + Number(i.price || 0);
    });

    const labels = Object.keys(map).sort();
    return {
      labels,
      datasets: [
        {
          label: "Daily Expense (₹)",
          data: labels.map((d) => map[d]),
          borderColor: "#16a34a",
          tension: 0.4,
        },
      ],
    };
  }, [monthItems]);

  /*  ADD / UPDATE  */
  const saveItem = async () => {
    if (!form.itemName || !form.price) return;

    if (editingId) {
      await api.put(`/tx/update/${editingId}`, {
        ...form,
        date: selectedDate,
        mode,
      });
    } else {
      await api.post("/tx/add", {
        userEmail: user.email,
        ...form,
        date: selectedDate,
        mode,
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await api.delete(`/tx/delete/${id}`);
    fetchItems();
  };

  const logout = () => {
    localStorage.removeItem("sg_user");
    navigate("/login");
  };

  /*  CALENDAR  */
  const [y, m] = month.split("-");
  const firstDay = new Date(+y, +m - 1, 1).getDay();
  const totalDays = new Date(+y, +m, 0).getDate();

  return (
    <>
      {/*  TOP BAR  */}
      <div className="topbar" style={{ display: "flex", alignItems: "center" }}>
  
  {/* LEFT : Modes */}
  <div className="menu" style={{ display: "flex", gap: 8 }}>
    {MODES.map((m) => (
      <button
        key={m}
        className="mode-btn"
        style={{
          backgroundColor: mode === m ? MODE_COLORS[m] : "#f3f4f6",
          color: mode === m ? "#fff" : "#111",
        }}
        onClick={() => setMode(m)}
      >
        {m}
      </button>
    ))}
  </div>

  {/* CENTER : Food for Health */}
  <div style={{ flex: 1, textAlign: "center" }}>
    <button
      className="mode-btn"
      style={{
        backgroundColor: "#16e662ff",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: 20,
      }}
      onClick={() => navigate("/food-for-health")}
    >
      🥗 Food for Health
    </button>
  </div>

  {/* RIGHT : Logout */}
  <button
    className="logout-btn"
    onClick={() => setShowLogoutConfirm(true)}
  >
    Logout
  </button>

</div>


      <div className="container">

        {/*  ADD ITEM  */}
        <div className="card">
          <h3>Add Item ({mode})</h3>
          <div className="grid-4">
            <input placeholder="Item name" value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })} />
            <input type="number" value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: +e.target.value })} />
            <select value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}>
              <option>kg</option><option>g</option><option>L</option>
              <option>mL</option><option>packet</option>
            </select>
            <input type="number" placeholder="₹ Price" value={form.price}
              onChange={(e) => setForm({ ...form, price: +e.target.value })} />
          </div>
          <button className="primary" onClick={saveItem} style={{ marginTop: 10 }}>
  {editingId ? "Update Item" : "Add Item"}
</button>

        </div>

        {/*  ITEM LIST + CALENDAR  */}
        <div className="split-grid">

          {/* ITEM LIST */}
<div className="card fixed-block">
  <h3>Items ({selectedDate})</h3>

  <div className={showAllItems ? "scroll-area" : ""}>
    {visibleItems.length === 0 && (
      <p className="muted">No items added</p>
    )}

    {visibleItems.map((i) => (
      <div key={i._id} className="item-row">
        {/* ITEM DETAILS */}
        <div>
          <strong>{i.itemName}</strong>
          <div className="muted">
            {i.quantity} {i.unit} — ₹{i.price}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="secondary"
            onClick={() => {
              setEditingId(i._id);
              setForm({
                itemName: i.itemName,
                quantity: i.quantity,
                unit: i.unit,
                price: i.price,
              });
            }}
          >
            Edit
          </button>

          <button
            className="danger"
            onClick={() => deleteItem(i._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

  {filteredDayItems.length > 5 && (
    <button
      className="secondary"
      style={{ marginTop: 8 }}
      onClick={() => setShowAllItems(!showAllItems)}
    >
      {showAllItems ? "Show Less" : "Show More"}
    </button>
  )}
</div>


          {/* CALENDAR */}
          <div className="card fixed-block">
            <div className="calendar-header">
              <h3>
                {new Date(month + "-01").toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <input type="month" value={month}
                onChange={(e) => setMonth(e.target.value)} />
            </div>

            <div className="calendar-grid">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="calendar-weekday">{d}</div>
              ))}

              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: totalDays }, (_, i) => {
                const day = String(i + 1).padStart(2, "0");
                const fullDate = `${month}-${day}`;
                const dayTotal = allItems
                  .filter((it) => it.date === fullDate)
                  .reduce((s, it) => s + Number(it.price || 0), 0);

                return (
                  <div key={day}
                    className={`calendar-day ${
                      selectedDate === fullDate ? "active-day" : ""
                    }`}
                    onClick={() => setSelectedDate(fullDate)}
                  >
                    <div className="day-number">{day}</div>
                    {dayTotal > 0 && (
                      <div className="calendar-expense">₹{dayTotal}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div> {/* split-grid CLOSED */}

        {/* ================= CHARTS ================= */}
<div className="charts-grid">

  {/* ===== PIE CHART ===== */}
  <div className="card chart-box">
    <h3 style={{ textAlign: "center" }}>Mode-wise Expense</h3>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <button
        className={pieMode === "daily" ? "active" : ""}
        onClick={() => setPieMode("daily")}
      >
        Daily
      </button>

      <button
        className={pieMode === "monthly" ? "active" : ""}
        onClick={() => setPieMode("monthly")}
      >
        Monthly
      </button>
    </div>

    <div className="chart-inner">
      <Pie data={pieData} options={chartOptions} />
    </div>
  </div>

  {/* ===== LINE CHART ===== */}
  <div className="card chart-box">
    <h3 style={{ textAlign: "center" }}>Expense Trend</h3>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <button
        className={lineMode === "monthly" ? "active" : ""}
        onClick={() => setLineMode("monthly")}
      >
        Monthly
      </button>

      <button
        className={lineMode === "daily" ? "active" : ""}
        onClick={() => setLineMode("daily")}
      >
        Daily
      </button>
    </div>

    <div className="chart-inner">
      {lineMode === "monthly" ? (
        <Line data={monthlyLineData} options={chartOptions} />
      ) : (
        <Line data={dailyLineData} options={chartOptions} />
      )}
    </div>
  </div>

</div>

        <div className="card total-expense-card">
          <strong>Total Monthly Expense:</strong> ₹ {monthlyTotal}
        </div>

      </div>
      {showLogoutConfirm && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Confirm Logout</h3>
      <p>Are you sure you want to log out?</p>

      <button
           onClick={() => navigate("/food-for-health")}
            style={{
                      marginRight: 12,
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: "1px solid #4CAF50",
                      background: "#E8F5E9",
                      cursor: "pointer"
                   }}
                  >
                🥗 Food for Health
        </button>

      <div className="modal-actions">
        <button className="danger" onClick={logout}>
          Yes
        </button>
        <button
          className="secondary"
          onClick={() => setShowLogoutConfirm(false)}
        >
          No
        </button>
        </div>
        </div>
        </div>
      )}

    </>
  );
}
