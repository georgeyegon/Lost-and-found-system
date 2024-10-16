function toggleForm(formType) {
    // Toggle display of lost and found forms
    document.getElementById('lost-form').style.display = 'none';
    document.getElementById('found-form').style.display = 'none';
    if (formType === 'lost') {
        document.getElementById('lost-form').style.display = 'block';
    } else {
        document.getElementById('found-form').style.display = 'block';
    }
}

function addItem(type) {
    // Get form values
    let description = document.getElementById(type + '-description').value;
    let location = document.getElementById(type + '-location').value;
    let date = document.getElementById(type + '-date').value;
    let contact = document.getElementById(type + '-contact').value;
    let imageFile = document.getElementById(type + '-image').files[0];

    // Create a new list item for the lost/found item
    let itemList = document.getElementById(type + '-items');
    let li = document.createElement('li');
    li.className = 'item';

    // Create image element
    let img = document.createElement('img');
    img.src = URL.createObjectURL(imageFile);

    // Create description container
    let descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'item-description';
    descriptionContainer.innerHTML = `<strong>Description:</strong> ${description}<br>
                                      <strong>Location:</strong> ${location}<br>
                                      <strong>Date:</strong> ${date}<br>
                                      <strong>Contact:</strong> ${contact}`;

    // Create buttons for edit and delete
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'item-buttons';
    let editButton = document.createElement('button');
    editButton.className = 'edit';
    editButton.innerText = 'Edit';
    editButton.onclick = function() { editItem(li, type); };
    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = function() { deleteItem(li); };
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    // Append elements to the list item
    li.appendChild(img);
    li.appendChild(descriptionContainer);
    li.appendChild(buttonContainer);

    // Append the list item to the respective list (lost/found)
    itemList.appendChild(li);

    // Reset the form after submission
    document.getElementById(type + 'ItemForm').reset();
}

function editItem(item, type) {
    // Prompt the user to edit item details
    let description = prompt("Edit description:");
    let location = prompt("Edit location:");
    let date = prompt("Edit date:");
    let contact = prompt("Edit contact:");

    if (description && location && date && contact) {
        // Update item details
        item.querySelector('.item-description').innerHTML = `<strong>Description:</strong> ${description}<br>
                                                             <strong>Location:</strong> ${location}<br>
                                                             <strong>Date:</strong> ${date}<br>
                                                             <strong>Contact:</strong> ${contact}`;
    }
}

