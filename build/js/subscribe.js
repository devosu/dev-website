
const joinEmailInput = document.getElementById("join-email-input");
const joinButton = document.getElementById("join-button");

function validateEmail() {
  const email = joinEmailInput.value;
  if (!email) {
    alert("Please enter your email");
  } else if (!/.+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(email)) {
    alert("Please enter a valid email");
  } else {
    joinButton.disabled = true;
    joinEmailInput.disabled = true;
    subscribe(email, () => {
      joinEmailInput.value = "";
      joinButton.disabled = false;
      joinEmailInput.disabled = false;
    });
  }
};

joinButton.addEventListener("click", validateEmail);
joinEmailInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    validateEmail();
  }
});
  
async function subscribe(email, callback) {
  const body = {
    email,
    domain: "devosu.substack.com",
  };
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(
    "https://substackapi.com/api/subscribe",
    request
  );

  if (response.status == 200) {
    alert("Done! Please confirm your subscription in your email");
    if (callback) callback();
  } else {
    alert("Something went wrong. Please reach out to officers");
  }
}