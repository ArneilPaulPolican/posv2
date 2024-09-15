import ITEM_DTO from "@/models/item.model";
import { SALES_DTO } from "@/models/sales.model";

export const netPrice = async (item: ITEM_DTO, sales: SALES_DTO) => {
    let _net_price = item.price;
    const _vat_rate = (item.tax_rate ?? 0) / 100 ;

    const _vat_in_net_price = item.price / (1 + _vat_rate); // if vat inclusive

    const _vat_ex_net_price = item.price * (1 + _vat_rate); // if vat exclusive
    // VAT section
    if((item.tax_rate ?? 0) > 0){
        if(item.is_vat_inclusive){
            _net_price = item.price;
        }else{
            _net_price = _vat_ex_net_price;
        }
    }

    // Discount section
    const _discount_rate = (sales.discount_rate / 100);

    if(_discount_rate > 0){
        
        if(sales.discount?.toLowerCase().includes('pwd') ||
        sales.discount?.toLowerCase().includes('senior') )
        {
            // For senior and pwd only
            // If item is vat inclusive
            if(item.is_vat_inclusive){
                _net_price = _vat_in_net_price;
                // _net_price = _net_price - (_net_price * _discount_rate);
            }else{
                _net_price = item.price;
            }
            _net_price = _net_price - (_net_price * _discount_rate)
        }else{
            _net_price = item.price;
            _net_price = _net_price - (_net_price * _discount_rate)
        }
    }
    _net_price = parseFloat(_net_price.toFixed(2));

    return _net_price;
}

export const computeVAT = async (quantity:number, item: ITEM_DTO) => {
    let _vat_amount = 0
    if((item.tax_rate ?? 0) > 0){
        const _vat_rate = (item.tax_rate ?? 0) / 100 ;

        const _vat_in_net_price = item.price / (1 + _vat_rate); // if vat inclusive
    
        const _vat_ex_net_price = item.price * (1 + _vat_rate); // if vat exclusive
    
    
        console.log(`_vat_in_net_price ${_vat_in_net_price} and _vat_ex_net_price ${_vat_ex_net_price}`)
        if(item.is_vat_inclusive){
            _vat_amount = parseFloat((item.price - _vat_in_net_price).toFixed(2));
        }else{
            _vat_amount = parseFloat((_vat_ex_net_price - item.price).toFixed(2));
        }
    }
    return _vat_amount
}

export const discountPerQuantity = async (quantity:number, item: ITEM_DTO, sales: SALES_DTO) => {
    let _discount = 0 ;
    let _price = item.price;
    if(sales.discount_rate > 0){

        const _discount_rate = (sales.discount_rate / 100);
        if(sales.discount?.toLowerCase().includes('pwd') ||
        sales.discount?.toLowerCase().includes('senior') )
        {
            // For senior and pwd only
            // If item is vat inclusive
            if(item.is_vat_inclusive){
                const _vat_amount = await computeVAT(quantity, item);
                _price = _price - _vat_amount; // take out vat first
                // _discount = parseFloat((_price * _discount_rate).toFixed(2)); // discount per / qty
            }
        }
        _discount = _price * _discount_rate; // discount per / qty
    
        _discount = parseFloat(_discount.toFixed(2));
    }
    return _discount;
}