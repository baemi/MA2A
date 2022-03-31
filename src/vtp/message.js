// VTP 메시지 전달
function sendTriggerMessage(socket, trigger) {
  const itemIndex = trigger.isCustomItem ? 8 : trigger.itemIndex;
  const customItemIndex = trigger.isCustomItem ? trigger.customItemIndex : -1;
  const message = `${trigger.method}:${trigger.count}:${itemIndex}:${customItemIndex}:${trigger.damage}`;

  socket.send(message);
}

export {
  sendTriggerMessage
}