// Function to toggle the form visibility
function toggleForm(type) {
    if (type === 'lost') {
        document.getElementById('lost-form').style.display = 'block';
        document.getElementById('found-form').style.display = 'none';
    } else if (type === 'found') {
        document.getElementById('lost-form').style.display = 'none';
        document.getElementById('found-form').style.display = 'block';
    }
}

// Function to hide both forms
function closeForms() {
    document.getElementById('lost-form').style.display = 'none';
    document.getElementById('found-form').style.display = 'none';
}

// Function to display items from local storage
function displayItems(type) {
    const items = JSON.parse(localStorage.getItem(`${type}Items`)) || [];
    const itemsList = document.getElementById(`${type}-items`);
    const otherType = type === 'lost' ? 'found' : 'lost';

    // Hide the other category's items and clear its content
    document.getElementById(`${otherType}-items`).innerHTML = '';

    // Clear previous items
    itemsList.innerHTML = '';

    // Add a heading above the items inside the buttons
    const heading = document.createElement('h2');
    heading.textContent = `Here are ${type} items`;
    heading.classList.add('items-heading');

    // Insert the heading above the items list
    itemsList.appendChild(heading);

    items.forEach(item => displayItem(item, type)); // Display each item
}

// Function to display an individual item
function displayItem(item, type) {
    const itemList = document.getElementById(`${type}-items`);

    const div = document.createElement('div');
    div.className = 'item';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = `${item.category} image`;

    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'item-description';
    descriptionContainer.innerHTML = `<strong>Category:</strong> ${item.category}<br>
                                       <strong>Description:</strong> ${item.description}<br>
                                       <strong>Location:</strong> ${item.location}<br>
                                       <strong>Date:</strong> ${item.date}<br>
                                       <strong>Contact:</strong> ${item.contact}`;

    const editButton = document.createElement('button');
    editButton.className = 'btn-edit';
    editButton.textContent = 'Edit';
    editButton.onclick = () => populateForm(item, type); // Populate the form for editing

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-delete';
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteItem(item.id, type); // Delete item on button click

    div.appendChild(img);
    div.appendChild(descriptionContainer);
    div.appendChild(editButton);
    div.appendChild(deleteButton);

    itemList.appendChild(div);
}

// Function to populate the form with an item's details for editing
function populateForm(item, type) {
    document.getElementById(`${type}-category`).value = item.category;
    document.getElementById(`${type}-description`).value = item.description;
    document.getElementById(`${type}-location`).value = item.location;
    document.getElementById(`${type}-date`).value = item.date;
    document.getElementById(`${type}-contact`).value = item.contact;

    toggleForm(type); // Show the relevant form

    const submitButton = document.querySelector(`#${type}-item-form button[type="submit"]`);
    submitButton.textContent = 'Update Item'; // Change button text to "Update Item"
    submitButton.onclick = () => addItem(type, item.id); // Call addItem with item ID to update the item
}

// Function to add or update an item
function addItem(type, itemId = null) {
    const category = document.getElementById(`${type}-category`).value;
    const description = document.getElementById(`${type}-description`).value;
    const location = document.getElementById(`${type}-location`).value;
    const date = document.getElementById(`${type}-date`).value;
    const contact = document.getElementById(`${type}-contact`).value;
    const imageFile = document.getElementById(`${type}-image`).files[0];

    if (!category || !description || !location || !date || !contact || !imageFile) {
        alert("Please fill all fields before submitting.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const newItem = {
            id: itemId || Date.now(), // Use existing ID or create a new one
            category,
            description,
            location,
            date,
            contact,
            image: reader.result // Base64 string of the image
        };

        const items = JSON.parse(localStorage.getItem(`${type}Items`)) || [];

        if (itemId) {
            // Update existing item
            const itemIndex = items.findIndex(item => item.id === itemId);
            items[itemIndex] = newItem;
        } else {
            // Add new item
            items.push(newItem);
        }

        localStorage.setItem(`${type}Items`, JSON.stringify(items));

        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} item ${itemId ? 'updated' : 'posted'} successfully!`);
        document.getElementById(`${type}-item-form`).reset(); // Clear the form
        closeForms(); // Close the form after posting or updating
        displayItems(type); // Refresh the item list immediately
    };

    reader.readAsDataURL(imageFile); // Convert the image to base64 before storing
}

// Function to delete an item
function deleteItem(itemId, type) {
    if (confirm("Are you sure you want to delete this item?")) {
        let items = JSON.parse(localStorage.getItem(`${type}Items`)) || [];
        items = items.filter(item => item.id !== itemId);
        localStorage.setItem(`${type}Items`, JSON.stringify(items));
        displayItems(type); // Refresh the item list after deletion
    }
}

// Event listeners for displaying lost and found items
document.querySelector('.btn-view-lost').addEventListener('click', () => {
    displayItems('lost'); // Show lost items
});

document.querySelector('.btn-view-found').addEventListener('click', () => {
    displayItems('found'); // Show found items
});

// Call displayItems when the page loads to show any existing lost items
window.onload = () => {
    displayItems('lost'); // Display lost items by default on page load
};
