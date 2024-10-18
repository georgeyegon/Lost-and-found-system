const baseUrl = 'http://localhost:3000/';
// Function to toggle between lost and found forms
function toggleForm(type) {
    document.getElementById('lost-form').style.display = type === 'lost' ? 'block' : 'none';
    document.getElementById('found-form').style.display = type === 'found' ? 'block' : 'none';
}

// Function to add or edit a lost or found item
async function addItem(type) {
    const category = document.getElementById(`${type}-category`).value;
    const description = document.getElementById(`${type}-description`).value;
    const location = document.getElementById(`${type}-location`).value;
    const date = document.getElementById(`${type}-date`).value;
    const contact = document.getElementById(`${type}-contact`).value;
    const image = document.getElementById(`${type}-image`).files[0];

    if (!category || !description || !location || !date || !contact || !image) {
        alert('Please fill in all fields.');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
        const newItem = {
            category,
            description,
            location,
            date,
            contact,
            image: reader.result
        };

        try {
            const response = await fetch(`${baseUrl}${type}Items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });

            if (response.ok) {
                alert('Item posted successfully!');
                document.getElementById(`${type}-ItemForm`).reset();
            } else {
                alert('Error posting item: ' + response.statusText);
            }
            viewItems(type); // Refresh the item list
        } catch (error) {
            console.error('Error posting item:', error);
            alert('Error posting item: ' + error.message);
        }
    };

    if (image) {
        reader.readAsDataURL(image);
    }
}

// Function to view lost or found items
async function viewItems(type) {
    const response = await fetch(`${baseUrl}${type}Items`);
    const items = await response.json();

    const itemList = document.getElementById(`${type}-items`);
    itemList.innerHTML = ''; // Clear previous items
    document.getElementById(`${type}-items`).style.display = 'block'; // Show items list

    items.forEach(item => addItemToDisplay(item, type));
}

// Function to display an item
function addItemToDisplay(item, type) {
    const itemList = document.getElementById(`${type}-items`);

    const div = document.createElement('div');
    div.className = 'item';

    const img = document.createElement('img');
    img.src = item.image; // Use the image URL from the server
    img.alt = 'Item Image';

    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'item-description';
    descriptionContainer.innerHTML = `<strong>Category:</strong> ${item.category}<br>
                                      <strong>Description:</strong> ${item.description}<br>
                                      <strong>Location:</strong> ${item.location}<br>
                                      <strong>Date:</strong> ${item.date}<br>
                                      <strong>Contact:</strong> ${item.contact}`;

    const itemButtons = document.createElement('div');
    itemButtons.className = 'item-buttons';

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.className = 'edit-btn';
    editButton.onclick = () => openEditForm(item);
    itemButtons.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete-btn';
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
    viewItems(type); // Refresh the item display
}

// Function to open the edit form
function openEditForm(item) {
    document.getElementById('edit-item-id').value = item.id;
    document.getElementById('edit-category').value = item.category;
    document.getElementById('edit-description').value = item.description;
    document.getElementById('edit-location').value = item.location;
    document.getElementById('edit-date').value = item.date;
    document.getElementById('edit-contact').value = item.contact;
    document.getElementById('edit-item-form').style.display = 'block';
}

// Function to update an item
async function updateItem() {
    const id = document.getElementById('edit-item-id').value;
    const category = document.getElementById('edit-category').value;
    const description = document.getElementById('edit-description').value;
    const location = document.getElementById('edit-location').value;
    const date = document.getElementById('edit-date').value;
    const contact = document.getElementById('edit-contact').value;

    const updatedItem = {
        category,
        description,
        location,
        date,
        contact
    };

    await fetch(`${baseUrl}lostItems/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    });

    document.getElementById('edit-item-form').style.display = 'none';
    viewItems('lost'); // Refresh the item display
    viewItems('found'); // Refresh the item display
}

// Call fetchItems when the page loads
window.onload = () => {
    viewItems('lost');
    viewItems('found');
};
