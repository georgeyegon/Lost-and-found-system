const baseUrl = 'http://localhost:3000/'; // Base URL for json-server

let currentEditItem = null; // Store the item being edited

// Function to toggle the form visibility
function toggleForm(type) {
    document.getElementById('lost-form').style.display = type === 'lost' ? 'block' : 'none';
    document.getElementById('found-form').style.display = type === 'found' ? 'block' : 'none';
    document.getElementById('lost-items-container').style.display = 'none'; // Hide lost items container
    document.getElementById('found-items-container').style.display = 'none'; // Hide found items container
    currentEditItem = null; // Reset current edit item
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

        // If editing an item, update it; otherwise, add a new item
        if (currentEditItem) {
            await fetch(`${baseUrl}${type}Items/${currentEditItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            currentEditItem = null; // Reset edit item
        } else {
            // Send POST request to add the item
            await fetch(`${baseUrl}${type}Items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
        }

        // Clear the form
        document.getElementById(`${type}ItemForm`).reset();
        toggleForm(type); // Hide the form after submission
        fetchItems(type); // Refresh item list
    };

    if (image) {
        reader.readAsDataURL(image);
    }
}

// Function to fetch lost and found items from the server
async function fetchItems(type) {
    let items = [];

    if (type === 'lost') {
        const lostResponse = await fetch(baseUrl + 'lostItems');
        items = await lostResponse.json();
        document.getElementById('lost-items-container').style.display = 'block'; // Show lost items container
        document.getElementById('found-items-container').style.display = 'none'; // Hide found items container
    } else if (type === 'found') {
        const foundResponse = await fetch(baseUrl + 'foundItems');
        items = await foundResponse.json();
        document.getElementById('found-items-container').style.display = 'block'; // Show found items container
        document.getElementById('lost-items-container').style.display = 'none'; // Hide lost items container
    }

    const itemsList = document.getElementById(type === 'lost' ? 'lost-items' : 'found-items');
    itemsList.innerHTML = ''; // Clear previous items

    items.forEach(item => displayItem(item, type)); // Display each item
}

// Function to display an item
function displayItem(item, type) {
    const itemList = document.getElementById(type === 'lost' ? 'lost-items' : 'found-items');

    const div = document.createElement('div');
    div.className = 'item';

    const img = document.createElement('img');
    img.src = item.image;

    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'item-description';
    descriptionContainer.innerHTML = `<strong>Category:</strong> ${item.category}<br>
                                       <strong>Description:</strong> ${item.description}<br>
                                       <strong>Location:</strong> ${item.location}<br>
                                       <strong>Date:</strong> ${item.date}<br>
                                       <strong>Contact:</strong> ${item.contact}`;

    div.appendChild(img);
    div.appendChild(descriptionContainer);

    // Append edit and delete buttons
    const itemButtons = document.createElement('div');
    itemButtons.className = 'item-buttons';
    
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.onclick = () => openEditForm(item, type);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => deleteItem(item.id, type);

    itemButtons.appendChild(editButton);
    itemButtons.appendChild(deleteButton);

    div.appendChild(itemButtons);
    itemList.appendChild(div);
}

// Function to delete an item
async function deleteItem(id, type) {
    await fetch(`${baseUrl}${type}Items/${id}`, {
        method: 'DELETE',
    });

    fetchItems(type); // Refresh the item display
}

// Function to open the edit form
function openEditForm(item, type) {
    currentEditItem = item; // Set the item to be edited

    // Fill the form with existing item data
    document.getElementById(`${type}-category`).value = item.category;
    document.getElementById(`${type}-description`).value = item.description;
    document.getElementById(`${type}-location`).value = item.location;
    document.getElementById(`${type}-date`).value = item.date;
    document.getElementById(`${type}-contact`).value = item.contact;

    // Show the corresponding form
    toggleForm(type);
}

// Call fetchItems when the page loads
window.onload = () => {
    fetchItems('lost'); // Default to view lost items on load
};
