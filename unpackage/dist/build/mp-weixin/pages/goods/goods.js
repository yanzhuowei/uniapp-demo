(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/goods/goods"],{"4b34":function(t,o,n){},"772e":function(t,o,n){"use strict";n.r(o);var a=n("a548"),e=n.n(a);for(var r in a)"default"!==r&&function(t){n.d(o,t,(function(){return a[t]}))}(r);o["default"]=e.a},"7f3c":function(t,o,n){"use strict";var a=n("4b34"),e=n.n(a);e.a},"8a6a":function(t,o,n){"use strict";(function(t){n("21b4");a(n("66fd"));var o=a(n("a53b"));function a(t){return t&&t.__esModule?t:{default:t}}t(o.default)}).call(this,n("543d")["createPage"])},"8a98":function(t,o,n){"use strict";var a;n.d(o,"b",(function(){return e})),n.d(o,"c",(function(){return r})),n.d(o,"a",(function(){return a}));var e=function(){var t=this,o=t.$createElement;t._self._c},r=[]},a53b:function(t,o,n){"use strict";n.r(o);var a=n("8a98"),e=n("772e");for(var r in e)"default"!==r&&function(t){n.d(o,t,(function(){return e[t]}))}(r);n("7f3c");var s,c=n("f0c5"),u=Object(c["a"])(e["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],s);o["default"]=u.exports},a548:function(t,o,n){"use strict";(function(t,a){Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var e=s(n("a34a")),r=s(n("527f"));function s(t){return t&&t.__esModule?t:{default:t}}function c(t,o,n,a,e,r,s){try{var c=t[r](s),u=c.value}catch(i){return void n(i)}c.done?o(u):Promise.resolve(u).then(a,e)}function u(t){return function(){var o=this,n=arguments;return new Promise((function(a,e){var r=t.apply(o,n);function s(t){c(r,a,e,s,u,"next",t)}function u(t){c(r,a,e,s,u,"throw",t)}s(void 0)}))}}var i={data:function(){return{goods:null,carts:t.getStorageSync("carts")||[]}},onLoad:function(t){var o=Number(t.id);this.getDetails(o)},methods:{buy:function(){t.showToast({title:"测试请勿当真！"})},goCart:function(){t.switchTab({url:"/pages/cart/cart"})},addCart:function(){var o=this;return u(e.default.mark((function n(){var a;return e.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return o.carts=t.getStorageSync("carts")||[],a=!1,o.carts.forEach((function(t){t.goods_id==o.goods.goods_id&&(t.goods_number+=1,a=!0)})),a||o.carts.push({goods_id:o.goods.goods_id,goods_name:o.goods.goods_name,goods_price:o.goods.goods_price,goods_small_logo:o.goods.goods_small_logo,category:o.goods.category,goods_number:1,checked:!0}),t.setStorageSync("carts",o.carts),t.showToast({title:"加入成功!"}),n.next=8,(0,r.default)(2e3);case 8:t.switchTab({url:"/pages/cart/main"});case 9:case"end":return n.stop()}}),n)})))()},getDetails:function(t){var o=this;a.callFunction({name:"getDetails",data:{id:t},success:function(t){console.log(t),o.goods=t.result.data[0],wx.aldVisit({category:o.goods.category,id:o.goods.goods_id,name:o.goods.goods_name.substr(0,4)})}})}}};o.default=i}).call(this,n("543d")["default"],n("a9ff")["default"])}},[["8a6a","common/runtime","common/vendor"]]]);