document.getElementById("openFormBtn").addEventListener("click", function() {
  document.getElementById("popupForm").style.display = "block";
  console.log("Popup form opened by openFormBtn");
});

document.getElementById("form").addEventListener("submit", function(event) {
  // Handle form submission here
  event.preventDefault(); // Prevent default form submission behavior
  // You can add further processing here such as form validation, sending data to server, etc.
  // For this example, let's just close the form
  document.getElementById("popupForm").style.display = "none";
});

document.getElementById("AddBtn").addEventListener("click", function() {
  document.getElementById("PopupForm").style.display = "block";
  console.log("Popup form opened by AddBtn");
});

// Close the form when clicking outside of it
document.addEventListener("click", function(event) {
  if (!event.target.closest("#popupForm") && !event.target.closest("#PopupForm") && event.target !== document.getElementById("openFormBtn") && event.target !== document.getElementById("AddBtn")) {
    document.getElementById("popupForm").style.display = "none";
    document.getElementById("PopupForm").style.display = "none";
    console.log("Popup forms closed due to click outside");
  }
});
