// main body...
var addReview = false;
var model = document.getElementById('user-review-input');
var element = document.querySelectorAll('#user-review-input .input-area')[0];
var inputOne = document.querySelectorAll("#user-review-input .input-area input")[0];
var inputTwo = document.querySelectorAll("#user-review-input .input-area textarea")[0];

reviewBox = document.querySelectorAll('.reviews.db')[0];
dbReview = document.getElementsByClassName('db-review-container')[0];
windowHeight = window.innerHeight;
if(dbReview.offsetHeight - reviewBox.offsetHeight > windowHeight)
    reviewBox.style.height = reviewBox.offsetHeight + windowHeight + 'px';
else
    reviewBox.style.height = "auto";

window.onload = function(){
    "use strict"
    let color = "";
    let progBar = document.getElementsByClassName('db-review-pbar');
    for(let i = 0; i < progBar.length ; i++){
        let review = progBar[i].nextElementSibling.innerHTML;
        let ajaxReq = new XMLHttpRequest();
        ajaxReq.onreadystatechange = () => {
            if(ajaxReq.readyState== 4 && ajaxReq.status == 200){
                (function(){
                    let data = JSON.parse(ajaxReq.responseText);
                    let percent = parseInt(data.percent);
                    progBar[i].querySelectorAll('.tooltip span')[0].innerHTML = percent;

                    if(percent > 80 && percent <= 100)
                        color = '#04b11b';
                    else if(percent > 60)
                        color = "rgb(105, 190, 24)";
                    else if(percent > 40)
                        color = "rgb(223, 202, 16)";
                    else if(percent > 20)
                        color = "rgb(243, 99, 16)";
                    else 
                        color = "rgb(223, 13, 13)";
            
                    progBar[i].getElementsByClassName('db-bar')[0].style.backgroundColor = color;
                    progBar[i].getElementsByClassName('db-bar')[0].style.width = percent + '%';
                })();
            }
        }
        ajaxReq.open("GET", "/imdb/analyse?&text=" + encodeURIComponent(review), true);
        ajaxReq.send();
    }
};

document.querySelectorAll('.db-reviews.add-review')[0].onclick = function(){
    if(addReview == false){
        alert("Your First review may take more time to analyse because of any ongoing anaylsing of Saved-user reviews below!")
        addReview = true;
    }

    // clear the past inputs
    (() => {inputOne.value = ''; inputTwo.value = '';})();
    model.style.display = "block";
    setTimeout(() => {
        element.style.opacity = 1;
        element.style.top = "20vh";
    }, 50);
}

document.getElementsByClassName('load-more')[0].onclick = function(){
    // alert(reviewBox.offsetHeight);
    windowHeight = window.innerHeight;
    if(dbReview.offsetHeight - reviewBox.offsetHeight > 2*windowHeight)
        reviewBox.style.height = reviewBox.offsetHeight + windowHeight * 2 + 'px';
    else{
        reviewBox.style.height = "auto";
        document.getElementsByClassName('load-more')[0].style.display = "none";
        newText = document.createTextNode("No More Reviews available");
        reviewBox.appendChild(newText);
    }
    // setTimeout(() => document.getElementById("user-review-scroll").scrollIntoView(), 100);
}

function exit(){
    element.style.opacity = 0.4;
    element.style.top = '50vw';
    setTimeout(() => model.style.display = "none", 200);
}

function analyse(){
    if (inputOne.value == '' || inputTwo.value == '')
        alert("The inputs should not be empty !");
    else{
        exit();
        let newNode = createReviewNode();
        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.onreadystatechange  = () => {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
                let data = JSON.parse(ajaxRequest.responseText);
                setTimeout(() => addSentiment(data, newNode), 50);
            }
            else if(ajaxRequest.status == 404){
                alert("Failed to Analyse. Some error has occured.");
                ajaxRequest.abort();
            }
        }
        let uri  = "&text=" + encodeURIComponent(inputTwo.value);
        ajaxRequest.open("GET","/imdb/analyse?" + uri, true);
        ajaxRequest.send();       
    }
}

function createReviewNode(){
    // create new node to add the personalize comment/review
    const newNodeContainer = document.getElementsByClassName('reviews')[0]; 
    const node = document.getElementsByClassName('sentiment')[0];
    let newNode = node.cloneNode(true);
    newNodeContainer.insertBefore(newNode, node.nextElementSibling);
    newNode.style.display = "block";
    newNode.querySelectorAll('#custom-uname')[0].innerHTML = "User: " + inputOne.value;
    newNode.getElementsByTagName("blockquote")[0].innerHTML = inputTwo.value;
    return newNode;
}

function addSentiment(data, newNode){
    "use strict" 
    let percent = parseInt(data.percent);
    let emojiPos = -1;
    let color = '#04b11b';
    let degree = percent/100 * 180;
    let v2 = newNode.querySelectorAll('.visualiser-out .circle .fill');
    let v1 = newNode.querySelectorAll('.visualiser-out .circle .mask.full');

    newNode.style.opacity = "1";
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
    }, 1000);
}

function animateLargeEmoji(nodeImgUrl){
    "use strict"
    nodeImgUrl = nodeImgUrl.replace("32px", "512px");
    console.log(nodeImgUrl);
    document.getElementById("success-emoji").style.display = "block";
    let largeEmoji = document.getElementById("large-emoji-box");
    largeEmoji.getElementsByTagName('img')[0].src = nodeImgUrl;
    setTimeout(() => {
        largeEmoji.style.top = "100px";
        largeEmoji.style.transform = "translateX(-50%) scale(1)";
        
        setTimeout(() => {
            largeEmoji.style.top = "1000px";
            largeEmoji.style.transform = "translate(-50%, -10%) scale(0)";
            document.getElementById("success-emoji").style.display = "none";
        }, 2500);
    }, 50);
}
