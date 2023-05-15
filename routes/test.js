const btn=document.getElementsByTagName('button');
btn[0].addEventListener('click',async ()=>{

    let response=await fetch("http://localhost:3002/cities");
    let data =await response.json();
    console.log(data);
})