import { useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { Layout } from "@/components/Layout";

interface PurchaseItem {
  id: string;
  product: string;
  unit: string;
  quantity: number;
  rate: number;
}

interface Supplier {
  id: string;
  name: string;
  phone: string;
  payable: number;
}

const mockProducts = [
  {
    id: "1",
    name: "Dairy Milk 35g",
    barcode: "8901000100010",
    units: { Piece: { rate: 12, cost: 12 }, Case: { rate: 288, cost: 288 } },
  },
  {
    id: "2",
    name: "Sprite 250ml",
    barcode: "8902110037039",
    units: { Piece: { rate: 20, cost: 20 }, Case: { rate: 480, cost: 480 } },
  },
  {
    id: "3",
    name: "Lay's Classic",
    barcode: "8901217002061",
    units: { Piece: { rate: 2.5, cost: 2.5 }, Bag: { rate: 22.5, cost: 22.5 } },
  },
];

const mockSuppliers: Supplier[] = [
  {
    id: "S1",
    name: "ABC Wholesale",
    phone: "98765 12340",
    payable: 45000,
  },
  {
    id: "S2",
    name: "XYZ Distributors",
    phone: "98765 12341",
    payable: 32500,
  },
];

export default function Purchase() {
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [billType, setBillType] = useState<"purchase" | "return">("purchase");
  const [invoiceNo, setInvoiceNo] = useState("");

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

    const existingItem = items.find(
      (item) => item.id === product.id && item.unit === selectedUnit
    );

    if (existingItem) {
      setItems(
        items.map((item) =>
          item.id === product.id && item.unit === selectedUnit
            ? { ...item, quantity: item.quantity + parseInt(quantity) }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          id: product.id,
          product: product.name,
          unit: selectedUnit,
          quantity: parseInt(quantity),
          rate: unitData.rate,
        },
      ]);
    }

    setProductSearch("");
    setSelectedUnit(null);
    setQuantity("");
    setFilteredProducts(mockProducts);
  };

  const handleDeleteItem = (id: string, unit: string) => {
    setItems(items.filter((item) => !(item.id === id && item.unit === unit)));
  };

  const handleQuantityChange = (id: string, unit: string, newQty: number) => {
    if (newQty <= 0) {
      handleDeleteItem(id, unit);
    } else {
      setItems(
        items.map((item) =>
          item.id === id && item.unit === unit
            ? { ...item, quantity: newQty }
            : item
        )
      );
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header Section - Single Row: Bill Type, Invoice No, and Supplier Search */}
        <div className="bg-card border border-border rounded-md p-4 mb-4">
          <div className="flex gap-4 items-end">
            {/* Bill Type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">
                Bill Type
              </label>
              <select
                value={billType}
                onChange={(e) => setBillType(e.target.value as "purchase" | "return")}
                className="bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-36"
              >
                <option value="purchase">Purchase</option>
                <option value="return">Purchase Return</option>
              </select>
            </div>

            {/* Invoice No */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">
                Invoice No
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="INV-001"
                className="bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-28"
              />
            </div>

            {/* Supplier Search - Flex-grow to fill remaining space */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">
                Supplier Search
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    placeholder="Name / Phone"
                    className="w-full bg-input border border-border rounded-sm pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {selectedSupplier && (
                  <button
                    onClick={() => {
                      setSelectedSupplier(null);
                      setSupplierSearch("");
                    }}
                    className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-sm text-sm transition shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {supplierSearch && !selectedSupplier && (
            <div className="space-y-2 max-h-48 overflow-y-auto mt-2">
              {mockSuppliers
                .filter(
                  (s) =>
                    s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                    s.phone.includes(supplierSearch)
                )
                .map((supplier) => (
                  <button
                    key={supplier.id}
                    onClick={() => {
                      setSelectedSupplier(supplier);
                      setSupplierSearch("");
                    }}
                    className="w-full text-left p-3 bg-secondary hover:bg-secondary/80 rounded-sm text-sm transition"
                  >
                    <div className="font-medium text-foreground">
                      {supplier.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {supplier.phone}
                    </div>
                  </button>
                ))}
            </div>
          )}

          {selectedSupplier && (
            <div className="p-3 bg-secondary rounded-sm border border-border mt-2">
              <div className="text-sm font-medium text-foreground mb-2">
                {selectedSupplier.name}
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Payable:</span>
                <div className="font-semibold text-[hsl(var(--error))]">
                  ₹{selectedSupplier.payable}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Search and Items */}
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
                  Add Item (Enter)
                </button>
              </div>
            )}
          </div>

          {/* Items Table */}
          {items.length > 0 && (
            <div className="bg-card border border-border rounded-md overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Purchase Items ({items.length})
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
                      <th className="text-center py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
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
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteItem(item.id, item.unit)}
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

        {/* Summary & Submit */}
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="text-foreground font-semibold">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (5%):</span>
                <span className="text-foreground font-semibold">
                  ₹{gst.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between">
                  <span className="text-foreground font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              disabled={items.length === 0 || !selectedSupplier}
              className="ml-6 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-6 py-3 rounded-sm font-semibold transition"
            >
              Record Purchase
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
