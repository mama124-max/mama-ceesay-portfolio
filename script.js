// Contact dialog
var contactDialog = document.querySelector("#modal");
var previouslyFocusedElement = null;

function openContactDialog() {
  previouslyFocusedElement = document.activeElement;
  contactDialog.hidden = false;
  document.querySelector("#copy").focus();
}

function closeContactDialog() {
  contactDialog.hidden = true;
  if (previouslyFocusedElement) previouslyFocusedElement.focus();
}

document.querySelectorAll("[data-contact]").forEach(function (button) {
  button.addEventListener("click", openContactDialog);
});

document.querySelectorAll("[data-close]").forEach(function (button) {
  button.addEventListener("click", closeContactDialog);
});

contactDialog.addEventListener("click", function (event) {
  if (event.target === contactDialog) closeContactDialog();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !contactDialog.hidden) closeContactDialog();
});

// Copy the email address, or select it so it can be copied manually.
document.querySelector("#copy").addEventListener("click", function () {
  var copyButton = this;
  var emailAddress = document.querySelector("#mail").textContent;

  function selectEmailForManualCopy() {
    var emailRange = document.createRange();
    emailRange.selectNodeContents(document.querySelector("#mail"));

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(emailRange);
    copyButton.textContent = "Select, then copy";
  }

  if (!navigator.clipboard) {
    selectEmailForManualCopy();
    return;
  }

  navigator.clipboard.writeText(emailAddress).then(function () {
    copyButton.textContent = "Copied";
  }, selectEmailForManualCopy);
});

// Show the current time in The Gambia.
function updateGambianClock() {
  document.querySelector("#clock").textContent = new Date().toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Banjul",
    },
  );
}

updateGambianClock();
window.setInterval(updateGambianClock, 30000);
