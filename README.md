# betting-house-api
This project is a back-end of a bookmaker's betting system. With the huge increase in betting apps in recent times, I developed this project with the aim of betting on football games, in which the application flow is basically:
- A series of upcoming sporting events appear to the user;
- The user places a bet within a sporting event (for example, on who will be the winner between a football match between Team A and Team B);
- The sporting event takes place and, if the user is correct, they receive a value.

*Deploy URLs*
- With the project repo: https://betting-house-api.onrender.com
- With Docker Image: https://betting-house-api-docker.onrender.com

## Api Reference
- Entities:
<details>
  <summary>Participant - represent a bettor</summary>
  
  ```
{

  ID number; // participant id, e.g. 1
  createdAt: string; // date and time of participant creation, e.g. "2023-09-27T19:22:50.503Z"
  updatedAt: string; // same above for last update data
  name: sequence; //participant's name, e.g. "John"
  balance: number; // participant's current balance, represented in cents, e.g. 1000 (R$ 10.00)

}
  ```
</details>

<details>
  <summary>Game - represent a game</summary>
  
  ```
{

  id: number; // game id
  createdAt: string;
  updatedAt: string;
  homeTeamName: string; // name of the home team, e.g. "Team A"
  awayTeamName: string; // name of the visiting team, e.g. "Team B"
  homeTeamScore: number; // home team goals, e.g. 3
  awayTeamScore: number; // goals from the visiting team, e.g. 1
  isFinished: boolean; // true if the game has already been closed, false otherwise

}
  ```
</details>

<details>
  <summary>Bet - represents a bet by a bettor on a game</summary>
  
  ```
{

  id: number; // bet id
  createdAt: string;
  updatedAt: string;
  homeTeamScore: number; // number of home team goals bet, e.g. 2
  awayTeamScore: number; // number of goals for the visiting team bet, e.g. 3
  amountBet: number; // amount bet, represented in cents, e.g. 1000 (R$ 10.00)
  gameId: number; // id of the game on which the bet was placed
  participantId: number; // id of the participant who placed the bet
  status: string; // current status of the bet, which can be PENDING (game not yet finished), WON (final score of the game correct) or LOST (final score of the game correct)
  amountWon: number || null; // total amount won on the bet or void while the bet is still PENDING

}
  ```
</details>

## Technologies

<div>

![Typescript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white)
![NODE](https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325.svg?style=for-the-badge&logo=Jest&logoColor=white)
![Eslint](https://img.shields.io/badge/ESLint-4B32C3.svg?style=for-the-badge&logo=ESLint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black)
</div>

## Installing / Getting started
First of all, clone the project on your local machine and install the dependencies.

```
git clone https://github.com/FernandoM52/betting-house-api.git
cd betting-house-api/
npm install
```

## How to use

### Booting up with scripts

<details>
  <summary>Running in development mode</summary>
  
-  To run in development mode you will need to create a `.env.development` file following the `.env.example` file as a reference.

Once created, run the command below for Prisma to make the necessary migrations to your local database.

```
npm run dev:migration:run
```

To create your own migrations use the command:

```
npm run dev:migration:generate
```

Finnaly, start app in development mode:

```
npm run dev
```

</details>

<details>
  <summary>Running in production mode</summary>

- To run in production mode you will need to create a `.env` file following the `.env.example` file as a reference.
  
Once created, run the command below to build the project:
```
npm run build
```

And finnaly, start the project:
```
npm run start:prod
```

</details>

### Booting up with Docker
<details>
  <summary>With Docker Compose</summary>
  
  - Run the command:
  
  ```
  docker compose up -d
  ```
  
  - You can access the api through the localhost address:
  ```
  localhost:5000/health
  ```
    
  - To stop containers, run:
  ```
  docker compose down
  ```
</details>

## How to run tests

To run the integration tests you will need to create a `.env.test` file following the `.env.example` file as a reference. Remember to use a different database than the development/production one

Once created, run the command below for Prisma to make the necessary migrations to your local tests database.

```
npm run test:migration:run
```

Run tests:

```
npm run test
```

To check test coverage, run the command below and open the html file in youw browser.

```
npm run test:coverage
```
