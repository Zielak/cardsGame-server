TODO: document this API

# Game

## Events

- `ACTION_COMPLETED(actionName, status)`
- `ACTION_FAILED(actionName, status)`


# Elements

### Sizes

All cards and containers should have a defined real-like dimensions. Classic playing cards are about 5,6 cm x 8,7 cm (at least here in Europe). 

There are 2 units of dimensions now:

- width
- height

Table sets the whole playground. It also should have a real-like dimensions, default table is 55 cm wide and 55 cm long. Table should fill the whole screen, so if it's larger, then the renderer should scale the whole view down. All game elements will get smaller, but should also be accessible, eg. zoom in on hover.

Cards in Hand don't need to follow this rule, those in real-life are kept close to our eyes, regardless of the size of the table.

Client-side renderer should follow those rules. Renderer could play around using some 3D or CSS perspective.

I don't yet know how will it play out on mobile devices/small screens.

## Table

## Containers

Containers are just a group of cards/elements. Different containers should be rendered differently

### `deck`

Neatly packed cards on top of eachother. Same x/y positions.

### `hand`

Cards that you hold in your own hand, and nobody can see them. They're ought to 
be rendered in "spread", just like you would hold cards in your hand.

### `pile`

Cards randomly thrown at one spot on the table, one on top of the other.
Each new card will get randomized offset and rotation.

### `row`

Cards placed in one row, one next to the other.
This container has specified width, and cards will never overflow this container.
User should be able to peek and see all cards in here (unless they're face-down). 

### `spread`

![Spread of cards](https://i.imgur.com/6AOyxPm.gif)

## Cards


