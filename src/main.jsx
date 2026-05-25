import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const [stamp, setStamp] = useState("");
  const [fileCharge, setFileCharge] = useState("");
  const [insurance, setInsurance] = useState("");

  const [customers, setCustomers] = useState([]);

  // Calculate total loan
  const calculateTotal = () => {
    return (
      parseFloat(amount || 0) +
      parseFloat(stamp || 0) +
      parseFloat(fileCharge || 0) +
      parseFloat(insurance || 0)
    );
  };

  // Save customer
  const saveCustomer = () => {
    const total = calculateTotal();

    if (!name || !total) return;

    const newCustomer = {
      name,
      amount: parseFloat(amount),
      stamp: parseFloat(stamp || 0),
      fileCharge: parseFloat(fileCharge || 0),
      insurance: parseFloat(insurance || 0),
      totalLoan: total,

      // 👇 EMI slabs
      emiPlan: [
        { from: 1, to: 15, amount: 500 },
        { from: 16, to: 24, amount: 400 }
      ],

      paid: 0
    };

    setCustomers([...customers, newCustomer]);

    setName("");
    setAmount("");
    setStamp("");
    setFileCharge("");
    setInsurance("");
  };

  // Add payment
  const addPayment = (index) => {
    const updated = [...customers];

    // simple: always add current slab EMI (for demo)
    updated[index].paid += 500;

    setCustomers(updated);
  };

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
        placeholder="Stamp Duty"
        value={stamp}
        onChange={(e) => setStamp(e.target.value)}
      /><br /><br />

      <input
        placeholder="File Charge"
        value={fileCharge}
        onChange={(e) => setFileCharge(e.target.value)}
      /><br /><br />

      <input
        placeholder="Insurance"
        value={insurance}
        onChange={(e) => setInsurance(e.target.value)}
      /><br /><br />

      <button onClick={saveCustomer}>Add Customer</button>

      <hr />

      <h2>Customers</h2>

      {customers.map((c, i) => {
        const balance = c.totalLoan - c.paid;

        return (
          <div key={i} style={{ marginBottom: 15 }}>
            <b>{c.name}</b> <br />

            Loan: ₹{c.amount} <br />
            Charges: ₹{c.stamp + c.fileCharge + c.insurance} <br />
            Total Loan: ₹{c.totalLoan} <br />

            <b>EMI Plan:</b><br />
            {c.emiPlan.map((e, idx) => (
              <div key={idx}>
                {e.from}–{e.to} → ₹{e.amount}
              </div>
            ))}

            <br />
            Paid: ₹{c.paid} <br />
            Balance: ₹{balance} <br />

            <button onClick={() => addPayment(i)}>+ Payment</button>
          </div>
        );
      })}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
