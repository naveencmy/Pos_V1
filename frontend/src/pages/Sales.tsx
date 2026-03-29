import { useState } from "react";
import { Search, Plus, Trash2, Receipt } from "lucide-react";
import { Layout } from "@/components/Layout";

interface CartItem {
  id: string;
  product: string;
  unit: string;
  quantity: number;
  rate: number;
  stock: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  outstanding: number;
  creditLimit: number;
}

const mockProducts = [
  {
    id: "1",
    name: "Dairy Milk 35g",
    barcode: "8901000100010",
    units: { Piece: { rate: 20, stock: 150 }, Case: { rate: 480, stock: 5 } },
  },
  {
    id: "2",
    name: "Sprite 250ml",
    barcode: "8902110037039",
    units: { Piece: { rate: 35, stock: 200 }, Case: { rate: 800, stock: 8 } },
  },
  {
    id: "3",
    name: "Lay's Classic",
    barcode: "8901217002061",
    units: { Piece: { rate: 5, stock: 500 }, Bag: { rate: 45, stock: 12 } },
  },
  {
    id: "4",
    name: "Amul Butter 100g",
    barcode: "8901250000159",
    units: { Piece: { rate: 40, stock: 80 }, Case: { rate: 960, stock: 3 } },
  },
  {
    id: "5",
    name: "Bournvita 100g",
    barcode: "8901030076009",
    units: { Piece: { rate: 80, stock: 60 }, Case: { rate: 1920, stock: 2 } },
  },
];

const mockCustomers: Customer[] = [
  {
    id: "C1",
    name: "Rajesh Retail Store",
    phone: "98765 43210",
    outstanding: 15000,
    creditLimit: 50000,
  },
  {
    id: "C2",
    name: "Sharma Stores",
    phone: "98765 43211",
    outstanding: 8500,
    creditLimit: 35000,
  },
];

export default function Sales() {
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [billType, setBillType] = useState<"sale" | "return">("sale");
  const [orderSource, setOrderSource] = useState<"inperson" | "phone">("inperson");
  const [cashInput, setCashInput] = useState("");
  const [upiInput, setUpiInput] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [summaryTab, setSummaryTab] = useState<"summary" | "payment">("summary");
  const [userRole, setUserRole] = useState<"owner" | "manager" | "worker" | "cashier">("cashier");
  const [billPaymentType, setBillPaymentType] = useState<"cash" | "credit">("cash");
  const isCashier = userRole === "cashier";

  const handleProductSearch = (value: string) => {
    setProductSearch(value);
    setSelectedUnit(null);
    const filtered = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.barcode.includes(value)
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = () => {
    if (!productSearch || !selectedUnit || !quantity) return;

    const product = mockProducts.find(
      (p) =>
        p.name.toLowerCase() === productSearch.toLowerCase() ||
        p.barcode === productSearch
    );
    if (!product) return;

    const unitData = product.units[selectedUnit as keyof typeof product.units];
    if (!unitData) return;

    const existingItem = cart.find(
      (item) => item.id === product.id && item.unit === selectedUnit
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.unit === selectedUnit
            ? { ...item, quantity: item.quantity + parseInt(quantity) }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          product: product.name,
          unit: selectedUnit,
          quantity: parseInt(quantity),
          rate: unitData.rate,
          stock: unitData.stock,
        },
      ]);
    }

    setProductSearch("");
    setSelectedUnit(null);
    setQuantity("");
    setFilteredProducts(mockProducts);
  };

  const handleDeleteCartItem = (id: string, unit: string) => {
    setCart(cart.filter((item) => !(item.id === id && item.unit === unit)));
  };

  const handleQuantityChange = (id: string, unit: string, newQty: number) => {
    if (newQty <= 0) {
      handleDeleteCartItem(id, unit);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id && item.unit === unit
            ? { ...item, quantity: newQty }
            : item
        )
      );
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discount = parseInt(discountAmount || "0");
  const grandTotal = subtotal - discount;
  const cashAmount = parseInt(cashInput || "0");
  const upiAmount = parseInt(upiInput || "0");
  const creditAmount = Math.max(0, grandTotal - cashAmount - upiAmount);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const paymentStatus =
    creditAmount === 0
      ? "fully-paid"
      : creditAmount === grandTotal
        ? "full-credit"
        : "partial";

  return (
    <Layout>
      <div className="space-y-4 pb-96">
        {/* Role Selector (for testing - would come from auth in production) */}
        <div className="text-xs text-muted-foreground mb-4">
          <label className="mr-2">User Role (Test):</label>
          <select
            value={userRole}
            onChange={(e) => {
              setUserRole(e.target.value as "owner" | "manager" | "worker" | "cashier");
              if (e.target.value !== "cashier") {
                setSummaryTab("summary");
              }
            }}
            className="bg-input border border-border rounded-sm px-2 py-1 text-xs text-foreground"
          >
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
            <option value="worker">Worker</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        {/* Unified Header Section - Single Row: Bill Type, Order Source, and Customer Search */}
        <div className="bg-card border border-border rounded-md p-4 mb-4">
          <div className="flex gap-4 items-end">
            {/* Bill Type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">
                Bill Type
              </label>
              <select
                value={billType}
                onChange={(e) => setBillType(e.target.value as "sale" | "return")}
                className="bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-28"
              >
                <option value="sale">Sale</option>
                <option value="return">Return</option>
              </select>
            </div>
            {/* Order Source */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">
                Order Source
              </label>
              <select
                value={orderSource}
                onChange={(e) =>
                  setOrderSource(e.target.value as "inperson" | "phone")
                }
                className="bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-32"
              >
                <option value="inperson">In-Person</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            {/* Customer Search - Flex-grow to fill remaining space */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">
                Customer Search
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Name / Phone / Bill No"
                    className="w-full bg-input border border-border rounded-sm pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {selectedCustomer && (
                  <button
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerSearch("");
                    }}
                    className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-sm text-sm transition shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {customerSearch && !selectedCustomer && (
            <div className="space-y-2 max-h-48 overflow-y-auto mt-2">
              {mockCustomers
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                    c.phone.includes(customerSearch)
                )
                .map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setCustomerSearch("");
                    }}
                    className="w-full text-left p-3 bg-secondary hover:bg-secondary/80 rounded-sm text-sm transition"
                  >
                    <div className="font-medium text-foreground">
                      {customer.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {customer.phone}
                    </div>
                  </button>
                ))}
            </div>
          )}

          {selectedCustomer && (
            <div className="p-3 bg-secondary rounded-sm border border-border mt-2">
              <div className="text-sm font-medium text-foreground mb-2">
                {selectedCustomer.name}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Outstanding:</span>
                  <div className="font-semibold text-[hsl(var(--warning))]">
                    ₹{selectedCustomer.outstanding}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Credit Limit:</span>
                  <div className="font-semibold text-foreground">
                    ₹{selectedCustomer.creditLimit}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content - Product Search and Cart */}
        <div className="space-y-4">
          {/* Product Search */}
          <div className="bg-card border border-border rounded-md p-4">
            <label className="text-xs text-muted-foreground block mb-3">
              Product Search
            </label>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => handleProductSearch(e.target.value)}
                  placeholder="Name / Barcode"
                  className="w-full bg-input border border-border rounded-sm pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {productSearch && filteredProducts.length > 0 && !selectedUnit && (
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      const units = Object.keys(product.units);
                      setProductSearch(product.name);
                      setSelectedUnit(units[0]);
                    }}
                    className="w-full text-left p-3 bg-secondary hover:bg-secondary/80 rounded-sm text-sm transition"
                  >
                    <div className="font-medium text-foreground">
                      {product.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product.barcode}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedUnit && (
              <div className="space-y-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">
                    Unit
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {mockProducts
                      .find((p) => p.name === productSearch)
                      ?.units &&
                      Object.keys(
                        mockProducts.find((p) => p.name === productSearch)!.units
                      ).map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-sm text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart (Enter)
                </button>
              </div>
            )}
          </div>

          {/* Cart Table */}
          {cart.length > 0 && (
            <div className="bg-card border border-border rounded-md overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Cart ({cart.length} items)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                        Product
                      </th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                        Unit
                      </th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                        Qty
                      </th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                        Rate
                      </th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                        Total
                      </th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                        Stock
                      </th>
                      <th className="text-center py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr
                        key={`${item.id}-${item.unit}`}
                        className="border-b border-border hover:bg-secondary transition"
                      >
                        <td className="py-3 px-4 text-foreground">{item.product}</td>
                        <td className="py-3 px-4 text-center text-foreground font-mono text-xs">
                          {item.unit}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                item.unit,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-16 bg-input border border-border rounded-sm px-2 py-1 text-center text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </td>
                        <td className="py-3 px-4 text-right text-foreground font-mono">
                          ₹{item.rate}
                        </td>
                        <td className="py-3 px-4 text-right text-foreground font-semibold">
                          ₹{(item.quantity * item.rate).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center text-muted-foreground font-mono text-xs">
                          {item.stock}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteCartItem(item.id, item.unit)}
                            className="p-1 hover:bg-secondary rounded-sm transition text-muted-foreground hover:text-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Section - Fixed at Bottom */}
        <div
          className="fixed bottom-0 bg-card border-t border-border rounded-t-md transition-all duration-300 ease-in-out"
          style={{
            left: "var(--sidebar-width, 256px)",
            right: "0",
          } as React.CSSProperties}
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setSummaryTab("summary")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition border-b-2 flex items-center justify-center gap-2 ${
                summaryTab === "summary"
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Summary ({itemCount})</span>
            </button>
            {isCashier && (
              <button
                onClick={() => setSummaryTab("payment")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition border-b-2 ${
                  summaryTab === "payment"
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <span>💳</span>
                <span className="hidden sm:inline">Payment</span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {summaryTab === "summary" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left - Summary Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground font-semibold">
                        ₹{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-2">
                        Discount (₹):
                      </label>
                      <input
                        type="number"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        placeholder="0"
                        className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-foreground font-semibold">
                          Grand Total:
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ₹{grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right - Bill Details */}
                  <div className="bg-secondary border border-border rounded-sm p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-semibold text-foreground">
                        {itemCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bill Type:</span>
                      <span className="font-semibold text-foreground">
                        {billType === "sale" ? "Sale" : "Return"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order Source:</span>
                      <span className="font-semibold text-foreground">
                        {orderSource === "inperson" ? "In-Person" : "Phone"}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="text-xs text-muted-foreground mb-2">
                        Payment Type:
                      </div>
                      {isCashier ? (
                        <select
                          value={billPaymentType}
                          onChange={(e) => setBillPaymentType(e.target.value as "cash" | "credit")}
                          className="w-full bg-input border border-border rounded-sm px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="cash">Cash</option>
                          <option value="credit">Credit</option>
                        </select>
                      ) : (
                        <span className="text-sm font-semibold text-foreground">
                          {billPaymentType === "cash" ? "Cash" : "Credit"}
                        </span>
                      )}
                    </div>
                    {selectedCustomer && (
                      <div className="border-t border-border pt-2 mt-2">
                        <div className="text-xs font-semibold text-foreground mb-1">
                          {selectedCustomer.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Outstanding: ₹{selectedCustomer.outstanding}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {summaryTab === "payment" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Payment Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-2">
                        Cash
                      </label>
                      <input
                        type="number"
                        value={cashInput}
                        onChange={(e) => setCashInput(e.target.value)}
                        placeholder="0"
                        className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground block mb-2">
                        UPI
                      </label>
                      <input
                        type="number"
                        value={upiInput}
                        onChange={(e) => setUpiInput(e.target.value)}
                        placeholder="0"
                        className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground block mb-2">
                        Credit
                      </label>
                      <div className="bg-secondary border border-border rounded-sm px-3 py-2 text-sm font-semibold text-foreground">
                        ₹{creditAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Payment Status & Summary */}
                  <div className="space-y-3">
                    <div className="bg-secondary border border-border rounded-sm p-4 space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            paymentStatus === "fully-paid"
                              ? "bg-[hsl(var(--success))]"
                              : paymentStatus === "partial"
                                ? "bg-[hsl(var(--warning))]"
                                : "bg-[hsl(var(--error))]"
                          }`}
                        />
                        <span className="text-sm font-semibold text-foreground">
                          {paymentStatus === "fully-paid"
                            ? "Fully Paid"
                            : paymentStatus === "partial"
                              ? "Partial Payment"
                              : "Full Credit"}
                        </span>
                      </div>

                      <div className="border-t border-border pt-2">
                        <div className="text-xs text-muted-foreground mb-1">
                          Total to Collect:
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          ₹{grandTotal.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={cart.length === 0}
                      className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground py-3 rounded-sm font-semibold transition"
                    >
                      Finalize Bill
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
