"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class Item {
    constructor(name, price, description) {
        this._id = (0, uuid_1.v4)();
        this._name = name;
        this._price = price;
        this._description = description;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get price() {
        return this._price;
    }
    get description() {
        return this._description;
    }
    itemElement() {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.innerHTML = `
      <h3>${this._name}</h3>
      <p>${this._description}</p>
      <p>Price: $${this._price}</p>
      <button class="add-to-cart" data-item-id="${this._id}">Add to Cart</button>
    `;
        return itemDiv;
    }
}
class User {
    constructor(name, age) {
        this._id = (0, uuid_1.v4)();
        this._name = name;
        this._age = age;
        this._cart = [];
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get age() {
        return this._age;
    }
    get cart() {
        return this._cart;
    }
    addToCart(item) {
        this._cart.push(item);
    }
    removeFromCart(item) {
        this._cart = this._cart.filter((cartItem) => cartItem.id !== item.id);
    }
    removeQuantityFromCart(item, quantity) {
        for (let i = 0; i < quantity; i++) {
            const index = this._cart.findIndex((cartItem) => cartItem.id === item.id);
            if (index !== -1) {
                this._cart.splice(index, 1);
            }
        }
    }
    cartTotal() {
        return this._cart.reduce((total, item) => total + item.price, 0);
    }
    cartHTMLElement() {
        const cartDiv = document.createElement('div');
        cartDiv.classList.add('cart');
        const cartItems = this._cart.reduce((html, item) => {
            const count = this._cart.filter((cartItem) => cartItem.id === item.id).length;
            return html + `
        <div class="cart-item">
          <span>${item.name} x ${count}</span>
          <button class="remove-one" data-item-id="${item.id}">Remove One</button>
          <button class="remove-all" data-item-id="${item.id}">Remove All</button>
        </div>
      `;
        }, '');
        cartDiv.innerHTML = `
      <h2>Cart</h2>
      ${cartItems}
      <p>Total: $${this.cartTotal()}</p>
    `;
        return cartDiv;
    }
    addRemoveEventListeners() {
        const removeOneButtons = document.querySelectorAll('.remove-one');
        const removeAllButtons = document.querySelectorAll('.remove-all');
        removeOneButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const itemId = button.getAttribute('data-item-id');
                const item = Shop.items.find((item) => item.id === itemId);
                if (item) {
                    this.removeQuantityFromCart(item, 1);
                    Shop.updateCart();
                }
            });
        });
        removeAllButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const itemId = button.getAttribute('data-item-id');
                const item = Shop.items.find((item) => item.id === itemId);
                if (item) {
                    this.removeFromCart(item);
                    Shop.updateCart();
                }
            });
        });
    }
    static loginUser() {
        const nameInput = document.getElementById('name');
        const ageInput = document.getElementById('age');
        const name = nameInput.value.trim();
        const age = parseInt(ageInput.value);
        if (name && age) {
            return new User(name, age);
        }
        return undefined;
    }
}
class Shop {
    constructor() {
        Shop._items = [
            new Item('Item 1', 10, 'Description of Item 1'),
            new Item('Item 2', 20, 'Description of Item 2'),
            new Item('Item 3', 30, 'Description of Item 3'),
            new Item('Item 4', 40, 'Description of Item 4'),
            new Item('Item 5', 50, 'Description of Item 5'),
            new Item('Item 6', 60, 'Description of Item 6'),
        ];
        this.showItems();
        Shop.updateCart();
    }
    static get items() {
        return Shop._items;
    }
    showItems() {
        const shopDiv = document.getElementById('shop');
        if (shopDiv) {
            Shop._items.forEach((item) => {
                var _a;
                const itemElement = item.itemElement();
                (_a = itemElement.querySelector('.add-to-cart')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    if (Shop.myUser) {
                        Shop.myUser.addToCart(item);
                        Shop.updateCart();
                    }
                });
                shopDiv.appendChild(itemElement);
            });
        }
    }
    static updateCart() {
        const cartDiv = document.getElementById('cart');
        if (cartDiv && Shop.myUser) {
            cartDiv.innerHTML = '';
            const cartElement = Shop.myUser.cartHTMLElement();
            Shop.myUser.addRemoveEventListeners();
            cartDiv.appendChild(cartElement);
        }
    }
    static loginUser(event) {
        event.preventDefault();
        const user = User.loginUser();
        if (user) {
            Shop.myUser = user;
            new Shop();
        }
    }
}
Shop._items = [];
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm === null || loginForm === void 0 ? void 0 : loginForm.addEventListener('submit', Shop.loginUser);
});
