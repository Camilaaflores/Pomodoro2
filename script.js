const timerDisplay = document.querySelector("#timerDisplay");
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resumeBtn = document.querySelector("#resumeBtn");
const resetBtn = document.querySelector("#resetBtn");

let interval;
let totalSeconds = 5; // Tempo inicial do cronômetro
let listaExercicios = [];
let exercicioAtual = 0;
let offset = 0;
let isPaused = false;

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
  }
  
  function exibirExercicio() {
    const dificuldadeExercicio = document.getElementById('dificuldade_exercicio');
    const descricaoExercicio = document.getElementById('descricao_exercicio');
  
    // Ocultar exercício anterior
    dificuldadeExercicio.innerText = "";
    descricaoExercicio.innerText = "";
  
    // Exibir novo exercício
    dificuldadeExercicio.innerText = listaExercicios[exercicioAtual].difficulty;
    descricaoExercicio.innerText = listaExercicios[exercicioAtual].instructions;
  
    // Esconder botões de controle do cronômetro
    startBtn.style.display = "none";
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "none";
    resetBtn.style.display = "none";
  
    // Reiniciar cronômetro principal
    resetTimer();
  
    // Aguardar 1 segundo antes de iniciar o cronômetro de 5 segundos
    setTimeout(() => {
      // Exibir botões de controle do cronômetro
      startBtn.style.display = "inline-block";
      resetBtn.style.display = "inline-block";
  
      // Cronômetro de 5 segundos para o cliente fazer o exercício
      let segundosRestantes = 5;
      const segundoCronometro = setInterval(() => {
        if (segundosRestantes === 0) {
          clearInterval(segundoCronometro);
          // Atualizar exercício ou reiniciar ciclo
          if (exercicioAtual === 9) {
            offset += 10;
            exercicioAtual = 0;
            getExercises();
          } else {
            exercicioAtual++;
          }
          return;
        }
        // Atualizar o display do cronômetro de 5 segundos
        timerDisplay.textContent = `00:${formatTime(segundosRestantes)}`;
        segundosRestantes--;
      }, 1000);
    }, 1000);
  }  

function getExercises() {
  fetch("https://api.api-ninjas.com/v1/exercises?type=stretching&offset=" + offset, {
    method: 'GET',
    headers: { 'X-Api-Key': 'K60s2IpHzUaQ3fAtMHfcKQ==7F60dailImM25omw'},
    contentType: 'application/json',
  })
  .then(response => response.json())
  .then(dados => {
    listaExercicios = dados;
  })
  .catch(error => console.log(error))
}

// Chamar a função para carregar os exercícios inicialmente
getExercises();

