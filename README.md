# TeamTrivia
## How to play
You begin by setting up a game by going to https://gits-15.sys.kth.se/pages/emijonss/TeamTrivia/#/. After deciding your name you get to decide how many questions you will take on aswell as from which categories questions may come from. When done you click the "Create Game" button and recieve a link. Click it and share it with your friends (you may also play alone). Now join a team of your choosing. When the teams are set up, click the "Start Game" button to begin playing.

## Description
The purpose of this project is to create an online team-based trivia game based on multiple-choice questions. You and your team collect points depending on how well you answer a series of questions of varying difficulty. The team with the most points when the last question has been answered wins. Before each question you get to decide what difficulty it should be. Every difficulty has been given a randomized category of question from the ones selected by the host at the start. Answering more difficult questions will give you more points. When answering a question every member of your team will get to vote on which answer they feel is correct. The answer with most votes after a time will be picked as the teams choice. If it is correct they get points. All teams will answer the same question at the same time, but they will not be able to see what the other teams answer.

## What we have done
We have set up a firebase database that supports multiple lobbies at once. We have made it possible to create a custom lobby. We have made it possible for different people to join teams in the same lobby from different computers. We have succesfully set up the connection to the API Open Trivia DB, https://opentdb.com/.
We have set up a local primitive trivia game, currently without points and teams.

## What you still plan to do
* Make the trivia game work online by making teams see the same things and be able to vote for answers
* Implement a question history table and point system to be able to see how well teams do and who is in the lead
* Who gets to decide what difficulty and type of question all teams answer: probably by letting the teams take turns, with a new member of the team picking the question every turn.

## Things we want to implement if we have time
* A chat

## Project file structure
App.js: Handles Routers. Responsible for creating an anonymous login and a name of the user.

GameSetup.js: Handles the structure and data of the game setup screen. Also responsible for printing the game setup screen.

GameState.js: Handles the currently local game logic. Will handle much more in the future.

GridItem.js: Currently not used; beginning of effort for splitting up classes into their own js-files for structure.

Lobby.js: Handles the structure, state and data of the lobby. Also responsible for printing the lobby.

Team.js: Handles the structure and data of teams. Also responsible for printing the teams.

firebase.js Handles the connection to the firebase database.

index.css: Keeps all css-styling for the entire project.

index.js: Starts the app. Sets up the outer router.
