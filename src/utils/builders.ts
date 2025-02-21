import { ProductDTO } from "src/product/dtos/product.dto";

export const queryProductBuilder = (product: ProductDTO) => {
    const query: {[k: string]: any} = {};
    let key: keyof ProductDTO;

    for(key in product){
        if(!product[key]) continue;
        query[key] = product[key];
    }

    return query;
};

export const queryPriceRangeBuilder = (min?: number, max?: number) => {
    return {
        price: {
            $gte: min ?? 0,
            $lte: max ?? 10000,
        },
    };
}