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

// 커스텀 아이템 경로(상위 경로)
export const vtpCustomItemPathState = atom({
  key: 'vtpCustomItemPathState',
  default: null,
  effects: [localStorageEffect('vtpCustomItemPathState')]
});

// Throw 커스텀 아이템 리스트 상태
export const vtpCustomThrowItemListState = atom({
  key: 'vtpCustomThrowItemListState',
  default: window.localStorage.vtpCustomThrowItemListState ? window.localStorage.vtpCustomThrowItemListState : [],
  effects: [localStorageEffect('vtpCustomThrowItemListState')]
});

// Drop 커스텀 아이템 리스트 상태
export const vtpCustomDropItemListState = atom({
  key: 'vtpCustomDropItemListState',
  default: window.localStorage.vtpCustomDropItemListState ? window.localStorage.vtpCustomDropItemListState : [],
  effects: [localStorageEffect('vtpCustomDropItemListState')]
})

// 트리거 리스트 상태
export const vtpTriggerListState = atom({
  key: 'vtpTriggerListState',
  default: window.localStorage.vtpTriggerListState ? window.localStorage.vtpTriggerListState : [],
  effects: [localStorageEffect('vtpTriggerListState')]
});

// 선택된 트리거 상태
export const selectedVtpTriggerState = atom({
  key: 'selectedVtpTriggerState',
  default: {
    triggerName: '',  // 트리거 이름
    method: 'VTP_Throw',  // 트리거 메소드(throw, drop)
    donationAmount: 1000,  // 후원 금액
    count: 1,  // 갯수
    itemIndex: -1,
    itemName: '랜덤',
    customItemIndex: -1,
    customItemName: '랜덤',
    customItemHash: null,
    isCustomItem: false,
    damage: 0,
    useAt: true,
    platform: ['투네이션']
  }
});

export const selectingVtpTriggerState = atom({
  key: 'selectingVtpTriggerState',
  default: false
});
