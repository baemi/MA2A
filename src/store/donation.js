import { atom } from "recoil";
import { localStorageEffect } from './atomEffect';

export const toonationKeyState = atom({
  key: 'toonationKeyState',
  default: window.localStorage.toonationKeyState,
  effects: [localStorageEffect('toonationKeyState')]
});

export const toonationConnectedState = atom({
  key: 'toonationConnectedState',
  default: false,
});


export const twipKeyState = atom({
  key: 'twipKeyState',
  default: window.localStorage.twipKeyState,
  effects: [localStorageEffect('twipKeyState')]
});

export const twipConnectedState = atom({
  key: 'twipConnectedState',
  default: false,
});