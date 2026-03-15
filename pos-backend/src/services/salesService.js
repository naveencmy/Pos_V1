const db = require('../config/db')
const salesRepo = require('../repositories/salesRepository')

exports.createSale = async (data,userId)=>{
  const client = await db.connect()
  try{
    await client.query("BEGIN")
    const invoice = await salesRepo.insertInvoice(
      client,
      data,
      userId
    )
    const invoiceId = invoice.id
    for(const item of data.items){
      await salesRepo.insertInvoiceItem(
        client,
        invoiceId,
        item
      )

    }

    for(const pay of data.payments){
      await salesRepo.insertPayment(
        client,
        invoiceId,
        pay
      )
    }
    await client.query("COMMIT")
    return invoice
  }catch(err){
    await client.query("ROLLBACK")
    throw err
  }finally{
    client.release()
  }
}

exports.getSaleById = async (id)=>{
  return salesRepo.getSaleById(id)
}

exports.returnSale = async (data,userId)=>{
  const client = await db.connect()
  try{
    await client.query("BEGIN")
    const invoice = await salesRepo.insertReturnInvoice(
      client,
      data,
      userId
    )
    const invoiceId = invoice.id
    for(const item of data.items){
      await salesRepo.insertInvoiceItem(
        client,
        invoiceId,
        item
      )
    }
    await client.query("COMMIT")
    return invoice
  }catch(err){
    await client.query("ROLLBACK")
    throw err
  }finally{
    client.release()
  }
}