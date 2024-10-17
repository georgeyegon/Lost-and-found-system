function toggleForm(type) {
    // Hide both forms
    document.getElementById('lost-form').style.display = 'none';
    document.getElementById('found-form').style.display = 'none';

    // Show the selected form
    if (type === 'lost') {
        document.getElementById('lost-form').style.display = 'block';
    } else {
        document.getElementById('found-form').style.display = 'block';
    }
}

function addItem(type) {
    // Get input values based on item type (lost or found)
    let category = document.getElementById(type + '-category').value;
    let description = document.getElementById(type + '-description').value;
    let location = document.getElementById(type + '-location').value;
    let date = document.getElementById(type + '-date').value;
    let contact = document.getElementById(type + '-contact').value;
    let imageFile = document.getElementById(type + '-image').files[0];
    let itemList = document.getElementById(type + '-items');

    // Create a new list item
    let li = document.createElement('div');
    li.className = 'item';

    // Create image element
    let img = document.createElement('img');
    img.src = URL.createObjectURL(imageFile); // Temporary URL for image
    img.alt = 'Item Image';

    // Create description container
    let descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'item-description';
    descriptionContainer.innerHTML = `<strong>Category:</strong> ${category}<br>
                                      <strong>Description:</strong> ${description}<br>
                                      <strong>Location:</strong> ${location}<br>
                                      <strong>Date:</strong> ${date}<br>
                                      <strong>Contact:</strong> ${contact}`;

    // Create edit and delete buttons
    let buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'item-buttons';
    buttonsContainer.innerHTML = `
        <button class="edit" onclick="showEditForm(this.parentElement.parentElement)">Edit</button>
        <button class="delete" onclick="deleteItem(this.parentElement.parentElement)">Delete</button>
    `;

    // Create edit form
    let editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
        <select id="edit-category" required>
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
        </select>
        <input type="text" id="edit-description" placeholder="Item Description" required>
        <input type="text" id="edit-location" placeholder="Location" required>
        <input type="date" id="edit-date" required>
        <input type="text" id="edit-contact" placeholder="Contact Information" required>
        <input type="file" id="edit-image" accept="image/*">
        <button onclick="updateItem(this.parentElement.parentElement)">Save</button>
        <button onclick="cancelEdit(this.parentElement.parentElement)">Cancel</button>
    `;

    li.appendChild(img);
    li.appendChild(descriptionContainer);
    li.appendChild(buttonsContainer);
    li.appendChild(editForm);
    
    // Append the list item to the respective list (lost/found)
    itemList.appendChild(li);

    // Reset the form after submission
    document.getElementById(type + 'ItemForm').reset();
}

function showEditForm(item) {
    // Show the edit form for the selected item
    let editForm = item.querySelector('.edit-form');
    editForm.style.display = 'block'; // Show edit form

    let category = item.querySelector('.item-description strong:nth-child(1)').nextSibling.textContent.trim();
    let description = item.querySelector('.item-description strong:nth-child(2)').nextSibling.textContent.trim();
    let location = item.querySelector('.item-description strong:nth-child(3)').nextSibling.textContent.trim();
    let date = item.querySelector('.item-description strong:nth-child(4)').nextSibling.textContent.trim();
    let contact = item.querySelector('.item-description strong:nth-child(5)').nextSibling.textContent.trim();

    editForm.querySelector('#edit-category').value = category;
    editForm.querySelector('#edit-description').value = description;
    editForm.querySelector('#edit-location').value = location;
    editForm.querySelector('#edit-date').value = date;
    editForm.querySelector('#edit-contact').value = contact;
}

function updateItem(item) {
    // Update item details from the edit form
    let editForm = item.querySelector('.edit-form');
    let category = editForm.querySelector('#edit-category').value;
    let description = editForm.querySelector('#edit-description').value;
    let location = editForm.querySelector('#edit-location').value;
    let date = editForm.querySelector('#edit-date').value;
    let contact = editForm.querySelector('#edit-contact').value;

    let descriptionContainer = item.querySelector('.item-description');
    descriptionContainer.innerHTML = `<strong>Category:</strong> ${category}<br>
                                      <strong>Description:</strong> ${description}<br>
                                      <strong>Location:</strong> ${location}<br>
                                      <strong>Date:</strong> ${date}<br>
                                      <strong>Contact:</strong> ${contact}`;
    
    // Hide the edit form
    editForm.style.display = 'none';
}

function cancelEdit(item) {
    // Hide the edit form without saving changes
    let editForm = item.querySelector('.edit-form');
    editForm.style.display = 'none';
}

function deleteItem(item) {
    // Remove the item from the list
    item.remove();
}

function searchItems() {
    // Search functionality
    let input = document.getElementById('search-input').value.toLowerCase();
    let lostItems = document.getElementById('lost-items');
    let foundItems = document.getElementById('found-items');
    let searchResults = document.getElementById('search-results');
    
    // Clear previous search results
    searchResults.innerHTML = '';

    let foundMatch = false;

    // Check lost items for matches
    lostItems.childNodes.forEach(item => {
        let description = item.querySelector('.item-description').innerText.toLowerCase();
        if (description.includes(input)) {
            searchResults.appendChild(item.cloneNode(true)); // Clone and append to search results
            foundMatch = true;
        }
    });

    // Check found items for matches
    foundItems.childNodes.forEach(item => {
        let description = item.querySelector('.item-description').innerText.toLowerCase();
        if (description.includes(input)) {
            searchResults.appendChild(item.cloneNode(true)); // Clone and append to search results
            foundMatch = true;
        }
    });

    // Display message if no results found
    if (!foundMatch) {
        searchResults.innerHTML = '<p>No items found.</p>';
    }
}
