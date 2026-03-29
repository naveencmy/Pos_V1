import { useState } from "react";
import { Search, Plus, Trash2, Edit2 } from "lucide-react";
import { Layout } from "@/components/Layout";

interface Party {
  id: string;
  type: "customer" | "supplier";
  name: string;
  phone: string;
  email: string;
  address: string;
  creditLimit?: number;
  openingBalance?: number;
  ledgerBalance: number;
}

const mockParties: Party[] = [
  {
    id: "C1",
    type: "customer",
    name: "Rajesh Retail Store",
    phone: "98765 43210",
    email: "rajesh@retail.com",
    address: "MG Road, Bangalore",
    creditLimit: 50000,
    openingBalance: 5000,
    ledgerBalance: 15000,
  },
  {
    id: "C2",
    type: "customer",
    name: "Sharma Stores",
    phone: "98765 43211",
    email: "sharma@stores.com",
    address: "Brigade Road, Bangalore",
    creditLimit: 35000,
    openingBalance: 0,
    ledgerBalance: 8500,
  },
  {
    id: "S1",
    type: "supplier",
    name: "ABC Wholesale",
    phone: "98765 12340",
    email: "abc@wholesale.com",
    address: "Industrial Area, Bangalore",
    openingBalance: 10000,
    ledgerBalance: -45000,
  },
  {
    id: "S2",
    type: "supplier",
    name: "XYZ Distributors",
    phone: "98765 12341",
    email: "xyz@distributors.com",
    address: "Peenya, Bangalore",
    openingBalance: 0,
    ledgerBalance: -32500,
  },
];

const ledgerEntries = [
  {
    id: "1",
    date: "2025-02-25",
    type: "Sale",
    reference: "INV-001",
    debit: 15000,
    credit: 0,
  },
  {
    id: "2",
    date: "2025-02-24",
    type: "Payment",
    reference: "REC-001",
    debit: 0,
    credit: 5000,
  },
  {
    id: "3",
    date: "2025-02-23",
    type: "Sale",
    reference: "INV-002",
    debit: 8500,
    credit: 0,
  },
];

export default function Parties() {
  const [partyType, setPartyType] = useState<"customer" | "supplier">("customer");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    creditLimit: "",
    openingBalance: "",
  });

  const filteredParties = mockParties.filter(
    (p) =>
      p.type === partyType &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm))
  );

  const handleAddParty = () => {
    if (formData.name && formData.phone) {
      setShowForm(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        creditLimit: "",
        openingBalance: "",
      });
    }
  };

  const totalCustomerBalance = mockParties
    .filter((p) => p.type === "customer")
    .reduce((sum, p) => sum + (p.ledgerBalance > 0 ? p.ledgerBalance : 0), 0);

  const totalSupplierBalance = Math.abs(
    mockParties
      .filter((p) => p.type === "supplier")
      .reduce((sum, p) => sum + (p.ledgerBalance < 0 ? p.ledgerBalance : 0), 0)
  );

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="metric-card">
            <div className="metric-label">
              {partyType === "customer" ? "Total Customers" : "Total Suppliers"}
            </div>
            <div className="metric-value">
              {filteredParties.filter((p) => p.type === partyType).length}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">
              {partyType === "customer" ? "Total Receivables" : "Total Payables"}
            </div>
            <div
              className={`metric-value ${
                partyType === "customer"
                  ? "text-[hsl(var(--warning))]"
                  : "text-[hsl(var(--error))]"
              }`}
            >
              ₹{(partyType === "customer" ? totalCustomerBalance : totalSupplierBalance).toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-md font-semibold transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add {partyType === "customer" ? "Customer" : "Supplier"}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left - Party List */}
          <div className="col-span-2">
            <div className="bg-card border border-border rounded-md p-4">
              {/* Type Selector */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => {
                    setPartyType("customer");
                    setSelectedParty(null);
                  }}
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition ${
                    partyType === "customer"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => {
                    setPartyType("supplier");
                    setSelectedParty(null);
                  }}
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition ${
                    partyType === "supplier"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Suppliers
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name / Phone"
                  className="w-full bg-input border border-border rounded-sm pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Party List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredParties.map((party) => (
                  <button
                    key={party.id}
                    onClick={() => setSelectedParty(party)}
                    className={`w-full text-left p-4 rounded-sm border transition ${
                      selectedParty?.id === party.id
                        ? "bg-primary bg-opacity-10 border-primary"
                        : "bg-secondary border-border hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-foreground">
                          {party.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {party.phone}
                        </div>
                      </div>
                      <div
                        className={`font-semibold text-lg ${
                          party.type === "customer"
                            ? party.ledgerBalance > 0
                              ? "text-[hsl(var(--warning))]"
                              : "text-foreground"
                            : party.ledgerBalance < 0
                              ? "text-[hsl(var(--error))]"
                              : "text-foreground"
                        }`}
                      >
                        ₹{Math.abs(party.ledgerBalance).toLocaleString()}
                      </div>
                    </div>
                    {party.creditLimit && (
                      <div className="text-xs text-muted-foreground">
                        Credit Limit: ₹{party.creditLimit}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Party Details */}
          {selectedParty && (
            <div className="col-span-1 sticky top-6">
              <div className="bg-card border border-border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {selectedParty.name}
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      {selectedParty.type === "customer"
                        ? "Customer"
                        : "Supplier"}
                    </div>
                  </div>
                  <button className="p-1 hover:bg-secondary rounded-sm transition">
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <div className="text-foreground">{selectedParty.phone}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <div className="text-foreground">{selectedParty.email}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <div className="text-foreground">{selectedParty.address}</div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  {selectedParty.creditLimit && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credit Limit:</span>
                      <span className="font-semibold text-foreground">
                        ₹{selectedParty.creditLimit}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {selectedParty.type === "customer"
                        ? "Outstanding"
                        : "Payable"}
                      :
                    </span>
                    <span
                      className={`font-semibold ${
                        selectedParty.type === "customer"
                          ? "text-[hsl(var(--warning))]"
                          : "text-[hsl(var(--error))]"
                      }`}
                    >
                      ₹{Math.abs(selectedParty.ledgerBalance).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Ledger History */}
                <div className="border-t border-border pt-3">
                  <h4 className="text-xs font-semibold text-foreground mb-3">
                    Ledger History
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                    {ledgerEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex justify-between items-center p-2 bg-secondary rounded-sm"
                      >
                        <div>
                          <div className="text-foreground font-medium">
                            {entry.type}
                          </div>
                          <div className="text-muted-foreground">
                            {entry.reference}
                          </div>
                        </div>
                        <div className="text-right">
                          {entry.debit > 0 && (
                            <div className="text-[hsl(var(--warning))] font-semibold">
                              Dr ₹{entry.debit}
                            </div>
                          )}
                          {entry.credit > 0 && (
                            <div className="text-[hsl(var(--success))] font-semibold">
                              Cr ₹{entry.credit}
                            </div>
                          )}
                          <div className="text-muted-foreground">
                            {entry.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delete Button */}
                <button className="w-full mt-4 border border-[hsl(var(--error))] text-[hsl(var(--error))] hover:bg-[hsl(var(--error))] hover:bg-opacity-10 py-2 rounded-sm text-sm font-medium transition flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Party Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-md p-6 w-96 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Add {partyType === "customer" ? "Customer" : "Supplier"}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {partyType === "customer" && (
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Credit Limit
                    </label>
                    <input
                      type="number"
                      value={formData.creditLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, creditLimit: e.target.value })
                      }
                      className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Opening Balance
                  </label>
                  <input
                    type="number"
                    value={formData.openingBalance}
                    onChange={(e) =>
                      setFormData({ ...formData, openingBalance: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-2 rounded-sm text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddParty}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-sm text-sm font-medium transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
