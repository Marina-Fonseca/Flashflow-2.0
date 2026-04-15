// --- Edição de Card ---
const editCardSection = document.getElementById('edit-card-section');
const editCardButton = document.getElementById('edit-card-button');
const editCardForm = document.getElementById('edit-card-form');
const editQuestionInput = document.getElementById('edit-question');
const editAnswerInput = document.getElementById('edit-answer');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

editCardButton.addEventListener('click', function() {
    if (flashcardsData.length === 0) {
        alert('Nenhum card para editar.');
        return;
    }
    // Preenche os campos com o card atual
    editQuestionInput.value = flashcardsData[currentCardIndex].question;
    editAnswerInput.value = flashcardsData[currentCardIndex].answer;
    editCardSection.style.display = 'block';
});

cancelEditBtn.addEventListener('click', function() {
    editCardSection.style.display = 'none';
});

editCardForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newQuestion = editQuestionInput.value.trim();
    const newAnswer = editAnswerInput.value.trim();
    if (newQuestion && newAnswer) {
        flashcardsData[currentCardIndex].question = newQuestion;
        flashcardsData[currentCardIndex].answer = newAnswer;
        saveFlashcards(flashcardsData, currentCategory);
        updateCardContent();
        editCardSection.style.display = 'none';
        alert('Card editado com sucesso!');
    }
});

// --- SUPORTE A CATEGORIAS ---
const defaultData = {
    programacao: [
        { question: "O que é JavaScript?", answer: "JavaScript é uma linguagem de programação interpretada e orientada a objetos, usada principalmente para adicionar interatividade e dinamismo a páginas web." },
        { question: "O que são funções de callback em JavaScript?", answer: "São funções passadas como argumento para outra função, que serão executadas após um determinado evento ou operação." },
        { question:  "O que é o this em JavaScript?", answer: "this se refere ao contexto de execução atual. Seu valor varia dependendo de como a função é chamada." },
        { question: "O que é hoisting em JavaScript?", answer: 'Hoisting é o comportamento em que declarações de variáveis e funções são "movidas" para o topo do escopo durante a fase de compilação. Isso faz com que seja possível usar uma função antes de sua definição no código.' },
        { question: "O que são tipos primitivos em JavaScript?", answer: "Os tipos primitivos em JavaScript são: String, Number, Boolean, Null, Undefined, BigInt e Symbol. Eles representam valores imutáveis e não são objetos." },
        { question: "Qual é a diferença entre absolute e relative na propriedade position do CSS?", answer: "relative: posiciona o elemento em relação à sua posição original e absolute: posiciona o elemento em relação ao elemento pai mais próximo que tenha position diferente de static (ou ao documento, se não houver pai posicionado)." },
        { question: "No CSS, qual unidade é relativa ao tamanho da fonte do elemento pai: em ou px?", answer: "em equivale ao tamanho da fonte do elemento pai." },
        { question: "Qual a diferença entre as tags <section> e <div> no HTML?", answer: "section: é semântica — usada para agrupar conteúdo relacionado que forma uma seção lógica da página e o div: é genérica — usada apenas para agrupar elementos, sem significado semântico." },
        { question: "Para que serve o atributo alt na tag <img> e por que ele é importante no HTML?", answer: "O atributo alt fornece um texto alternativo para a imagem, usado por leitores de tela e exibido quando a imagem não pode ser carregada. Ele é importante para acessibilidade e SEO." },
        { question: 'Qual a função do atributo target="_blank" em um link <a> no HTML?', answer: "Ele faz com que o link seja aberto em uma nova aba ou janela do navegador." }
    ],
    ingles: [
        { question: "When is your birthday?", answer: "My birthday is in July." },
        { question: "How do you usually celebrate your birthday?", answer: "I usually celebrate my birthday with my family and friends." },
        { question: "What is the plural of 'child'?", answer: "Children" },
        { question: "What does 'book' mean in Portuguese?", answer: "Livro" },
        { question: "Do you like receiving gifts?", answer: "Yes, I like it, but I prefer spending time with people I love." },
        { question: "What kind of cake do you like?", answer: "I like chocolate cake the most." },
        { question: "Do you like traveling?", answer: "Yes, I like traveling because I can see new places." },
        { question: "Where did you travel last time?", answer: "I traveled to Florida last year." },
        { question: "Who do you usually travel with?", answer: "I usually travel with my family." },
        { question: "What do you like to do when you travel?", answer: "I like to visit new places and try different foods." },
    ]
};

let currentCategory = 'programacao';

function getStorageKey(category) {
    return `flashcardsData_${category}`;
}

function saveFlashcards(data, category) {
    localStorage.setItem(getStorageKey(category), JSON.stringify(data));
}

function loadFlashcards(category) {
    const data = localStorage.getItem(getStorageKey(category));
    if (data) {
        return JSON.parse(data);
    } else {
        return defaultData[category] ? [...defaultData[category]] : [];
    }
}

let flashcardsData = loadFlashcards(currentCategory);
let currentCardIndex = 0;

// Referências aos elementos HTML
const flashcardElement = document.getElementById('flashcard');
const questionTextElement = document.getElementById('question-text');
const answerTextElement = document.getElementById('answer-text');
const cardCounterElement = document.getElementById('card-counter');
const nextButtonElement = document.getElementById('next-button');

document.getElementById('restart-button').addEventListener('click', function() {
    location.reload();
});

// Troca de categoria
const categorySelect = document.getElementById('category-select');
categorySelect.addEventListener('change', function() {
    currentCategory = this.value;
    flashcardsData = loadFlashcards(currentCategory);
    currentCardIndex = 0;
    updateCardContent();
});

// Lógica para adicionar novo card
const addCardForm = document.getElementById('add-card-form');
addCardForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const questionInput = document.getElementById('new-question');
    const answerInput = document.getElementById('new-answer');
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    if (question && answer) {
        flashcardsData.push({ question, answer });
        saveFlashcards(flashcardsData, currentCategory);
        questionInput.value = '';
        answerInput.value = '';
        currentCardIndex = flashcardsData.length - 1;
        updateCardContent();
        alert('Card adicionado com sucesso!');
    }
});

function updateCardContent() {
    // Remove a classe 'flipped' para garantir que o card esteja na pergunta
    flashcardElement.classList.remove('flipped');

    // Recarrega os dados do localStorage para garantir atualização
    flashcardsData = loadFlashcards(currentCategory);

    // Verifica se há cartas para exibir
    if (flashcardsData.length === 0) {
        questionTextElement.textContent = "Nenhum flashcard disponível.";
        answerTextElement.textContent = "Adicione cards para começar!";
        cardCounterElement.textContent = "0 de 0";
        nextButtonElement.disabled = true; 
        return;
    }

    if (currentCardIndex >= flashcardsData.length) {
        currentCardIndex = 0; // Volta para o início se chegar ao final
    }

    const currentCard = flashcardsData[currentCardIndex];
    questionTextElement.textContent = currentCard.question;
    answerTextElement.textContent = currentCard.answer;
    cardCounterElement.textContent = `Card ${currentCardIndex + 1} de ${flashcardsData.length}`;
    nextButtonElement.disabled = false; 
}

// Botão de apagar card
const deleteCardButton = document.getElementById('delete-card-button');
deleteCardButton.addEventListener('click', function() {
    if (flashcardsData.length === 0) {
        alert('Nenhum card para apagar.');
        return;
    }
    if (confirm('Tem certeza que deseja apagar este card?')) {
        flashcardsData.splice(currentCardIndex, 1);
        saveFlashcards(flashcardsData, currentCategory);
        if (currentCardIndex >= flashcardsData.length) {
            currentCardIndex = 0;
        }
        updateCardContent();
        alert('Card apagado com sucesso!');
    }
});

// Adiciona um efeito para virar o card 
flashcardElement.addEventListener('click', () => {
    flashcardElement.classList.toggle('flipped');
});

nextButtonElement.addEventListener('click', () => {
    currentCardIndex++; 
    updateCardContent(); 
});

// Chama a função para carregar o primeiro card quando a página é carregada
document.addEventListener('DOMContentLoaded', updateCardContent);
