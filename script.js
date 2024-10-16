document.addEventListener('DOMContentLoaded', function() {
    const lostButton = document.getElementById('lostButton');
    const foundButton = document.getElementById('foundButton');
    const itemTypeInput = document.getElementById('itemType');
    
    // Set default item type to "lost"
    itemTypeInput.value = 'lost';

    // Event listeners for "Lost" and "Found" buttons
    lostButton.addEventListener('click', function() {
        itemTypeInput.value = 'lost';
        lostButton.style.backgroundColor = '#d9534f';
        foundButton.style.backgroundColor = '#5cb85c';
    });

    foundButton.addEventListener('click', function() {
        itemTypeInput.value = 'found';
        foundButton.style.backgroundColor = '#5cb85c';
        lostButton.style.backgroundColor = '#d9534f';
    });

    // Handling form submission and image upload (this is a placeholder)
    const form = document.getElementById('itemForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const itemType = formData.get('itemType');
        const description = formData.get('itemDescription');
        const location = formData.get('location');
        const date = formData.get('date');
        const contact = formData.get('contact');
        const imageFile = formData.get('image');
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                addItemToList(itemType, description, location, date, contact, imageUrl);
            };
            reader.readAsDataURL(imageFile);
        } else {
            addItemToList(itemType, description, location, date, contact, null);
        }

        form.reset(); // Clear the form after submission
    });

   