'use strict';

exports.development = {
  onChange(filePath) {
    // don't reload when ts file change
    if (filePath.endsWith('.ts')) {
      return false;
    }
    return true;
  }
}