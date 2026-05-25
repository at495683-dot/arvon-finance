import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    cityNumber: "",
    name: "",
    contact: "",
    amount: "",
    interest: "",
    weeks: "",
    stamp: "",
    fileCharge: "",
    insurance: "",
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

  const generateEMI = (amount, interest, weeks) => {
    const total = amount + (amount * interest) / 100;
    return total / weeks;
  };

  const addCustomer = () => {
    const P = parseFloat(form.amount);
    const R = parseFloat(form.interest);
    const N = parseFloat(form.weeks);

    if (!form.name || !P || !N) return;

    const charges =
      parseFloat(form.stamp || 0) +
      parseFloat(form.fileCharge || 0) +
      parseFloat(form.insurance || 0);

    const totalLoan = P + charges;
    const weekly = generateEMI(totalLoan, R, N);

    const newCustomer = {
      ...form,
      totalLoan,
      weekly,
      paid: 0,
    };

    setCustomers([...customers, newCustomer]);

    setForm({
      cityNumber: "",
      name: "",
      contact: "",
      amount: "",
      interest: "",
      weeks: "",
      stamp: "",
      fileCharge: "",
      insurance: "",
    });
  };

  const addPayment = (i) => {
    const updated = [...customers];
    updated[i].paid += updated[i].weekly;
    setCustomers(updated);
  };

  const deleteCustomer = (i) => {
    setCustomers(customers.filter((_, idx) => idx !== i));
  };

  const totalGiven = customers.reduce((s, c) => s + c.totalLoan, 0);
  const totalCollected = customers.reduce((s, c) => s + c.paid, 0);
  const profit = totalCollected - totalGiven;

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#f5f7fb" }}>
      
      <h1 style={{ textAlign: "center" }}>💰 Arvon Finance Dashboard</h1>

      {/* FORM */}
      <div style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: 20
      }}>
        <h3>Add Customer</h3>

        <div style={{ display: "grid", gap: 10 }}>
          <input name="cityNumber" placeholder="City No" value={form.cityNumber} onChange={handleChange} />
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />

          <input name="amount" placeholder="Loan Amount" value={form.amount} onChange={handleChange} />
          <input name="interest" placeholder="Interest %" value={form.interest} onChange={handleChange} />
          <input name="weeks" placeholder="Weeks" value={form.weeks} onChange={handleChange} />

          <input name="stamp" placeholder="Stamp Charge" value={form.stamp} onChange={handleChange} />
          <input name="fileCharge" placeholder="File Charge" value={form.fileCharge} onChange={handleChange} />
          <input name="insurance" placeholder="Insurance" value={form.insurance} onChange={handleChange} />
        </div>

        <button onClick={addCustomer} style={{
          marginTop: 15,
          padding: 10,
          width: "100%",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 6
        }}>
          ➕ Add Customer
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={cardStyle("#2196F3")}>
          <h4>Total Given</h4>
          ₹{totalGiven}
        </div>
        <div style={cardStyle("#4CAF50")}>
          <h4>Total Collected</h4>
          ₹{totalCollected}
        </div>
        <div style={cardStyle("#f44336")}>
          <h4>Profit</h4>
          ₹{profit}
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="🔍 Search Customer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      {/* CUSTOMER CARDS */}
      {filtered.map((c, i) => {
        const balance = c.totalLoan - c.paid;

        return (
          <div key={i} style={{
            background: "white",
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <b>{c.name}</b> ({c.cityNumber}) <br />
            📞 {c.contact} <br /><br />

            💵 Loan: ₹{c.totalLoan} <br />
            📆 Weekly: ₹{c.weekly.toFixed(2)} <br />
            ✅ Paid: ₹{c.paid.toFixed(2)} <br />
            ⚠️ Balance: ₹{balance.toFixed(2)} <br /><br />

            <button onClick={() => addPayment(i)} style={btn("#4CAF50")}>
              + Payment
            </button>

            <button onClick={() => deleteCustomer(i)} style={btn("#f44336")}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

// 🎨 styles
const cardStyle = (color) => ({
  flex: 1,
  background: color,
  color: "white",
  padding: 15,
  borderRadius: 10,
  textAlign: "center"
});

const btn = (color) => ({
  padding: 8,
  marginRight: 10,
  background: color,
  color: "white",
  border: "none",
  borderRadius: 5
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
