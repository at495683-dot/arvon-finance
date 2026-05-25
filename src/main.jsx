import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [months, setMonths] = useState("");
  const [emi, setEmi] = useState(null);
  const [customers, setCustomers] = useState([]);

  const calculateEMI = () => {
    const P = parseFloat(amount);
    const R = parseFloat(interest) / 12 / 100;
    const N = parseFloat(months);

    if (!P || !R || !N) return;

    const emiValue =
      (P * R * Math.pow(1 + R, N)) /
      (Math.pow(1 + R, N) - 1);

    setEmi(emiValue.toFixed(2));
  };

  const saveCustomer = () => {
    if (!name || !emi) return;

    const newCustomer = {
      name,
      amount: parseFloat(amount),
      emi: parseFloat(emi),
      paid: 0
    };

    setCustomers([...customers, newCustomer]);

    setName("");
    setAmount("");
    setInterest("");
    setMonths("");
    setEmi(null);
  };

  const deleteCustomer = (index) => {
    const updated = customers.filter((_, i) => i !== index);
    setCustomers(updated);
  };

  const addPayment = (index) => {
    const updated = [...customers];
    updated[index].paid += updated[index].emi;
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
        placeholder="Interest (%)"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
      /><br /><br />

      <input
        placeholder="Months"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
      /><br /><br />

      <button onClick={calculateEMI}>Calculate EMI</button>

      {emi && (
        <>
          <h2>EMI: ₹{emi}</h2>
          <button onClick={saveCustomer}>Save</button>
        </>
      )}

      <hr />

      <h2>Customers</h2>

      {customers.map((c, i) => {
        const balance = c.amount - c.paid;

        return (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{c.name}</b> <br />
            Loan: ₹{c.amount} <br />
            EMI: ₹{c.emi} <br />
            Paid: ₹{c.paid} <br />
            Balance: ₹{balance} <br />

            <button onClick={() => addPayment(i)}>+ EMI Paid</button>
            <button onClick={() => deleteCustomer(i)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
