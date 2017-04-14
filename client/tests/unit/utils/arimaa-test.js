import { Color, Piece, Position } from 'whatcode/utils/arimaa';
import { module, test } from 'qunit';

module('Unit | Utility | arimaa');

test('it exists', function(assert) {
  let pos = new Position();
  assert.ok(pos);
});

test('it has a short string representation', function(assert) {
  let pos = new Position();
  let s = "g[................................................................]";
  assert.equal(pos.toShortString(), s);
  assert.equal(pos.toShortString({dots: false}), s.replace(/\./g, ' '));
});

test('it has a long string representation', function(assert) {
  let pos = new Position();
  let str = `g
 +-----------------+
8| . . . . . . . . |
7| . . . . . . . . |
6| . . x . . x . . |
5| . . . . . . . . |
4| . . . . . . . . |
3| . . x . . x . . |
2| . . . . . . . . |
1| . . . . . . . . |
 +-----------------+
   a b c d e f g h`;
  assert.equal(pos.toLongString(), str);
  assert.equal(pos.toLongString({dots: false}), str.replace(/\./g, ' '));
});

test('it should create a board from a short string', function(assert) {
  let s1="g4[r....rrrrrch.md.MeRR....R.d....R....E..R....h.D...HC.H...R......]";
  let pos = new Position(s1);
  assert.equal(pos.board.length, 128);
  assert.equal(pos.board[7 * 16 + 0], Piece.SRABBIT);
  assert.equal(pos.board[7 * 16 + 1], Piece.EMPTY);
  assert.equal(pos.board[6 * 16 + 3], Piece.SHORSE);
  assert.equal(pos.board[0 * 16 + 1], Piece.GRABBIT);
  assert.equal(pos.stepsLeft, 4);
  assert.equal(pos.color, Color.GOLD);
  assert.equal(pos.inPush, false);
  assert.equal(pos.lastFrom, 0x08);
  assert.equal(pos.toShortString(), 'g' + s1.slice(2));
  let s2="s4[r    rrrrrch md MeRR    R d    R    E  R    h D   HC H   R      ]";
  let pos2 = new Position(s2);
  assert.equal(pos2.color, Color.SILVER);
});

test('it should create a board from a long string', function(assert) {
  let longString = "g\n" +
                   " +-----------------+\n" +
	                 "8| r r r r r r r r |\n" +
	                 "7| d h c m e h c d |\n" +
	                 "6| . . x . . x . . |\n" +
	                 "5| . . . . . . . . |\n" +
	                 "4| . . . . . . . . |\n" +
	                 "3| . . x . . x . . |\n" +
	                 "2| R H C M E C H D |\n" +
	                 "1| D R R R R R R R |\n" +
	                 " +-----------------+\n" +
	                 "   a b c d e f g h";
	let pos = new Position(longString);
	assert.equal(pos.board[6 * 16 + 0], Piece.SDOG);
	assert.equal(pos.board[6 * 16 + 1], Piece.SHORSE);
	assert.equal(pos.board[6 * 16 + 2], Piece.SCAT);
	assert.equal(pos.board[6 * 16 + 3], Piece.SCAMEL);
	assert.equal(pos.board[5 * 16 + 2], Piece.EMPTY);
	assert.equal(pos.board[5 * 16 + 3], Piece.EMPTY);
	assert.equal(pos.color, Color.GOLD);
	assert.equal(pos.inPush, false);
	assert.equal(pos.stepsLeft, 4);
	assert.equal(pos.lastFrom, 0x08);
	assert.equal(pos.toLongString(), longString);
	let longString2 = "s\n" +
                   " +-----------------+\n" +
	                 "8| r r r r r r r r |\n" +
	                 "7| d h c m e h c d |\n" +
	                 "6| . . x . . x . . |\n" +
	                 "5| . . . . E . . . |\n" +
	                 "4| . . . . . . . . |\n" +
	                 "3| . H x . . x . . |\n" +
	                 "2| R . C M . C H D |\n" +
	                 "1| D R R R R R R R |\n" +
	                 " +-----------------+\n" +
	                 "   a b c d e f g h";
	let pos2 = new Position(longString2);
	assert.equal(pos2.color, Color.SILVER);
	assert.equal(pos2.inPush, false);
	assert.equal(pos2.stepsLeft, 4);
	assert.equal(pos2.lastFrom, 0x08);
});


