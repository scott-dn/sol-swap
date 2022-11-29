export class Payload {
  id: number;

  amount: bigint;

  constructor(id: number, amount: bigint) {
    this.id = id;
    this.amount = amount;
  }
}

export enum InstructionVariant {
  Swap = 0
}

export const schema = new Map([
  [
    Payload,
    {
      kind: 'struct',
      fields: [
        ['id', 'u8'],
        ['amount', 'u64']
      ]
    }
  ]
]);
