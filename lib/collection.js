// import SimpleSchema from 'simpl-schema';
products= new Mongo.Collection('products');


Schemas = {};


Schemas.productSchema = new SimpleSchema({
  FBName:{
    type:String,
  },
  QBName:{
    type:String,
  }
})

products.attachSchema(Schemas.productSchema);
