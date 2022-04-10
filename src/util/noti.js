import { notification } from "antd";

export function openSuccessNotification(msg, desc) {
  notification.success({
    message: msg,
    description: desc,
    placement: 'bottom'
  });
}


export function openFailedNotification(msg, desc) {
  notification.error({
    message: msg,
    description: desc,
    placement: 'bottom'
  });
}


export function openInfoNotification(msg, desc) {
  notification.info({
    message: msg,
    description: desc,
    placement: 'bottom'
  });
}