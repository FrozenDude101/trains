import Game from "./the-pixel-engine/Components/Game.mjs";
import Vector2 from "./the-pixel-engine/Maths/Vector2.mjs";
import Stock, { StockUpdate } from "./trains/stock/Stock.mjs";
import Track from "./trains/track/Track.mjs";
import TrackNode from "./trains/track/TrackNode.mjs";

const game = new Game();

const nodeCount = 10;
const circleRadius = 80;
const stockCount = 11;

const nodePoints: [number, number][] = [];
for (let i = 0; i < nodeCount; i++) {
    nodePoints.push([circleRadius * Math.sin(i * 2*Math.PI/nodeCount), circleRadius * Math.cos(i * 2*Math.PI/nodeCount)])
}

const nodes: TrackNode[] = [];
for (let i = 0; i < nodePoints.length; i++) {
    let point = nodePoints[i]!;
    nodes.push(game.addChild(new TrackNode(`Node${i}`, new Vector2(point[0], point[1]))))
}

const tracks: Track[] = [];
let preTrack: Track | null = null;
for (let i = 0; i < nodes.length - 1; i++) {
    let node1 = nodes[i]!;
    let node2 = nodes[i+1]!;
    let track = game.addChild(new Track(`Track${i}-${i+1}`, node1, node2));
    tracks.push(track);
    if (preTrack !== null) {
        node1.addConnection(preTrack, track);
    }
    preTrack = track;
}

let track = game.addChild(new Track(`TrackEnd`, nodes[0]!, nodes[nodes.length-1]!));
nodes[0]!.addConnection(track, tracks[0]!);
nodes[nodes.length-1]!.addConnection(track, tracks[tracks.length-1]!);

let head = game.addChild(new Stock(tracks[0]!, nodes[0]!, 0));
let pre = head;
for (let i = 1; i < stockCount; i++) {
    let item = game.addChild(new Stock(tracks[0]!, nodes[0]!, i * -25));
    pre.setNext(item);
    pre = item;
}

head.addScript(StockUpdate);

game.start();