class BoardData {
  constructor(pieces) {
    this.pieces = pieces;

  };

  getPieceById(id){

    for(let piece of this.pieces){
      if(piece.id === id){
        return piece;
      };
    }
      
  }; 
  
   checkForCastleUpdate(piece) {

    if(piece.type === ROOK){

      if(piece.BLACK_PLAYER){

        if(piece.col === 7){
          rightBlackRookDidntMove = false;
        };
        if(piece.col === 0){
          leftBlackRookDidntMove = false; 
        };
      };

      if(piece.WHITE_PLAYER){

        if(piece.col === 7){
          rightWhiteRookDidntMove = false;
        };
        if(piece.col === 0){
          leftWhiteRookDidntMove = false; 
        }; 
      };
    };

    if(piece.type === KING){

      if(piece.player === BLACK_PLAYER){
       blackKingDidntMove = false; 
      };
      if(piece.player === WHITE_PLAYER){
        whiteKingDidntMove = false;
      };
    };
  };
  
  trySmallCastle() {
    const whiteKing = this.getPieceById(3);
    const leftWhiteRook = this.getPieceById(0); 
    const blackKing = this.getPieceById(19);
    const leftBlackRook = this.getPieceById(16);    
    console.log(whiteKing);
    console.log(leftWhiteRook);
    if(whiteKing.row === 0 && whiteKing.col === 1 && smallWhiteCastleUsed === false){
      
      leftWhiteRook.row = 0;
      leftWhiteRook.col = 2;
      smallWhiteCastleUsed = true;
    };
    if(blackKing.row === 7 && blackKing.col === 1 && smallBlackCastleUsed === false){
      
      leftBlackRook.row = 7;
      leftBlackRook.col = 2; 
      smallBlackCastleUsed = true; 
    }; 
  };    
  
  tryBigCastle() {
    const whiteKing = this.getPieceById(3);
    const rightWhiteRook = this.getPieceById(7); 
    const blackKing = this.getPieceById(19);
    const rightBlackRook = this.getPieceById(23);  
    if(whiteKing.row === 0 && whiteKing.col === 5 && bigWhiteCastleUsed === false){
      
      rightWhiteRook.row = 0;
      rightWhiteRook.col = 4;
      bigWhiteCastleUsed = true;
    }
    if(blackKing.row === 7 && blackKing.col === 5 && bigBlackCastleUsed === false){
      
      rightBlackRook.row = 7;
      rightBlackRook.col = 4;  
      bigBlackCastleUsed = true; 
    }
  };

  getPiece(row, col) {

    for (const piece of this.pieces) {

      if (piece.row === row && piece.col === col) {

        return piece;

      };
    }
  };
   
  isEmpty(row, col) {

    return this.getPiece(row, col) === undefined;

  }; 

  isPlayer(row, col, player) {

    const piece = this.getPiece(row, col);
    return piece !== undefined && piece.player === player;

  };  

  removePiece(row, col) {

    for (let i = 0; i < this.pieces.length; i++) {

      let piece = this.pieces[i]; 

      if (piece.row === row && piece.col === col) {

        if(piece.type === KING){
          piece = piece.getOpponent(); 
          turn = GAME_OVER;
          winner = piece;
        }

       this.pieces.splice(i, 1);

      };
    }
  };

  movePiece(piece, row, col) {

    const possibleMoves = piece.getPossibleMoves(boardData);  
    for (const possibleMove of possibleMoves) {
      
      if (possibleMove[0] === row && possibleMove[1] === col) { 
        
        
        boardData.removePiece(row, col);
        
        piece.row = row;
        piece.col = col;
        
        this.checkForCastleUpdate(piece);

        this.trySmallCastle();

        this.tryBigCastle();

        this.switchTurn(); 
  
       return true;
      };
    }
  
    return false;  
  };

  switchTurn() {
    if(turn === WHITE_PLAYER){
      turn = BLACK_PLAYER;
    }else {
      turn = WHITE_PLAYER; 
    }; 
  }

  endGame() {

    if(turn === GAME_OVER){
  
      body.appendChild(winnerPopUp);
      winnerPopUp.innerHTML = `${winner} wins, Congratulations! <br> Refresh to start again`;    
      winnerPopUp.classList.add('popup'); 
      selectedPiece = undefined;
    }; 
  };

  showPieceMoves(row, col) {   
  
    const piece = boardData.getPiece(row, col);
   
    for (let piece of boardData.pieces) {
   
      if (piece.row === row && piece.col === col) {
   
        let possibleMoves = piece.getPossibleMoves(boardData); 
         
        for (let possibleMove of possibleMoves) {
   
          const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
   
          const possibleEnemy = boardData.getPiece(possibleMove[0], possibleMove[1])
   
          if(piece && piece.player === turn){
             
            if(possibleEnemy && piece.player !== possibleEnemy.player){ 
   
             cell.classList.add('attack');
            };
   
            cell.classList.add('movement');
          }; 
        }
      }; 
    }
   
    selectedCell = table.rows[row].cells[col];
    selectedCell.classList.add('select');
    selectedPiece = piece;  
  }; 

  resetMarks() {

    for(let i = 0; i < 8; i++){ 
        
      for(let j = 0; j < 8; j++){

        table.rows[i].cells[j].classList.remove('movement');
        table.rows[i].cells[j].classList.remove('select'); 
        table.rows[i].cells[j].classList.remove('attack');  
        if(turn === GAME_OVER){
            
          table.rows[i].cells[j].removeEventListener('click', clickOnCell()); 
        };
      } 
    }  
  };

};  
