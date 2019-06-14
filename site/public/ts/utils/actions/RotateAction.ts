import {Vector} from "../math/Vector";

import {Action} from "./Action";
import {Component} from "../../models/ioobjects/Component";

export class RotateAction implements Action {
    private objects: Array<Component>;

    private midpoint: Vector;

    private initialAngles: Array<number>;
    private finalAngles: Array<number>;

    public constructor(objects: Array<Component>, midpoint: Vector, initialAngles: Array<number>, finalAngles: Array<number>) {
        this.objects = objects;
        this.midpoint = midpoint;
        this.initialAngles = initialAngles;
        this.finalAngles = finalAngles;
    }

    private setAngles(angles: Array<number>): void {
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            obj.getTransform().setRotationAbout(angles[i], this.midpoint);
        }
    }

    public execute(): void {
        this.setAngles(this.finalAngles);
    }

    public undo(): void {
        this.setAngles(this.initialAngles);
    }

}
