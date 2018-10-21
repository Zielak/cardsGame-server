# Investigation

How should I handle events comming from players based on current game state. Examples from real games:

## Game state API?

`PreparePlayer()` - need a place, defined by game implementer, where he can preepare every container for ONE PLAYER. This "template" would be used to init game of X number of players, positioning them on client-side.

## Rules?

"Seniority of the cards" (unique value of each card) is different per game and should be set in generic place.

## Actions definition

### Command

Action to be invoked and remembered, once below rules are met

### Interaction

Static (data). About what user does. Interaction type, element chosen.

* player clicks, drags, hovers somethings
* chose card, container, other player
* details about the element, rank, suit, name, value

Could be an array to define multiple kinds of cards to play the same role:

- first, king od spades or heart
  * type: 'card'
  * rank: 'K'
  * suit: 'H', 'S'
- second, any twos and threes
  * type: 'card',
  * rank: [2, 3]

### Condition

Dynamic (functions). About current gameState.
Conditions must know about the interaction to match card types/values etc.

* is his turn?
* does chosen element match the pile?
* does state value match players value?
* ...

It should be possible to combine conditions with OR statements. By default, a list of conditions is all ANDS

`[isMyTurn, cardMatchesRank]`

Meaning, is HAS to be my turn and chosen card MUST match its rank with top card on the pile.

There could also be:

`[isMyTurn, OR(matchesRank, matchesSuit)]`

At least one condition should PASS in the OR() statement (use `Promise.race`)

# Game examples

## Makao

### Game setup

Table containers:
- `deck: Deck` of all cards
- `pile: Pile` where cards are played

Player containers:
- `mainHand: Hand` - all players cards
- `tmpHand: Hand` - after passing, pick one there from the deck. Then, either play it on `pile` or to your main `mainHand`

### Game rules

On your turn:
- enact any action that previous player left
- **play 1 card from your hand**
- if you don't have or don't want to play any of your cards: **take 1 card from deck**
- **play that new card**, only if it matches with the pile

### Game state

- `actionCardPlayed = null | cardType` - name of action which persists to next player
- `actionValue: number` - increments with each takeX or sleep cards
- `playerDemandingRank: Player` - player who initiaded 'demand rank'
- `demandedRank: string` - rank of card demanded
- `playerDemandingSuit: Player` - same for suit
- `demandedSuit: string`

### Commands

Commands could be defined on-the-fly. Users should be able to tweak the rules, by choosing some variants, for example: "5s on anything on 5s" OR "Q♠ on anything on Q♠"

List of all possible variants:
* 'takeX' - 2, 3, King♥, King♠
* 'sleep' - 4
* 'anyOnFive' or 'anyOnQueenSpades' - "play anything on - X - on anything" (rare)
* 'demandRank' all Js - "card played on it can be of any suit", action can be replaced with another J
* 'demandSuit' all Aces - "card played on it can be of any suit", can be replaced with another Ace
* 'cancelTakeX' Q♠ - "queen spades cancels effects of takeX" (rare)
* 'jokers' - acts as any chosen card

#### 1. play card from hand

- play card without action
  * interaction:
    - element type: 'card'
    - card rank: depending on optional rules - [5,6,7,8,9,10]
  * conditions: `isMyTurn`, OR(`matchesSuit`, `matchesRank`)
- play first "takeX" card
  * interaction:
    - element type: 'card'
    - cards: [2,3] OR ['KS','KH']
  * conditions:
    - `!actionCardPlayed`
- play defending "takeX"
  * interaction:
    -
  * conditions `actionCardPlayed` on pile, `type === pile.top`, `rank is same`

- pass and take card from deck
  * take 1 card from deck
  * play it on pile (interaction: choose pile) (condition, `matches pile`, `from hand2`)
  * pass, put it on your hand (interaction: choose hand) (condition, `has card on hand2`)

What about this:

* interaction:
  - element type: 'card'
  - card rank: [2,3]
  - card name: ['KS','KH']



**Game itself** can invoke some commands:

Replenish deck - if deck looses its last cards by any player interaction:
- move all but the top cards from pile to deck
- shuffle them
