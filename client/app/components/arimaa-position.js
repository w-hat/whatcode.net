import Ember from 'ember';
import { Piece, Position } from 'whatcode/utils/arimaa';

export default Ember.Component.extend({
  classNames: ['arimaa-position'],
  classNameBindings: ['color'],
  positional: [],
  params: {},
  block: '',
  position: Ember.computed('positional', 'params', 'block', function() {
    const text = this.get('block') || this.get('params').position ||
                 this.get('positional')[0];
    return new Position(text);
  }),
  pieces: Ember.computed('position', function() {
    const position = this.get('position');
    const pieces = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const ix = (7 - row) * 16 + col;
        const piece = position.board[ix];
        if (piece) {
          pieces.push({row, col, type: class_for(piece)});
        }
      }
    }
    return pieces;
  }),
  color: Ember.computed('position', function() {
    const position = this.get('position');
    if (isNaN(position.color)) {
      return false;
    }
    return (position.color ? 'silver' : 'gold');
  }),
});

function class_for(piece) {
  switch(piece) {
    case Piece.EMPTY: return 'empty';
    case Piece.GRABBIT: return 'grabbit';
    case Piece.GCAT: return 'gcat';
    case Piece.GDOG: return 'gdog';
    case Piece.GHORSE: return 'ghorse';
    case Piece.GCAMEL: return 'gcamel';
    case Piece.GELEPHANT: return 'gelephant';
    case Piece.SRABBIT: return 'srabbit';
    case Piece.SCAT: return 'scat';
    case Piece.SDOG: return 'sdog';
    case Piece.SHORSE: return 'shorse';
    case Piece.SCAMEL: return 'scamel';
    case Piece.SELEPHANT: return 'selephant';
    default: return 'unknown';
  }
}
