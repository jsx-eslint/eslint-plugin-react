'use strict';

module.exports = function getMessageData(messageId, message) {
  return messageId ? { messageId } : { message };
};
