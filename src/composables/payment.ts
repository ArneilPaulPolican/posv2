import { COLLECTIONS_LINES, COLLECTIONS_LINES_DTO } from "@/models/collection-lines.model";
import { COLLECTIONS, COLLECTIONS_DTO } from "@/models/collections.model";
import { PAYTYPE } from "@/models/paytype.model";
import { SALES_ITEM_DTO } from "@/models/sales-item.model";
import { SALES, SALES_DTO } from "@/models/sales.model";
import { addCollection, addPayment } from "@/services/activity/collection.service";
import { updateSales } from "@/services/activity/sales.service";

export const onPaymentSubmitUpdateSalesBalance = async (sales: SALES, collection:COLLECTIONS, collection_line: COLLECTIONS_LINES[]) => {
    try {
        const add_payment_res = await addPayment(collection, collection_line); // add the payment first
        if(add_payment_res.success){ 
            sales.balance_amount = (sales.balance_amount ?? 0 ) - collection.total_amount;
            sales.paid_amount = (sales.paid_amount ?? 0 ) + collection.total_amount;
            sales.is_locked = true;
            sales.is_billed_out = true;
            sales.status = 'PAID'
            const update_sales_res = await updateSales(sales); // if success update sales balance
            if(update_sales_res.success){
                return { success: true };  // if success return true
            }else{
                return { success: false };
            }
        }else{
            return { success: false };
        }
    } catch (error) {
        throw error;
    }
}