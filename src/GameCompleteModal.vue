<template>
    <div class="modal" id="gameCompleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header ">
            <h1 class="modal-title text-dark">Game Stats</h1>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <h4>
              Score:
              <span class="badge badge-warning ml-3 mt-3 mb-3">{{score}}</span>
            </h4>
            <h4>
              Total Questions:
              <span class="badge badge-warning ml-3 mb-3">{{totalQuestions}}</span>
            </h4>
            <h4>
              Question Answered Correctly:
              <span class="badge badge-warning ml-3 mb-3">{{totalQuesAnswered}}</span>
            </h4>
            <div class="mt-5">
              <h2 class="text-danger">Title:</h2>  
              <hr>
              <h2 v-if="totalQuesAnswered == totalQuestions" class="text-dark user_title">KING OF WORDS <i class="ml-3 fa fa-thumbs-up text-secondary"></i></h2>
              <h2 v-if="totalQuesAnswered < 12 && totalQuesAnswered > 9" class="text-dark user_title">WARRIOR OF WORDS</h2>
              <h2 v-if="totalQuesAnswered <= 9 && totalQuesAnswered > 6" class="text-dark user_title">ROOKIE</h2>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-success btn-sm shadow-sm" @click="playAgainBtn">Click to play again <i class="ml-2 fa fa-play"></i></button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["score", "totalQuesAnswered", "totalQuestions"],
  mounted() {},
  methods: {
    playAgainBtn(e) {
      $("#gameCompleteModal").modal("hide");
    }
  }
};
</script>
<style scoped>
</style>