import axios from "axios";
import React, { useState } from "react";
import transfer from "../../public/bank-account.svg";
import { Link } from "react-router-dom";

export default function MoneyTransferForm(props) {
  const user = props.data;
  const [transferData, setTransferData] = useState({
    sourceAccountNumber: user.accountInfo.accountNumber,
    destinationAccountNumber: "",
    amount: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [success,setSuccess] = useState("");

  const handleChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleReturn = () => {
    setTransferSuccess(false);
  };
  const handleSubmit = async () => {
   
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/user/transfer",
        transferData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.responseMessage}`,
          },
        }
      );
      if (response.data.responseCode === "008") {
        setTransferSuccess(true);
        setSuccess("Successfull")
      }
    } catch (error) {
      // console.log(error.message);
      setLoading(false)
      setTransferSuccess(true)
      setSuccess("Unsuccessfull")
    } finally {
      setLoading(false);
      setTransferData({
        destinationAccountNumber: "",
        amount: "",
        password: "",
      });
    }
  };
  return (
    <>
    {loading && <div className="loading"> <p>Sending...</p></div>}
    {transferSuccess && !loading && (
      <div className="loading">
        <p>Transfer {success}! <Link onClick={handleReturn}>Return</Link></p>
        
      </div>
    )}
    <div className="transfer">
      <form className="form">
        <label>
          Account Number :{" "}
          <input
            type="text"
            name="destinationAccountNumber"
            value={transferData.destinationAccountNumber}
            onChange={handleChange}
            disabled={loading || transferSuccess}
            placeholder="Account number required"
          />
        </label>
        <label>
          Amount :
          <input
            type="text"
            name="amount"
            value={transferData.amount}
            onChange={handleChange}
            disabled={loading || transferSuccess}
            placeholder="Amount required"
          />
        </label>
        <label>
          Password :
          <input
            type="password"
            name="password"
            value={transferData.password}
            onChange={handleChange}
            disabled={loading || transferSuccess}
            placeholder="Password required"
          />
        </label>
        <button
          className="btn"
          style={{ border: "2px solid green" }}
          type="button"
          onClick={handleSubmit}
          disabled={loading || transferSuccess}
        >
          Pay
        </button>
      </form>
      <img className="bankimg" src={transfer} alt="bank" />
    </div>
    </>
  );
}
