# multiplayer-game

## UNUSABLE yet

This is work in progress, most likely in unusable state right now.

---

## Usage

To setup your cards game you need to prepare first:

1. Create your game class, which extends from `GameRoom`.
2. Set `name = 'My Game'` in your class.
3. Define how your game area is setup in `setupGame()` method - creating cards and containers goes here.
4. Optionally, create your custom game state class, which extends from `GameState`. Default game state should probably be enough for your first game.
5. Create and provide your `Command`s - stuff which players can do in-game.
6. Create game server in your entry file:

```javascript
import MyGame from './myGame'
import { CreateGameServer } from 'cardsGame-server'

// This will init the server with one game type
CreateGameServer([MyGame])
```
