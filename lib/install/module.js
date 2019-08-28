'use strict';

const _ = require('lodash');

class FunTask {

  constructor(type, attrs) {
    this.type = type;
    this.attrs = attrs;
  }

  static parse(attrs) {
    if (attrs.pip) {
      return new FunTask('pip', Object.assign({ local: true }, attrs));
    } else if (attrs.apt) {
      return new FunTask('apt', Object.assign({ local: true }, attrs));
    } else if (attrs.shell) {
      return new FunTask('shell', attrs);
    }
    throw new Error('Unknown task.');
  }

  isEqual(task) {
    if (!(task instanceof FunTask)) { return false; }
    if (this.type !== task.type) { return false; }
    return this.attrs[this.type] === task.attrs[this.type];
  }

  canonical() {
    let attrs = _(this.attrs)
      .toPairs()
      .reject(item => {
        switch (item[0]) {
        case 'local': return item[1] === true;
        case 'env': return _.isEmpty(item[1]);
        default: return false;
        }
      })
      .fromPairs()
      .value();

    return new FunTask(this.type, attrs);
  }
}

module.exports = {
  FunTask
};