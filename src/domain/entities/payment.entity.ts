export class Payment {
    constructor(
        public readonly id: string,
        public readonly status: string,
        public readonly externalReference: string,
        public readonly qrCode: string,
    ) {}
}
