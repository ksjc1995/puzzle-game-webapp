<template>
  <div class="row">
    <div class="container-fluid col-lg-6 col-sm-10 col-10 col-md-7 mt-5">
         <h1 class="text-center"><span class="badge badge-primary shadow-sm mb-3">Word Puzzle Game</span></h1>
      <div v-if="isPlaying" class="guess_game_container">
        <GameCompleteModal
          v-if="isGameComplete"
          :score="score"
          :totalQuesAnswered="totalQuesAnswered"
          :totalQuestions="questions[1].length+questions[2].length+questions[3].length"
        ></GameCompleteModal>
       
        <div class="row mb-5">
          <div class="col-12 col-sm-12 col-lg-6 col-md-6">
            <span class="mb-2 ml-1 p-2 badge badge-success game_details">Score: {{score}}</span>
            <span
              class="ml-4 mb-3 p-2 badge badge-success game_details"
            >Time: {{millisToMinutesAndSeconds(timeRemaining)}}</span>
          </div>
          <div class="col-12 col-sm-12 col-lg-6 col-md-6">
            <div class="row">
              <div class="col-3 col-sm-3 col-md-4">
                <span class="p-2 ml-1 level_badge badge badge-warning">Level {{currentLevel}}</span>
              </div>
              <div class="col-7 col-sm-8 col-md-8 text-center">
                <span class="game_btns">
                  <span class="p-1 badge badge-danger" @click="resetAnswer">Clear</span>
                  <span class="p-1 badge badge-danger" @click="restartGame">Restart Level</span>
                  <span
                    class="p-1 badge badge-danger"
                    v-if="currQuesIndex < questions[currentLevel].length-1"
                    @click="skipQues"
                  >Skip question</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row matrix_container">
          <div class="col-12 col-lg-6 col-md-12 col-sm-12">
            <div v-for="(row,rowIndex) in charMatrix" class="row ml-1" :key="rowIndex">
              <div
                v-for="(col,colIndex) in row"
                @click="(isAnswerCorrect || isLevelOver || timeUp)?'':matrixColClickHandler(rowIndex,colIndex)"
                :key="rowIndex+colIndex"
                disable
                class="col-2 h2 col-sm-2 col-md-2 col-lg-2 p-2 rounded mr-3 mb-3 text-center matrix_col"
              >{{col}}</div>
            </div>
          </div>
          <div v-if="!timeUp" class="col-12 col-lg-6 col-md-12 col-sm-12 answer_container pl-2">
            <p
              class="puzzle_question h3 ml-2 pr-4"
            >{{this.currQuesIndex+1+ "). "}}{{questions[this.currentLevel][this.currQuesIndex].ques}}</p>
            <div class="row ml-2">
              <div
                class="col-1 border-dark border-bottom p-3 mr-3 text-center answer_spaces"
                v-for="idx in questions[this.currentLevel][this.currQuesIndex].ans.length"
                :key="'AS'+ idx"
                :ref="'AS' + idx"
              ></div>
            </div>
              <div class="h2 text-success mt-4" v-if="isAnswerCorrect">
                Correct
                <i class="ml-2 fa fa-check"/>
              </div>
               <div class="h2 text-danger mt-4" v-if="showIncorrectAnsMsg">
                Incorrect
                <i class="ml-3 fa fa-times"/>
              </div>
          </div>
            <div v-if="timeUp" class="row mt-5 ml-2">
              <div class="col-12 col-lg-12 col-md-12 col-sm-12">
                <div v-if="timeUp && !isLevelOver">
                  <span class="h1 text-danger">Time up</span>
                  <i class="ml-2 h1 mb-4 text-danger fa fa-hourglass-end"/>
                  <br>
                  <div class="nextQuestionBtn" @click="showNextQuestion">
                    <span class="ml-1 h1 text-primary">Next Question</span>
                    <i class="ml-1 h1 fa fa-chevron-right text-primary"/>
                  </div>
                </div>
                <div v-if="isLevelOver && canProceedToNextLevel">
                  <span class="ml-1 display-4 text-primary">Congrats!!</span>
                  <br>
                  <span
                    @click="goToNextLvlClickHanlder"
                    class="go_to_next_level_btn ml-2 text-success h4 mt-3"
                  >
                    Go to next level
                    <i class="fa fa-arrow-right"/>
                  </span>
                </div>
                <div v-if="isLevelOver && !canProceedToNextLevel && !isGameComplete">
                  <span class="ml-1 display-4 text-danger">Sorry!!</span>
                  <br>
                  <span @click="tryAgainBtnClickHandler" class="try_again_btn ml-2 mt-2 h4">
                    Try again
                    <i class="fa ml-2 fa-arrow-circle-o-right" aria-hidden="true"></i>
                  </span>
                  <br>
                  <br>
                   <span class="ml-2 text-danger">Min score to pass level 1: 300</span>
                  <br>
                  <span class="ml-2 text-danger">Min score to pass level 2: 600</span>
                </div>
              </div>
            </div>
        </div>
        <br v-for="idx in 2" :key="'br'+idx">
      </div>
      <div v-if="!isPlaying" class="row justify-content-center align-items-center">
        <div class="col-12 mt-5 text-center">
          <span class="text-dark display-4">Game Starting In</span>
          <h1 class="display-2 text-danger">{{countdown}}</h1>
        </div>
      </div>
  </div>
  </div>
</template>

<script>
import _gameHlpr from "./utils/gameHelper.js";
import questions from "./utils/dummyData.js";
import GameCompleteModal from "./GameCompleteModal";

export default {
  name: "guessGame",
  components: {
    GameCompleteModal
  },
  mounted() {
        this.fillQuestions(questions);
        this.initGame();
        this.countDown();
  },
  data() {
    return {
      currQuesIndex: 0,
      currentLevel: 1,
      isLevelOver: false,
      isPlaying: false,
      canProceedToNextLevel: false,
      charMatrix: [],
      answerByUser: "",
      questions: {
        1: [],
        2: [],
        3: []
      },
      score: 0,
      timeRemaining: 120000,
      timer: null,
      isAnswerCorrect: false,
      timeUp: false,
      countdown: 3,
      minScoreForNextLevel: [300, 600],
      isGameComplete: false,
      totalQuesAnswered: 0,
      showIncorrectAnsMsg:false
    };
  },
  methods: {
    fillQuestions(questions) {
      for (let i = 0; i < questions.length; i++) {
        this.questions[questions[i].level].push({
          ques: questions[i].question,
          ans: questions[i].ans.toUpperCase()
        });
      }
    },
    matrixColClickHandler(rI, cI) {
      const vm = this;
      let character = this.charMatrix[rI][cI];
      let actualAnswer = this.questions[this.currentLevel][this.currQuesIndex]
        .ans;
      if (this.answerByUser.length != actualAnswer.length ) {
        this.answerByUser += character;
        this.$refs["AS" + this.answerByUser.length][0].innerText = character;
        this.checkAnswer();
      }
      if (this.answerByUser.length == actualAnswer.length) {
        if (this.isAnswerCorrect) {
          this.score += 100;
          if (
            this.questions[this.currentLevel].length - 1 ==
            this.currQuesIndex
          ) {
            if (
              (this.score >= this.minScoreForNextLevel[0] &&
                this.currentLevel == 1) ||
              (this.currentLevel == 2 &&
                this.score >= this.minScoreForNextLevel[1])
            ) {
              this.canProceedToNextLevel = true;
            }
            this.isLevelOver = true;
            this.timeRemaining = 1000;
            this.checkIfGameComplete();
          } else {
            setTimeout(() => {
              vm.isAnswerCorrect = false;
              vm.resetAnswer();
              vm.showNextQuestion();
              vm.restartTimer();
            }, 1400);
          }
        } else {
          this.showIncorrectAnsMsg = true;
          setTimeout(() => {
             this.showIncorrectAnsMsg = false;
          }, 1500);
        }
      }
    },
    checkIfGameComplete() {
      if (this.currentLevel == 3) {
        this.isGameComplete = true;
        $("#gameCompleteModal").modal({ backdrop: "static", keyboard: false });
        $("#gameCompleteModal").modal("show");
      }
    },
    checkAnswer() {
      const actualAnswer = this.questions[this.currentLevel][
        this.currQuesIndex
      ].ans.toUpperCase();
      if (this.answerByUser == actualAnswer) {
        this.isAnswerCorrect = true;
        this.totalQuesAnswered += 1;
      }
    },
    showNextQuestion() {
      this.currQuesIndex += 1;
      if (this.timeUp) {
        this.timeUp = false;
        this.restartTimer();
      }
    },
    calculateTime() {
      this.timeRemaining -= 1000;
      if (this.timeRemaining <= 0) {
        if (
          this.questions[this.currentLevel].length - 1 ==
          this.currQuesIndex
        ) {
          if (
            (this.score >= this.minScoreForNextLevel[0] &&
              this.currentLevel == 1) ||
            (this.currentLevel == 1 &&
              this.score >= this.minScoreForNextLevel[1])
          ) {
            this.canProceedToNextLevel = true;
          }
          this.isLevelOver = true;
          this.checkIfGameComplete();
        }

        this.timeUp = true;
        this.resetAnswer();
        this.clearTimer();
      }
    },
    startTimer() {
      this.timer = setInterval(this.calculateTime, 1000);
    },
    restartTimer() {
      this.clearTimer();
      this.timeRemaining = 120000;
      this.startTimer();
    },
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    millisToMinutesAndSeconds(millis) {
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    restartGame() {
      this.resetGame();
      // this.restartTimer();
    },
    resumeGame() {
      this.startTimer();
    },
    resetGame() {
      this.resetAnswer();
      this.answerByUser = "";
      this.timeRemaining = 120000;
      this.isAnswerCorrect = false;
      this.timeUp = false;
      this.isLevelOver = false;
      this.currQuesIndex = 0;
      this.timeUp = false;
      this.canProceedToNextLevel = false;
    },
    endGame() {
      this.resetGame();
    },
    afterLevelComplete() {},
    skipQues() {
      this.showNextQuestion();
      this.resetAnswer();
      this.restartTimer();
    },
    resetAnswer() {
      if (this.answerByUser.length > 0) {
        for (let i = this.answerByUser.length; i > 0; i--) {
          this.$refs["AS" + i][0].innerText = "";
        }
        this.answerByUser = "";
      }
    },
    countDown() {
      let vm = this;
      this.countdownTimer = setInterval(function() {
        vm.countdown -= 1;
        if (vm.countdown == 0) {
          clearInterval(vm.countdownTimer);
          vm.isPlaying = true;
          vm.startTimer();
        }
      }, 1000);
    },
    initGame() {
      const ansCharAndFreObj = _gameHlpr.generateCharSetAndFreq(
        this.questions[this.currentLevel]
      );

      const charset = Array.from(ansCharAndFreObj.charSet).join("");
      const charFreq = ansCharAndFreObj.charfreq;

      this.charMatrix = _gameHlpr.generateMatrix(4, charset).matrix;
      localStorage.removeItem("matrix");
      localStorage.setItem(
        "matrix",
        JSON.stringify(_gameHlpr.generateMatrix(4, charset))
      );
    },
    goToNextLvlClickHanlder() {
      this.resetGame();
      this.currentLevel += 1;
      this.initGame();
      this.isPlaying = true;
      this.startTimer();
    },
    tryAgainBtnClickHandler() {
      this.restartGame();
    }
  }
};
</script>
<style>
.answer_container {
  padding: 0;
}

.matrix_col {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

.matrix_col:hover {
  cursor: pointer;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.guess_game_container {
  margin-top: 4rem;
  transition: all 0.3s ease-in-out;
}

.puzzle_question {
  margin-bottom: 3rem;
  word-wrap: break-word;
}

.game_btns:hover {
  cursor: pointer;
}

.answer_spaces {
  width: 20px;
  height: 50px;
  transition: 2s ease-in-out;
}

.nextQuestionBtn:hover {
  cursor: pointer;
}

.go_to_next_level_btn:hover,
.try_again_btn:hover {
  cursor: pointer;
}
</style>