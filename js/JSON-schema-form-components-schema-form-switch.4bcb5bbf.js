(window.webpackJsonp=window.webpackJsonp||[]).push([["JSON-schema-form-components-schema-form-switch"],{"5eed":function(e,t,n){"use strict";n.r(t);var c=n("7a23"),o=n("ade3"),r=(n("fbd6"),n("160c")),a=(n("b0c0"),Object(c.defineComponent)({name:"SchemaFormTextarea",components:Object(o.a)({},r.a.name,r.a),emits:["update:value"],props:{formItem:{type:Object,default:function(){return{}}},value:void 0},setup:function(e,t){t.attrs;var n=t.emit;return{modelValue:Object(c.computed)({get:function(){return e.value},set:function(e){return n("update:value",e)}})}}}));a.render=function(e,t,n,o,r,a){var u=Object(c.resolveComponent)("a-switch");return Object(c.openBlock)(),Object(c.createBlock)(u,Object(c.mergeProps)({checked:e.modelValue,"onUpdate:checked":t[1]||(t[1]=function(t){return e.modelValue=t})},e.formItem.props,Object(c.toHandlers)(e.formItem.eventObject)),null,16,["checked"])},t.default=a}}]);