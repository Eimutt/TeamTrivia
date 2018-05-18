# TeamTrivia by Emil Jonsson and Isak Peterson
## How to play
You begin by setting up a game by going to https://gits-15.sys.kth.se/pages/emijonss/TeamTrivia/#/. After deciding your name you get to decide how many questions you will take on as well as from which categories questions may come from. When done you click the "Create Game" button, taking you to your lobby. Share the URL with your friends to play multiplayer (you may also play alone). Join a team of your choosing. When the teams are set up, click the "Start Game" button to begin playing. You may use the chat in the lower left corner to talk with the people you are playing with. Taking on hard questions will reward teams that answer correctly 3 points, medium questions with 2 points and easy questions with 1 point. The first category and difficulty combination clicked by any player from any team is selected for all teams, so select fast if you see something you like. When someone in your team has picked an answer your team can not change what was picked, so choose wisely.

## Description
The purpose of this project was to create an online team-based trivia game using multiple-choice questions. You and your team collect points depending on how well you answer a series of questions of varying difficulty. The team with the most points when the last question has been answered wins. Before each question you get to decide what difficulty and category the question should be. Every difficulty has been given a randomized category of question from the ones selected by the host at the start. Answering more difficult questions will give you more points. All teams will answer the same question at the same time, but they will not be able to see what the other teams answer until after all teams have answered or the timer has run out. You will then see what the teams answered and which answer that was correct.

## What we have done
We have set up a firebase database that supports multiple lobbies. We have made it possible to create a custom lobby. We have made it possible for different people to join teams in the same lobby from different computers. We have successfully set up the connection to the API Open Trivia DB, https://opentdb.com/, from which we fetch categories, questions and answers.
We have deployed a working team-based multi-player trivia game.

## Key features
* ID: give yourself a fancy nickname before you join a lobby
* Online Multi-player: create a lobby and share the URL with your friends
* Spectator-mode: By joining the lobby after the host has started the game, or by not having selected a team when the host starts the game, you can still see how things are going as a spectator.
* A lobby-wide chat where you can smack-talk your competition

## Project file structure
AnswerOptions.js: Used by GameState.js. Responsible for the logic and rendering of the answer options for questions.

App.js: Responsible for creating an anonymous login and a name of the user, as well as initializing GameSetup.js and Lobby.js.

Categories.js: Used by GameSetup.js. Responsible for fetching the categories dynamically from the API as well as the logic and rendering of the categories table.

Chat.js: Used by Lobby.js. Responsible for structuring the chat.

ChatInput.js: Used by Chat.js: Responsible for the logic and rendering of the input box in the chat section. Pushes messages to the firebase DB.

firebase.js: Used by all components connecting to the firebase DB. Responsible for establishing a connection to the firebase DB.

GameSetup.js: Used by App.js. Responsible for the logic and rendering of setting up a game, i.e. selecting number of questions and categories.

GameState.js: Used by Lobby.js. Responsible for most of the game logic and the rendering of the game, for example the questions, the answers, the results etc.

GridItem.js: Used by Categories.js. Responsible for the logic and rendering of the categories in the categories table.

index.css: Responsible for ALL css in the entire project. (This is far from ideal but we never got around to splitting it up into separate files).

index.js: Starts the app. Sets up the outer router.

Lobby.js: Used by App.js. Responsible for TeamSetup.js, GameState.js, VictoryScreen.js, SpectatorWarning.js etc. Practically contains everything related to the game once the host has created a lobby.

MessageBox.js: Used by Chat.js. Responsible for the logic and rendering of the messages posted in the chat.

NameInput.js: Used by App.js. Responsible for the logic and rendering of the name-input screen you meet whenever you start up TeamTrivia.

RoundResults.js: Used by GameState.js. Responsible for the logic and rendering of the results of the previous question.

ScoreBoard.js: Used by GameState.js. Responsible for the logic and rendering of the current points held by the teams.

SpectatorWarning.js: Used by Lobby.js. Responsible for the logic and rendering of a warning message to spectators telling them that they are spectators.

Team.js: Used by TeamSetup.js. Responsible for the logic of joining and changing teams as well as the rendering of the teams.

TeamSetup.js: Used by Lobby.js. Responsible for the logic and rendering of the table of the 4 teams.

Timer.js: Used by GameState.js. Responsible for the logic and rendering of the ticking down timer during gameplay.

VictoryScreen.js: Used by Lobby.js. Responsible for the logic and rendering of the endgame results.
