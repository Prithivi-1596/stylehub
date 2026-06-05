const { useState, useMemo, useEffect, useRef } = React;

const products = [
  {
    id: 1,
    name: "Classic White Halfsleeve",
    description: "Soft cotton crewneck with a comfortable everyday fit.",
    price: 499,
    image: "images/white halfsleeve.jpg",
    category: "men",
    type: "halfsleeve",
    reviews: [
      { author: "Rohit", text: "Great everyday tee, very comfortable.", rating: 4 },
      { author: "Priya", text: "Perfect fit and soft fabric.", rating: 5 },
    ],
  },
  {
    id: 2,
    name: "Black Minimal Halfsleeve",
    description: "Clean black tee designed for effortless styling.",
    price: 549,
    image: "images/black.jpg",
    category: "men",
    type: "halfsleeve",
    reviews: [
      { author: "Ankit", text: "Classic look, pairs well with anything.", rating: 5 },
      { author: "Neha", text: "Nice quality, and the color stays after wash.", rating: 4 },
    ],
  },
  {
    id: 3,
    name: "Navy Blue Fullsleeve",
    description: "Comfortable fullsleeve for layering and warmth.",
    price: 799,
    image: "images/blue.jpg",
    category: "men",
    type: "fullsleeve",
    reviews: [
      { author: "Karan", text: "Warm and soft, great for cooler evenings.", rating: 4 },
      { author: "Meera", text: "Excellent stitching and fit.", rating: 5 },
    ],
  },
  {
    id: 4,
    name: "Graphic Logo Hoodie",
    description: "Statement hoodie with a modern logo print.",
    price: 1299,
    image: "images/hoodie men.jpg",
    category: "men",
    type: "hoodie",
    reviews: [
      { author: "Varun", text: "Cozy hoodie with a cool print.", rating: 5 },
      { author: "Sana", text: "Warm and stylish for winter.", rating: 4 },
    ],
  },
  {
    id: 5,
    name: "White Fitted Halfsleeve",
    description: "Elegant fitted cut with soft cotton comfort.",
    price: 549,
    image: "images/white women.jpg",
    category: "women",
    type: "halfsleeve",
    reviews: [
      { author: "Aisha", text: "Lovely fit, looks great with jeans.", rating: 5 },
      { author: "Maya", text: "Comfortable and breezy.", rating: 4 },
    ],
  },
  {
    id: 6,
    name: "Black Crop Halfsleeve",
    description: "Modern crop top style for a contemporary look.",
    price: 599,
    image: "images/black women.jpg",
    category: "women",
    type: "halfsleeve",
    reviews: [
      { author: "Rhea", text: "Perfect crop length and stretch.", rating: 5 },
      { author: "Simran", text: "Stylish and comfortable.", rating: 4 },
    ],
  },
  {
    id: 7,
    name: "Rose Gold Fullsleeve",
    description: "Soft fullsleeve with elegant draping.",
    price: 849,
    image: "images/rose.png",
    category: "women",
    type: "fullsleeve",
    reviews: [
      { author: "Nikita", text: "Beautiful color and soft material.", rating: 5 },
      { author: "Tara", text: "Great for layering in cooler weather.", rating: 4 },
    ],
  },
  {
    id: 8,
    name: "Cozy Pastel Hoodie",
    description: "Luxurious hoodie in soft pastel tones.",
    price: 1399,
    image: "images/hoodie women.jpg",
    category: "women",
    type: "hoodie",
    reviews: [
      { author: "Isha", text: "So soft and cozy, my favorite hoodie.", rating: 5 },
      { author: "Anya", text: "Lovely pastel shade and snug fit.", rating: 4 },
    ],
  },
];

function Typewriter({ text, speed = 70, start = true, mode = "char" }) {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    setPos(0);
    if (!text || !start) return;
    let mounted = true;

    if (mode === "word") {
      const words = text.split(" ");
      const id = setInterval(() => {
        if (!mounted) return;
        setPos((p) => (p >= words.length ? p : p + 1));
      }, speed);

      return () => {
        mounted = false;
        clearInterval(id);
      };
    }

    // char mode
    const id = setInterval(() => {
      if (!mounted) return;
      setPos((p) => (p >= text.length ? p : p + 1));
    }, speed);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [text, speed, start, mode]);

  if (mode === "word") {
    const words = text.split(" ");
    const shown = words.slice(0, pos).join(" ");
    return <span>{shown}</span>;
  }

  return <span>{text.slice(0, pos)}</span>;
}

function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}

function App() {
  const [cartItems, setCartItems] = useState(new Map());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedType, setSelectedType] = useState(null);

  const totalCount = useMemo(() => {
    let sum = 0;
    cartItems.forEach((item) => (sum += item.quantity));
    return sum;
  }, [cartItems]);

  const subtotal = useMemo(() => {
    let total = 0;
    cartItems.forEach((item) => (total += item.price * item.quantity));
    return total;
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((current) => {
      const next = new Map(current);
      const existing = next.get(product.id);

      if (existing) {
        next.set(product.id, { ...existing, quantity: existing.quantity + 1 });
      } else {
        next.set(product.id, { ...product, quantity: 1 });
      }

      return next;
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((current) => {
      const next = new Map(current);
      const item = next.get(productId);

      if (!item) return current;

      const newQuantity = item.quantity + delta;

      if (newQuantity <= 0) {
        next.delete(productId);
      } else {
        next.set(productId, { ...item, quantity: newQuantity });
      }

      return next;
    });
  };

  const removeItem = (productId) => {
    setCartItems((current) => {
      const next = new Map(current);
      next.delete(productId);
      return next;
    });
  };

  const filteredProducts =
    currentPage === "home"
      ? products
      : products.filter((p) => p.category === currentPage);

  const finalProducts = selectedType
    ? filteredProducts.filter((p) => p.type === selectedType)
    : filteredProducts;

  const heroRef = useRef(null);
  const [heroInView, setHeroInView] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            setHeroInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [currentPage]);

  return (
    <div>
      <header className="site-header">
        <div className="container header-inner">
          <button
            className="brand"
            onClick={() => {
              setCurrentPage("home");
              setSelectedType(null);
            }}
          >
            Style Hub Co.
          </button>

          <nav className="nav-links">
            <button onClick={() => setCurrentPage("home")}>Home</button>
          </nav>

          <button className="cart-button" onClick={() => setIsCartOpen(true)}>
            🛒 Cart <span>({totalCount})</span>
          </button>
        </div>
      </header>

      <main>
        {currentPage === "home" && (
          <section className="hero">
            <div className="hero-banner">
              <div className="hero-banner-copy">
                <div className="hero-eyebrow">New Arrivals</div>
                <h2>EVERYDAY COMFORT</h2>
                <p>Matching styles for him &amp; her. Shop the look now.</p>
              </div>

              <div className="hero-images">
                <img src="images/banner.jpg" alt="Banner" />
              </div>
            </div>

            <div className="container">
              <div className="hero-content-wrapper">
                <div className="hero-copy" ref={heroRef}>
                  <div className="hero-eyebrow">Limited drop</div>
                  <h1 className="hero-title">
                    <Typewriter text={"FIX YOUR STYLE HERE"} speed={600} start={heroInView} mode={"word"} />
                  </h1>
                  <p className="hero-description">Make your wardboard stylish with our latest collection!</p>

                  <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => setCurrentPage("men")}>Shop Men</button>
                    <button className="btn btn-secondary" onClick={() => setCurrentPage("women")}>Shop Women</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="section">
          <div className="container">
            {currentPage !== "home" && (
              <button
                className="back-btn"
                onClick={() => {
                  setCurrentPage("home");
                  setSelectedType(null);
                }}
              >
                ← Back to Home
              </button>
            )}

            <span className="section-title"></span>
            <h2 className="section-heading">
              {currentPage === "men"
                ? "Men's Collection"
                : currentPage === "women"
                ? "Women's Collection"
                : "Choose your favorite T-shirt"}
            </h2>

            {currentPage !== "home" && (
              <div className="type-filters">
                {["halfsleeve", "fullsleeve", "hoodie"].map((type) => (
                  <button
                    key={type}
                    className={`type-box ${selectedType === type ? "active" : ""}`}
                    onClick={() =>
                      setSelectedType(selectedType === type ? null : type)
                    }
                  >
                    {type === "halfsleeve" && "👕 Half Sleeve"}
                    {type === "fullsleeve" && "👔 Full Sleeve"}
                    {type === "hoodie" && "🧥 Hoodie"}
                  </button>
                ))}
              </div>
            )}

            <div className="product-grid">
              {finalProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <img src={product.image} alt={product.name} />

                  <div className="product-card-body">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>

                    <div className="product-review-summary">
                      <strong>{getAverageRating(product.reviews).toFixed(1)}</strong>
                      <span>⭐</span>
                      <span>({product.reviews.length} reviews)</span>
                    </div>
                    <p className="review-snippet">
                      “{product.reviews[0].text}”
                    </p>

                    <div className="product-meta">
                      <span className="product-price">₹{product.price}</span>
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(product)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <aside className={`cart-panel ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <div>
            <h2>Your Cart</h2>
            <p>{totalCount > 0 ? `${totalCount} item(s)` : "Your cart is empty."}</p>
          </div>

          <button className="close-cart" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        <div className="cart-items">
          {Array.from(cartItems.values()).map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <div className="cart-item-title">{item.name}</div>

                <div className="cart-item-meta">
                  <span>₹{item.price}</span>
                  <button
                    className="cart-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="cart-quantity">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}

          {cartItems.size === 0 && (
            <p className="section-text">Add a T-shirt to get started.</p>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <strong>₹{subtotal}</strong>
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={() => alert("Checkout is demo only.")}
          >
            Checkout
          </button>
        </div>
      </aside>

      <div
        className={`cart-backdrop ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      <footer className="footer">
        <div className="container">
          <p>© 2026 Style Hub. Stylish T-shirts for modern wardrobes.</p>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);