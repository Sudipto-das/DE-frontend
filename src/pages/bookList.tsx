import axios from 'axios';
import { useEffect, useState } from 'react';

interface Books {
    _id: string,
    title: string,
    author: string,
    isBorrowed: boolean
}

const BookList = () => {
    const [books, setBooks] = useState<Books[]>([]);
    const [borrowedBooks, setBorrowedBooks] = useState<Books[]>([]);

    useEffect(() => {
        const fetchBooksList = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/books', {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                if (response.status === 200) {
                    const data: Books[] = response.data.books;
                    // Filter out borrowed books
                    const availableBooks = data.filter(book => !book.isBorrowed);
                    setBooks(availableBooks);
                    // Filter borrowed books
                    const borrowed = data.filter(book => book.isBorrowed);
                    setBorrowedBooks(borrowed);
                }
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        
        
        fetchBooksList();
    }, []);

    const handleBorrow = async (bookId: string) => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/borrow-book/${bookId}`,
                {},
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            console.log(response);
            if (response.status === 200) {
                // Update books state to reflect borrowed status
                const updatedBooks = books.map(book =>
                    book._id === bookId ? { ...book, isBorrowed: true } : book
                );
                setBooks(updatedBooks);
                // Add borrowed book to borrowedBooks state
                const borrowedBook = updatedBooks.find(book => book._id === bookId);
                if (borrowedBook) {
                    setBorrowedBooks([...borrowedBooks, borrowedBook]);
                }
            }
        } catch (error) {
            console.error("Error borrowing book:", error);
        }
    };
    const handleReturn = async (bookId: string) => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/return-book/${bookId}`,
                {},
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            console.log(response);
            if (response.status === 200) {
                // Update books state to reflect returned status
                const updatedBooks = borrowedBooks.filter(book => book._id !== bookId);
                setBorrowedBooks(updatedBooks);
                // Mark the book as not borrowed in the main book list
                const bookIndex = books.findIndex(book => book._id === bookId);
                if (bookIndex !== -1) {
                    const updatedMainBooks = [...books];
                    updatedMainBooks[bookIndex].isBorrowed = false;
                    setBooks(updatedMainBooks);
                }
            }
        } catch (error) {
            console.error("Error returning book:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Book List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books && books.map(book => (
                    <div key={book._id} className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-xl font-semibold">{book.title}</h2>
                        <p className="text-gray-700">Author: {book.author}</p>
                        <button
                            onClick={() => handleBorrow(book._id)}
                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            {book.isBorrowed ? 'Borrowed' : 'Borrow Book'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Borrowed Books Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Borrowed Books</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {borrowedBooks && borrowedBooks.map(book => (
                        <div key={book._id} className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-semibold">{book.title}</h2>
                            <p className="text-gray-700">Author: {book.author}</p>
                            <button
                                onClick={() => handleReturn(book._id)}
                                className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                                Return Book
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookList;
