import axios from 'axios';
import React, { useState, useEffect } from 'react';

interface Book {
    _id: string;
    title: string;
    author: string;
}

const BookManagement = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/books', {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                if (response.status === 200) {
                    setBooks(response.data.books);
                }
            } catch (error) {
                setError('Error fetching books');
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleAddOrUpdateBook = async () => {
        if (!title || !author) {
            setError('Title and author are required');
            return;
        }

        try {
            if (selectedBook) {
                // Update book
                const response = await axios.put(`http://localhost:3000/api/update-book/${selectedBook._id}`, { title, author }, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                if (response.status === 200) {
                    const updatedBook = response.data.book;
                    setBooks(books.map(book => book._id === updatedBook._id ? updatedBook : book));
                    setSelectedBook(null);
                }
            } else {
                // Add book
                const response = await axios.post('http://localhost:3000/api/add-books', { title, author }, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                if (response.status === 201) {
                    setBooks([...books, response.data.book]);
                }
            }

            setTitle('');
            setAuthor('');
            setError(null);
        } catch (error) {
            setError('Error saving book');
            console.error('Error saving book:', error);
        }
    };

    const handleDeleteBook = async (id: string) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/delete-book/${id}`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });

            if (response.status === 200) {
                setBooks(books.filter(book => book._id !== id));
            }
        } catch (error) {
            setError('Error deleting book');
            console.error('Error deleting book:', error);
        }
    };

    const handleEditBook = (book: Book) => {
        setSelectedBook(book);
        setTitle(book.title);
        setAuthor(book.author);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Books</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 border border-gray-300 rounded mr-2"
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="p-2 border border-gray-300 rounded mr-2"
                />
                <button
                    onClick={handleAddOrUpdateBook}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    {selectedBook ? 'Update Book' : 'Add Book'}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map(book => (
                    <div key={book._id} className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-xl font-semibold">{book.title}</h2>
                        <p className="text-gray-700">Author: {book.author}</p>
                        <div className="mt-2 flex justify-between">
                            <button
                                onClick={() => handleEditBook(book)}
                                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteBook(book._id)}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookManagement;
