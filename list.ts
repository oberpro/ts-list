
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

export interface List<T extends Comparable<T>> extends Serializable {

    add(item: T): boolean;

    addAll(items: List<T>): void;

    remove(item: T): boolean;

    removeIndex(index: number): boolean;

    size(): number;

    isEmpty(): boolean;

    contains(item: T): boolean;

    indexOf(item: T): number;

    set(index: number, item: T): T;

    get(index: number): T;

    swap(p: number, q: number): void;

    sublist(start: number, end: number): List<T>;

    order(way?: ORDER): List<T>;

    toArray(): T[];

    clear(): void;

    pagination(pagenumber: number, itemsPerPage: number): List<T>;

    serialize(): any;

    deserialize(content: any): void;

    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;

}



export class ArrayList<T extends Comparable<T>> implements List<T>{


    private array: T[] = [];

    constructor() {
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

    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
        this.array.forEach(callbackfn);
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

    serialize(): string {
        return JSON.stringify(this.array);
    }

    deserialize(content: string): void {
        if (content != null && content.length > 0) {
            this.array = JSON.parse(content);
        }
    }

}