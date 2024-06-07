// Toggle the dropdown visibility when the profile picture is clicked
document.getElementById("profile-pic").addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent the event from bubbling up to the window
    var dropdownContent = document.getElementById("dropdown-content");
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
});

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('#profile-pic') && !event.target.closest('.dropdown-content')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
};

// Support form submission handling
document.getElementById('support-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const issueType = document.getElementById('issue-type').value;
    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;

    if (email && issueType && subject && description) {
        alert('Your support request has been submitted successfully!');
        // Here you would typically send the form data to your server using AJAX or fetch.
    } else {
        alert('Please fill in all required fields.');
    }
});
