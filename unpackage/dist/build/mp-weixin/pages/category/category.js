(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/category/category"],{"07b9":function(t,e,n){},"3d44":function(t,e,n){"use strict";(function(t){n("21b4");r(n("66fd"));var e=r(n("d9ae"));function r(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},"4db8":function(t,e,n){"use strict";n.r(e);var r=n("9c49"),o=n.n(r);for(var a in r)"default"!==a&&function(t){n.d(e,t,(function(){return r[t]}))}(a);e["default"]=o.a},9446:function(t,e,n){"use strict";var r;n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return r}));var o=function(){var t=this,e=t.$createElement;t._self._c},a=[]},"9c49":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={data:function(){return{topCategory:[],currentIndex:0}},created:function(){this.getTopCategory()},onShow:function(){},computed:{childCategory:function(){return this.topCategory.length&&this.topCategory[this.currentIndex].children}},onShareAppMessage:function(t){return{title:"购物小程序测试分类页",path:"pages/category/category"}},onShareTimeline:function(){return{title:"购物小程序测试分类页",path:"pages/category/category"}},methods:{getChild:function(t){this.currentIndex=t},getTopCategory:function(){var e=this;t.callFunction({name:"getCategory",success:function(t){console.log(t),e.topCategory=t.result.data}})}}};e.default=n}).call(this,n("a9ff")["default"])},af40:function(t,e,n){"use strict";var r=n("07b9"),o=n.n(r);o.a},d9ae:function(t,e,n){"use strict";n.r(e);var r=n("9446"),o=n("4db8");for(var a in o)"default"!==a&&function(t){n.d(e,t,(function(){return o[t]}))}(a);n("af40");var u,c=n("f0c5"),i=Object(c["a"])(o["default"],r["b"],r["c"],!1,null,null,null,!1,r["a"],u);e["default"]=i.exports}},[["3d44","common/runtime","common/vendor"]]]);