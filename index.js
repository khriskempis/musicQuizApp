

// === START PAGE RENDERING === 


function generateStartPage(){
	let startPageHTML = ` <div class="start-page container center">
    <form class="quiz-start js-quiz-start">
      <header>
        <h1>Music Note Quiz</h1>
      </header>
      <p>Test your Sight-Reading Ability!</p>
      <button class="js-start">Get Started!</button>
    </form>
  </div>`;

  return startPageHTML
}

function renderStartPage(){
	const startPageHTML = generateStartPage();
	$('.main-viewport').html(startPageHTML)
}


// === QUESTION RENDERING === 


// create the correct answer 
function generateCorrectAnswer(){
	let correctAnswer = `<button class="answer col-6 js-answer js-correct-answer">${quizDATA.name}</button>`

	return correctAnswer; 
};

// finds a random index
function randomIndex(num){
	return Math.floor(Math.random() * num)
};

function setQuizData(data){
	quizDATA.name = data.name
	quizDATA.src = data.src
};

function createQuestionObject(dataItem){
		// create new object with information to be passed around to other functions
	let infoObject = {
			name:  dataItem.name,
			question:	`
	<form class="question js-question">
    <div class="container center">
      <section role="score" class="track-info">
        <h3 class="question-display">Question: <span>${quizDATA.questionNum}</span>/10</h3>
        <h3 class="score-display"> Score: <span class="js-score">${quizDATA.score}</span></h3>
      </section>
      <h4 class="hidden js-answer-display">${dataItem.name}</h4>
      <section role="note image" class="note-img">
        <img src="${dataItem.src}"" alt="${dataItem.alt}">
      </section>
      <section role="multiple choice answers" class="row buttons center">`,

   answer: generateCorrectAnswer()
	};

   return infoObject;
};

// iterate through data and select question to ask 
function generateQuestion(array){
	const indexItem = randomIndex(array.length)
	const questionInfo = array[indexItem]; 

	let correctAnswer = setQuizData(questionInfo);

	let questionObject = createQuestionObject(questionInfo)

  return questionObject; 
};

function generateWrongAnswers(){
	let wrongAnswers = [];

	for(let i = 0; i < STORE.length; i++){
			let data = STORE[i].name
		if(!wrongAnswers.includes(data)){
			wrongAnswers.push(data); 
		}
	}

	return wrongAnswers; 
}

// create random answers
function generateRandomAnswers(object){
	// create function to handle array 
	const answers = generateWrongAnswers(); 
	const buttonsStringArray = []
	// loop until array has 3 random answers 
	while(buttonsStringArray.length < 3){
		// removes random answer from array
		let wrongAnswer = answers.splice(randomIndex(answers.length), 1).toString();
		// checks to make sure it doesn't push the correct answer into random answers
		if(wrongAnswer !== object.name){
			buttonsStringArray.push(`<button class="answer col-6 js-answer">${wrongAnswer}</button>`)
		} 		
	};
	
	return buttonsStringArray;
};

// takes all buttons and randomizes them to include the answer
function randomizeAnswers(array){
	const randomAnswers = []

	// randomize answers
	for(let i = 0; i < 4; i++){
		randomAnswers.push(array.splice(randomIndex(array.length), 1))
	}
	return randomAnswers
}

// build the question 
function generateQuestionAndAnswers(){
	// creates the question which is an object with all info
	const questionObject = generateQuestion(STORE); 

	// creates random answers
	let buttonsArray = generateRandomAnswers(questionObject);

	// adds the right answer into the buttons array
	buttonsArray.push(questionObject.answer); 

	// randomizes all the answers 
	randomAnswers = randomizeAnswers(buttonsArray); 

	// creates a string of the buttons array
	let buttonsString = randomAnswers.join(''); 

	let questionString = '';

	// creates the string that includes all info 
	questionString += questionObject.question + buttonsString +
		` </section>
		  </div>
		    <section role="feedback" class="js-feedback hidden center">
		      <h2>Correct!</h2>
		      <p class="js-feedback-answer"></p>
		      <button class="next js-next">Next</button>
		    </section>
		  </form>
		`;

		return questionString; 
};

// render to DOM 
function renderQuestionAndAnswers(){

	const questionHTML = generateQuestionAndAnswers()
	$('.main-viewport').html(questionHTML)
};



// === RESULTS RENDERING === 

function resultsFeedback(){

	return (quizDATA.score <= 5) ? 'You need to practice..' : 'You did Amazing! <br> Well Done!';
}

// generate HTML string  
function generateResults(){

	let resultsHTML = 
	`<form class="quiz-end js-quiz-end">
    <div class="container center">
      <header >
        <h1 class="js-result">RESULT</h1>
      </header>
      <h2><span class="js-questions-answered">${quizDATA.score}</span> / 10 Correct</h2>
      <p>${resultsFeedback()}</p>
      <button class="js-restart restart">Play Again</button>
    </div>
  </form>`;

  return resultsHTML;
};

// render results to the DOM
function renderResults(){
	const resultsHTML = generateResults();
	$('.main-viewport').html(resultsHTML); 
}




// === CLICK EVENTS ===

function randomEncouragment(){
	const comments = [
	'Amazing!',
	'Keep it up!',
	"You're doing Great!",
	'Wow!', 
	'Are you a Musician?'
	]

	return comments[randomIndex(comments.length)]
}

// handle multiple choice answers 
function handleAnswersClicked(){
	let questionForm = $('.main-viewport').find('.buttons')



	questionForm.on('click', '.js-answer', function(event){

		event.preventDefault(); 

		let answerClicked = $(this).text();
		let feedbackSection = $('.js-feedback');
		let feedbackHeader = feedbackSection.find('h2');
		let feedbackButton = feedbackSection.find('button'); 
		let scoreDisplay = $('.js-score');

		let correctButton = $('.js-correct-answer');
		let feedbackParagraph = $('.js-feedback-answer')

		feedbackSection.removeClass('hidden');

		if(!quizDATA.hasBeenSelected){

			if(answerClicked !== quizDATA.name){
				feedbackHeader.text('Wrong!');
				$(this).addClass('wrong');
				feedbackParagraph.text(`The correct answer is ${quizDATA.name}`)
			} else {
				feedbackHeader.text('Correct!')
				feedbackParagraph.text(randomEncouragment());
				quizDATA.score++; 

			}
			correctButton.addClass('correct')
			quizDATA.questionNum++;
			quizDATA.hasBeenSelected = true;
			scoreDisplay.text(quizDATA.score);
		}
	});
};

function handleNextClicked(){

	let feedbackNextButton = $('.main-viewport').find('.js-feedback');

	feedbackNextButton.on('click', '.js-next', event => {

		event.preventDefault(); 

		quizDATA.hasBeenSelected = false;

		if (quizDATA.questionNum <= 10) {
			handleQuiz(); 
		}	else {
			renderResults(); 
			handleRestartClicked(); 
		}
	});
};


function handleStartClicked(){
	let startButton = $('.main-viewport').find('.js-start'); 

	startButton.click(event => {
		event.preventDefault(); 

		handleQuiz(); 
	});

};

function handleRestartClicked(){
	let restartButton = $('.main-viewport').find('.js-restart');

	restartButton.click(function(event){
		event.preventDefault();

		quizDATA.questionNum = 1;
		quizDATA.score = 0; 

		handleQuiz();

	});
};


// when DOM is ready generate question and handle clicks 

function handleQuiz(){
	renderQuestionAndAnswers(); 
	handleAnswersClicked(); 
	handleNextClicked(); 
};

// when DOM first loads in 
function init(){

	renderStartPage(); 
	handleStartClicked();

};

$(init());



