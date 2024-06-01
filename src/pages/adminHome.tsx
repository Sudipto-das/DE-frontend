import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Book {
    id: string;
    title: string;
    author: string;
}

interface User {
    id: string;
    username: string;
}

interface Transaction {
    id: string;
    book: Book;
    user: User;
    type: string;
    date: string;
}

const Dashboard = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/transactions', {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                if (response.status === 200) {
                    const data = response.data.transactions;
                    setTransactions(data);
                } else {
                    throw new Error(`Error: ${response.status}`);
                }
            } catch (error:any) {
                setError(error.message);
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Transactions List</h1>
            {error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="w-1/4 py-2 px-4">Book Title</th>
                                <th className="w-1/4 py-2 px-4">Author</th>
                                <th className="w-1/4 py-2 px-4">User</th>
                                <th className="w-1/4 py-2 px-4">Type</th>
                                <th className="w-1/4 py-2 px-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="bg-gray-100 border-b">
                                    <td className="py-2 px-4">{transaction.book.title}</td>
                                    <td className="py-2 px-4">{transaction.book.author}</td>
                                    <td className="py-2 px-4">{transaction.user.username}</td>
                                    <td className="py-2 px-4">{transaction.type}</td>
                                    <td className="py-2 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
