(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();


document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', function () {
    let container = this.parentElement;
    this.classList.add('d-none');
    let selector = container.querySelector('.quantity-selector');
    selector.classList.remove('d-none');
  });
});

document.querySelectorAll('.increase').forEach(button => {
  button.addEventListener('click', function () {
    let count = this.previousElementSibling;
    count.textContent = parseInt(count.textContent) + 1;
  });
});

document.querySelectorAll('.decrease').forEach(button => {
  button.addEventListener('click', function () {
    let count = this.nextElementSibling;
    if (parseInt(count.textContent) > 1) {
      count.textContent = parseInt(count.textContent) - 1;
    } else {
      let container = this.parentElement.parentElement;
      this.parentElement.classList.add('d-none');
      container.querySelector('.add-to-cart-btn').classList.remove('d-none');
    }
  });
});
function toggleDropdown() {
  var dropdown = document.getElementById("dropdownMenu");
  dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}

// Close dropdown if clicked outside
window.onclick = function(event) {
  if (!event.target.closest('.profile')) {
      document.getElementById("dropdownMenu").style.display = "none";
  }
}
function toggleOffers() {
  var offersDropdown = document.getElementById("offersDropdown");
  offersDropdown.style.display = (offersDropdown.style.display === "block") ? "none" : "block";
}
function openLoginModal(event) {
  event.preventDefault();
  document.getElementById("loginModal").style.display = "block";
}

function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}

// Close dropdown if clicked outside
window.onclick = function(event) {
  if (!event.target.closest('.profile')) {
      document.getElementById("dropdownMenu").style.display = "none";
  }
  if (event.target === document.getElementById("loginModal")) {
      closeLoginModal();
  }
}
window.onclick = function(event) {
  if (!event.target.closest('.profile')) {
      document.getElementById("dropdownMenu").style.display = "none";
  }
  if (!event.target.closest('.offers')) {
      document.getElementById("offersDropdown").style.display = "none";
  }
}

// Function to Attach Event Listeners to Add to Cart Buttons
function attachCartListeners() {
  document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", async function () {
      let container = this.closest(".cart-container");
      const productId = container.getAttribute("data-product-id");
      const price = container.getAttribute("data-price");

      
      this.classList.add("d-none");
      let selector = container.querySelector(".quantity-selector");
      selector.classList.remove("d-none");
    });
  });

  
  document.querySelectorAll(".increase").forEach(button => {
    button.addEventListener("click", function () {
      let count = this.previousElementSibling;
      count.textContent = parseInt(count.textContent) + 1;
    });
  });

  
  document.querySelectorAll(".decrease").forEach(button => {
    button.addEventListener("click", function () {
      let count = this.nextElementSibling;
      if (parseInt(count.textContent) > 1) {
        count.textContent = parseInt(count.textContent) - 1;
      } else {
        let container = this.parentElement.parentElement;
        this.parentElement.classList.add("d-none");
        container.querySelector(".add-to-cart-btn").classList.remove("d-none");
      }
    });
  });

  // Handle add to cart confirmation
  document.querySelectorAll(".confirm-add").forEach(button => {
    button.addEventListener("click", async function () {
      let container = this.closest(".cart-container");
      const productId = container.getAttribute("data-product-id");
      const price = parseFloat(container.getAttribute("data-price"));
      const quantity = parseInt(container.querySelector(".quantity-count").textContent);
      
      try {
        // First get the user ID from the session
        const userResponse = await fetch("/api/user/current", {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            window.location.href = '/login';
            return;
          }
          throw new Error(`HTTP error! status: ${userResponse.status}`);
        }

        const cartData = {
          items: [{
            productId: productId,
            quantity: quantity,
            price: price
          }]
        };

        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(cartData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        showFlashMessage("Item added to cart successfully!");
        
        // Reset the UI
        container.querySelector(".quantity-selector").classList.add("d-none");
        container.querySelector(".add-to-cart-btn").classList.remove("d-none");
        container.querySelector(".quantity-count").textContent = "1";
        
      } catch (error) {
        console.error("Error in cart operation:", error);
        if (error.message.includes("401")) {
          window.location.href = '/login';
        } else {
          showFlashMessage(error.message || "Failed to add item to cart", "error");
        }
      }
    });
  });
}


document.addEventListener("DOMContentLoaded", attachCartListeners);

//load menu dynamically
document.addEventListener("DOMContentLoaded", async function () {
  try {
      const response = await fetch("http://localhost:5501/api/products", {
        credentials: 'include'
      }); 
      const products = await response.json();

      
      const categories = [...new Set(products.map(product => product.category))];

      
      const menuTabs = document.getElementById("menu-tabs");
      const menuContent = document.getElementById("menu-content");

      
      menuTabs.innerHTML = "";
      menuContent.innerHTML = "";

      
      categories.forEach((category, index) => {
          const categoryId = category.toLowerCase().replace(/\s+/g, "-");

          
          const tabHTML = `
              <li class="nav-item">
                  <a class="nav-link ${index === 0 ? "active show" : ""}" data-bs-toggle="tab" data-bs-target="#${categoryId}">
                      <h4>${category}</h4>
                  </a>
              </li>
          `;
          menuTabs.innerHTML += tabHTML;

          
          const contentHTML = `
              <div class="tab-pane fade ${index === 0 ? "active show" : ""}" id="${categoryId}">
                  <div class="tab-header text-center">
                      <p>Menu</p>
                      <h3>${category}</h3>
                  </div>
                  <div class="row gy-5" id="menu-${categoryId}"></div>
              </div>
          `;
          menuContent.innerHTML += contentHTML;
      });

  
      products.forEach(product => {
          const categoryId = product.category.toLowerCase().replace(/\s+/g, "-");
          const section = document.getElementById(`menu-${categoryId}`);

          if (section) {
              const itemHTML = `
                  <div class="col-lg-4 menu-item">
                      <a href="${product.imageUrl}" class="glightbox">
                          <img src="${product.imageUrl}" class="menu-img img-fluid" alt="${product.name}">
                      </a>
                      <h4>${product.name}</h4>
                      <p class="ingredients">Delicious & Fresh</p>
                      <p class="price">₹${product.price}/-</p>
                      <div class="cart-container" data-product-id="${product._id}" data-price="${product.price}">
                          <button class="add-to-cart-btn">Add to Cart</button>
                          <div class="quantity-selector d-none">
                              <button class="decrease">-</button>
                              <span class="quantity-count">1</span>
                              <button class="increase">+</button>
                              <button class="confirm-add">Confirm</button>
                          </div>
                      </div>
                  </div>
              `;
              section.innerHTML += itemHTML;
          }
      });

      
      attachCartListeners();

  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById("menu-content").innerHTML = "<p>Failed to load menu. Please try again later.</p>";
  }
});




function showFlashMessage(message, type = 'success') {
    const flashDiv = document.createElement('div');
    flashDiv.className = `flash-message ${type}`;
    flashDiv.textContent = message;
    document.body.appendChild(flashDiv);
    
    setTimeout(() => {
        flashDiv.remove();
    }, 3000);
}


async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            showFlashMessage('Login successful!', 'success');
            closeLoginModal();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showFlashMessage(result.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showFlashMessage('An error occurred during login', 'error');
    }
}