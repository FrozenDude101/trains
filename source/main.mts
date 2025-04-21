import Game from "./the-pixel-engine/Components/Game.mjs";
import Vector2 from "./the-pixel-engine/Maths/Vector2.mjs";
import Stock from "./trains/stock/Stock.mjs";
import Track from "./trains/track/Track.mjs";
import TrackNode from "./trains/track/TrackNode.mjs";

const game = new Game();

const node1 = game.addChild(new TrackNode("Node1", new Vector2(-50, 50)));
const node2 = game.addChild(new TrackNode("Node2", new Vector2(-50, -50)));
const node3 = game.addChild(new TrackNode("Node3", new Vector2(50, -50)));
const node4 = game.addChild(new TrackNode("Node4", new Vector2(50, 50)));

const track1 = game.addChild(new Track("Track1", node1, node2));
const track2 = game.addChild(new Track("Track2", node2, node3));
const track3 = game.addChild(new Track("Track3", node3, node4));
const track4 = game.addChild(new Track("Track4", node4, node1));

node2.addConnection(track1, track2);
node3.addConnection(track2, track3);
node4.addConnection(track3, track4);
node1.addConnection(track4, track1);

let stock = game.addChild(new Stock(track1, node1));

//@ts-ignore
window.stock = stock;

game.start();