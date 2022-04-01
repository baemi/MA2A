*주의: 본 프로그램은 재능 기부 형태로 제작되었습니다. 지속적인 관리가 어려운 점 참고 바랍니다.*     
*이미지 및 테스트 지원: 앙쥬님, 천년낚시꾼님*

# MA2A: Money Attack To Angjyu 

투네이션, 트윕 후원 알림과 Vtuber Plus 연동 프로그램        

- 투네이션 후원 알림 연결 및 수신
- 트윕 후원 알림 연결 및 수신
- Vtuber Plus 연결
- 후원 금액에 따라 Vtuber Plus 던지기(VTP_Throw), 떨구기(VTP_Drop) 동작 관리

## 기술 스택

- node v16.13.2
- electron 17.2.0
- electron-builder 22.14.13
- react 17.0.2
- recoil 0.6.1
- websocket 1.0.34
- antd 4.19.3

프로젝트 명령어:

### `npm start`

개발모드로 실행

### `npm run build`

일렉트론 패키징


## 변경 이력

### 2022-04-01

- 투네이션, 트윕 자동 재연결 추가

### 2022-03-31

- 트윕 연동 추가
- 투네이션 룰렛 알림 차단
- 트리거 관리 Vtuber Plus 떨구기(VTP_Drop) 추가
- Vtuber Plus 트리거 목록 가져오기 / 내보내기 추가
- Vtuber Plus Dropitem 목록 불러오기 추가

### 2022-03-30

- 투네이션 연결 하기 / 연결 끊기 추가
- Vtuber Plus 연결 하기 / 연결 끊기 추가

### 2022-03-29

- 프로토타입 개발