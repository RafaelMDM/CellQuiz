$(document).ready(function () {

	let questionNumber = 0;
	let questionBank = [];
	let stage = '#game1';
	let stage2 = '#game2';
	let questionLock = false;
	let numberOfQuestions;
	let score = 0;

	// Lendo os dados do arquivo .JSON
	$.getJSON('./perguntas.json', function (data) {
		let questions = [];
		for (const question of data.quizlist) {
			const shuffledQuestion = {
				...question,
				correctOption: question.options[0],
				options: shuffleThisBitch(question.options),
			}

			questions.push(shuffledQuestion);
		}
		console.log(questionBank);
		questionBank = shuffleThisBitch(questions);
		console.log(questionBank);
		numberOfQuestions = questionBank.length;

		displayQuestion();
	});

	function shuffleThisBitch(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	function displayQuestion() {
		const {
			question,
			questionTxt,
			correctOption,
			options
		} = questionBank[questionNumber];

		const correctId = options.indexOf(correctOption) + 1;

		$(stage).append(`
			<div class="questionImage"><img src="img/${question}"</div>
			<div class="questionText">${questionTxt}</div>
			<div id="1" class="option">${options[0]}</div>
			<div id="2" class="option">${options[1]}</div>
			<div id="3" class="option">${options[2]}</div>
			<div id="4" class="option">${options[3]}</div>
		`);

		$('.option').click(function () {
			if (!questionLock) {
				questionLock = true;

				if (this.id == correctId) {
					//Resposta correta
					$(stage).append('<div class="feedback1">CORRETO</div>');
					score++;
				} else {
					//Resposta errada	
					$(stage).append('<div class="feedback2">ERRADO</div>');
				}
				setTimeout(function () {
					changeQuestion();
				}, 1000);
			}
		})
	}

	//Muda p/ a próxima pergunta
	function changeQuestion() {
		questionNumber++;
		[stage, stage2] = [stage2, stage];

		if (questionNumber < numberOfQuestions) {
			displayQuestion();
		} else {
			displayFinalSlide();
		}

		$(stage2).animate({
			right: '+=800px'
		}, 'slow', function () {
			$(stage2).css('right', '-800px');
			$(stage2).empty();
		});
		$(stage).animate({
			right: '+=800px'
		}, 'slow', function () {
			questionLock = false;
		});
	}

	//Mostra o último slide
	function displayFinalSlide() {
		$(stage).append(`<div class="finalSlide">
			Você completou o Quiz!<br><br>
			Total de perguntas: ${numberOfQuestions}<br>
			Respostas corretas: ${score}
		</div>`);
	}
});