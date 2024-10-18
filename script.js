const baseUrl = 'https://lost-and-found-system.onrender.com/';

function toggleForm(type) {
    document.getElementById('lost-form').style.display = type === 'lost' ? 'block' : 'none';
    document.getElementById('found-form').style.display = type === 'found' ? 'block' : 'none';
    // Hide item lists when toggling forms
    document.getElementById('lost-items').style.display = 'none';
    document.getElementById('found-items').style.display = 'none';
}

async function addItem(type) {
    const category = document.getElementById(`${type}-category`).value;
    const description = document.getElementById(`${type}-description`).value;
    const location = document.getElementById(`${type}-location`).value;
    const date = document.getElementById(`${type}-date`).value;
    const contact = document.getElementById(`${type}-contact`).value;
    const imageFile = document.getElementById(`${type}-image`).files[0];

    if (!imageFile) {
        alert('Please upload an image.');
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error('Failed to post item');
            }

            document.getElementById(`${type}-item-form`).reset();
            fetchItems();
        } catch (error) {
            console.error('Error posting item:', error);
            alert('Error posting item: ' + error.message);
        }
    };

    reader.readAsDataURL(imageFile);
}

async function fetchItems() {
    try {
        const lostResponse = await fetch(`${baseUrl}lostItems`);
        const foundResponse = await fetch(`${baseUrl}foundItems`);

        if (!lostResponse.ok || !foundResponse.ok) {
            throw new Error('Failed to fetch items');
        }

        const lostItems = await lostResponse.json();
        const foundItems = await foundResponse.json();

        document.getElementById('lost-items').innerHTML = '';
        document.getElementById('found-items').innerHTML = '';

        lostItems.forEach(item => addItemToDisplay(item, 'lost'));
        foundItems.forEach(item => addItemToDisplay(item, 'found'));
    } catch (error) {
        console.error('Error fetching items:', error);
        alert('Error fetching items: ' + error.message);
    }
}

function addItemToDisplay(item, type) {
    const itemList = document.getElementById(`${type}-items`);
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.setAttribute('data-id', item.id);
    itemDiv.innerHTML = `
        <h3>${item.category}</h3>
        <p>Description: ${item.description}</p>
        <p>Location: ${item.location}</p>
        <p>Date: ${item.date}</p>
        <p>Contact: ${item.contact}</p>
        <img src="${item.image}" alt="${item.category}">
        <button class="btn btn-edit" onclick="openEditForm(${item.id}, '${type}')">Edit</button>
        <button class="btn btn-delete" onclick="deleteItem(${item.id}, '${type}')">Delete</button>
    `;
    itemList.appendChild(itemDiv);
}

async function deleteItem(id, type) {
    try {
        const response = await fetch(`${baseUrl}${type}Items/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete item');
        }

        fetchItems(); // Refresh the item list
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item: ' + error.message);
    }
}

function openEditForm(id, type) {
    const itemDiv = document.querySelector(`.item[data-id="${id}"]`);
    document.getElementById('edit-item-id').value = id;
    document.getElementById('edit-category').value = itemDiv.querySelector('h3').textContent;
    document.getElementById('edit-description').value = itemDiv.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
    document.getElementById('edit-location').value = itemDiv.querySelector('p:nth-of-type(2)').textContent.split(': ')[1];
    document.getElementById('edit-date').value = itemDiv.querySelector('p:nth-of-type(3)').textContent.split(': ')[1];
    document.getElementById('edit-contact').value = itemDiv.querySelector('p:nth-of-type(4)').textContent.split(': ')[1];
    document.getElementById('edit-item-form').style.display = 'block';
}

async function updateItem() {
    const id = document.getElementById('edit-item-id').value;
    const category = document.getElementById('edit-category').value;
    const description = document.getElementById('edit-description').value;
    const location = document.getElementById('edit-location').value;
    const date = document.getElementById('edit-date').value;
    const contact = document.getElementById('edit-contact').value;
    const imageFile = document.getElementById('edit-image').files[0];

    let updatedItem = {
        category,
        description,
        location,
        date,
        contact
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
            updatedItem.image = reader.result;

            try {
                const response = await fetch(`${baseUrl}lostItems/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedItem),
                });

                if (!response.ok) {
                    throw new Error('Failed to update item');
                }

                document.getElementById('edit-item-form').style.display = 'none'; // Hide edit form
                fetchItems(); // Refresh the item list
            } catch (error) {
                console.error('Error updating item:', error);
                alert('Error updating item: ' + error.message);
            }
        };

        reader.readAsDataURL(imageFile);
    } else {
        try {
            const response = await fetch(`${baseUrl}lostItems/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            document.getElementById('edit-item-form').style.display = 'none'; // Hide edit form
            fetchItems(); // Refresh the item list
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item: ' + error.message);
        }
    }
}

function viewItems(type) {
    document.getElementById('lost-items').style.display = type === 'lost' ? 'block' : 'none';
    document.getElementById('found-items').style.display = type === 'found' ? 'block' : 'none';
}

// Fetch items on page load
fetchItems();
