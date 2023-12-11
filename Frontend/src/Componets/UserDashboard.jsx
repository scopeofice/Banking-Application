import React, { useEffect, useState } from "react";
import "../Styles/UserPage.css";
import { Link } from "react-router-dom";
import avatar from "../../public/profile.svg";
import MoneyTransferForm from "./MoneyTransferForm";
import axios from "axios";

export default function UserDashboard() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [userDetails, setUserDetails] = useState(user.accountInfo);
  const [showBalance, setShowBalance] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [moneyTransfer, setMoneyTransfer] = useState(false);
  const [showTransactions, setShowTransactions] = useState(true);
  const [balance, setBalance] = useState(0.0);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/bankStatement/transactions/${userDetails.accountNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.responseMessage}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  const fetchBalance = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/balanceEnquiry/${userDetails.accountNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.responseMessage}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setBalance(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, [showTransactions, showBalance]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(transactions.length / entriesPerPage);
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  

  const sliceTransactions = () => {
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    return transactions.slice(indexOfFirstEntry, indexOfLastEntry);
  };

  const handleAmount = (amount, transactionType) => {
    const handledAmount =
      transactionType === "DEBIT" ? `-${amount}` : `+${amount}`;
    const amountColor = transactionType === "DEBIT" ? "red" : "lime";
    return <span style={{ color: amountColor }}>{handledAmount}</span>;
  };

  const handleTransaction = () => {
    setMoneyTransfer(false);
    setShowBalance(false);
    setShowTransactions(true);
    fetchTransactions();
  };
  const handleBalance = () => {
    setShowBalance(showBalance ? false : true);
    setMoneyTransfer(false);
    setShowTransactions(false);
    fetchBalance();
  };

  const handleTransfer = () => {
    setShowTransactions(false);
    setMoneyTransfer(true);
    setShowBalance(false);
  };

  return (
    <div className="home">
      <div className="userpage">
        <div className="userpage-profile">
          <div>
            <h2>Welcome</h2>
            <p>
              <strong>Name:</strong> {userDetails.accountName}
            </p>
            <p>
              <strong>Account Number:</strong> {userDetails.accountNumber}
            </p>
            <p>
              <strong>Address:</strong> {userDetails.address}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {userDetails.phoneNumber}
            </p>
            <p>
              <strong>Account Type:</strong> {userDetails.accountType}
            </p>
          </div>
          <div>
            <img src={avatar} alt="profile" className="dp" />
          </div>
        </div>
        <div>
          <div className="features">
            <button className="btn3" onClick={handleTransaction}>
              Transaction History
            </button>
            {showBalance ? (
              <button className="btn1" onClick={handleBalance}>
                Hide Balance
              </button>
            ) : (
              <button className="btn1" onClick={handleBalance}>
                Check Balance
              </button>
            )}
            <button className="btn2" onClick={handleTransfer}>
              Send Money
            </button>
          </div>
          {showBalance && (
            <div>
              <div className="table">
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Account Number</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{user.accountInfo.accountNumber}</td>
                      <td>
                        <span style={{ color: "lime" }}>{balance}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {moneyTransfer && <MoneyTransferForm data={user} />}
          {showTransactions && (<>
            <div className="table">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Transactions</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {sliceTransactions().map((transaction) => (
                    <tr key={transaction.transactionId}>
                      <td>
                        <span>{transaction.receiver}</span>
                        <br />
                        <p style={{ color: "grey" }}>
                          {transaction.modifiedAt}
                        </p>
                      </td>
                      <td>
                        {handleAmount(
                          transaction.amount,
                          transaction.transactionType
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        <div className="btno">
          <button onClick={handlePreviousPage}>Previous</button>
          <button onClick={handleNextPage}>Next</button>
        </div>
        </>
          )}
        </div>
      </div>
    </div>
  );
}
