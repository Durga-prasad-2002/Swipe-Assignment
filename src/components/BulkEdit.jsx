import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import '../style/BulkEdit.css'
import { useEffect, useState } from 'react'
import { bulkUpdate } from '../redux/invoicesSlice'
import { Link } from 'react-router-dom'
import { BiSolidPencil, BiTrash } from 'react-icons/bi'

const BulkEdit = () => {
    const state  = useSelector(state=>state.invoices)
    const [invoices,setInvoices] = useState([]);
    const dispatch = useDispatch();
    const handleSave = () =>{
        dispatch(bulkUpdate(invoices));
    }


    const handleCalculateTotal=(newInvoice,i)=>{
      let subTotal = 0;
      newInvoice[i].items.forEach((item)=>{
          subTotal += parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
      })
      const taxAmount = parseFloat(
        subTotal * (newInvoice[i].taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (newInvoice[i].discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      newInvoice[i]={
        ...newInvoice[i],
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      }
      setInvoices(newInvoice);
    }
    
    const handleChange=(i,e)=>{
      const newInvoice = [...invoices];
      console.log(e);
      newInvoice[i]={
        ...newInvoice[i],
        [e.target.name]:e.target.value
      }

      handleCalculateTotal(newInvoice,i);
    }

    const handleItemChange=async (i,j,e)=>{
      const newInvoice=[...invoices];
      let newItems = (newInvoice[i].items);
      console.log(newItems);
      const temp = newItems.map((oldItem)=>{
        if(oldItem.itemId==j){
          return {...oldItem,[e.target.name]:e.target.value};
        }
        return oldItem;
      })
      newInvoice[i]={
        ...newInvoice[i],
        items:temp,
      }
      handleCalculateTotal(newInvoice,i);
    }


    const handleAddItem=(i)=>{
        const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        const newItem = {
          itemId: id,
          itemName: "",
          itemDescription: "",
          itemPrice: "1.00",
          itemQuantity: 1,
        };
        let newInvoice = [...invoices];
        newInvoice[i]={
          ...newInvoice[i],
          items:[...newInvoice[i].items,newItem],
        };
        handleCalculateTotal(newInvoice,i)
    }

    const handleDeleteItem =(i,j)=>{

      const newInvoice = [...invoices]
      
      const updatedItems = newInvoice[i].items.filter(
        (item) => item.itemId !== j
      );

      newInvoice[i]={
        ...newInvoice[i],
        items:updatedItems,
      }
      handleCalculateTotal(newInvoice,i);
    }

    useEffect(()=>{
      setInvoices(state);
    },[])

  return (
    <div className='bulkpage'>
      <h1 className="heading d-flex justify-content-center align-items-center">BULK EDIT</h1>
      <Link className='savebulk' to='/'>
        <Button onClick={handleSave}>Save</Button>
      </Link>
      <div className="content">
        <Table responsive className='table-bordered'>
          <tr className='text-capitalize'>
            <th>invoiceNumber</th>
            <th>currentDate</th>
            <th>dateOfIssue</th>
            <th>itemName</th>
            <th>itemDescription</th>
            <th>itemPrice</th>
            <th>itemQuantity</th>
            <th>itemActions</th>
            <th>total</th>
            <th>billTo</th>
            <th>billToEmail</th>
            <th>billToAddress</th>
            <th>billFrom</th>
            <th>billFromEmail</th>
            <th>billFromAddress</th>
            <th>notes</th>
          </tr>
          <tbody>
            {

                invoices && invoices.map((invoice,i)=>{
                  return (
                    <>
                        <tr key={i}>
                          <td className='my_td'><input type="text" className='bulkInput' value={invoice.invoiceNumber} name='invoiceNumber' onChange={(e)=>{handleChange(i,e)}}/></td>
                          <td> <input type="text" className='bulkInput' value={invoice.currentDate} /></td>
                          <td> <input type="date" className='bulkInput' value={invoice.dateOfIssue} name='dateOfIssue' onChange={(e)=>{handleChange(i,e)}} /></td>
                          <td colSpan={4} ></td>
                          <td>
                          <center>
                            <Button onClick={()=>{handleAddItem(i)}}>
                              <BiSolidPencil/>
                            </Button>
                            </center>
                          </td>
                          <td><input type="text" className='bulkInput' name='total' value={invoice.total} onChange={(e)=>{handleChange(i,e)}} /></td>
                          <td> <input type="text" className='bulkInput' name='billTo' value={invoice.billTo} onChange={(e)=>{handleChange(i,e)}}/></td>
                          <td> <input type="text"className='bulkInput' name='billToEmail' value={invoice.billToEmail} onChange={(e)=>{handleChange(i,e)}} /></td>
                          <td> <input type="text" className='bulkInput' name='billToAddress' value={invoice.billToAddress} onChange={(e)=>{handleChange(i,e)}}/></td>
                          <td> <input type="text" className='bulkInput' name='billFrom' value={invoice.billFrom} onChange={(e)=>{handleChange(i,e)}}/></td>
                          <td> <input type="text" className='bulkInput' name='billFromEmail' value={invoice.billFromEmail} onChange={(e)=>{handleChange(i,e)}}/></td>
                          <td> <input type="text" className='bulkInput' name='billFromAddress' value={invoice.billFromAddress} onChange={(e)=>{handleChange(i,e)}}/></td>
                          <td> <input type="text" className='bulkInput' name='notes' value={invoice.notes} onChange={(e)=>{handleChange(i,e)}}/></td>
                        </tr>
                        {
                          invoice.items.map((item,j)=>{
                            return (
                              <tr key={j}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td> <input type="text" name='itemName' className='bulkInput' onChange={(e)=>{handleItemChange(i,item.itemId,e)}} value={item.itemName}/></td>
                                <td> <input type="text" name='itemDescription' className='bulkInput' onChange={(e)=>{handleItemChange(i,item.itemId,e)}} value={item.itemDescription}/></td>
                                <td> <input type="text" name='itemPrice' className='bulkInput' onChange={(e)=>{handleItemChange(i,item.itemId,e)}} value={item.itemPrice}/></td>
                                <td> <input type="text" name='itemQuantity' className='bulkInput' onChange={(e)=>{handleItemChange(i,item.itemId,e)}} value={item.itemQuantity}/></td>
                                <td> 
                                  <center>
                                  <Button variant='danger'
                                  onClick={()=>{handleDeleteItem(i,item.itemId)}}>
                                      <BiTrash />
                                  </Button>
                                  </center>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td ></td>
                              </tr>
                            )
                          })
                        }
                    </>
                        
                  )
                })

            }
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default BulkEdit
