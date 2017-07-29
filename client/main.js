createProductMapping = function(){
  var data =products.find().fetch();
  var productList = {};
  _.map(data,function(v){
    // console.log(v);
        var fbname = v.FBName;
        var qbname = v.QBName;
        productList[fbname] = qbname;
  })
  return productList;
}

orderParser = function(){
  var orderItems = Session.get('orderData');
  var productsMapping = createProductMapping();
  var res =[];
  var i=2;
  orderInfo={};
  poNo='';
  customerName='';
  orderFulFillDate=''
  index=0;
  var today=new Date();
  var invoiceString = (today.getMonth()+1).toString()+today.getDate().toString()+today.getFullYear().toString();
  while(i<orderItems.length){
    if(orderItems[i][0]==='SO'){
      orderInfo={};
      poNo=orderItems[i][1];
      customerName=orderItems[i][3];
      orderFulFillDate = orderItems[i][30];
      orderInfo.poNo = poNo;
      orderInfo.customerName = customerName;
      index++;
      i++;
    }
    else {
      orderInfo={};
      orderInfo.customerName = customerName;
      orderInfo.poNo = poNo;
      orderInfo.orderFulFillDate = orderFulFillDate;
      if(orderItems[i][2].toLowerCase().includes('discount')){
        orderInfo.itemName = 'Discount';
      }
      else{
        var itemName = orderItems[i][2];
        orderInfo.itemName = productsMapping[itemName]||orderItems[i][2];
      }
      // orderInfo.itemName = orderItems[i][2];
      orderInfo.itemRate = orderItems[i][6];
      orderInfo.count = orderItems[i][4];
      orderInfo.invoice = invoiceString+index;
      res.push(orderInfo);
      i++;
    }
  }
  // console.log(res);
  if(res)
  {
    Session.set('dataBeforeparse',res);
    Session.set('dataAfterParse',Papa.unparse(res));
  }

  // Session.set('dataAfterParse',dataAfterParse)
}

Template.parser.onCreated(function(){
  Session.set('orderData',{});
  Session.set('dataAfterParse','')
  // createProductMapping();
  Tracker.autorun(() => {
    var orderData = Session.get('orderData');
    if(orderData){
      orderParser();
    }
  })
})


Template.parser.events({
  'change #inviceInput':function(e,t){
         Papa.parse(e.target.files[0],{
           complete:function(res){

          Session.set('orderData',res.data);
          // orderParser();
          }
        })

  },
  'click #downloadFile':function(e,t){
    var csvString = Session.get('dataAfterParse');
    if(csvString.length)
  {
      var blob = new Blob([csvString]);
      if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
      window.navigator.msSaveBlob(blob, "filename.csv");
      else
      {
          var a = window.document.createElement("a");
          a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
          a.download = "filename.csv";
          document.body.appendChild(a);
          a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
          document.body.removeChild(a);
      }
    }
  }
})



//
Template.parser.helpers({
  downloadFile:function(){
    var fileParsed = Session.get('dataBeforeparse');
    return fileParsed;
  }
})
//   'downloadFile':function(e,t){
//     var csvString = Session.get('dataAfterParse');
//
//     if(csvString.length)
//   {
//       var blob = new Blob([csvString]);
//       if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
//       window.navigator.msSaveBlob(blob, "filename.csv");
//       else
//       {
//           var a = window.document.createElement("a");
//           a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
//           a.download = "filename.csv";
//           document.body.appendChild(a);
//           a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
//           document.body.removeChild(a);
//       }
//   }
//   }
// })
// //   data:function(){
// //     var orderItems = Session.get('orderData');
// //     var res =[];
// //     var i=2;
// //     orderInfo={};
// //     poNo='';
// //     customerName='';
// //     while(i<orderItems.length){
// //       if(orderItems[i][0]==='SO'){
// //         orderInfo={};
// //         poNo=orderItems[i][1];
// //         customerName=orderItems[i][3];
// //         orderInfo.poNo = poNo;
// //         orderInfo.customerName = customerName;
// //         i++;
// //       }
// //       else {
// //         orderInfo.customerName = customerName;
// //         orderInfo.poNo = poNo;
// //         orderInfo.itemName = orderItems[i][2];
// //         orderInfo.itemRate = orderItems[i][6];
// //         orderInfo.count = orderItems[i][4];
// //         res.push(orderInfo);
// //         i++;
// //       }
// //     }
// //     console.log(res);
// //   }
// //
// })
