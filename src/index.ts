import { v4 as uuidv4 } from 'uuid';


class Item {
    private _id: string;
    private _name: string;
    private _price: number;
    private _description: string;
  
    constructor(name: string, price: number, description: string) {
      this._id = uuidv4(); 
      this._name = name;
      this._price = price;
      this._description = description;
    }
  
    get id(): string {
      return this._id;
    }
  
    get name(): string {
      return this._name;
    }
  
    get price(): number {
      return this._price;
    }
  
    get description(): string {
      return this._description;
    }
  
    itemElement(): HTMLDivElement {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      itemDiv.innerHTML = `
        <h3>${this._name}</h3>
        <p>${this._description}</p>
        <p>Price: $${this._price}</p>
        <button class="add-to-cart" id="${this._id}">Add to Cart</button>
      `;
      return itemDiv;
    }
  }
  

  class User {
    private _id: string;
    private _name: string;
    private _age: number;
    private _cart: Item[];
  
    constructor(name: string, age: number) {
      this._id = uuidv4(); 
      this._name = name;
      this._age = age;
      this._cart = [];
    }
  
    get id(): string {
      return this._id;
    }
  
    get name(): string {
      return this._name;
    }
  
    get age(): number {
      return this._age;
    }
  
    get cart(): Item[] {
      return this._cart;
    }
  
    addToCart(item: Item): void {
      this._cart.push(item);
    }
  
    removeFromCart(item: Item): void {
      this._cart = this._cart.filter((cartItem) => cartItem.id !== item.id);
      console.log(this._cart);
    }
  
    removeQuantityFromCart(item: Item, quantity: number): void {
      const indexToRemove = this._cart.findIndex((cartItem) => cartItem.id === item.id);
      this._cart.splice(indexToRemove, quantity);
    }
  
    cartTotal(): number {
      return this._cart.reduce((total, item) => total + item.price, 0);
    }
  
    cartHTMLElement(): HTMLDivElement {
      const cartDiv = document.createElement('div');
      cartDiv.classList.add('cart');
      const uniqueItems = new Set(this._cart);
      console.log(uniqueItems);
      let cartItems = '';
      for (const item of uniqueItems) { 
        const count = this._cart.filter((cartItem) => cartItem.id === item.id).length;
        cartItems += `
          <div class="cart-item">
            <span>${item.name} x ${count}</span>
            <button class="remove-one" id="${item.id}-rm1">Remove One</button>
            <button class="remove-all" id="${item.id}-rmall">Remove All</button>
          </div>`;
      }
  
      cartDiv.innerHTML = `
        <h2>Cart</h2>
        ${cartItems}
        <p>Total: $${this.cartTotal()}</p>
      `;
  
      return cartDiv;
    }
  
    addRemoveEventListeners(): void {
      const uniqueItems = new Set(this._cart);
      for (let item of uniqueItems) {
        const removeOneButton = document.getElementById(`${item.id}-rm1`)!;
        const removeAllButton = document.getElementById(`${item.id}-rmall`)!;
        removeOneButton.addEventListener('click', () => {
          console.log(this.cart);
          this.removeQuantityFromCart(item, 1);
          console.log(this.cart);
          Shop.updateCart();
        });
        removeAllButton.addEventListener('click', () => {
          this.removeFromCart(item);
          Shop.updateCart();
        });
      }
    }
  
    static loginUser(): User | undefined {
      const nameInput = document.getElementById('name') as HTMLInputElement;
      const ageInput = document.getElementById('age') as HTMLInputElement;
  
      const name = nameInput.value.trim();
      const age = parseInt(ageInput.value);
  
      if (name && age) {
        return new User(name, age);
      }
  
      return undefined;
    }
  }
  
  
  class Shop {
    private static _items: Item[] = [];
    static myUser: User | undefined;
  
    constructor() {
      Shop._items = [
        new Item('Dictionary', 13, 'Book of words and their meanings'),
        new Item('Belladonna', 88, 'Book on the art of raising poisonous plants'),
        new Item('Mug', 30, 'Winnie the Pooh mug'),
        new Item('Blanket', 12, 'Cozy fleece blanket'),
        new Item('Slippers', 8, 'Bunny Slippers'),
        new Item('Eye mask', 20, 'Silk sleep mask for eyes'),
      ];
  
      this.showItems();
    }
  
    static get items(): Item[] {
      return Shop._items;
    }
  
    showItems(): void {
      const shopDiv = document.getElementById('shop');
      if (shopDiv) {
        Shop._items.forEach((item) => {
          const itemElement = item.itemElement();
          itemElement.querySelector('.add-to-cart')?.addEventListener('click', () => {
            if (Shop.myUser) {
              Shop.myUser.addToCart(item);
              Shop.updateCart();
            }
          });
          shopDiv.appendChild(itemElement);
        });
      }
    }
  
    static updateCart(): void {
      const cartDiv = document.getElementById('cart');
      if (cartDiv && Shop.myUser) {
        cartDiv.innerHTML = '';
        const cartElement = Shop.myUser.cartHTMLElement();
        cartDiv.appendChild(cartElement);
        Shop.myUser.addRemoveEventListeners();
      }
    }
  
    static loginUser(event: Event): void {
      event.preventDefault();
      const user = User.loginUser();
      if (user) {
        Shop.myUser = user;
        new Shop();
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', Shop.loginUser);
  });
  