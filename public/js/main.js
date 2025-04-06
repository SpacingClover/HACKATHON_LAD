async function getData(query){
  const url = "http://localhost:3000/" + query;
  console.log(url);
  try{
    const response = await fetch(url);
    if (!response.ok) {
      console.log("error");
      // throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  }
  catch(error){
    console.error(error.message);
  }
}
