const serveraddress = "http://localhost:3000/";
const assetsaddress = serveraddress + "assets/";
let question_uid = -1;

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
  const json = await getData("get_question");
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
  MathJax.typeset();
  selectedImage = null;
}

async function submitAnswer(){
  if(selectedImage){
    let selectedAnswerIndex = parseInt(selectedImage.id)-1;
    console.log("User submitted image: " + selectedAnswerIndex);
    let result = await getData("check_answer/" + selectedAnswerIndex.toString())
  }
  else{
    console.log("User did not select an image");
  }
}
