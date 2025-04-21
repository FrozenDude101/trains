import Component from "../Components/Component.mjs";
import Sprite from "./Sprite.mjs";

interface IScript {
    onEnable: () => void;
    onDisable: () => void;
    onUpdate: (ms: number) => void;
    getSprites: () => Sprite;
}

export type ScriptEvent = keyof IScript;
export type ScriptParameters<TScript extends ScriptEvent> = Parameters<IScript[TScript]>;
export type ScriptReturn<TScript extends ScriptEvent> = ReturnType<IScript[TScript]>;

export default abstract class Script<TParent extends Component = Component> implements Partial<IScript> {
    
    protected readonly parent: TParent;

    private _enabled: boolean = true;
    public get enabled() { return this._enabled; }

    public constructor(parent: TParent) {
        this.parent = parent;
    }

    public enable(): void {
        if (this._enabled) return;
        this._enabled = true;
        this.handleEvent("onEnable");
    }
    public disable(): void {
        if (!this._enabled) return;
        this.handleEvent("onDisable");
        this._enabled = false;
    }

    public onEnable?: () => void = undefined;
    public onDisable?: () => void = undefined;
    public onUpdate?: (ms: number) => void = undefined;
    public getSprites?: () => Sprite = undefined;

    public hasEvent<TEvent extends ScriptEvent>(event: TEvent): boolean {
        return this[event] !== undefined;
    }
    public handleEvent<TEvent extends ScriptEvent>(event: TEvent, ...args: ScriptParameters<TEvent>): ScriptReturn<TEvent> {
        // @ts-ignore
        return this[event]?.(...args);
    }

}