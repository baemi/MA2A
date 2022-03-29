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