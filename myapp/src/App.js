import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost/405final_assignment/api.php';

const App = ({ userId, onLogout }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmark, setNewBookmark] = useState({ url: '', title: '' });
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch bookmarks
  const fetchBookmarks = () => {
    const url = userId ? `${API_URL}?user_id=${userId}` : API_URL;

    fetch(url)
      .then(response => response.json())
      .then(data => setBookmarks(data))
      .catch(error => console.error('Error fetching bookmarks:', error));
  };

  // Fetch bookmarks 
  useEffect(() => {
    fetchBookmarks();
  }, [userId]); // Fetch bookmarks when userId changes

  const handleAddBookmark = () => {
    if (userId) {
      // Check if the URL starts with "https://", if not, prepend it
      const formattedUrl = newBookmark.url.startsWith('https://')
        ? newBookmark.url
        : `https://${newBookmark.url}`;

      // Simple URL validation
      const urlValidationRegex = /^(https):\/\/[^ "]+$/;
      if (!urlValidationRegex.test(formattedUrl)) {
        console.error('Invalid URL. Please enter a valid website URL.');
        return;
      }

      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newBookmark, url: formattedUrl, user_id: userId }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          setNewBookmark({ url: '', title: '' });
          // Fetch updated list of bookmarks
          fetchBookmarks();
        })
        .catch(error => console.error('Error adding bookmark:', error));
    } else {
      console.error('User not authenticated. Cannot add bookmark.');
    }
  };


  const handleDeleteBookmark = (id) => {
    fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        // Fetch updated list of bookmarks
        fetchBookmarks();
      })
      .catch(error => console.error('Error deleting bookmark:', error));
  };

  const handleUpdateBookmark = (id, updatedData) => {
    // Check if the URL starts with "https://", if not, prepend it
    const formattedUrl = updatedData.url.startsWith('https://')
      ? updatedData.url
      : `https://${updatedData.url}`;

    // Simple URL validation
    const urlValidationRegex = /^(https):\/\/[^ "]+$/;
    if (!urlValidationRegex.test(formattedUrl)) {
      console.error('Invalid URL. Please enter a valid website URL.');
      return;
    }

    fetch(`${API_URL}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...updatedData, url: formattedUrl }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        // Fetch updated list of bookmarks
        fetchBookmarks();
      })
      .catch(error => console.error('Error updating bookmark:', error));
  };


  const handleEditBookmark = (id) => {
    const bookmarkToEdit = bookmarks.find(bookmark => bookmark.id === id);
    setEditingBookmark(bookmarkToEdit);
  };

  const handleSaveEdit = () => {
    if (editingBookmark) {
      handleUpdateBookmark(editingBookmark.id, {
        id: editingBookmark.id,
        url: editingBookmark.url,
        title: editingBookmark.title,
      });
      setEditingBookmark(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingBookmark(null);
  };

  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    }
  };

  // Filter bookmarks based on search term
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Bookmark App</h1>
      <div>
        <h2>Add Bookmark</h2>
        <label>URL: </label>
        <input
          type="text"
          value={newBookmark.url}
          onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
        />
        <br />
        <label>Title: </label>
        <input
          type="text"
          value={newBookmark.title}
          onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
        />
        <br />
        <button onClick={handleAddBookmark}>Add Bookmark</button>
      </div>
      <div>
        <h2>Edit Bookmark</h2>
        {editingBookmark && (
          <div>
            <label>URL: </label>
            <input
              type="text"
              value={editingBookmark.url}
              onChange={(e) => setEditingBookmark({ ...editingBookmark, url: e.target.value })}
            />
            <br />
            <label>Title: </label>
            <input
              type="text"
              value={editingBookmark.title}
              onChange={(e) => setEditingBookmark({ ...editingBookmark, title: e.target.value })}
            />
            <br />
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        )}
      </div>
      <div>
        <h2>Bookmarks</h2>
        <input
          type="text"
          placeholder="Search bookmarks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {filteredBookmarks.map(bookmark => (
            <li key={bookmark.id}>
              <strong>
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                  {bookmark.title}
                </a>
              </strong>
              {bookmark.dateAdded && (
                <span className="date"> Date Added: {new Date(bookmark.dateAdded).toLocaleString()}</span>
              )}
              <button onClick={() => handleEditBookmark(bookmark.id)}>Edit</button>
              <button onClick={() => handleDeleteBookmark(bookmark.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
