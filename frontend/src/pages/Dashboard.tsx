import { AlertCircle, TrendingUp, TrendingDown, IndianRupee } from "lucide-react";
import { Layout } from "@/components/Layout";

interface Metric {
  label: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease";
}

interface Transaction {
  id: string;
  type: "sale" | "purchase";
  reference: string;
  party: string;
  amount: string;
  time: string;
  status: "completed" | "pending" | "partial";
}

const metrics: Metric[] = [
  {
    label: "Today Sales",
    value: "₹45,320",
    change: "+12.5%",
    changeType: "increase",
  },
  {
    label: "Today Purchases",
    value: "₹28,500",
    change: "+5.2%",
    changeType: "increase",
  },
  {
    label: "Total Receivables",
    value: "₹2,34,500",
    change: "+8.3%",
    changeType: "increase",
  },
  {
    label: "Total Payables",
    value: "₹89,200",
    change: "-2.1%",
    changeType: "decrease",
  },
];

const lowStockAlerts = [
  { product: "Dairy Milk 35g", sku: "DM-35", stock: 5, reorderLevel: 20 },
  { product: "Sprite 250ml", sku: "SPR-250", stock: 8, reorderLevel: 30 },
  { product: "Lay's Classic", sku: "LAY-C", stock: 3, reorderLevel: 15 },
];

const recentTransactions: Transaction[] = [
  {
    id: "INV-001",
    type: "sale",
    reference: "INV-001",
    party: "Rajesh Retail Store",
    amount: "₹5,420",
    time: "10:35 AM",
    status: "completed",
  },
  {
    id: "PUR-042",
    type: "purchase",
    reference: "PUR-042",
    party: "ABC Wholesale",
    amount: "₹12,300",
    time: "09:45 AM",
    status: "completed",
  },
  {
    id: "INV-002",
    type: "sale",
    reference: "INV-002",
    party: "Sharma Stores",
    amount: "₹3,850",
    time: "09:20 AM",
    status: "partial",
  },
  {
    id: "INV-003",
    type: "sale",
    reference: "INV-003",
    party: "Patel Kirana",
    amount: "₹8,250",
    time: "08:55 AM",
    status: "completed",
  },
  {
    id: "PUR-041",
    type: "purchase",
    reference: "PUR-041",
    party: "XYZ Distributors",
    amount: "₹15,800",
    time: "08:30 AM",
    status: "completed",
  },
  {
    id: "INV-004",
    type: "sale",
    reference: "INV-004",
    party: "Modern Mart",
    amount: "₹6,700",
    time: "08:10 AM",
    status: "completed",
  },
  {
    id: "INV-005",
    type: "sale",
    reference: "INV-005",
    party: "Daily Store",
    amount: "₹4,100",
    time: "07:50 AM",
    status: "completed",
  },
  {
    id: "PUR-040",
    type: "purchase",
    reference: "PUR-040",
    party: "Supreme Traders",
    amount: "₹18,500",
    time: "07:30 AM",
    status: "completed",
  },
  {
    id: "INV-006",
    type: "sale",
    reference: "INV-006",
    party: "Local Shop",
    amount: "₹2,900",
    time: "07:15 AM",
    status: "completed",
  },
  {
    id: "INV-007",
    type: "sale",
    reference: "INV-007",
    party: "Express Store",
    amount: "₹5,800",
    time: "06:50 AM",
    status: "completed",
  },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="metric-label">{metric.label}</div>
                  <div className="metric-value">{metric.value}</div>
                </div>
                <IndianRupee className="w-5 h-5 text-muted-foreground opacity-50" />
              </div>
              {metric.change && (
                <div className="mt-3 flex items-center gap-1">
                  {metric.changeType === "increase" ? (
                    <TrendingUp className="w-4 h-4 text-[hsl(var(--success))]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-[hsl(var(--info))]" />
                  )}
                  <span
                    className={
                      metric.changeType === "increase"
                        ? "text-[hsl(var(--success))] text-xs font-medium"
                        : "text-[hsl(var(--info))] text-xs font-medium"
                    }
                  >
                    {metric.change} from yesterday
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-[hsl(var(--warning))]" />
            <h2 className="text-sm font-semibold text-foreground">Low Stock Alerts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockAlerts.map((alert) => (
              <div
                key={alert.sku}
                className="bg-background border border-border rounded-sm p-3"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {alert.product}
                    </div>
                    <div className="text-xs text-muted-foreground">{alert.sku}</div>
                  </div>
                  <span className="text-xs font-bold text-[hsl(var(--warning))]">
                    {alert.stock} units
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Reorder level: {alert.reorderLevel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card border border-border rounded-md p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Recent Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                    Reference
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                    Party
                  </th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                    Amount
                  </th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="py-3 px-4 text-foreground font-mono text-xs">
                      {tx.reference}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-medium ${
                          tx.type === "sale"
                            ? "text-[hsl(var(--success))]"
                            : "text-[hsl(var(--info))]"
                        }`}
                      >
                        {tx.type === "sale" ? "Sale" : "Purchase"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground">{tx.party}</td>
                    <td className="py-3 px-4 text-right text-foreground font-semibold">
                      {tx.amount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-sm text-xs font-medium ${
                          tx.status === "completed"
                            ? "bg-[hsl(var(--success))] bg-opacity-10 text-[hsl(var(--success))]"
                            : tx.status === "partial"
                              ? "bg-[hsl(var(--warning))] bg-opacity-10 text-[hsl(var(--warning))]"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">
                      {tx.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
