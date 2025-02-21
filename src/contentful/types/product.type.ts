import * as Contentful from 'contentful';

export type ProductSkeleton = {
  contentTypeId: 'product';
  fields: {
    sku: Contentful.EntryFieldTypes.Text;
    name: Contentful.EntryFieldTypes.Text;
    brand: Contentful.EntryFieldTypes.Text;
    model: Contentful.EntryFieldTypes.Text;
    category: Contentful.EntryFieldTypes.Text;
    color: Contentful.EntryFieldTypes.Text;
    price: Contentful.EntryFieldTypes.Number;
    currency: Contentful.EntryFieldTypes.Text;
    stock: Contentful.EntryFieldTypes.Integer;
  };
};

export type ProductSysSkeleton = {
  contentTypeId: 'product';
  sys: {
    createdAt: Contentful.EntryFieldTypes.Date | string;
    updatedAt: Contentful.EntryFieldTypes.Date | string;
  };
  fields: {
    sku: Contentful.EntryFieldTypes.Text | string;
    name: Contentful.EntryFieldTypes.Text | string;
    brand: Contentful.EntryFieldTypes.Text | string;
    model: Contentful.EntryFieldTypes.Text | string;
    category: Contentful.EntryFieldTypes.Text | string;
    color: Contentful.EntryFieldTypes.Text | string;
    price: Contentful.EntryFieldTypes.Number | number;
    currency: Contentful.EntryFieldTypes.Text | string;
    stock: Contentful.EntryFieldTypes.Integer | number;
  };
};
