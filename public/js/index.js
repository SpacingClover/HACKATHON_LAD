loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop the form from reloading the page

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "quiz123") {
    alert("Login successful!");
    window.location.href = "http://localhost:3000/htmls/quiz.html";
  } else {
    document.getElementById("message").textContent = "Invalid credentials!";
  }
});