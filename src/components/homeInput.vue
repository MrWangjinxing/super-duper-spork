<template>
    <div class='input_box'>
        <input type="text" :value="modelValue" @input="inpchange" placeholder="代办事项" v-btnborder="$store.state.color">
        <button @click="add" v-bg="$store.state.color">提交</button>
    </div>
</template>

<script>
import { ref, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
 import { useRouter, useRoute } from 'vue-router';
 export default {
     props:['modelValue'],
    directives: {
    bg: {
      mounted(el,binding) {
      el.style.backgroundColor = binding.value
    },
    beforeUpdate(el,binding) {
       
      el.style.backgroundColor = binding.value
    },
    },
    btnborder:{
         mounted(el,binding) {
      el.style.borderColor = binding.value 
    },
    beforeUpdate(el,binding) {
       
      el.style.borderColor = binding.value 
    },
    }
  },
setup(props, ctx) {
const store = useStore();
const router = useRouter();
const route = useRoute();
const data = reactive({});
const inpchange = function(e){
     ctx.emit("update:modelValue", e.target.value);
}
const add = function(){
    ctx.emit('add')
}
return { ...toRefs(data),inpchange,add };
 },
 };
</script>

<style lang='scss' scoped>
.input_box{
    width: 100%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 20px 10px ;
    height: 100px;
    input{
        width: 80%;
        border: #00b0f0 1px solid ;
        height: 40px;
        border-radius: 5px;
        padding: 0 10px;
        box-sizing: border-box;
    }
    button{
        width: 18%;
        background-color: #00b0f0;
        color: #fff;
        height: 40px;
        border: none;
 border-radius: 5px;
    }

}
</style>
