import Component from "./Component.mjs";
import { ScriptEvent, ScriptParameters, ScriptReturn } from "../Scripts/Script.mjs";

export default class Game {

    private readonly CANVAS_WIDTH = 320;
    private readonly CANVAS_HEIGHT = 180;
    private readonly MS_PER_TICK = 1000 / 60;
    private readonly MS_PER_FRAME = 1000 / 60;

    private readonly container: HTMLElement;
    private canvas: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private scale: number = 1;

    private previousTimestamp?: number;
    private animationFrame?: number;
    private tickTime: number = 0;
    private frameTime: number = 0;

    private children: Array<Component> = [];

    public constructor() {
        const body = document.getElementsByTagName("body")[0];
        if (!body) throw new Error("Failed to locate a body element for the game.");
        this.container = body;

        this.canvas = document.createElement("canvas");
        this.container.appendChild(this.canvas);
        this.resizeCanvas();

        this.update = this.update.bind(this);
    }

    public addChild<TChild extends Component>(child: TChild): TChild {
        this.children.push(child);
        return child;
    }

    public resizeCanvas(): void {
        this.scale = Math.floor(Math.max(1, Math.min(
            this.container.offsetWidth / this.CANVAS_WIDTH,
            this.container.offsetHeight / this.CANVAS_HEIGHT,
        )));

        this.canvas.width = this.CANVAS_WIDTH * this.scale;
        this.canvas.height = this.CANVAS_HEIGHT * this.scale;

        const ctx = this.canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to create a 2d canvas rendering context.");
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
        this.ctx.scale(this.scale, this.scale);
    }

    public start(): void {
        if (this.animationFrame) return;
        this.animationFrame = window.requestAnimationFrame(this.update);
        this.handleEvent("onEnable");
    }
    public stop(): void {
        if (!this.animationFrame) return;
        this.handleEvent("onDisable");
        window.cancelAnimationFrame(this.animationFrame);
    }
    public update(timestamp: number): void {
        try {
            this.animationFrame = window.requestAnimationFrame(this.update);
            if (!this.previousTimestamp) {
                this.previousTimestamp = timestamp;
                return;
            }

            const elapsed = timestamp - this.previousTimestamp;
            this.previousTimestamp = timestamp;

            this.tickTime += elapsed;
            while (this.tickTime >= this.MS_PER_TICK) {
                this.tickTime -= this.MS_PER_TICK;
                this.tick();
            }

            this.frameTime += elapsed;
            if (this.frameTime >= this.MS_PER_FRAME) {
                this.frameTime  = 0;
                this.render();
            }

        } catch (e) {
            this.stop();
            throw e;
        }
    }
    public tick() {
        this.handleEvent("onUpdate", this.MS_PER_TICK);
    }
    public render() {
        const sprites = this.handleEvent("getSprites");

        this.ctx.clearRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);
        for (let sprite of sprites) {
            this.ctx.save();
            sprite.draw(this.ctx);
            this.ctx.restore();
        }
    }

    public handleEvent<TEvent extends ScriptEvent>(event: TEvent, ...args: ScriptParameters<TEvent>): Array<ScriptReturn<TEvent>> {
        var returnValues: Array<ScriptReturn<TEvent>> = [];

        for (let child of this.children) {
            if (!child.enabled) continue;
            returnValues.push(...child.handleEvent(event, ...args));
        }

        return returnValues;
    }

}