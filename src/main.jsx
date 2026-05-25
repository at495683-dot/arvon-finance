import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    amount: "",
    interest: "",
    weeks: "",
  });

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem("financeData");
    if (saved) {
      setCustomers(JSON.parse(saved));
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("financeData", JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add customer
  const addCustomer = () => {
    const P = Number(form.amount);
    const R = Number(form.interest);
    const N = Number(form.weeks);

    if (!form.name || !P || !N) return;

    const total = P + (P * R) / 100;
    const weekly = total / N;

    const newCustomer = {
      name: form.name,
      contact: form.contact,
      weeks: N,
      totalLoan: total,
      weekly: weekly,
      paid: 0,
      emiCount: 0,
      history: [],
    };

    setCustomers([...customers, newCustomer]);

    setForm({
      name: "",
      contact: "",
      amount: "",
      interest: "",
      weeks: "",
    });
  };

  // Add payment
  const addPayment = (index) => {
    const updated = [...customers];
    const c = updated[index];

    const amt = Number(c.weekly) || 0;

    c.paid += amt;
    c.emiCount += 1;

    c.history.push({
      date: new Date().toLocaleDateString(),
      amount: amt,
    });

    setCustomers(updated);
  };

  // ================= DETAIL PAGE =================
  if (selected !== null) {
    const c = customers[selected];
    const balance = (c.totalLoan || 0) - (c.paid || 0);

    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setSelected(null)}>⬅ Back</button>

        <h2>{c.name}</h2>
        <p>📞 {c.contact}</p>

        <hr />

        <h3>Loan Info</h3>
        <p>Total Loan: ₹{Number(c.totalLoan || 0)}</p>
        <p>Weekly EMI: ₹{Number(c.weekly || 0).toFixed(2)}</p>
        <p>Total EMI: {Number(c.weeks || 0)}</p>

        <hr />

        <h3>Status</h3>
        <p>Paid EMI: {Number(c.emiCount || 0)}</p>
        <p>Outstanding: ₹{Number(balance || 0).toFixed(2)}</p>
        <p>
          Status: {balance <= 0 ? "Closed" : "Active"}
        </p>

        <button onClick={() => addPayment(selected)}>
          Add Payment
        </button>

        <hr />

        <h3>Payment History</h3>
        {c.history.length === 0 && <p>No payments yet</p>}

        {c.history.map((h, i) => (
          <div key={i}>
            {h.date} → ₹{h.amount}
          </div>
        ))}
      </div>
    );
  }

  // ================= MAIN PAGE =================
  return (
    <div style={{ padding: 20 }}>
      <h1>Arvon Finance 🚀</h1>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      /><br /><br />

      <input
        name="contact"
        placeholder="Contact"
        value={form.contact}
        onChange={handleChange}
      /><br /><br />

      <input
        name="amount"
        placeholder="Loan Amount"
        value={form.amount}
        onChange={handleChange}
      /><br /><br />

      <input
        name="interest"
        placeholder="Interest %"
        value={form.interest}
        onChange={handleChange}
      /><br /><br />

      <input
        name="weeks"
        placeholder="Weeks"
        value={form.weeks}
        onChange={handleChange}
      /><br /><br />

      <button onClick={addCustomer}>Add Customer</button>

      <hr />

      <h2>Customers</h2>

      {customers.map((c, i) => (
        <div key={i}>
          <span
            onClick={() => setSelected(i)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {c.name}
          </span>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
