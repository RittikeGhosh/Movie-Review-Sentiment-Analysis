function analyse(){
    if (inputOne.value == '' || inputTwo.value == '')
        alert("The inputs should not be empty !");
    else{
        exit();

        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.onreadystatechange  = () => {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
                data = JSON.parse(ajaxRequest.responseText);
                setTimeout(() => addSentiment(data), 50);
            }
            else if(ajaxRequest.status == 404){
                alert("Failed to Analyse. Some error has occured.");
                ajaxRequest.abort();
            }
        }
        ajaxRequest.open("GET", "/imdb/analyse?name=" + inputOne.value + "&text=" + inputTwo.value, true);
        ajaxRequest.send();       
    }
}

function exit(){
    element.style.opacity = 0.4;
    element.style.top = "40%";
    setTimeout(() => model.style.display = "none", 200);
}

function animateLargeEmoji(nodeImgUrl){
    "use strict"
    nodeImgUrl = nodeImgUrl.replace("32px", "512px");
    console.log(nodeImgUrl);
    document.getElementById("success-emoji").style.display = "block";
    let largeEmoji = document.getElementById("large-emoji-box");
    largeEmoji.getElementsByTagName('img')[0].src = nodeImgUrl;
    setTimeout(() => {
        largeEmoji.style.top = "10%";
        largeEmoji.style.transform = "translate(-50%, -10%) scale(1)";
        
        setTimeout(() => {
            largeEmoji.style.top = "120%";
            largeEmoji.style.transform = "translate(-50%, -10%) scale(0)";
            document.getElementById("success-emoji").style.display = "none";
        }, 2500);
    }, 50);
}

function addSentiment(data){
    "use strict"
    // create new node to add the personalize comment/review
    const newNodeContainer = document.getElementsByClassName('reviews')[0]; 
    const node = document.getElementsByClassName('sentiment')[0];
    let newNode = node.cloneNode(true);
    newNodeContainer.appendChild(newNode);
    
    let percent = data.percent;
    let emojiPos = -1;
    let color = '#04b11b';
    let degree = Math.ceil(percent/100 * 180);
    let v2 = newNode.querySelectorAll('.visualiser-out .circle .fill');
    let v1 = newNode.querySelectorAll('.visualiser-out .circle .mask.full');

    newNode.style.display = "block";
    newNode.querySelectorAll('#custom-uname')[0].innerHTML = "User: " + data.name;
    newNode.getElementsByTagName("blockquote")[0].innerHTML = data.text;
    newNode.getElementsByClassName("visualiser-in")[0].innerHTML = percent + '%';
    
    if(percent > 80 && percent <= 100){
        emojiPos = 4;
    }
    else if(percent > 60){
        emojiPos = 3;
        color = "rgb(105, 190, 24)";
    }
    else if(percent > 40){
        emojiPos = 2;
        color = "rgb(223, 202, 16)";
    }
    else if(percent > 20){
        emojiPos = 1;
        color = "rgb(243, 99, 16)";
    }
    else {
        emojiPos = 0;
        color = "rgb(223, 13, 13)";
    }

    setTimeout(() => {
        newNode.style.transform =  "scale(1)";
        newNode.getElementsByClassName('emojis')[emojiPos].style.opacity = 1;
        newNode.getElementsByClassName('emojis')[emojiPos].style.transform = "scale(1.1)";
        newNode.querySelectorAll('.fill')[0].style.backgroundColor = color;
        newNode.querySelectorAll('.fill')[1].style.backgroundColor = color;

        for(let i = 0; i < v1.length; i++){
        v1[i].style.transform = "rotate(" + degree + "deg)";
        }
        for(let i = 0; i < v2.length; i++){
            v2[i].style.transform = "rotate(" + degree + "deg)";
        }
        setTimeout(() => {
            animateLargeEmoji(newNode.getElementsByClassName('emojis')[emojiPos].getElementsByTagName('img')[0].src)
        },
            1000);
    }, 50);
}

// main body...
var model = document.getElementById('user-review-input');
var element = document.querySelectorAll('#user-review-input .input-area')[0];
var inputOne = document.querySelectorAll("#user-review-input .input-area input")[0];
var inputTwo = document.querySelectorAll("#user-review-input .input-area textarea")[0];

document.getElementById("add-review-button").addEventListener(
    "click", () => {
        // clear the past inputs
        clear = (() => {
                inputOne.value = '';
                inputTwo.value = '';
            })();
        model.style.display = "block";
        setTimeout(() => {
            element.style.opacity = 1;
            element.style.top = "10%";
        }, 50);
});