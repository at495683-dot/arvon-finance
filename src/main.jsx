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

  // 🔥 Load data
  useEffect(() => {
    const saved = localStorage.getItem("financeData");
    if (saved) setCustomers(JSON.parse(saved));
  }, []);

  // 🔥 Save data
  useEffect(() => {
    localStorage.setItem("financeData", JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Create EMI Plan
  const generateEMI = (amount, interest, weeks) => {
    const total = amount + (amount * interest) / 100;
    const weekly = total / weeks;
    return weekly;
  };

  // ✅ Add Customer
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

  // ✅ Add Payment
  const addPayment = (i) => {
    const updated = [...customers];
    updated[i].paid += updated[i].weekly;
    setCustomers(updated);
  };

  // ✅ Delete
  const deleteCustomer = (i) => {
    setCustomers(customers.filter((_, idx) => idx !== i));
  };

  // 🔥 Summary
  const totalGiven = customers.reduce((s, c) => s + c.totalLoan, 0);
  const totalCollected = customers.reduce((s, c) => s + c.paid, 0);
  const profit = totalCollected - totalGiven;

  // 🔍 Search
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Arvon Finance System 🚀</h1>

      {/* 🔥 ADD CUSTOMER */}
      <div style={{ background: "#f2f2f2", padding: 15, borderRadius: 10 }}>
        <h3>Add Customer</h3>

        <input name="cityNumber" placeholder="City No" value={form.cityNumber} onChange={handleChange} /><br /><br />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br /><br />
        <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} /><br /><br />

        <input name="amount" placeholder="Loan Amount" value={form.amount} onChange={handleChange} /><br /><br />
        <input name="interest" placeholder="Interest %" value={form.interest} onChange={handleChange} /><br /><br />
        <input name="weeks" placeholder="Weeks" value={form.weeks} onChange={handleChange} /><br /><br />

        <input name="stamp" placeholder="Stamp Charge" value={form.stamp} onChange={handleChange} /><br /><br />
        <input name="fileCharge" placeholder="File Charge" value={form.fileCharge} onChange={handleChange} /><br /><br />
        <input name="insurance" placeholder="Insurance" value={form.insurance} onChange={handleChange} /><br /><br />

        <button onClick={addCustomer}>Add Customer</button>
      </div>

      <hr />

      {/* 🔥 SUMMARY */}
      <h2>Summary</h2>
      <p>Total Given: ₹{totalGiven}</p>
      <p>Total Collected: ₹{totalCollected}</p>
      <p>Profit: ₹{profit}</p>

      <hr />

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search Customer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      /><br /><br />

      {/* 🔥 CUSTOMER LIST */}
      <h2>Customers</h2>

      {filtered.map((c, i) => {
        const balance = c.totalLoan - c.paid;

        return (
          <div key={i} style={{ borderBottom: "1px solid #ccc", marginBottom: 10 }}>
            <b>{c.name}</b> ({c.cityNumber}) <br />
            Contact: {c.contact} <br />
            Loan: ₹{c.totalLoan} <br />
            Weekly: ₹{c.weekly.toFixed(2)} <br />
            Paid: ₹{c.paid.toFixed(2)} <br />
            Balance: ₹{balance.toFixed(2)} <br />

            <button onClick={() => addPayment(i)}>+ Payment</button>
            <button onClick={() => deleteCustomer(i)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
