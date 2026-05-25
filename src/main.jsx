import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    cityNumber: "",
    name: "",
    contact: "",
    dob: "",
    adhar: "",
    pan: "",
    husbandName: "",
    husbandDob: "",
    husbandContact: "",
    childName: "",
    childContact: "",
    childDob: "",
    currentAddress: "",
    permanentAddress: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveCustomer = () => {
    if (!form.name || !form.contact) return;

    setCustomers([...customers, form]);

    setForm({
      cityNumber: "",
      name: "",
      contact: "",
      dob: "",
      adhar: "",
      pan: "",
      husbandName: "",
      husbandDob: "",
      husbandContact: "",
      childName: "",
      childContact: "",
      childDob: "",
      currentAddress: "",
      permanentAddress: "",
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Arvon Finance - Customer Add</h1>

      <div style={{ background: "#f2f2f2", padding: 20, borderRadius: 10 }}>

        <h3>Basic Details</h3>

        <input name="cityNumber" placeholder="City Number" value={form.cityNumber} onChange={handleChange} /><br /><br />
        <input name="name" placeholder="Customer Name" value={form.name} onChange={handleChange} /><br /><br />
        <input name="contact" placeholder="Customer Contact" value={form.contact} onChange={handleChange} /><br /><br />
        <input name="dob" placeholder="Customer DOB" value={form.dob} onChange={handleChange} /><br /><br />
        <input name="adhar" placeholder="Aadhar Number" value={form.adhar} onChange={handleChange} /><br /><br />
        <input name="pan" placeholder="PAN Number" value={form.pan} onChange={handleChange} /><br /><br />

        <h3>Husband Details</h3>

        <input name="husbandName" placeholder="Husband Name" value={form.husbandName} onChange={handleChange} /><br /><br />
        <input name="husbandDob" placeholder="Husband DOB" value={form.husbandDob} onChange={handleChange} /><br /><br />
        <input name="husbandContact" placeholder="Husband Contact" value={form.husbandContact} onChange={handleChange} /><br /><br />

        <h3>Child Details (Optional)</h3>

        <input name="childName" placeholder="Child Name" value={form.childName} onChange={handleChange} /><br /><br />
        <input name="childContact" placeholder="Child Contact" value={form.childContact} onChange={handleChange} /><br /><br />
        <input name="childDob" placeholder="Child DOB" value={form.childDob} onChange={handleChange} /><br /><br />

        <h3>Address</h3>

        <textarea name="currentAddress" placeholder="Current Address" value={form.currentAddress} onChange={handleChange} /><br /><br />
        <textarea name="permanentAddress" placeholder="Permanent Address" value={form.permanentAddress} onChange={handleChange} /><br /><br />

        <button onClick={saveCustomer} style={{ padding: 10, background: "black", color: "white" }}>
          Add Customer
        </button>
      </div>

      <hr />

      <h2>Customer List</h2>

      {customers.map((c, i) => (
        <div key={i} style={{ marginBottom: 15, borderBottom: "1px solid #ccc" }}>
          <b>{c.name}</b> ({c.cityNumber}) <br />
          Contact: {c.contact} <br />
          Address: {c.currentAddress}
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
