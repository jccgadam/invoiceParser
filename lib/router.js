
Router.route('/',{
  name:'parser',
  waitOn:function(){
    return Meteor.subscribe('allProducts');
  },
  data:function(){
    return products.find().fetch();
  }
})

Router.route('/addProduct',{
  name:'addProduct'
});

Router.route('/allProducts',{
  name:'allProducts',
  waitOn:function(){
    return Meteor.subscribe('allProducts');
  },
  data:function(){
    return products.find();
  }
})
