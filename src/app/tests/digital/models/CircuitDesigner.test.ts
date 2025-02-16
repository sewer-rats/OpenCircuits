import "jest";

import {DigitalCircuitDesigner} from "digital/models/DigitalCircuitDesigner";
import {Switch}          from "digital/models/ioobjects/inputs/Switch";
import {LED}             from "digital/models/ioobjects/outputs/LED";

import {GetHelpers} from "test/helpers/Helpers";


describe("CircuitDesigner", () => {
    describe("Empty Circuit", () => {
        const designer = new DigitalCircuitDesigner(0);

        expect(designer.getObjects().length).toBe(0);
        expect(designer.getWires().length).toBe(0);
    });
    describe("Add", () => {
        test("Add Object", () => {
            const designer = new DigitalCircuitDesigner(0);
            const {Place} = GetHelpers({designer});

            const [a, o] = Place(new Switch(), new LED());

            expect(designer.getObjects().length).toBe(2);

            expect(() => Place(a)).toThrowError();
            expect(designer.getObjects().length).toBe(2);

            expect(() => Place(o)).toThrowError();
            expect(designer.getObjects().length).toBe(2);
        });
        test("Add Objects", () => {
            const designer = new DigitalCircuitDesigner(0);
            const {Place} = GetHelpers({designer});

            const [a, o] = Place(new Switch(), new LED());

            expect(designer.getObjects().length).toBe(2);

            expect(() => Place(a)).toThrowError();
            expect(designer.getObjects().length).toBe(2);

            expect(() => Place(o)).toThrowError();
            expect(designer.getObjects().length).toBe(2);
        });
    });
    describe("Basic Circuit", () => {
        const designer = new DigitalCircuitDesigner(0);
        const {Place, Connect} = GetHelpers({designer});

        const [a, o] = Place(new Switch(), new LED());
        Connect(a, 0,  o, 0);

        const objects = designer.getObjects();
        expect(objects.length).toBe(2);
        expect(objects[0]).toBe(a);
        expect(objects[1]).toBe(o);

        const wires = designer.getWires();
        expect(wires.length).toBe(1);
        expect(wires[0].getInputComponent()).toBe(a);
        expect(wires[0].getOutputComponent()).toBe(o);

        test("Initial State", () => {
            expect(o.isOn()).toBe(false);
        });

        test("Turn On", () => {
            a.activate(true);

            expect(o.isOn()).toBe(true);
        });
    });
    describe("Remove Object", () => {
        test("Add Remove No Connection", () => {
            const designer = new DigitalCircuitDesigner(0);
            const {Place, Remove} = GetHelpers({designer});

            const [a, o] = Place(new Switch(), new LED());

            expect(designer.getObjects().length).toBe(2);

            Remove(a, o);

            expect(designer.getObjects().length).toBe(0);

            expect(a.getDesigner()).toBe(undefined);
            expect(o.getDesigner()).toBe(undefined);

            expect(() => Remove(a)).toThrowError();
            expect(() => Remove(o)).toThrowError();
        });
        test("Add Remove Connected 1", () => {
            const designer = new DigitalCircuitDesigner(0);
            const {Place, Connect, Remove} = GetHelpers({designer});

            const [a, o] = Place(new Switch(), new LED());
            Connect(a, 0,  o, 0);

            expect(designer.getObjects().length).toBe(2);
            expect(designer.getWires().length).toBe(1);
            expect(a.getOutputs().length).toBe(1);
            expect(o.getInputs().length).toBe(1);

            Remove(a);

            expect(designer.getObjects().length).toBe(1);
            expect(designer.getWires().length).toBe(0);
            expect(a.getOutputs().length).toBe(0);
            expect(o.getInputs().length).toBe(0);

            expect(() => Remove(a)).toThrowError();
        });
    });
    describe("Reset Circuit", () => {
        const designer = new DigitalCircuitDesigner(0);
        const {Place, Connect} = GetHelpers({designer});

        const [a, o] = Place(new Switch(), new LED());
        Connect(a, 0,  o, 0);

        expect(designer.getObjects().length).toBe(2);
        expect(designer.getWires().length).toBe(1);

        designer.reset();

        expect(designer.getObjects().length).toBe(0);
        expect(designer.getWires().length).toBe(0);
    });
});
