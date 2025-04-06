loginForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // Stop the form from reloading the page

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  let loginvalid = await getData("sign_in?name="+username+"&password="+password);

  console.log(loginvalid["response"]);


  if (loginvalid["response"]) {
    alert("Login successful!");
    window.location.href = "http://localhost:3000/htmls/quiz.html";
  } else {
    document.getElementById("message").textContent = "Invalid credentials!";
  }
});


const serveraddress = "http://localhost:3000/";

async function getData(query){
  const url = serveraddress + query;
  console.log(url);
  try{
    const response = await fetch(url);
    if (!response.ok) {
      console.log("error");
      // throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  }
  catch(error){
    console.error(error.message);
  }
}
