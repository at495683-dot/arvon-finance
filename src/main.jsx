import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null); // 👈 page switch

  const [form, setForm] = useState({
    name: "",
    contact: "",
    amount: "",
    interest: "",
    weeks: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("financeData");
    if (saved) setCustomers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("financeData", JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCustomer = () => {
    const P = parseFloat(form.amount);
    const R = parseFloat(form.interest);
    const N = parseFloat(form.weeks);

    if (!form.name || !P || !N) return;

    const total = P + (P * R) / 100;
    const weekly = total / N;

    const newCustomer = {
      ...form,
      totalLoan: total,
      weekly,
      paid: 0,
      emiCount: 0,
      history: []
    };

    setCustomers([...customers, newCustomer]);
    setForm({ name: "", contact: "", amount: "", interest: "", weeks: "" });
  };

  const addPayment = (index) => {
    const updated = [...customers];
    const c = updated[index];

    c.paid += c.weekly;
    c.emiCount += 1;

    c.history.push({
      date: new Date().toLocaleDateString(),
      amount: c.weekly
    });

    setCustomers(updated);
  };

  // =======================
  // 👉 CUSTOMER DETAIL PAGE
  // =======================
  if (selected !== null) {
    const c = customers[selected];
    const balance = c.totalLoan - c.paid;

    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setSelected(null)}>⬅ Back</button>

        <h2>{c.name}</h2>
        <p>📞 {c.contact}</p>

        <hr />

        <h3>Loan Info</h3>
        <p>Total Loan: ₹{c.totalLoan}</p>
        <p>Weekly EMI: ₹{c.weekly ? c.weekly.toFixed(2) : 0}</p>
        <p>Total EMI: {c.weeks || 0}</p>

        <hr />

        <h3>Status</h3>
        <p>Paid EMI: {c.emiCount}</p>
        <p>Outstanding: ₹{balance ? balance.toFixed(2) : 0}</p>
        <p>
          Status:{" "}
          {balance <= 0 ? "✅ Closed" : "🟢 Active"}
        </p>

        <button onClick={() => addPayment(selected)}>
          ➕ Add Payment
        </button>

        <hr />

        <h3>Payment History</h3>
        {c.history.map((h, i) => (
          <div key={i}>
            {h.date} → ₹{h.amount}
          </div>
        ))}
      </div>
    );
  }

  // =======================
  // 👉 MAIN PAGE
  // =======================
  return (
    <div style={{ padding: 20 }}>
      <h1>Arvon Finance 🚀</h1>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br /><br />
      <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} /><br /><br />
      <input name="amount" placeholder="Loan Amount" value={form.amount} onChange={handleChange} /><br /><br />
      <input name="interest" placeholder="Interest %" value={form.interest} onChange={handleChange} /><br /><br />
      <input name="weeks" placeholder="Weeks" value={form.weeks} onChange={handleChange} /><br /><br />

      <button onClick={addCustomer}>Add Customer</button>

      <hr />

      <h2>Customers</h2>

      {customers.map((c, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <b onClick={() => setSelected(i)} style={{ cursor: "pointer" }}>
            {c.name}
          </b>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
