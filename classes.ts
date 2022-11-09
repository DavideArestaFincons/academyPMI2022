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
    public price: Price,
    public players: number,
    public bookedBy: Customer,
    public court: Court
  ) {}
  update(price: Price,
    bookedBy: Customer,
    court: Court) {
      this.price = price
      this.bookedBy = bookedBy
      this.court = court
    }
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

  formattedValue() {
    return this.value + " €";
  }
}
