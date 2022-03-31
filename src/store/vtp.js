import { atom } from "recoil";
import { localStorageEffect } from './atomEffect';

export const vtpIpState = atom({
  key: 'vtpIpState',
  default: window.localStorage.vtpIpState ? window.localStorage.vtpIpState : '127.0.0.1',
  effects: [localStorageEffect('vtpIpState')]
});

export const vtpPortState = atom({
  key: 'vtpPortState',
  default: window.localStorage.vtpPortState ? window.localStorage.vtpPortState : '4430',
  effects: [localStorageEffect('vtpPortState')]
});

export const vtpSocketState = atom({
  key: 'vtpSocketState',
  default: null
})

export const vtpCustomItemPathState = atom({
  key: 'vtpCustomItemPathState',
  default: null,
  effects: [localStorageEffect('vtpCustomItemPathState')]
});

export const vtpCustomItemListState = atom({
  key: 'vtpCustomItemListState',
  default: window.localStorage.vtpCustomItemListState ? window.localStorage.vtpCustomItemListState : [],
  effects: [localStorageEffect('vtpCustomItemListState')]
});

export const vtpTriggerListState = atom({
  key: 'vtpTriggerListState',
  default: window.localStorage.vtpTriggerListState ? window.localStorage.vtpTriggerListState : [],
  effects: [localStorageEffect('vtpTriggerListState')]
});

export const selectedVtpTriggerState = atom({
  key: 'selectedVtpTriggerState',
  default: {
    triggerName: '',  // 트리거 이름
    method: '',  // 트리거 메소드(throw, drop)
    donationAmount: 1000,  // 후원 금액
    count: 1,  // 갯수
    itemIndex: -1,
    customItemIndex: -1,
    customItemName: '',
    customItemHash: null,
    isCustomItem: false,
    damage: 0
  }
});

export const selectingVtpTriggerState = atom({
  key: 'selectingVtpTriggerState',
  default: false
});
