// app.js
import SimpleDB from './db.js';

// Initialize the database
const db = new SimpleDB();

function uniqueID() {
  return Math.floor(Math.random() * 999999999999);
}

// Handle search form submission
const searchForm = document.getElementById('searchForm');

function submitFormFn(event) {
  event.preventDefault();
  const searchQueryElement = document.getElementById('searchQuery');
  const searchQuery = searchQueryElement.value.trim();
  if (searchQuery) {
    let recordId = db.create({ id: uniqueID(), query: searchQuery, timestamp: new Date().toLocaleString() });
    // localStorage.setItem('searchQuery', searchQuery);
    window.location.href = `results.html?id=${encodeURIComponent(recordId)}`;
  }
}

searchForm.addEventListener("submit", submitFormFn);

// Display search results
if (window.location.pathname.endsWith('results.html')) {
  const resultsContainer = document.getElementById('resultsContainer');
  // const searchQuery = localStorage.getItem('searchQuery');
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  const id = getQueryParam('id')
  let record = db.find(decodeURIComponent(id))
  if (record) {
    resultsContainer.innerHTML = `
      <p>You searched for: <strong>${record.query}</strong></p>
      <br>
      <a href="/">Search again</a>
    `;
    // Here you can add logic to display actual search results
  } else {
    resultsContainer.innerHTML = `
      <p>Sorry, cannot find the results of what you are looking for...</p> 
      <br>
      <a href="/">Search</a>
    `;
  }
}

// Display search history
if (window.location.pathname.endsWith('history.html')) {
  const historyContainer = document.getElementById('historyContainer');
  const history = db.read();

  if (history.length > 0) {
    // history.forEach((item, index) => {
    //   const historyItem = document.createElement('div');
    //   historyItem.innerHTML = `<p>${index + 1}. ${item.query} - <em>${item.timestamp}</em></p>`;
    //   historyContainer.appendChild(historyItem);
    // });
    
    // Create a table element
    const table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '1');
    
    // Create table header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>#</th>
        <th>Query</th>
        <th>Timestamp</th>
    `;
    table.appendChild(headerRow);
    
    // Iterate over history and create table rows
    history.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.query}</td>
            <td><em>${item.timestamp}</em></td>
        `;
        table.appendChild(row);
    });

    // Append the table to the history container
    historyContainer.appendChild(table);
  } else {
    historyContainer.innerHTML = '<p>No search history found.</p>';
  }
}
