import { useState } from "react";
import { Calendar, Download, Filter } from "lucide-react";
import { Layout } from "@/components/Layout";

interface SalesReport {
  date: string;
  totalSales: number;
  totalReturns: number;
  netSales: number;
  transactions: number;
  avgBill: number;
}

interface InventoryReport {
  product: string;
  sku: string;
  openingStock: number;
  purchases: number;
  sales: number;
  closingStock: number;
  value: number;
}

interface PartyReport {
  name: string;
  type: "customer" | "supplier";
  openingBalance: number;
  debit: number;
  credit: number;
  closingBalance: number;
}

const salesReports: SalesReport[] = [
  {
    date: "2025-02-25",
    totalSales: 45320,
    totalReturns: 2500,
    netSales: 42820,
    transactions: 15,
    avgBill: 2855,
  },
  {
    date: "2025-02-24",
    totalSales: 38500,
    totalReturns: 1200,
    netSales: 37300,
    transactions: 12,
    avgBill: 3108,
  },
  {
    date: "2025-02-23",
    totalSales: 52100,
    totalReturns: 3400,
    netSales: 48700,
    transactions: 18,
    avgBill: 2706,
  },
  {
    date: "2025-02-22",
    totalSales: 41200,
    totalReturns: 1800,
    netSales: 39400,
    transactions: 14,
    avgBill: 2814,
  },
  {
    date: "2025-02-21",
    totalSales: 47800,
    totalReturns: 2100,
    netSales: 45700,
    transactions: 16,
    avgBill: 2856,
  },
];

const inventoryReports: InventoryReport[] = [
  {
    product: "Dairy Milk 35g",
    sku: "DM-35",
    openingStock: 120,
    purchases: 100,
    sales: 70,
    closingStock: 150,
    value: 3000,
  },
  {
    product: "Sprite 250ml",
    sku: "SPR-250",
    openingStock: 180,
    purchases: 150,
    sales: 130,
    closingStock: 200,
    value: 7000,
  },
  {
    product: "Lay's Classic",
    sku: "LAY-C",
    openingStock: 450,
    purchases: 250,
    sales: 200,
    closingStock: 500,
    value: 1250,
  },
  {
    product: "Amul Butter 100g",
    sku: "AMU-100",
    openingStock: 60,
    purchases: 60,
    sales: 40,
    closingStock: 80,
    value: 2000,
  },
];

const partyReports: PartyReport[] = [
  {
    name: "Rajesh Retail Store",
    type: "customer",
    openingBalance: 5000,
    debit: 20000,
    credit: 10000,
    closingBalance: 15000,
  },
  {
    name: "Sharma Stores",
    type: "customer",
    openingBalance: 0,
    debit: 12500,
    credit: 4000,
    closingBalance: 8500,
  },
  {
    name: "ABC Wholesale",
    type: "supplier",
    openingBalance: 10000,
    debit: 35000,
    credit: 0,
    closingBalance: -45000,
  },
  {
    name: "XYZ Distributors",
    type: "supplier",
    openingBalance: 0,
    debit: 32500,
    credit: 0,
    closingBalance: -32500,
  },
];

export default function Reports() {
  const [reportType, setReportType] = useState<"sales" | "inventory" | "parties">(
    "sales"
  );
  const [startDate, setStartDate] = useState("2025-02-21");
  const [endDate, setEndDate] = useState("2025-02-25");

  const totalSales = salesReports.reduce((sum, r) => sum + r.netSales, 0);
  const totalTransactions = salesReports.reduce((sum, r) => sum + r.transactions, 0);
  const avgDailyBill =
    totalTransactions > 0 ? Math.round(totalSales / totalTransactions) : 0;

  const totalInventoryValue = inventoryReports.reduce((sum, r) => sum + r.value, 0);

  const totalReceivables = partyReports
    .filter((p) => p.type === "customer" && p.closingBalance > 0)
    .reduce((sum, p) => sum + p.closingBalance, 0);

  const totalPayables = Math.abs(
    partyReports
      .filter((p) => p.type === "supplier" && p.closingBalance < 0)
      .reduce((sum, p) => sum + p.closingBalance, 0)
  );

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reportType === "sales" && (
            <>
              <div className="metric-card">
                <div className="metric-label">Period Sales</div>
                <div className="metric-value">₹{totalSales.toLocaleString()}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Transactions</div>
                <div className="metric-value">{totalTransactions}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Avg Bill</div>
                <div className="metric-value">₹{avgDailyBill.toLocaleString()}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Avg Daily</div>
                <div className="metric-value">
                  ₹{Math.round(totalSales / 5).toLocaleString()}
                </div>
              </div>
            </>
          )}
          {reportType === "inventory" && (
            <>
              <div className="metric-card">
                <div className="metric-label">Stock Valuation</div>
                <div className="metric-value">
                  ₹{totalInventoryValue.toLocaleString()}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Total Products</div>
                <div className="metric-value">{inventoryReports.length}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Avg Value/Product</div>
                <div className="metric-value">
                  ₹{Math.round(totalInventoryValue / inventoryReports.length).toLocaleString()}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Total Units</div>
                <div className="metric-value">
                  {inventoryReports.reduce((sum, r) => sum + r.closingStock, 0)}
                </div>
              </div>
            </>
          )}
          {reportType === "parties" && (
            <>
              <div className="metric-card">
                <div className="metric-label">Total Receivables</div>
                <div className="metric-value text-[hsl(var(--warning))]">
                  ₹{totalReceivables.toLocaleString()}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Total Payables</div>
                <div className="metric-value text-[hsl(var(--error))]">
                  ₹{totalPayables.toLocaleString()}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Total Customers</div>
                <div className="metric-value">
                  {partyReports.filter((p) => p.type === "customer").length}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Total Suppliers</div>
                <div className="metric-value">
                  {partyReports.filter((p) => p.type === "supplier").length}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Report Selector & Date Filter */}
        <div className="bg-card border border-border rounded-md p-4 flex gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value as "sales" | "inventory" | "parties")
              }
              className="bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="parties">Parties Report</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-2">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-2">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-end gap-2">
            <button className="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-sm text-sm font-medium transition flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Apply
            </button>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-sm text-sm font-medium transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Report Data */}
        {reportType === "sales" && (
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">
                Daily Sales Report
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Gross Sales
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Returns
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Net Sales
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Transactions
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Avg Bill
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesReports.map((report) => (
                    <tr
                      key={report.date}
                      className="border-b border-border hover:bg-secondary transition"
                    >
                      <td className="py-3 px-4 text-foreground font-mono">
                        {report.date}
                      </td>
                      <td className="py-3 px-4 text-right text-foreground font-semibold">
                        ₹{report.totalSales.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-[hsl(var(--error))]">
                        ₹{report.totalReturns.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-[hsl(var(--success))] font-semibold">
                        ₹{report.netSales.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center text-foreground">
                        {report.transactions}
                      </td>
                      <td className="py-3 px-4 text-right text-foreground">
                        ₹{report.avgBill.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === "inventory" && (
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">
                Stock Position Report
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
                      Opening
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Purchases
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Sales
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Closing
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryReports.map((report) => (
                    <tr
                      key={report.sku}
                      className="border-b border-border hover:bg-secondary transition"
                    >
                      <td className="py-3 px-4 text-foreground">
                        {report.product}
                      </td>
                      <td className="py-3 px-4 text-center text-foreground">
                        {report.openingStock}
                      </td>
                      <td className="py-3 px-4 text-center text-[hsl(var(--success))]">
                        +{report.purchases}
                      </td>
                      <td className="py-3 px-4 text-center text-[hsl(var(--error))]">
                        -{report.sales}
                      </td>
                      <td className="py-3 px-4 text-center text-foreground font-semibold">
                        {report.closingStock}
                      </td>
                      <td className="py-3 px-4 text-right text-foreground font-semibold">
                        ₹{report.value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === "parties" && (
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">
                Party Ledger Report
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Party Name
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Type
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Opening
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Debit
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Credit
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {partyReports.map((report) => (
                    <tr
                      key={report.name}
                      className="border-b border-border hover:bg-secondary transition"
                    >
                      <td className="py-3 px-4 text-foreground font-medium">
                        {report.name}
                      </td>
                      <td className="py-3 px-4 text-center text-xs">
                        <span
                          className={`px-2 py-1 rounded-sm font-medium ${
                            report.type === "customer"
                              ? "bg-[hsl(var(--info))] bg-opacity-10 text-[hsl(var(--info))]"
                              : "bg-[hsl(var(--error))] bg-opacity-10 text-[hsl(var(--error))]"
                          }`}
                        >
                          {report.type === "customer" ? "C" : "S"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-foreground">
                        ₹{report.openingBalance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-foreground">
                        ₹{report.debit.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-foreground">
                        ₹{report.credit.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-semibold ${
                          report.closingBalance > 0
                            ? report.type === "customer"
                              ? "text-[hsl(var(--warning))]"
                              : "text-[hsl(var(--error))]"
                            : "text-foreground"
                        }`}
                      >
                        ₹{Math.abs(report.closingBalance).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
