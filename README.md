# Letters-Chat

## env 설정

```
JWT_SECRET_KEY=[]
API_URL=[]
DB_HOST=[]
DB_user=[]
DB_password=[]
```

- JWT SECRET KEY 설정
- API URL 설정
- DB 정보 설정

--- 

## 개발환경 Init

``` shell
npm run env:init
```

- MySQL
  설치 및 Database 생성
- Kafka
  - zookeeper
  - broker

---

## DB Scheme 생성

- Docker 설치 후

```shell
npm run db:migrate
```


### migration 추가
``` shell
npx babel-node migration.js add migration [migration name]
```

---

## 실행

### 채팅 서버 실행

``` shell
npm run start
```

### DB Writer 실행

``` shell
npm run writer:start
```