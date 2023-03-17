class qdata {
    #question;
    #incorrectChoices;
    #correctChoice;
    #choices;

    constructor(JSONResponse) {
        this.#question = JSONResponse.question;
        this.#incorrectChoices = JSONResponse.incorrect_answers;
        this.#correctChoice = JSONResponse.correct_answer;
    }

    filterReplace(str) {
        return str.replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");
    }

    get question() {
        return this.filterReplace(this.#question);
    }

    get choices() {
        this.#choices = [...this.#incorrectChoices];
        this.#choices.push(this.correctChoice)
        /* Applying Fisher-Yates Shuffle */
        let currentIndex = this.#choices.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [this.#choices[currentIndex], this.#choices[randomIndex]] =
                [this.#choices[randomIndex], this.#choices[currentIndex]];
        }
        return this.#choices.map(item => this.filterReplace(item))
            .reduce((a, v, i) => ({ ...a, ["choice" + (i + 1)]: v }), {})
    }

    get correctChoice() {
        return this.#correctChoice;
    }
}

fetch("https://opentdb.com/api.php?amount=15&category=31&difficulty=easy&type=multiple")
    .then(response => response.json())
    .then(data => {
        // console.log(data.results);
        let score, questionCounter, seconds, timer, currentQuizData, itemsLeft, QuizData;
        let acceptAnswers;
        /* Maximum Number of Questions Asked */
        const MaxData = data.results.length;
        /* helper function - Get New QuizData */
        const getNewData = () => {
            itemsLeft--;
            currentQuizData = QuizData.pop();
        }
        /* helper function - get question */
        const getQuestion = () => currentQuizData.question;
        /* helper function - get options */
        const getOptions = () => currentQuizData.choices;
        /* helper function - check for correctness */
        const checkAnswer = (userChoice) => (userChoice === currentQuizData.correctChoice);

        start = () => {
            QuizData = data.results.map(q => new qdata(q));
            itemsLeft = MaxData;
            score = questionCounter = 0;
            getNewQuestion();
        }
        /* Award score for correct answer */
        awardScore = (s) => {
            score += s;
            document.getElementById("score").textContent = score;
        }

        getNewQuestion = () => {
            getNewData()
            /* Fetching data from object */
            if (itemsLeft === 0 || questionCounter >= MaxData) {
                localStorage.setItem("recent-score", score);
                console.log("bye!")
                return window.location.assign("../html/end.html");
            }
            questionCounter++;
            /* Updating the Question Number */
            document.getElementById("questionCounter").textContent =
                `${questionCounter}/${MaxData}`
            /* Displaying the Question */
            document.getElementById("question").textContent = getQuestion();
            /* Displaying multiple choices */
            const choices = Array.from(document.getElementsByClassName("choice-text"));
            let options = getOptions();
            choices.forEach((choice) => {
                const number = choice.dataset.number;
                choice.textContent = options["choice" + number];
            })
            seconds = 15;
            startTimer();
            /* Start to accept answers */
            acceptAnswers = true;
            /* removing the spinner/loader */
            document.getElementById("loader").classList.add("hidden")
            document.getElementById("game").classList.remove("hidden");
            /* Seconds to accept some answers! */
            choiceOptions();
        }

        choiceOptions = () => {
            const choices = Array.from(document.getElementsByClassName("choice-text"));
            choices.forEach(choice => {
                choice.addEventListener('click', e => {
                    if (!acceptAnswers) return;

                    acceptAnswers = false;
                    /* Choice picked by user */
                    const userChoice = choice.textContent;
                    /* css style classes to show incorrect/correct pick */
                    const classToApply =
                        checkAnswer(userChoice) ? "correct" : "incorrect";

                    awardScore(classToApply === "correct" ? 10 : 0); //Award for correct answer

                    /* targeting parentElement for css style */
                    e.target.parentElement.classList.add(classToApply);
                    /* wait for next question once answered */
                    setTimeout(() => {
                        e.target.parentElement.classList.remove(classToApply);
                        clearInterval(timer);
                        getNewQuestion();
                    }, 700);
                })
            })
        }

        startTimer = () => {
            timer = setInterval(() => {
                const safeTimerDisplay = document.getElementById("safeTimerDisplay");
                seconds > 9 ? safeTimerDisplay.textContent = "00:" + seconds
                    : safeTimerDisplay.textContent = "00:0" + seconds
                seconds -= 1;

                let totalTime = 15;
                document.getElementById("progressBarFull").style.width
                    = `${((totalTime - seconds) / totalTime) * 100}%`

                if (seconds < 0) {
                    clearInterval(timer);
                    awardScore(0);
                    getNewQuestion();
                }
            }, 1000);
        }

        start();
    })
    .catch(err => console.error(err))