import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [weeks, setWeeks] = useState("");
  const [emi, setEmi] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 LOAD DATA (page open pe)
  useEffect(() => {
    const saved = localStorage.getItem("customers");
    if (saved) {
      setCustomers(JSON.parse(saved));
    }
  }, []);

  // 🔥 SAVE DATA (jab change ho)
  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const calculateEMI = () => {
    const P = parseFloat(amount);
    const R = parseFloat(interest) / 100;
    const N = parseFloat(weeks);

    if (!P || !N) return;

    const total = P + (P * R);
    const weekly = total / N;

    setEmi(weekly.toFixed(2));
  };

  const saveCustomer = () => {
    if (!name || !emi) return;

    const newCustomer = {
      name,
      amount: parseFloat(amount),
      weekly: parseFloat(emi),
      paid: 0,
    };

    setCustomers([...customers, newCustomer]);

    setName("");
    setAmount("");
    setInterest("");
    setWeeks("");
    setEmi(null);
  };

  const addPayment = (index) => {
    const updated = [...customers];
    updated[index].paid += updated[index].weekly;
    setCustomers(updated);
  };

  const deleteCustomer = (index) => {
    const updated = customers.filter((_, i) => i !== index);
    setCustomers(updated);
  };

  const totalGiven = customers.reduce((sum, c) => sum + c.amount, 0);
  const totalCollected = customers.reduce((sum, c) => sum + c.paid, 0);
  const profit = totalCollected - totalGiven;

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Arvon Finance 🚀</h1>

      <input
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Loan Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /><br /><br />

      <input
        placeholder="Interest (%)"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
      /><br /><br />

      <input
        placeholder="Weeks"
        value={weeks}
        onChange={(e) => setWeeks(e.target.value)}
      /><br /><br />

      <button onClick={calculateEMI}>Calculate Weekly</button>

      {emi && (
        <>
          <h2>Weekly Payment: ₹{emi}</h2>
          <button onClick={saveCustomer}>Save</button>
        </>
      )}

      <hr />

      <h2>Summary</h2>
      <p>Total Given: ₹{totalGiven}</p>
      <p>Total Collected: ₹{totalCollected}</p>
      <p>Profit: ₹{profit}</p>

      <hr />

      <input
        placeholder="Search Customer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      /><br /><br />

      <h2>Customers</h2>

      {filteredCustomers.map((c, i) => {
        const balance = c.amount - c.paid;

        return (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{c.name}</b> <br />
            Loan: ₹{c.amount} <br />
            Weekly: ₹{c.weekly} <br />
            Paid: ₹{c.paid} <br />
            Balance: ₹{balance} <br />

            <button onClick={() => addPayment(i)}>+ Paid</button>
            <button onClick={() => deleteCustomer(i)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
