import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [months, setMonths] = useState("");
  const [emi, setEmi] = useState(null);

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

  return (
    <div style={{ padding: 20 }}>
      <h1>Arvon Finance 🚀</h1>

      <input
        placeholder="Loan Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /><br /><br />

      <input
        placeholder="Interest Rate (%)"
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
        <h2>Monthly EMI: ₹{emi}</h2>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
