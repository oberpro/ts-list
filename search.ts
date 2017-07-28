import { List, Comparable, ArrayList } from "./list";

export interface Searchable<T> {
    contains(other: T): boolean;
    containsSensitive(other: T): boolean;
}

export interface SearchableList<T extends Comparable<T> & Searchable<T>> extends List<T> {
    search(item: T): List<T>;
    searchSensitive(item: T, sensitive: boolean): List<T>;
}

export class SearchableArrayList<T extends Comparable<T> & Searchable<T>> extends ArrayList<T> implements SearchableList<T>{
    constructor() {
        super();
    }

    searchSensitive(item: T, sensitive: boolean): List<T> {
        if (item != null) {
            let sub: SearchableArrayList<T> = new SearchableArrayList<T>();
            for (let i = 0; i < super.size(); i++) {
                let temp: T = super.get(i);
                if ((!sensitive && temp.contains(item)) || (sensitive && temp.containsSensitive(item))) {
                    sub.add(temp);
                }
            }
            return sub;
        }
        return this;
    }

    search(item: T): List<T> {
        return this.searchSensitive(item, false);
    }

}