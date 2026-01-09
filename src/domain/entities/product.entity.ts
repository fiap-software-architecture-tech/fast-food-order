interface Category {
    name: string;
}

export class Product {
    constructor(
        public readonly id: string,
        public name: string,
        public value: number,
        public description: string | null,
        public category: Category,
    ) {}
}
