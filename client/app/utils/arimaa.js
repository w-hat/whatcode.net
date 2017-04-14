export const Color = {GOLD: 0, SILVER: 1};

const ColorFromLetter = {
  'g': Color.GOLD,
  'w': Color.GOLD,
  's': Color.SILVER,
  'b': Color.SILVER,
};

export const Piece = {
  EMPTY: 0,
  GRABBIT: 1,
  GCAT: 2,
  GDOG: 3,
  GHORSE: 4,
  GCAMEL: 5,
  GELEPHANT: 6,
  COLOR: 8,
  SRABBIT: 9,
  SCAT: 10,
  SDOG: 11,
  SHORSE: 12,
  SCAMEL: 13,
  SELEPHANT: 14,
  COUNT: 15,
  PCHARS: ".RCDHMExxrcdhme",
  DECOLOR: ~0x8, // ~COLOR
};

export const EMPTY_BOARD = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

export const BASIC_SETUP = [1,1,1,3,2,1,1,1,0,0,0,0,0,0,0,0,
                     1,4,2,6,5,3,4,1,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                     9,12,11,13,14,11,12,9,0,0,0,0,0,0,0,0,
                     0,9,9,10,10,9,9,9,0,0,0,0,0,0,0,0];

export function Position(options) {
  if (typeof options === 'string') {
    if (options.length < 70) {
      options = Position._parseShortString(options);
    } else {
      options = Position._parseLongString(options);
    }
  } else if (typeof options === 'undefined') {
    options = {color: Color.GOLD};
  }
  this.color     = options.color;
  this.stepsLeft = options.stepsLeft || 4;
  this.board     = options.board     || EMPTY_BOARD.slice();
  this.lastPiece = options.lastPiece || false;
  this.lastFrom  = options.lastFrom  || 0x08; // Off the board
  this.inPush    = options.inPush    || false;
  
  if (options.refreeze === false) { return; }
  let offsets = [-1, 1, -16, 16];
  for (let ix = 0; ix < 120; ix++) {
    if (ix & 0x88) { ix += 8; }
    if (this.board[ix] !== Piece.EMPTY) {
      let piece = this.board[ix];
      let frozen = false;
      for (let o in offsets) {
        let nix = ix + offsets[o];
        let neighbor = this.board[nix];
        // If the neighbor is off the board or empty, move on.
        if ((nix & 0x88) || (neighbor === Piece.EMPTY)) {
          continue;
        // Otherwise, if the pieces are teammates, our piece is not frozen.
        } else if (!((piece ^ neighbor) & Piece.COLOR )) {
          frozen = false;
          break;
        // If the neighbor is stronger, set our piece as frozen.
        } else if ((piece & Piece.DECOLOR) < (neighbor & Piece.DECOLOR)) {
          frozen = true;
        }
      }
      this.board[ix + 8] = frozen;
    }
  }
}

Position._parseShortString = function(text) {
  let options = {
    board: EMPTY_BOARD.slice(),
    lastPiece: Piece.EMPTY,
    lastFrom: 0x08,
    inPush: false,
    color: ColorFromLetter[text[0]],
    stepsLeft: 4,
  };
  if ("1234".indexOf(text[1]) !== -1) {
    options.stepsLeft = Number(text[1]);
    let lastPiece = Piece.PCHARS.indexOf(text[2]);
    if (lastPiece > -1) { options.lastPiece = lastPiece; }
  }
  let piecesStart = text.indexOf('[') + 1;
  let pieceChars = text.slice(piecesStart, piecesStart + 64);
  for (let i = 0; i < pieceChars.length; i++) {
    let pieceChar = pieceChars[i];
    let col = i % 8;
    let row = 7 - ((i - col) / 8);
    let ix = row * 16 + col;
    if (pieceChar === ',') {
      options.lastFrom = ix;
    } else if (pieceChar === '_') {
      options.lastFrom = ix;
      options.inPush = true;
    } else if (pieceChar !== ' ') {
      let piece = Piece.PCHARS.indexOf(pieceChar);
      if (piece > -1) { options.board[ix] = piece; }
    }
  }
  return options;
};

Position._parseLongString = function(text) {
  const trimmed_text = text.trim();
  let lines = trimmed_text.split("\n");
  if (lines.length < 8) {
    throw new Error('Input too short to parse long position.');
  }
  let options = {
    board: EMPTY_BOARD.slice(),
    lastPiece: Piece.EMPTY,
    lastFrom: 0x08,
    inPush: false,
    color: ColorFromLetter[trimmed_text[0]],
    stepsLeft: 4,
  };
  if (lines[0].length > 1) {
    options.stepsLeft = Number(lines[0][2]);
    let lastPiece = Piece.PCHARS.indexOf(lines[0][3]);
    if (lastPiece > -1) { options.lastPiece = lastPiece; }
  }
  let row = 7;
  let col = 0;
  for (let l = 0; l < lines.length; l++) {
    let tokens = lines[l].split(" ");
    for (let t in tokens) {
      let token = tokens[t];
      let piece = Piece.EMPTY;
      if (token === '_') {
        options.inPush = true;
        options.lastFrom = row * 16 + col;
      } else if (token === ',') {
        options.lastFrom = row * 16 + col;
      } else if (token !== '.' && token !== 'x' && token !== 'X') {
        if (token === '|') { continue; }
        piece = Piece.PCHARS.indexOf(token);
        if (piece === -1 || token === '') { continue; }
      }
      options.board[row * 16 + col] = piece;
      col++;
      if (col === 8) { col = 0; row--; }
      if (row === -1) { break; }
    }
  }
  return options;
};

Position.prototype.toShortString = function(options) {
  const dots = (options ? options.dots : true);
  const board = this.board;
  let layout = ["gs"[this.color]];
  if (this.stepsLeft !== 4) {
    layout.push(this.stepsLeft);
    layout.push(Piece.PCHARS[this.lastPiece]);
  }
  layout.push("[");
  for (let rank = 7; rank >= 0; rank--) {
    var rix = rank * 16;
    for (let col = 0; col < 8; col++) {
      var ix = rix + col;
      var piece = board[ix];
      if (this.inPush && ix === this.lastFrom) {
        layout.push('_');
      } else if (ix === this.lastFrom) {
        layout.push(',');
      } else {
        layout.push(Piece.PCHARS[piece]);
      }
    }
  }
  layout.push("]");
  const str = layout.join("");
  return (dots ? str : str.replace(/\./g, ' '));
};

Position.prototype.toLongString = function(options) {
  options = options || {dots: true};
  const board = this.board;
  let layout = ["gs"[this.color]];
  if (this.stepsLeft !== 4) {
    layout.push('(' + this.stepsLeft);
    if (this.lastPiece) {
      layout.push(Piece.PCHARS[this.lastPiece]);
    }
    layout.push(')');
  }
  if (options.showFrozen) {
    layout.push("\n +-----------------+-----------------+\n");
  } else {
    layout.push("\n +-----------------+\n");
  }
  for (let row = 8; row > 0; row--) {
    layout.push(row + "| ");
    let rix = 16 * (row - 1);
    let colEnd = 8;
    if (options.showFrozen) { colEnd = 16; }
    for (let col = 0; col < colEnd; col++) {
      if (col === 8) { layout.push('| '); }
      let ix = rix + col;
      let piece = board[ix];
      if (col < 8 && piece === false) {
        layout.push('! ');
      } else if (col > 7 && piece === true) {
        layout.push('@ ');
      } else if (piece !== Piece.EMPTY) {
        layout.push(Piece.PCHARS[piece] + ' ');
      } else {
        if (this.inPush && ix === this.lastFrom) {
          layout.push('_ ');
        } else if (ix === this.lastFrom && col < 8) {
          layout.push(', ');
        } else if ((col === 2 || col === 5) && (row === 3 || row === 6)) {
          layout.push("x ");
        } else {
          if (options.dots) {
            layout.push(". ");
          } else {
            layout.push("  ");
          }
        }
      }
    }
    layout.push("|\n");
  }
  if (options.showFrozen) {
    layout.push(" +-----------------+-----------------+\n");
    layout.push("   a b c d e f g h   a b c d e f g h");
  } else {
    layout.push(" +-----------------+\n");
    layout.push("   a b c d e f g h");
  }
  return layout.join("");
};

export default { Position };
