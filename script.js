const baseUrl = 'http://localhost:3000/'; // Base URL for json-server

// Function to toggle the form visibility
function toggleForm(type) {
    document.getElementById('lost-form').style.display = type === 'lost' ? 'block' : 'none';
    document.getElementById('found-form').style.display = type === 'found' ? 'block' : 'none';
}

// Function to add a lost or found item
async function addItem(type) {
    const category = document.getElementById(`${type}-category`).value;
    const description = document.getElementById(`${type}-description`).value;
    const location = document.getElementById(`${type}-location`).value;
    const date = document.getElementById(`${type}-date`).value;
    const contact = document.getElementById(`${type}-contact`).value;
    const image = document.getElementById(`${type}-image`).files[0];

    // Convert image to base64 string
    const reader = new FileReader();
    reader.onloadend = async () => {
        const newItem = {
            category,
            description,
            location,
            date,
            contact,
            image: reader.result // Base64 string of image
        };

        // Send POST request to add the item
        await fetch(`${baseUrl}${type}Items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        // Clear the form
        document.getElementById(`${type}-ItemForm`).reset();
        // Fetch items to refresh the display
        fetchItems();
    };

    if (image) {
        reader.readAsDataURL(image);
    }
}

// Function to fetch lost and found items from the server
async function fetchItems() {
    const lostResponse = await fetch(baseUrl + 'lostItems');
    const foundResponse = await fetch(baseUrl + 'foundItems');

    const lostItems = await lostResponse.json();
    const foundItems = await foundResponse.json();

    // Clear previous items
    document.getElementById('lost-items').innerHTML = '';
    document.getElementById('found-items').innerHTML = '';

    // Populate the item lists
    lostItems.forEach(item => addItemToDisplay(item, 'lost'));
    foundItems.forEach(item => addItemToDisplay(item, 'found'));
}

// Helper function to add an item to the display
function addItemToDisplay(item, type) {
    let itemList = document.getElementById(type + '-items');

    let div = document.createElement('div');
    div.className = 'item';

    let img = document.createElement('img');
    img.src = item.image; // Use the image URL from the server
    img.alt = 'Item Image';

    let descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'item-description';
    descriptionContainer.innerHTML = `<strong>Category:</strong> ${item.category}<br>
                                      <strong>Description:</strong> ${item.description}<br>
                                      <strong>Location:</strong> ${item.location}<br>
                                      <strong>Date:</strong> ${item.date}<br>
                                      <strong>Contact:</strong> ${item.contact}`;

    let itemButtons = document.createElement('div');
    itemButtons.className = 'item-buttons';

    let editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.className = 'edit';
    editButton.onclick = () => openEditForm(item, type);
    itemButtons.appendChild(editButton);

    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => deleteItem(item.id, type);
    itemButtons.appendChild(deleteButton);

    div.appendChild(img);
    div.appendChild(descriptionContainer);
    div.appendChild(itemButtons);
    itemList.appendChild(div);
}

// Function to delete an item
async function deleteItem(id, type) {
    await fetch(`${baseUrl}${type}Items/${id}`, {
        method: 'DELETE',
    });
    fetchItems(); // Refresh the item display
}

// Function to open the edit form
function openEditForm(item, type) {
    // Create edit form and pre-fill with item data
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    
    const categoryInput = document.createElement('input');
    categoryInput.value = item.category;

    const descriptionInput = document.createElement('input');
    descriptionInput.value = item.description;

    const locationInput = document.createElement('input');
    locationInput.value = item.location;

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = item.date;

    const contactInput = document.createElement('input');
    contactInput.value = item.contact;

    const updateButton = document.createElement('button');
    updateButton.innerText = 'Update';
    updateButton.onclick = () => updateItem(item.id, {
        category: categoryInput.value,
        description: descriptionInput.value,
        location: locationInput.value,
        date: dateInput.value,
        contact: contactInput.value,
        image: item.image // Keep existing image
    }, type);
    
    editForm.append(categoryInput, descriptionInput, locationInput, dateInput, contactInput, updateButton);
    
    const itemDiv = document.querySelector(`.item:nth-child(${item.id})`);
    itemDiv.appendChild(editForm); // Add the edit form to the item
}

// Function to update an item
async function updateItem(id, updatedItem, type) {
    await fetch(`${baseUrl}${type}Items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    });

    fetchItems(); // Refresh the item display
}

// Function to search for items
async function searchItems() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const lostResponse = await fetch(baseUrl + 'lostItems');
    const foundResponse = await fetch(baseUrl + 'foundItems');

    const lostItems = await lostResponse.json();
    const foundItems = await foundResponse.json();

    const searchResults = [];

    // Search lost items
    lostItems.forEach(item => {
        if (item.description.toLowerCase().includes(query) || item.location.toLowerCase().includes(query)) {
            searchResults.push({ ...item, type: 'lost' });
        }
    });

    // Search found items
    foundItems.forEach(item => {
        if (item.description.toLowerCase().includes(query) || item.location.toLowerCase().includes(query)) {
            searchResults.push({ ...item, type: 'found' });
        }
    });

    // Clear previous search results
    document.getElementById('search-results').innerHTML = '';

    // Display search results
    searchResults.forEach(item => {
        let div = document.createElement('div');
        div.className = 'item';

        let img = document.createElement('img');
        img.src = item.image; // Use the image URL from the server
        img.alt = 'Item Image';

        let descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'item-description';
        descriptionContainer.innerHTML = `<strong>Category:</strong> ${item.category}<br>
                                          <strong>Description:</strong> ${item.description}<br>
                                          <strong>Location:</strong> ${item.location}<br>
                                          <strong>Date:</strong> ${item.date}<br>
                                          <strong>Contact:</strong> ${item.contact}`;

        div.appendChild(img);
        div.appendChild(descriptionContainer);
        document.getElementById('search-results').appendChild(div);
    });
}

// Call fetchItems when the page loads
window.onload = fetchItems;
