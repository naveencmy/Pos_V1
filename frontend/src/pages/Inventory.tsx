import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";

interface Product {
  id: string;
  name: string;
  sku: string;
  purchaseRate: number;
  salesRate: number;
  stock: { [key: string]: number };
  lastSupplier: string;
  lastPurchaseDate: string;
  valuation: number;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Dairy Milk 35g",
    sku: "DM-35",
    purchaseRate: 12,
    salesRate: 20,
    stock: { Piece: 150, Case: 5 },
    lastSupplier: "ABC Wholesale",
    lastPurchaseDate: "2025-02-25",
    valuation: 2400,
  },
  {
    id: "2",
    name: "Sprite 250ml",
    sku: "SPR-250",
    purchaseRate: 20,
    salesRate: 35,
    stock: { Piece: 200, Case: 8 },
    lastSupplier: "XYZ Distributors",
    lastPurchaseDate: "2025-02-24",
    valuation: 5600,
  },
  {
    id: "3",
    name: "Lay's Classic",
    sku: "LAY-C",
    purchaseRate: 2.5,
    salesRate: 5,
    stock: { Piece: 500, Bag: 12 },
    lastSupplier: "ABC Wholesale",
    lastPurchaseDate: "2025-02-23",
    valuation: 1530,
  },
  {
    id: "4",
    name: "Amul Butter 100g",
    sku: "AMU-100",
    purchaseRate: 25,
    salesRate: 40,
    stock: { Piece: 80, Case: 3 },
    lastSupplier: "XYZ Distributors",
    lastPurchaseDate: "2025-02-22",
    valuation: 2075,
  },
  {
    id: "5",
    name: "Bournvita 100g",
    sku: "BOU-100",
    purchaseRate: 50,
    salesRate: 80,
    stock: { Piece: 60, Case: 2 },
    lastSupplier: "Supreme Traders",
    lastPurchaseDate: "2025-02-21",
    valuation: 3100,
  },
];

const stockMovementHistory = [
  {
    id: "1",
    date: "2025-02-25",
    type: "Purchase",
    reference: "PUR-042",
    quantity: 100,
    unit: "Piece",
  },
  {
    id: "2",
    date: "2025-02-25",
    type: "Sale",
    reference: "INV-001",
    quantity: -20,
    unit: "Piece",
  },
  {
    id: "3",
    date: "2025-02-24",
    type: "Sale",
    reference: "INV-002",
    quantity: -15,
    unit: "Piece",
  },
  {
    id: "4",
    date: "2025-02-23",
    type: "Adjustment",
    reference: "ADJ-001",
    quantity: 5,
    unit: "Piece",
  },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState("");
  const [adjustmentUnit, setAdjustmentUnit] = useState("");

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValuation = mockProducts.reduce((sum, p) => sum + p.valuation, 0);

  const handleAdjustStock = () => {
    if (adjustmentQty && adjustmentUnit && selectedProduct) {
      // In a real app, this would update the backend
      setAdjustmentQty("");
      setAdjustmentUnit("");
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="metric-card">
            <div className="metric-label">Total Products</div>
            <div className="metric-value">{mockProducts.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Stock Valuation</div>
            <div className="metric-value">₹{totalValuation.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Low Stock Items</div>
            <div className="metric-value">3</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left - Product List */}
          <div className="col-span-2">
            <div className="bg-card border border-border rounded-md p-4">
              <label className="text-xs text-muted-foreground block mb-3">
                Search Products
              </label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name / SKU"
                  className="w-full bg-input border border-border rounded-sm pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`w-full text-left p-4 rounded-sm border transition ${
                      selectedProduct?.id === product.id
                        ? "bg-primary bg-opacity-10 border-primary"
                        : "bg-secondary border-border hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-foreground">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.sku}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Purchase:</span>
                        <div className="font-semibold text-foreground">
                          ₹{product.purchaseRate}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sales:</span>
                        <div className="font-semibold text-foreground">
                          ₹{product.salesRate}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Value:</span>
                        <div className="font-semibold text-[hsl(var(--success))]">
                          ₹{product.valuation}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Product Details */}
          {selectedProduct && (
            <div className="col-span-1 sticky top-6">
              <div className="bg-card border border-border rounded-md p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {selectedProduct.name}
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    {selectedProduct.sku}
                  </div>
                </div>

                {/* Units & Stock */}
                <div className="border-t border-border pt-3">
                  <div className="text-xs font-semibold text-foreground mb-2">
                    Stock by Unit
                  </div>
                  {Object.entries(selectedProduct.stock).map(([unit, qty]) => (
                    <div
                      key={unit}
                      className="flex justify-between text-sm mb-2 p-2 bg-secondary rounded-sm"
                    >
                      <span className="text-foreground">{unit}</span>
                      <span className="font-semibold text-foreground">{qty}</span>
                    </div>
                  ))}
                </div>

                {/* Rates */}
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Rate:</span>
                    <span className="font-semibold text-foreground">
                      ₹{selectedProduct.purchaseRate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sales Rate:</span>
                    <span className="font-semibold text-foreground">
                      ₹{selectedProduct.salesRate}
                    </span>
                  </div>
                </div>

                {/* Last Purchase */}
                <div className="border-t border-border pt-3">
                  <div className="text-xs font-semibold text-foreground mb-2">
                    Last Purchase
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Supplier: {selectedProduct.lastSupplier}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Date: {selectedProduct.lastPurchaseDate}
                  </div>
                </div>

                {/* Stock Adjustment */}
                <div className="border-t border-border pt-3">
                  <div className="text-xs font-semibold text-foreground mb-3">
                    Manual Adjustment
                  </div>
                  <div className="space-y-2 mb-3">
                    <select
                      value={adjustmentUnit}
                      onChange={(e) => setAdjustmentUnit(e.target.value)}
                      className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Unit</option>
                      {Object.keys(selectedProduct.stock).map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={adjustmentQty}
                      onChange={(e) => setAdjustmentQty(e.target.value)}
                      placeholder="Qty (+ or -)"
                      className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={handleAdjustStock}
                    disabled={!adjustmentQty || !adjustmentUnit}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground py-2 rounded-sm text-sm font-medium transition"
                  >
                    Adjust Stock
                  </button>
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    Owner only
                  </div>
                </div>
              </div>

              {/* Movement History */}
              {selectedProduct && (
                <div className="bg-card border border-border rounded-md p-4 mt-4">
                  <h4 className="text-xs font-semibold text-foreground mb-3">
                    Recent Movements
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                    {stockMovementHistory.slice(0, 5).map((movement) => (
                      <div
                        key={movement.id}
                        className="flex justify-between items-center p-2 bg-secondary rounded-sm"
                      >
                        <div>
                          <div className="text-foreground font-medium">
                            {movement.type}
                          </div>
                          <div className="text-muted-foreground">
                            {movement.reference}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-semibold ${
                              movement.quantity > 0
                                ? "text-[hsl(var(--success))]"
                                : "text-[hsl(var(--error))]"
                            }`}
                          >
                            {movement.quantity > 0 ? "+" : ""}
                            {movement.quantity} {movement.unit}
                          </div>
                          <div className="text-muted-foreground">
                            {movement.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
