const timerDisplay = document.querySelector("#timerDisplay");
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resumeBtn = document.querySelector("#resumeBtn");
const resetBtn = document.querySelector("#resetBtn");

let interval;
let totalSeconds = 5; // Tempo inicial do cronômetro
let listaExercicios = [];
let exercicioAtual = parseInt(localStorage.getItem('exercicioAtual')) || 0;
let offset = parseInt(localStorage.getItem('offset')) || 0;
let isPaused = false;

// Verifica se há dados salvos no localStorage e os recupera, se houver
if (localStorage.getItem('pomodoroTimer')) {
    totalSeconds = parseInt(localStorage.getItem('pomodoroTimer'));
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resumeBtn.addEventListener("click", resumeTimer);
resetBtn.addEventListener("click", resetTimer);

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function startTimer() {
    interval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            exibirExercicio();
            return;
        }

        if (!isPaused) {
            totalSeconds--;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            timerDisplay.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
            // Salva o tempo atual no localStorage sempre que houver uma alteração
            localStorage.setItem('pomodoroTimer', totalSeconds.toString());
        }
    }, 1000);

    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
}

function pauseTimer() {
    clearInterval(interval);
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "inline-block";
    isPaused = true;
}

function resumeTimer() {
    isPaused = false;
    startTimer();
    pauseBtn.style.display = "inline-block";
    resumeBtn.style.display = "none";
}

function resetTimer() {
    clearInterval(interval);
    totalSeconds = 5; // Defina o tempo inicial do cronômetro aqui
    timerDisplay.textContent = "00:05"; // Atualiza o display do cronômetro
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "none";
    isPaused = false; // Certifica-se de que o timer não esteja pausado
    // Remove os dados do localStorage ao resetar o timer
    localStorage.removeItem('pomodoroTimer');
}

function exibirExercicio() {
    const dificuldadeExercicio = document.getElementById('dificuldade_exercicio');
    const descricaoExercicio = document.getElementById('descricao_exercicio');
    const nomeExercicio = document.getElementById('nome_exercicio')

    // Ocultar exercício anterior
    nomeExercicio.innerText = "";
    dificuldadeExercicio.innerText = "";
    descricaoExercicio.innerText = "";

    // Exibir novo exercício
    nomeExercicio.innerText = listaExercicios[exercicioAtual].name
    dificuldadeExercicio.innerText = listaExercicios[exercicioAtual].difficulty;
    descricaoExercicio.innerText = listaExercicios[exercicioAtual].instructions;

    // Reiniciar cronômetro principal
    resetTimer();

    // Exibir botões de controle do cronômetro
    startBtn.style.display = "inline-block";
    resetBtn.style.display = "inline-block";

    // Cronômetro de 5 segundos para o cliente fazer o exercício
    let segundosRestantes = 5;
    const segundoCronometro = setInterval(() => {
        if (segundosRestantes === 0) {
            clearInterval(segundoCronometro);
            // Ocultar exercício após o término do cronômetro
            dificuldadeExercicio.innerText = "";
            descricaoExercicio.innerText = "";
            nomeExercicio.innerText = "";
            // Atualizar exercício ou reiniciar ciclo
            if (exercicioAtual === 9) {
                offset += 10;
                exercicioAtual = -1;
                localStorage.setItem('offset', offset)
                getExercises(); // Busca novos exercícios da API
            }
                exercicioAtual++;
                localStorage.setItem('exercicioAtual', exercicioAtual)
            
            // Reiniciar cronômetro principal
            resetTimer();
            // Exibir botões de controle do cronômetro
            startBtn.style.display = "inline-block";
            resetBtn.style.display = "inline-block";
            return;
        }
        // Atualizar o display do cronômetro de 5 segundos
        timerDisplay.textContent = `00:${formatTime(segundosRestantes)}`;
        segundosRestantes--;
    }, 1000);
}

function getExercises() {
    fetch("https://api.api-ninjas.com/v1/exercises?type=stretching&offset=" + offset, {
        method: 'GET',
        headers: { 'X-Api-Key': 'K60s2IpHzUaQ3fAtMHfcKQ==7F60dailImM25omw' },
        contentType: 'application/json',
    })
        .then(response => response.json())
        .then(dados => {
            listaExercicios = dados.map(exercise => {
                return {
                    name: exercise.name,
                    difficulty: exercise.difficulty,
                    instructions: exercise.instructions,
                }
            })
            console.log(listaExercicios)
        })
        .catch(error => console.log(error))
}

// Chamar a função para carregar os exercícios inicialmente
getExercises();
