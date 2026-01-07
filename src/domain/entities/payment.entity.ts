export class Payment {
    constructor(
        public readonly id: string,
        public readonly status: string,
        public readonly externalReference?: string | null,
        public readonly qrCode?: string | null,
    ) {}
}
