export class Customer {
  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
    public birthDate: Date,
    public phoneNumber: string,
    public email: string
  ) {}
  naming() {
    return this.firstname + " " + this.lastname;
  }
}

export class Booking {
  paidOn = null;
  constructor(
    public id: number,
    public date: Date,
    public from: Date,
    public to: Date,
    public price: number,
    public players: number,
    public bookedBy: Customer,
    public court: Court
  ) {}
}

export class Court {
  constructor(
    public id: number,
    public name: string,
    public ground: string,
    public type: string,
    public prices: Price[]
  ) {
    this.prices = prices.map(
      (p) => new Price(p.id, new Date(p.fromDate), new Date(p.toDate), p.value)
    );
  }

  naming() {
    return this.name + " (" + this.ground + ", " + this.type + ")";
  }
}

export class Price {
  constructor(
    public id: number,
    public fromDate: Date,
    public toDate: Date,
    public value: number
  ) {}

  naming() {
    return (
      this.value +
      "€, " +
      this.fromDate.toLocaleDateString("it") +
      " -> " +
      this.toDate.toLocaleDateString("it")
    );
  }
}
