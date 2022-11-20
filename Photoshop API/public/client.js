function validate(filePath){
    console.log(filePath)

    
    var allowedExtensions = /(\.jpg|\.png)$/i;
    if(!allowedExtensions.exec(filePath)){
        alert('Please upload .jpg and .png images only.');
        document.getElementById('image').value=null;
        return false;
    }else{
        //Image preview
        document.getElementsByClassName("button")[0].removeAttribute("disabled");
        document.getElementsByClassName("button")[1].removeAttribute("disabled");
       
    }

}