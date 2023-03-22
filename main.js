let countSpan = document.querySelector(".count span");
let spans = document.querySelector(".Bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let submit = document.querySelector(".submit");
let bullets = document.querySelector(".Bullets");
let results = document.querySelector(".results");
let countDownSpan = document.querySelector(".count-down");
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;

            createBullets(questionsCount);
            getQData(questionsObject[currentIndex], questionsCount);
            Timer(5 , questionsCount);

            submit.onclick = () => {
                let rightAnswer = questionsObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(rightAnswer, questionsCount);
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                getQData(questionsObject[currentIndex], questionsCount);
                handleBullets();
                clearInterval(countDownInterval);
                Timer(5 , questionsCount);
                showResult(questionsCount);
            }
        }
    };
    myRequest.open("GET", "questions.json", true);
    myRequest.send();
}
getQuestions();


function createBullets(num) {
    countSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let Bullets = document.createElement('span');
        let spans = document.querySelector(".Bullets .spans");
        if (i === 0) {
            Bullets.className = "on";
        }
        spans.appendChild(Bullets);
    }
}

function getQData(obj, count) {
    if (currentIndex < count) {
        
    let theQuestion = document.createElement("h2");
    let QuestionText = document.createTextNode(obj["title"]);
    theQuestion.appendChild(QuestionText);
    quizArea.appendChild(theQuestion);

    for (let j = 1; j <= 4; j++) {
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";

        let radioInput = document.createElement("input");
        radioInput.name = "answers";
        radioInput.type = "radio";
        radioInput.id = `ANS-${j}`;
        radioInput.dataset.answer = obj[`ANS-${j}`];

        if (j === 1) {
            radioInput.checked = true;
        }

        let label = document.createElement("label");
        label.htmlFor = `ANS-${j}`;
        let labelText = document.createTextNode(obj[`answer_${j}`]);

        answersArea.appendChild(mainDiv);
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(label);
        label.appendChild(labelText);
    }
    }

} 

function checkAnswer(rAnswer, count) {
    let Answers = document.getElementsByName("answers");
    let thChoosenAnswer;
    for (let i = 0; i < Answers.length; i++) {
        if (Answers[i].checked = true) {
            thChoosenAnswer = Answers[i].dataset.answer;
        }
    }
    if (rAnswer === thChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".quiz-app .Bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResult(count) {
    if (currentIndex === count) {
        let theResults;
        quizArea.remove();
        answersArea.remove();
        submit.remove();
        bullets.remove();

        if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span> , You got ${rightAnswers} from ${count}`;
        } else if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span> , You got ${rightAnswers} from ${count}`;
        } else {
            theResults = `<span class="bad">Bad</span> , You got ${rightAnswers} from ${count}`;
        }

        results.innerHTML = theResults;
    }
}

function Timer(duration, count) {
    if (currentIndex < count) {
        let minutes , seconds;
        countDownInterval = setInterval(function () {

            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;

            countDownSpan.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submit.click();
            }
        }, 1000);
    }
}