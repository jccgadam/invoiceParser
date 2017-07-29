
Meteor.publish('allProducts',function(){
    return products.find();
})
