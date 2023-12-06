import React,{useEffect, useState} from 'react'
import '../Styles/UserPage.css'
import avatar from '../../public/profile.svg'

export default function UserDashboard() {

  
  const [user,setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [userDetails, setUserDetails] = useState(user.accountInfo);
  
  const [transactions, setTransactions] = useState([]);
  
  useEffect(()=>{
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:8080/bankStatement/transactions/${userDetails.accountNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.responseMessage}`,
        },
      });
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.statusText}`);
        }
  
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    

  fetchTransactions();
}, []);

const handleAmount=(amount, transactionType)=>{
  const handledAmount = transactionType === 'DEBIT' ? `-${amount}` : `+${amount}`;
  const amountColor = transactionType === 'DEBIT' ? 'red' : 'lime';
  return <span style={{color: amountColor}}>{handledAmount}</span>
}

  

  return (
    <div className='home'>
    <div className='userpage'>
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
          <img src={avatar} alt="profile" className='dp'/>
        </div>
      </div>
      <div>
        <div className='table'>
      <table className='transaction-table'>
          <thead>
            <tr>
              <th>Transactions</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td><span>{transaction.receiver}</span><br/><p style={{color: "grey"}}>{transaction.modifiedAt}</p></td>
                <td>{handleAmount(transaction.amount, transaction.transactionType)}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  )
}
