define("lobby", ["require", "exports", "colyseus"], function (require, exports, colyseus) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const isValidMessage = text => {
        return ('' + text).length > 0;
    };
    class Lobby extends colyseus.Room {
        onInit(options) {
            this.setState({
                messages: [],
                clients: [],
                gameRooms: [],
            });
            console.log('Lobby created!', options);
        }
        onJoin(client) {
            this.state.messages.push({
                text: `${client.id} joined.`
            });
            this.state.clients.push(client.id);
        }
        onLeave(client) {
            this.state.messages.push({
                text: `${client.id} left.`
            });
            this.state.clients.splice(this.state.clients.indexOf(client.id), 1);
        }
        onMessage(client, data) {
            if (isValidMessage(data.message)) {
                this.state.messages.push({
                    text: data.message,
                    client: client.id
                });
                console.log('Lobby:', client.id, data.message);
            }
        }
        onDispose() {
            console.log('Dispose Lobby');
        }
    }
    module.exports = Lobby;
});
define("cardsGame/base", ["require", "exports", "uuid/v4", "../../shared/utils", "eventemitter3", "colyseus"], function (require, exports, v4_1, utils_1, EventEmitter, colyseus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const objects = new Map();
    class Base extends EventEmitter {
        constructor(options) {
            super();
            this.id = v4_1.default();
            objects.set(this.id, this);
            this.type = utils_1.default.def(options.type, undefined);
            this.name = utils_1.default.def(options.name, undefined);
            this.width = utils_1.default.def(options.width, 5);
            this.height = utils_1.default.def(options.height, 5);
            this.children = [];
            this.onUpdate = utils_1.default.def(options.onUpdate || utils_1.default.noop);
            this.parentId = typeof options.parentId === 'string' ? options.parentId : null;
            if (options.parentId !== null) {
                const parent = Base.get(options.parentId);
                parent && parent.addChild(this.id);
            }
            this.startListeningForEvents();
        }
        get owner() {
            if (typeof this.parentId === 'string') {
                return Base.get(this.parentId);
            }
            else if (this.parentId === null) {
                return null;
            }
            else {
                return Base.get(this.parentId).owner;
            }
        }
        startListeningForEvents() {
            this.on('child.removed', child => this.removeChild(child));
        }
        top() {
            return Base.get(this.children[this.children.length - 1]);
        }
        bottom() {
            return Base.get(this.children[0]);
        }
        moveTo(newParent) {
            if (typeof newParent === 'string') {
                newParent = Base.get(newParent);
            }
            newParent.addChild(this);
            return this;
        }
        addChild(element) {
            const child = typeof element === 'string' ? Base.get(element) : element;
            const lastParent = Base.get(child.parentId);
            if (lastParent) {
                lastParent.removeChild(child);
            }
            child.parentId = this.id;
            this.children.push(child.id);
            child.onUpdate(child);
            this.onUpdate(this);
            return this;
        }
        removeChild(element) {
            const child = typeof element === 'string' ? Base.get(element) : element;
            if (!child) {
                throw new ReferenceError(`couldn't find that chid: ${child}`);
            }
            if (!this.children.some(id => id === child.id)) {
                return this;
            }
            child.parentId = null;
            this.children = this.children.filter(id => id !== child.id);
            this.onUpdate(this);
            child.onUpdate(child);
            return this;
        }
        filterByName() { }
        getAllByType(type, deep = true) {
            const nested = [];
            const found = this.children
                .map(Base.toObject)
                .filter(el => {
                if (deep && el.children.length > 1) {
                    nested.push(...el.getAllByType(type));
                }
                return el.type === type;
            });
            return [...found, ...nested];
        }
        getByType(type) {
            return this.getAllByType(type, false)[0];
        }
        static get(id) {
            return objects.get(id);
        }
        static toObject(element) {
            return typeof element === 'string' ? Base.get(element) : element;
        }
        static _clear() {
            objects.clear();
        }
    }
    Base.events = {
        TEST: 'test'
    };
    exports.Base = Base;
    colyseus_1.nosync(Base.prototype, '_events');
    colyseus_1.nosync(Base.prototype, '_eventsCount');
    colyseus_1.nosync(Base.prototype, '_maxListeners');
    colyseus_1.nosync(Base.prototype, 'domain');
    colyseus_1.nosync(Base.prototype, 'onUpdate');
});
define("cardsGame/baseCard", ["require", "exports", "cardsGame/base"], function (require, exports, base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseCard extends base_1.Base {
        constructor(options) {
            super(options);
            this.state = {
                faceUp: false,
                rotated: 0,
                marked: false
            };
            this.name = options.name || 'card';
            this.type = options.type || 'card';
            this.state = { ...this.state, ...options.state };
        }
        show() {
            this.state.faceUp = true;
        }
        hide() {
            this.state.faceUp = false;
        }
        flip() {
            this.state.faceUp = !this.state.faceUp;
        }
        canBeTakenBy() { }
    }
    exports.BaseCard = BaseCard;
});
define("cardsGame/classicCard", ["require", "exports", "cardsGame/baseCard"], function (require, exports, baseCard_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ClassicCard extends baseCard_1.BaseCard {
        constructor(options) {
            super(options);
            this.suit = options.suit;
            this.rank = options.rank;
            this.name = this.rank + this.suit;
        }
    }
    exports.ClassicCard = ClassicCard;
});
define("cardsGame/command", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Command {
        constructor(context = {}) {
            this.context = context;
        }
        prepare() { }
        execute(invoker, state, reducer) { }
        undo(state, reducer) { }
    }
    exports.Command = Command;
});
define("cardsGame/commandManager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CommandManager {
        constructor() {
            this.commands = [];
            this.lastCommand = null;
        }
        execute(command, context, invoker, state, reducer) {
            const newCommand = new command(context);
            this.commands.push(newCommand);
            this.lastCommand = newCommand;
            newCommand.prepare();
            return newCommand.execute(invoker, state, reducer);
        }
        get canUndo() {
            return this.lastCommand !== null;
        }
    }
    exports.default = CommandManager;
});
define("cardsGame/conditions", ["require", "exports", "cardsGame/base"], function (require, exports, base_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Conditions extends Map {
        constructor(set = [], context = null) {
            super();
            Object.keys(set).forEach(key => {
                this.set(key, set[key]);
            });
            this.context = context !== null ? context.id : null;
        }
        check(key, args = undefined) {
            if (this.has(key) && typeof this.get(key) === 'function') {
                return this.get(key).apply(base_2.Base.get(this.context), args);
            }
            else {
                throw new Error(`There's no valid condition called ${key}.`);
            }
        }
    }
    exports.default = Conditions;
});
define("cardsGame/container", ["require", "exports", "cardsGame/conditions", "cardsGame/base"], function (require, exports, conditions_1, base_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Container extends base_3.Base {
        constructor(options) {
            super(options);
            this.conditions = new conditions_1.default(options.conditions, this);
        }
        get length() {
            return this.children.length;
        }
        shuffle() {
            let i = this.children.length;
            if (i === 0)
                return;
            while (--i) {
                const j = Math.floor(Math.random() * (i + 1));
                const tempi = this.children[i];
                const tempj = this.children[j];
                this.children[i] = tempj;
                this.children[j] = tempi;
            }
            this.emit(Container.events.SHUFFLED);
            return this;
        }
    }
    Container.events = {
        ...base_3.Base.events,
        SHUFFLED: 'shuffled'
    };
    exports.Container = Container;
});
define("cardsGame/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toArray = (element) => {
        return !Array.isArray(element) ? [element] : [...element];
    };
});
define("cardsGame/game", ["require", "exports", "eventemitter3", "cardsGame/commandManager", "cardsGame/utils"], function (require, exports, EventEmitter, commandManager_1, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const eventTypeMatches = (playerEvent, actionContext) => {
        if (actionContext.eventType) {
            const eventTypes = utils_2.toArray(actionContext.eventType);
            return eventTypes.some(type => type === playerEvent.eventType);
        }
        return true;
    };
    const reporterMatches = (playerEvent, actionContext) => {
        if (actionContext.reporter) {
            const keys = Object.keys(actionContext.reporter);
            return keys.every(prop => actionContext.reporter[prop] === playerEvent.reporter[prop]);
        }
        return true;
    };
    const elementMatches = (playerEvent, actionContext) => {
        if (actionContext.element) {
            const playerElements = utils_2.toArray(playerEvent.element);
            const contextProps = Object.keys(actionContext.element);
            return playerElements.every(element => contextProps.every(prop => element[prop] === actionContext.element[prop]));
        }
        return true;
    };
    const doesContextMatch = (playerEvent, actionContext) => {
        return eventTypeMatches(playerEvent, actionContext) &&
            reporterMatches(playerEvent, actionContext) &&
            elementMatches(playerEvent, actionContext);
    };
    class Game extends EventEmitter {
        constructor(options) {
            super();
            this.actions = options.actions;
            this.reducer = options.reducer;
            this.commandManager = new commandManager_1.default();
        }
        actionCompleted(resolve, actionName) {
            return status => {
                console.info('Action complete:', status);
                resolve(status);
                this.emit(Game.events.ACTION_COMPLETED, actionName, status);
            };
        }
        actionFailed(reject, actionName) {
            return status => {
                console.warn('Action failed:', status);
                reject(status);
                this.emit(Game.events.ACTION_FAILED, actionName, status);
            };
        }
        performAction(client, data, state) {
            if (client === null || typeof client !== 'object') {
                client = Game.id;
            }
            const action = data.action ?
                this.actions[data.action] :
                this.mapEventToIntention(data);
            const actionName = data.action;
            console.info(`-= performAction("${client.id}",`, data, `)`);
            if (!data.action) {
                console.info(`   User Event:`, data);
                console.info(`   Found intentions: ${action.length}`);
            }
            return new Promise((resolve, reject) => {
                if (!state.clients || state.clients.length <= 0) {
                    reject(`There are no clients.`);
                }
                if (state.clients.includes(client)) {
                    reject(`This client doesn't exist "${client}".`);
                }
                if (action === undefined) {
                    reject(`Unknown action.`);
                }
                const context = {
                    data: data,
                    ...action.context
                };
                if (action.condition === undefined) {
                    console.info(`action has no conditions`);
                    this.commandManager.execute(action.command, context, client, state, this.reducer)
                        .then(this.actionCompleted(resolve, actionName))
                        .catch(this.actionFailed(reject, actionName));
                }
                else {
                    action.condition(state, client)
                        .then(() => this.commandManager.execute(action.command, context, client, state, this.reducer))
                        .then(this.actionCompleted(resolve, actionName))
                        .catch(this.actionFailed(reject, actionName));
                }
            });
        }
        getAllPossibleMoves() {
            return this.actions;
        }
        getCurrentPossibleMoves() {
        }
        mapEventToIntention(playerEvent) {
            const actions = this.actions;
            const actionKeys = Object.keys(actions);
            const matchedContext = actionKeys.filter(actionName => {
                console.log('actionName: ', actionName);
                if (typeof actions[actionName].context === 'undefined' || typeof actions[actionName].context !== 'object') {
                    return false;
                }
                return doesContextMatch(playerEvent, actions[actionName].context);
            });
            return matchedContext;
        }
    }
    Game.id = Symbol('gameid');
    Game.events = {
        ACTION_COMPLETED: 'actionCompleted',
        ACTION_FAILED: 'actionFailed',
    };
    Game.baseState = () => {
        return {
            clients: [],
            started: false,
            players: {
                list: [],
                reversed: false,
                currentPlayerIdx: 0,
                currentPlayer: null,
                currentPlayerPhase: 0,
            },
            table: null,
        };
    };
    exports.Game = Game;
    Object.defineProperties(Array.prototype, {
        'first': {
            get: function () {
                return this[0];
            }
        },
        'last': {
            get: function () {
                return this[this.length - 1];
            }
        }
    });
});
define("cardsGame/commands/createContainer", ["require", "exports", "cardsGame/command"], function (require, exports, command_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const containerClasses = {
        'container': require('../container'),
        'deck': require('../containers/deck'),
        'hand': require('../containers/hand'),
        'pile': require('../containers/pile'),
        'row': require('../containers/row'),
        'spread': require('../containers/spread'),
    };
    class CreateContainer extends command_1.Command {
        constructor(conditions, context) {
            super(context);
        }
        execute() {
            this.context.newContainer = new containerClasses[this.context.type](this.context.options);
            this.context.state.containers.push(this.context.newContainer);
        }
        undo() {
            if (!this.context.newContainer) {
                return false;
            }
        }
    }
    exports.default = CreateContainer;
});
define("cardsGame/containers/deck", ["require", "exports", "cardsGame/container"], function (require, exports, container_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Deck extends container_1.Container {
        constructor(options) {
            super({
                ...options,
                type: options.type || 'deck'
            });
        }
        deal(containers, count = Infinity) {
            let i = 0;
            containers = Array.isArray(containers) ? containers : [containers];
            containers = containers.map(container_1.Container.toObject);
            const maxDeals = count * containers.length;
            const dealOne = () => {
                const card = this.top();
                if (!card) {
                    this.onCardsDealt();
                    return;
                }
                card.moveTo(containers[i % containers.length]);
                i++;
                if (this.children.length > 0 && i < maxDeals) {
                    setTimeout(dealOne, 10);
                }
                else {
                    this.onCardsDealt();
                }
            };
            dealOne();
            return this;
        }
        onCardsDealt() {
            this.emit(Deck.events.DEALT);
            console.log('Deck: Done dealing cards.');
        }
    }
    Deck.events = {
        ...container_1.Container.events,
        DEALT: 'dealt'
    };
    exports.Deck = Deck;
});
define("cardsGame/player", ["require", "exports", "cardsGame/base"], function (require, exports, base_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Player extends base_4.Base {
        constructor(options) {
            super(options);
            this.type = 'player';
            this.name = options.name;
            this.clientId = options.clientId;
            this.score = 0;
            this.timeleft = 'Infinity';
        }
    }
    exports.Player = Player;
    module.exports = Player;
});
define("cardsGame/commands/drawUpToX", ["require", "exports", "cardsGame/command", "cardsGame/containers/deck", "cardsGame/player"], function (require, exports, command_2, deck_1, player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DrawUpToX extends command_2.Command {
        execute(invoker, state, reducer) {
            return new Promise((resolve) => {
                const player = player_1.Player.get(state.players.list.find(player => player.clientId === invoker).id);
                const myDeck = player.getByType('deck');
                const myHand = player.getByType('hand');
                const cardsToTake = this.context.maxCards - myHand.length;
                myDeck.deal(myHand, cardsToTake)
                    .on(deck_1.Deck.events.DEALT, () => setTimeout(resolve, 250));
            });
        }
    }
    exports.default = DrawUpToX;
});
define("cardsGame/commands/moveCardToContainer", ["require", "exports", "cardsGame/command", "../../../shared/utils"], function (require, exports, command_3, utils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MoveCardToContainer extends command_3.Command {
        constructor(context) {
            super(context);
            this.context = context;
        }
        execute(invoker, state) {
            const card = utils_3.default.getElementById(state.cards, this.context.card.id);
            this.context.container.addChild(card);
        }
    }
    exports.default = MoveCardToContainer;
});
define("cardsGame/commands/nextPlayer", ["require", "exports", "cardsGame/command"], function (require, exports, command_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NextPlayer extends command_4.Command {
        execute(invoker, state, reducer) {
            reducer.players.next(state);
        }
        undo(state, reducer) {
            reducer.players.prev(state);
        }
    }
    exports.default = NextPlayer;
});
define("cardsGame/commands/prevPlayer", ["require", "exports", "cardsGame/command"], function (require, exports, command_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PreviousPlayer extends command_5.Command {
        execute(invoker, state, reducer) {
            reducer.players.prev(state);
        }
        undo(state, reducer) {
            reducer.players.next(state);
        }
    }
    exports.default = PreviousPlayer;
});
define("cardsGame/conditions/isClientPlaying", ["require", "exports", "cardsGame/player"], function (require, exports, player_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = (state, client) => new Promise((resolve, reject) => {
        const player = player_2.Player.get(state.players.list.find(player => player.clientId === client));
        if (!player) {
            reject(`Couldn't find this client in players list`);
        }
        resolve();
    });
});
define("cardsGame/conditions/isPlayersTurn", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = (state, player) => {
        return state.players.currentPlayer === player;
    };
});
define("cardsGame/containers/hand", ["require", "exports", "cardsGame/container"], function (require, exports, container_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Hand extends container_2.Container {
        constructor(options) {
            super({
                ...options,
                type: options.type || 'hand',
            });
        }
        addChild(element) {
            super.addChild(element);
            if (element.type === 'card') {
                element.show && element.show();
            }
            return this;
        }
        removeChild(element) {
            super.removeChild(element);
            if (element.type === 'card') {
                element.show && element.hide();
            }
            return this;
        }
    }
    exports.Hand = Hand;
    module.exports = Hand;
});
define("cardsGame/containers/pile", ["require", "exports", "cardsGame/container", "../../../shared/utils"], function (require, exports, container_3, utils_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const cardsDataFactory = (card, limits) => {
        return {
            id: card.id,
            rotation: utils_4.default.float(limits.minAngle, limits.maxAngle),
            offset: {
                x: utils_4.default.float(limits.minX, limits.maxX),
                y: utils_4.default.float(limits.minY, limits.maxY),
            }
        };
    };
    class Pile extends container_3.Container {
        constructor(options) {
            super(options);
            this.type = options.type || 'pile';
            this.limits = Object.assign({}, {
                minAngle: -20,
                maxAngle: 20,
                minX: -10,
                minY: -10,
                maxX: 10,
                maxY: 10,
            }, options.limits);
            this.cardsData = [];
        }
        addChild(element) {
            this.cardsData.push(cardsDataFactory(element, this.limits));
            return super.addChild(element);
        }
        removeChild(element) {
            const idx = this.children.indexOf(element);
            this.cardsData.splice(idx, 1);
            return super.removeChild(element);
        }
    }
    exports.Pile = Pile;
});
define("cardsGame/containers/row", ["require", "exports", "cardsGame/container"], function (require, exports, container_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Row extends container_4.Container {
        constructor(options) {
            super(options);
            this.type = options.type || 'row';
        }
    }
    exports.Row = Row;
});
define("cardsGame/containers/spread", ["require", "exports", "cardsGame/container"], function (require, exports, container_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Spread extends container_5.Container {
        constructor(options) {
            super(options);
            this.type = options.type || 'spread';
        }
    }
    exports.Spread = Spread;
});
define("cardsGame/presets", ["require", "exports", "cardsGame/classicCard"], function (require, exports, classicCard_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.classicCards = () => {
        const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        const suits = ['H', 'S', 'C', 'D'];
        const cards = suits.reduce((prevS, suit) => [
            ...prevS,
            ...ranks.reduce((prevR, rank) => [
                ...prevR,
                new classicCard_1.ClassicCard({ suit, rank })
            ], [])
        ], []);
        console.log(`  = CardAPI, presets: created a deck of ${cards.length} cards`);
        return cards;
    };
});
define("cardsGame/table", ["require", "exports", "../../shared/utils"], function (require, exports, utils_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Table {
        constructor({ width, height }) {
            this.width = utils_5.default.def(width, 55);
            this.height = utils_5.default.def(height, 55);
            this.x = 0;
            this.y = 0;
        }
    }
    exports.Table = Table;
});
define("cardsGame/reducers/arrayReducer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const createArrayReducer = (targetArray) => {
        const reducer = {
            add: (state, element) => {
                element.onUpdate = me => reducer.update(state, me);
                state[targetArray].push(element);
            },
            remove: (state, element) => {
                state[targetArray] = state[targetArray].filter(el => el !== element);
            },
            update: (state, element) => {
                const idx = state[targetArray].indexOf(element);
                state[targetArray][idx] = element;
            },
        };
        return reducer;
    };
    exports.default = createArrayReducer;
});
define("cardsGame/reducers/players", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const playersReducer = {
        add: (state, player) => {
            player.onUpdate = me => playersReducer.update(state, me);
            state.players.list.push(player);
        },
        update: (state, player) => {
            const idx = state.players.list.indexOf(player);
            state.players.list[idx] = player;
        },
        next: (state) => {
            const players = state.players;
            let currIdx = players.currentPlayerIdx;
            if (!players.reversed) {
                if (++currIdx > players.list.length - 1) {
                    currIdx = 0;
                }
            }
            else {
                if (--currIdx < 0) {
                    currIdx = players.list.length - 1;
                }
            }
            players.currentPlayerIdx = currIdx;
            players.currentPlayer = players.list[currIdx];
        },
        prev: (state) => {
            const players = state.players;
            let currIdx = players.currentPlayerIdx;
            if (players.reversed) {
                if (++currIdx > players.list.length - 1) {
                    currIdx = 0;
                }
            }
            else {
                if (--currIdx < 0) {
                    currIdx = players.list.length - 1;
                }
            }
            players.currentPlayerIdx = currIdx;
            players.currentPlayer = players.list[currIdx];
        },
        shuffle: (state) => {
            let currentPlayerIdx = state.players.currentPlayerIdx;
            let i = state.players.list.length;
            if (i === 0) {
                return;
            }
            while (--i) {
                const j = Math.floor(Math.random() * (i + 1));
                const tempi = state.players.list[i];
                const tempj = state.players.list[j];
                state.players.list[i] = tempj;
                state.players.list[j] = tempi;
                if (i === currentPlayerIdx) {
                    currentPlayerIdx = j;
                }
            }
            state.players.currentPlayerIdx = currentPlayerIdx;
            state.players.currentPlayer = state.players.list[currentPlayerIdx];
        },
        reverse: (state) => {
            state.players.reversed = state.players.reversed;
        }
    };
    exports.default = playersReducer;
});
define("cardsGame/reducers/index", ["require", "exports", "cardsGame/reducers/arrayReducer", "cardsGame/reducers/players"], function (require, exports, arrayReducer_1, players_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Reducers = {
        createArrayReducer: arrayReducer_1.default,
        playerReducer: players_1.default
    };
});
define("cardsGame/index", ["require", "exports", "cardsGame/base", "cardsGame/baseCard", "cardsGame/classicCard", "cardsGame/command", "cardsGame/commands/createContainer", "cardsGame/commands/drawUpToX", "cardsGame/commands/moveCardToContainer", "cardsGame/commands/nextPlayer", "cardsGame/commands/prevPlayer", "cardsGame/conditions/isClientPlaying", "cardsGame/conditions/isPlayersTurn", "cardsGame/container", "cardsGame/containers/deck", "cardsGame/containers/hand", "cardsGame/containers/pile", "cardsGame/containers/row", "cardsGame/containers/spread", "cardsGame/game", "cardsGame/player", "cardsGame/presets", "cardsGame/table", "cardsGame/reducers/index"], function (require, exports, base_5, baseCard_2, classicCard_2, command_6, createContainer_1, drawUpToX_1, moveCardToContainer_1, nextPlayer_1, prevPlayer_1, isClientPlaying_1, isPlayersTurn_1, container_6, deck_2, hand_1, pile_1, row_1, spread_1, game_1, player_3, Presets, table_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Base = base_5.Base;
    exports.BaseCard = baseCard_2.BaseCard;
    exports.ClassicCard = classicCard_2.ClassicCard;
    exports.Command = command_6.Command;
    exports.DefaultCommands = {
        CreateContainer: createContainer_1.default,
        DrawUpToXCommand: drawUpToX_1.default,
        MoveCardToContainer: moveCardToContainer_1.default,
        NextPlayer: nextPlayer_1.default,
        PreviousPlayer: prevPlayer_1.default
    };
    exports.Conditions = {
        isClientPlaying: isClientPlaying_1.default, isPlayersTurn: isPlayersTurn_1.default
    };
    exports.Container = container_6.Container;
    exports.Deck = deck_2.Deck;
    exports.Hand = hand_1.Hand;
    exports.Pile = pile_1.Pile;
    exports.Row = row_1.Row;
    exports.Spread = spread_1.Spread;
    exports.Game = game_1.Game;
    exports.Player = player_3.Player;
    exports.Presets = Presets;
    exports.Table = table_1.Table;
    exports.Reducers = index_1.Reducers;
});
define("cardsGame/events/playerEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlayerEvent {
        constructor({ player, reporter, element, eventType }) {
            this.player = player;
            this.reporter = reporter;
            this.element = element;
            this.eventType = eventType;
        }
    }
    exports.PlayerEvent = PlayerEvent;
});
define("cardsGame/reducers/clients", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const clientsReducer = {
        add: (state, client) => {
            state.clients.push(client);
        },
        remove: (state, client) => {
            state.clients = state.clients.filter(el => el !== client);
        }
    };
    exports.default = clientsReducer;
});
define("cardsGame/reducers/containers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const containersReducer = {
        add: (state, container) => {
            container.onUpdate = me => containersReducer.update(state, me);
            state.containers.push(container);
        },
        remove: (state, container) => {
            state.containers = state.containers.filter(el => el !== container);
        },
        update: (state, container) => {
            state.containers.forEach((element, idx) => {
                if (element.id === container.id) {
                    for (const key in container) {
                        state.containers[idx][key] = container[key];
                    }
                }
            });
        },
        addElement: (state, container, element) => {
            console.log('add element ', element);
            const cont = state.containers.find(el => el.id === container.id);
            cont.addChild(element);
        }
    };
    exports.default = containersReducer;
});
define("warGame/actions/index", ["require", "exports", "../../cardsGame"], function (require, exports, cardsGame_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        GameStart: require('./gameStart'),
        PlayCard: require('./playCard'),
        NextPlayer: cardsGame_1.DefaultCommands.NextPlayer,
        PrevPlayer: cardsGame_1.DefaultCommands.PreviousPlayer,
        DrawUpToThree: require('./drawUpToThree'),
        TestDeal: require('./testDeal'),
    };
});
define("warGame/index", ["require", "exports", "colyseus", "cardsGame/index", "warGame/actions/index"], function (require, exports, colyseus, index_2, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const reducer = {
        clients: index_2.Reducers.createArrayReducer('clients'),
        cards: index_2.Reducers.createArrayReducer('cards'),
        containers: index_2.Reducers.createArrayReducer('containers'),
        players: index_2.Reducers.playerReducer,
    };
    class WarGame extends colyseus.Room {
        onInit(options) {
            this.game = new index_2.Game({
                actions: index_3.default,
                reducer,
            });
            this.setState(Object.assign({}, index_2.Game.baseState(), {
                maxClients: options.maxClients || 2,
                host: options.host,
                cards: [],
                containers: [],
            }));
            console.log('WarGame room created!', options);
        }
        requestJoin() {
            const res = this.clients.length < this.state.maxClients;
            if (!res) {
                console.log('WarGame - rejected new client!');
            }
            return this.clients.length < this.state.maxClients;
        }
        onJoin(client) {
            console.log('WarGame: JOINED: ', client.id);
            reducer.clients.add(this.state, client.id);
            if (!this.state.host) {
                this.state.host = client.id;
            }
        }
        onLeave(client) {
            reducer.clients.remove(this.state, client.id);
        }
        onMessage(client, data) {
            console.log('MSG: ', JSON.stringify(data));
            this.performAction(client, data);
        }
        onDispose() {
            console.log('Dispose WarGame');
            console.log('===========================');
        }
        performAction(client, data) {
            this.game.performAction(client, data, this.state)
                .then(status => {
                console.log('action resolved!', status);
            })
                .catch(status => {
                console.error('action failed!', status);
                this.broadcast({
                    event: 'game.error',
                    data: `Client "${client.id}" failed to perform "${data.action}" action.
          Details: ${status}`
                });
            });
        }
        attatchEvents() {
            const eventMap = {
                gameStart: this.onGameStart,
            };
            this.game.on(index_2.Game.events.ACTION_COMPLETED, (actionName, status) => {
                eventMap[actionName](status);
            });
        }
        onGameStart() {
        }
    }
    exports.default = WarGame;
});
const { isPlayersTurn, isClientPlaying, } = require('../../cardsGame').Conditions;
const { DrawUpToX } = require('../../cardsGame/commands');
const condition = (state, client) => new Promise((resolve, reject) => {
    if (!isPlayersTurn(state, client.id)) {
        reject(`It's not your turn.`);
        return;
    }
    else if (!isClientPlaying(state, client.id)) {
        reject(`Couldn't find this client in players list`);
        return;
    }
    resolve();
});
const command = DrawUpToX;
const context = {
    maxCards: 3
};
module.exports = { condition, command, context };
define("warGame/actions/gameStart", ["require", "exports", "../../cardsGame"], function (require, exports, cardsGame_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const randomName = () => [1, 2, 3].map(() => Math.floor(Math.random() * 25 + 65)).map((e) => String.fromCharCode(e)).join('');
    const condition = (state, client) => new Promise((resolve, reject) => {
        if (state.started) {
            reject(`Game already started.`);
        }
        else if (client.id !== state.host) {
            reject(`Client '${client.id}' is not a host: '${state.host}'`);
        }
        else if (state.clients.length < 1) {
            reject(`Not enough clients: only '${state.clients.length}' clients in the room`);
        }
        resolve();
    });
    const command = class GameStartCommand extends cardsGame_2.Command {
        prepare() {
            this.context.createdPlayers = [];
            this.context.createdContainers = [];
        }
        execute(invoker, state, reducer) {
            return new Promise((resolve) => {
                [0, 1].forEach(client => {
                    const newPlayer = new cardsGame_2.Player({
                        clientId: '' + client,
                        name: randomName(),
                    });
                    this.context.createdPlayers.push(newPlayer);
                    reducer.players.add(state, newPlayer);
                });
                const mainDeck = new cardsGame_2.Deck({
                    x: 0, y: 0,
                });
                this.context.createdContainers.push(mainDeck);
                reducer.containers.add(state, mainDeck);
                state.players.list.forEach(player => {
                    reducer.containers.add(state, new cardsGame_2.Deck({
                        x: 20,
                        parentId: player.id,
                    }));
                    reducer.containers.add(state, new cardsGame_2.Hand({
                        parentId: player.id,
                    }));
                    reducer.containers.add(state, new cardsGame_2.Pile({
                        parentId: player.id,
                        name: 'stage',
                        y: -20,
                    }));
                    reducer.containers.add(state, new cardsGame_2.Pile({
                        parentId: player.id,
                        name: 'dead heat',
                        y: -20,
                        x: -20,
                    }));
                });
                cardsGame_2.Presets.classicCards().forEach(card => {
                    reducer.cards.add(state, card);
                    mainDeck.addChild(card);
                });
                state.started = true;
                setTimeout(() => {
                    const decks = state.players.list.map(player => player.getAllByType('deck').first);
                    mainDeck.deal(decks);
                }, 500);
                mainDeck.on(cardsGame_2.Deck.events.DEALT, () => {
                    setTimeout(() => {
                        state.players.list.map(player => {
                            const myDeck = player.getByType('deck');
                            const myHand = player.getByType('hand');
                            myDeck.deal(myHand, 3);
                        });
                        resolve();
                    }, 500);
                });
            });
        }
        undo() { }
    };
    module.exports = { condition, command };
});
define("warGame/actions/playCard", ["require", "exports", "../../cardsGame"], function (require, exports, cardsGame_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const { Command, } = require('../../cardsGame/index');
    const context = {
        eventType: 'click',
        reporter: {
            type: 'hand'
        },
        element: {
            type: 'card'
        }
    };
    const condition = (state, client) => new Promise((resolve, reject) => {
        if (!cardsGame_3.Conditions.isPlayersTurn(state, client.id)) {
            reject(`It's not your turn.`);
            return;
        }
        resolve();
    });
    class PlayCardCommand extends Command {
        execute() {
            return new Promise((resolve) => {
                this.context.element.moveTo(this.context.target);
                resolve();
            });
        }
    }
    module.exports = { context, condition, command: PlayCardCommand };
});
define("warGame/actions/testDeal", ["require", "exports", "cardsGame/index"], function (require, exports, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const command = class TestDealCommand extends index_4.Command {
        execute(invoker, state) {
            return new Promise((resolve, reject) => {
                const contsCards = state.containers.filter(container => {
                    return container.children.length > 0 && container.type === 'deck';
                });
                console.log(`found ${contsCards.length} potential FROM candidates`);
                let idx = Math.floor(Math.random() * (contsCards.length - 1));
                const cont = contsCards[idx];
                idx = Math.floor(Math.random() * (state.containers.length - 1));
                const targetCont = state.containers[idx];
                if (cont) {
                    cont.deal(targetCont, Math.floor(Math.random() * 3));
                    cont.on(index_4.Deck.events.DEALT, () => resolve());
                }
                else {
                    reject(`couldn't find cont :(`);
                }
            });
        }
    };
    module.exports = { command };
});
//# sourceMappingURL=index.js.map