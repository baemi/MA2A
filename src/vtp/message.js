// VTP 메시지 전달
function sendTriggerMessage(socket, trigger) {
  console.log(trigger);

  if(trigger.method === 'VTP_Throw') {
    const itemIndex = trigger.isCustomItem ? 8 : trigger.itemIndex;
    const customItemIndex = trigger.isCustomItem ? trigger.customItemIndex : -1;
    const message = `VTP_Throw:${trigger.count}:${itemIndex}:${customItemIndex}:${trigger.damage}`;
  
    socket.send(message);
  } else if(trigger.method === 'VTP_Drop') {
    const itemIndex = trigger.isCustomItem ? 6 : trigger.itemIndex;
    const customItemIndex = trigger.isCustomItem ? trigger.customItemIndex : -1;
    const message = `VTP_Drop:${itemIndex}:${customItemIndex}:${trigger.damage}`;
  
    socket.send(message);
  }
}

export {
  sendTriggerMessage
}