const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const cartDialog = document.querySelector(".cart-dialog");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartLabel = document.querySelector(".cart-link");
const cartSubtotal = document.querySelector(".cart-subtotal strong");
const dialogCount = document.querySelector(".dialog-count");
const cart = new Map();

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function renderCart() {
  const itemCount = [...cart.values()].reduce((count, item) => count + item.quantity, 0);
  const subtotal = [...cart.values()].reduce((total, item) => total + item.price * item.quantity, 0);

  cartCount.textContent = itemCount;
  cartLabel.setAttribute("aria-label", `Shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
  dialogCount.textContent = `(${itemCount})`;
  cartSubtotal.textContent = formatPrice(subtotal);

  if (cart.size === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is taking a little breather. Add something good to get started.</p>';
    return;
  }

  cartItems.replaceChildren();
  cart.forEach((item, name) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = name;
    const quantity = document.createElement("p");
    quantity.textContent = `${item.quantity} × ${formatPrice(item.price)}`;
    details.append(title, quantity);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-item";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${name} from your bag`);
    removeButton.addEventListener("click", () => {
      cart.delete(name);
      renderCart();
    });

    row.append(details, removeButton);
    cartItems.append(row);
  });
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  }
});

if (cartDialog) {
  document.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.product;
      const price = Number(button.dataset.price);
      const current = cart.get(name);

      cart.set(name, { price, quantity: current ? current.quantity + 1 : 1 });
      renderCart();
      button.classList.add("added");
      button.innerHTML = 'Added to bag <span aria-hidden="true">✓</span>';
      window.setTimeout(() => {
        button.classList.remove("added");
        button.innerHTML = 'Add to bag <span aria-hidden="true">+</span>';
      }, 1400);
    });
  });

  cartLabel.addEventListener("click", () => cartDialog.showModal());
  document.querySelector(".dialog-close").addEventListener("click", () => cartDialog.close());
  document.querySelector(".continue-shopping").addEventListener("click", () => cartDialog.close());

  cartDialog.addEventListener("click", (event) => {
    if (event.target === cartDialog) {
      const bounds = cartDialog.getBoundingClientRect();
      const isOutside = event.clientX < bounds.left
        || event.clientX > bounds.right
        || event.clientY < bounds.top
        || event.clientY > bounds.bottom;
      if (isOutside) cartDialog.close();
    }
  });

  renderCart();
}

const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector(".newsletter-message").textContent =
      "Thanks for your interest! Sign-up isn't connected in this preview, so your email wasn't saved.";
    event.currentTarget.reset();
  });
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
