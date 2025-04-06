const serveraddress = "http://localhost:3000/";
const assetsaddress = serveraddress + "assets/";
let question_uid = -1;

let score = 0;
let answered = false;

let ai_model_to_use = "groq";

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

async function getNewQuestion(){
  const json = await getData("get_question?aimodel="+ai_model_to_use);
  console.log(json);
  for(let key in json){
    if(key==="equation"){
      document.getElementById('latex-display').innerHTML = json[key];
    }
    else if(key==="img_1"){
      image1.src = assetsaddress + json[key];
    }
    else if(key==="img_2"){
      image2.src = assetsaddress + json[key];
    }
    else if(key==="img_3"){
      image3.src = assetsaddress + json[key];
    }
    else if(key==="img_4"){
      image4.src = assetsaddress + json[key];
    }
    else if(key==="uid"){
      question_uid = json[key];
    }
  }
  selectedImage = null;
  document.body.style.backgroundColor = "white";
  answered = false;
  resetStuff();
  MathJax.typeset();
}

async function submitAnswer(){
  if(selectedImage){
    let selectedAnswerIndex = parseInt(selectedImage.id);
    console.log("User submitted image: " + selectedAnswerIndex);
    let url = "check_answer" + "?question_uid=" + question_uid.toString() + "&answer=" + selectedAnswerIndex.toString();
    let result = await getData(url);
    if(result["value"]){
      if(!answered){
        document.body.style.backgroundColor = "green";
        score++;
        answered = true;
        document.getElementById("score").innerHTML = "Score " + score.toString();
      }
    }
    else{
      document.body.style.backgroundColor = "red";
    }
  }
  else{
    console.log("User did not select an image");
  }
}

function resetStuff(){
  images.forEach(img => {
    img.classList.remove('selected');
  })
}

function activateGemini(){
  ai_model_to_use = "gemini";
  console.log("gemini");
}

function activateGroq(){
  ai_model_to_use = "groq";
  console.log("groq");
}
