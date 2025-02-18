import * as Contentful from 'contentful';

export type ProductSkeleton = {
    contentTypeId: 'product',
    fields: {
        sku: Contentful.EntryFieldTypes.Text,
        name: Contentful.EntryFieldTypes.Text,
        brand: Contentful.EntryFieldTypes.Text,
        model: Contentful.EntryFieldTypes.Text,
        category: Contentful.EntryFieldTypes.Text,
        color: Contentful.EntryFieldTypes.Text,
        price: Contentful.EntryFieldTypes.Number,
        currency: Contentful.EntryFieldTypes.Text,
        stock: Contentful.EntryFieldTypes.Integer
  }
}