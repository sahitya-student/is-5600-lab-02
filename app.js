/* add your code here */

// ✅ Stock Portfolio Dashboard - app.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Parse JSON data from global variables (provided in users.js & stocks-complete.js) ---
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // --- Get Buttons ---
  const saveButton = document.querySelector('#saveUser');
  const deleteButton = document.querySelector('#deleteUser');

  // --- Add some visual background effect for fun ---
  document.body.style.background = 'linear-gradient(120deg, #f0f9ff, #cbebff, #a1c4fd)';
  document.body.style.minHeight = '100vh';
  document.body.style.fontFamily = 'Arial, sans-serif';

  /**
   * Loops through the users and renders a ul with li elements for each user
   * @param {*} users 
   * @param {*} stocks 
   */
  function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; // clear out list before rendering again

    users.map(({ user, id }) => {
      const listItem = document.createElement('li');
      listItem.innerText = `${user.lastname}, ${user.firstname}`;
      listItem.setAttribute('id', id);
      listItem.style.cursor = 'pointer';
      listItem.style.padding = '6px 10px';
      listItem.style.margin = '3px 0';
      listItem.style.background = '#f7faff';
      listItem.style.borderRadius = '6px';
      listItem.style.transition = '0.2s';
      listItem.addEventListener('mouseenter', () => listItem.style.background = '#e0f2fe');
      listItem.addEventListener('mouseleave', () => listItem.style.background = '#f7faff');
      userList.appendChild(listItem);
    });

    // --- Register event listener on the list ---
    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
  }

  /**
   * Handles the click event on the user list
   * @param {*} event 
   */
  function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find(user => user.id == userId);
    populateForm(user);
    renderPortfolio(user, stocks);
  }

  /**
   * Populates the form with the user's data
   * @param {*} user 
   */
  function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
  }

  /**
   * Renders the portfolio items for the user
   * @param {*} user 
   */
  function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = ''; // clear list

    portfolio.map(({ symbol, owned }) => {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.justifyContent = 'space-between';
      container.style.alignItems = 'center';
      container.style.background = '#ffffff';
      container.style.padding = '8px';
      container.style.margin = '5px 0';
      container.style.borderRadius = '8px';
      container.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';

      const symbolEl = document.createElement('p');
      const sharesEl = document.createElement('p');
      const actionEl = document.createElement('button');

      symbolEl.innerText = symbol;
      sharesEl.innerText = `Shares: ${owned}`;
      actionEl.innerText = 'View';
      actionEl.setAttribute('id', symbol);
      actionEl.style.background = '#0ea5e9';
      actionEl.style.color = 'white';
      actionEl.style.border = 'none';
      actionEl.style.padding = '6px 10px';
      actionEl.style.borderRadius = '5px';
      actionEl.style.cursor = 'pointer';
      actionEl.addEventListener('mouseenter', () => actionEl.style.background = '#0284c7');
      actionEl.addEventListener('mouseleave', () => actionEl.style.background = '#0ea5e9');

      container.appendChild(symbolEl);
      container.appendChild(sharesEl);
      container.appendChild(actionEl);
      portfolioDetails.appendChild(container);
    });

    // --- Register viewStock listener on the parent container ---
    portfolioDetails.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        viewStock(event.target.id, stocks);
      }
    });
  }

  /**
   * Renders the stock information for the symbol
   * @param {*} symbol 
   */
  function viewStock(symbol, stocks) {
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
      const stock = stocks.find((s) => s.symbol == symbol);
      document.querySelector('#stockName').textContent = stock.name;
      document.querySelector('#stockSector').textContent = stock.sector;
      document.querySelector('#stockIndustry').textContent = stock.subIndustry;
      document.querySelector('#stockAddress').textContent = stock.address;
      document.querySelector('#logo').src = `logos/${symbol}.svg`;
      stockArea.style.background = '#f1f5f9';
      stockArea.style.borderRadius = '10px';
      stockArea.style.padding = '10px';
    }
  }

  // --- Delete user functionality ---
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);
    userData.splice(userIndex, 1);
    generateUserList(userData, stocksData);
    document.querySelector('.portfolio-list').innerHTML = '';
    document.querySelector('.stock-form').innerHTML = '';
  });

  // --- Save user functionality ---
  saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    const id = document.querySelector('#userID').value;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i].id == id) {
        userData[i].user.firstname = document.querySelector('#firstname').value;
        userData[i].user.lastname = document.querySelector('#lastname').value;
        userData[i].user.address = document.querySelector('#address').value;
        userData[i].user.city = document.querySelector('#city').value;
        userData[i].user.email = document.querySelector('#email').value;
        generateUserList(userData, stocksData);
      }
    }
  });

  // --- Initial render ---
  generateUserList(userData, stocksData);
});
