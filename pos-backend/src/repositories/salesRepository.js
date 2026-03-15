const db = require('../config/db')

exports.insertInvoice = async (client,data,userId)=>{
  const result = await client.query(
  `
  INSERT INTO invoices
  (
    invoice_number,
    type,
    party_id,
    subtotal,
    discount,
    tax,
    grand_total,
    created_by
  )
  VALUES
  (
    generate_invoice_number('sale'),
    'sale',
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
  )
  RETURNING id,invoice_number
  `,
  [
    data.party_id,
    data.subtotal,
    data.discount,
    data.tax,
    data.total,
    userId
  ])
  return result.rows[0]
}

exports.insertInvoiceItem = async (client,invoiceId,item)=>{
  await client.query(
  `
  INSERT INTO invoice_items
  (
    invoice_id,
    product_unit_id,
    quantity,
    rate,
    total
  )
  VALUES ($1,$2,$3,$4,$5)
  `,
  [
    invoiceId,
    item.product_unit_id,
    item.quantity,
    item.rate,
    item.total
  ])
}



exports.insertPayment = async (client,invoiceId,payment)=>{
  await client.query(
  `
  INSERT INTO payments
  (
    invoice_id,
    payment_method,
    amount
  )
  VALUES ($1,$2,$3)
  `,
  [
    invoiceId,
    payment.method,
    payment.amount
  ])
}

exports.getSaleById = async (id)=>{
  const invoice = await db.query(

  `
  SELECT *
  FROM invoices
  WHERE id=$1 AND type='sale'
  `,
  [id])
  const items = await db.query(

  `
  SELECT
    ii.*,
    p.name,
    pu.unit_name
  FROM invoice_items ii
  JOIN product_units pu
  ON pu.id=ii.product_unit_id
  JOIN products p
  ON p.id=pu.product_id
  WHERE ii.invoice_id=$1
  `,
  [id])
  const payments = await db.query(
  `
  SELECT *
  FROM payments
  WHERE invoice_id=$1
  `,
  [id])
  return {
    invoice: invoice.rows[0],
    items: items.rows,
    payments: payments.rows
  }
}

exports.insertReturnInvoice = async (client,data,userId)=>{
  const result = await client.query(

  `
  INSERT INTO invoices
  (
    invoice_number,
    type,
    party_id,
    subtotal,
    discount,
    tax,
    grand_total,
    created_by
  )
  VALUES
  (
    generate_invoice_number('sale'),
    'return',
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
  )
  RETURNING id,invoice_number
  `,
  [
    data.party_id,
    data.subtotal,
    data.discount,
    data.tax,
    data.total,
    userId
  ])
  return result.rows[0]
}