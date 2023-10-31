document.body.onload=function(){
    nbr=5;
    p=0;
    container=document.getElementById("container");
    g=document.getElementById("g");
    d=document.getElementById("d");
    container.style.width=(800*nbr)+"px";
    for(i=1;i<nbr;i++){
        div=document.createElement("div");
        div.className="photo";
        div.style.backgroundImage="url('data/base_movie"+i+".jpg')";
        container.appendChild(div);
    }

}