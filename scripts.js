// Handle profile dropdown toggle
document.querySelector('.profile-trigger').addEventListener('click', function() {
    var dropdownContent = document.getElementById('dropdown-content');
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Handle responsive navbar dropdown toggle
document.getElementById('dropdown-btn').addEventListener('click', function() {
    var dropdownLinks = document.getElementById('dropdown-links');
    dropdownLinks.style.display = dropdownLinks.style.display === 'block' ? 'none' : 'block';
});

// Handle form submission
document.getElementById('support-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    var formData = new FormData(this);
    var formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Retrieve existing form data from local storage
    var existingFormData = localStorage.getItem('supportFormData');
    var existingForms = existingFormData ? JSON.parse(existingFormData) : [];
    
    // Add the new form data to the existing forms
    existingForms.push(formObject);

    // Store the updated forms in local storage
    localStorage.setItem('supportFormData', JSON.stringify(existingForms));

    // Reset the form
    this.reset();

    // Display success message
    alert('Your support request has been submitted successfully!');
});

