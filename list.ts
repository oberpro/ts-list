
export interface Equality<T> {
    equals(other: T): boolean;
}

export interface Comparable<T> extends Equality<T> {
    compare(other: T): number;
}

export interface Serializable {
    serialize(): string;
    deserialize(content: string): void;
}

export enum ORDER {
    ASC, DESC
}

export abstract class List<T extends Comparable<T>> implements Serializable {

    abstract add(item: T): boolean;

    abstract addAll(items: List<T>): void;

    abstract remove(item: T): boolean;

    abstract removeIndex(index: number): boolean;

    abstract size(): number;

    abstract isEmpty(): boolean;

    abstract contains(item: T): boolean;

    abstract indexOf(item: T): number;

    abstract set(index: number, item: T): T;

    abstract get(index: number): T;

    abstract swap(p: number, q: number): void;

    abstract sublist(start: number, end: number): List<T>;

    abstract order(way?: ORDER): List<T>;

    abstract toArray(): T[];

    abstract clear(): void;

    abstract pagination(pagenumber: number, itemsPerPage: number): List<T>;

    abstract serializeImpl(): string;

    abstract deserializeImpl(content: string): void;

    serialize(): string {
        return this.serializeImpl();
    }

    deserialize(content: string): void {
        this.deserializeImpl(content);
    }
}



export class ArrayList<T extends Comparable<T>> extends List<T>{

    private array: T[] = [];

    constructor() {
        super();
    }

    toArray(): T[] {
        return this.array;
    }

    addAll(items: List<T>): void {
        if (items == null) {
            return;
        }
        for (let i = 0; i < items.size(); i++) {
            this.add(items.get(i));
        }
    }

    clear() {
        this.array = [];
    }

    order(way?: ORDER): List<T> {
        let direction: number = 1;
        if (way == ORDER.DESC) {
            direction = -1;
        }
        for (let i = 1; i < this.size(); i++) {
            for (let j = i; j > 0 && (this.get(j - 1).compare(this.get(j)) * direction) > 0; --j) {
                this.swap(j - 1, j);
            }
        }
        return this;
    }

    swap(p: number, q: number): void {
        if (p >= 0 && q >= 0) {
            let tmp: T = this.get(p);
            this.set(p, this.get(q));
            this.set(q, tmp);
        }
    }

    remove(item: T): boolean {
        let index: number = this.indexOf(item);
        if (index >= 0) {
            this.removeIndex(index);
            return true;
        }
        return false;
    }
    removeIndex(index: number): boolean {
        if (index >= 0 && index < this.size()) {
            this.array.splice(index, 1);
            return true;
        }
        return false;
    }
    size(): number {
        return this.array.length;
    }
    isEmpty(): boolean {
        return this.size() == 0;
    }

    contains(item: T): boolean {
        let index = this.indexOf(item);
        if (index >= 0) {
            return true;
        }
        return false;
    }
    indexOf(item: T): number {
        for (let i = 0; i < this.size(); i++) {
            let it: T = this.get(i);
            if (item.equals(it)) {
                return i;
            }
        }
        return -1;
    }
    set(index: number, item: T): T {
        if (index >= 0 && index < this.size()) {
            let old: T = this.get(index);
            this.array[index] = item;
            return old;
        }
        return null;
    }
    get(index: number): T {
        if (index >= 0 && index < this.size()) {
            return this.array[index];
        }
        return null;
    }
    sublist(start: number, end: number): List<T> {
        let sublist: ArrayList<T> = new ArrayList<T>();
        if (start >= 0 && end >= 0) {
            for (let i = Math.max(0, start); i <= Math.min(end, this.size() - 1); i++) {
                sublist.add(this.get(i));
            }
        }
        return sublist;
    }

    pagination(pagenumber: number, itemsPerPage: number): List<T> {
        let start: number = itemsPerPage * (pagenumber - 1);
        return this.sublist(start, start + (itemsPerPage - 1));
    }

    add(item: T): boolean {
        this.array.push(item);
        return true;
    }

    serializeImpl(): string {
        return JSON.stringify(this.array);
    }
    deserializeImpl(content: string): void {
        this.array = JSON.parse(content);
    }
}