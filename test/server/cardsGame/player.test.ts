import test from 'ava'
import Player from '../../../app/cardsGame/player'

test('constructor', t => {
  const player = new Player({
    type: 'something else',
    name: 'Zielak',
    clientId: 'asd123'
  })

  t.is(player.type, 'player')
  t.is(player.name, 'Zielak')
  t.is(player.clientId, 'asd123')
  t.is(player.score, 0)
})
