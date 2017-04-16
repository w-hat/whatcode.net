import Ember from 'ember';

export default Ember.Component.extend({
  piece: {},
  classNames: ['arimaa-piece'],
  classNameBindings: ['type'],
  type: Ember.computed('piece', function() {
    let piece = this.get('piece');
    return piece.type;
  }),
  attributeBindings: ['style'],
  style: Ember.computed('piece', function() {
    let piece = this.get('piece');
    return Ember.String.htmlSafe('margin-top: '  + (piece.row*41 + 3) + 'px;' +
                                 'margin-left: ' + (piece.col*41 + 3) + 'px;');
  }),
});
