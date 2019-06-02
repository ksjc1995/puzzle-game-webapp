let _gameHlpr = (function() {
    function generateMatrix(size, ansCharSet) {
      let randomCharMatrix = initMatrixWithRandomChars(size);
      let finalMatrix = fillAnswersCharsInMatrixRandomly(
        ansCharSet,
        size,
        randomCharMatrix
      );
      return finalMatrix;
    }
    function initMatrixWithRandomChars(size) {
      let matrix = [];
      let row = [];
      for (let i = 0; i < size; i++) {
        row = [];
        for (let j = 0; j < size; j++) {
          row.push(generateRandomChar());
        }
        matrix.push(row);
      }
      return matrix;
    }
    function generateRandomChar() {
      var char = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
      for (var i = 0; i < 1; i++)
        char = possible.charAt(Math.floor(Math.random() * possible.length));
      return char;
    }
    function generateRandomMatrixPosition(size) {
      let i,
        j = 0;
      i = Math.floor(Math.random() * size);
      j = Math.floor(Math.random() * size);
      return i + '' + j;
    }
    function fillAnswersCharsInMatrixRandomly(ansCharSet, size, matrix) {
      let answerCharSetArray = ansCharSet.split('');
      const answerCharSetArrayLength = ansCharSet.length;
      let positionsTracker = [];
      let randomMatrixPos = '';
      let ith = '';
      let jth = '';
      for (let i = 0; i < answerCharSetArrayLength; i++) {
        if (i == 0) {
          randomMatrixPos = generateRandomMatrixPosition(size);
        } else {
          while (true) {
            if (positionsTracker.indexOf(randomMatrixPos) < 0) {
              break;
            }
            randomMatrixPos = generateRandomMatrixPosition(size);
          }
        }
        positionsTracker.push(randomMatrixPos);
        ith = randomMatrixPos[0];
        jth = randomMatrixPos[1];
        matrix[ith][jth] = answerCharSetArray[i];
      }
      return { matrix: matrix, positions: positionsTracker };
    }
  
    function generateCharSetAndFreq(ansArr){
      let charSet = null;
      let answersString = "";
      let charfreq = {}
      for(let i=0;i<ansArr.length;i++){
        let currAnswer = ansArr[i].ans.toUpperCase();
        for(let j=0;j<ansArr[i]['ans'].length;j++){
          if(charfreq[currAnswer[j]]){
            charfreq[currAnswer[j]] +=1;
          }
          else{
            charfreq[currAnswer[j]] = 1;
          }
        }
        answersString += currAnswer;
      }
  
      charSet = new Set(answersString);
      return {
        charSet:charSet,
        charfreq:charfreq
      }
    }
  
    return {
      generateMatrix: generateMatrix,
      generateRandomChar: generateRandomChar,
      generateCharSetAndFreq:generateCharSetAndFreq
    };
  })();
  
  export default _gameHlpr;
  