<template>
  <div class="list_box">
    <div class="title" @click="flagup">
      <span>{{ title }}</span>
      <span>
        <van-icon name="arrow-up" color="#fff" v-if="flag" />
        <van-icon name="arrow-down" color="#fff" v-else />
      </span>
    </div>
    <div class="deta" v-show="flag">
      <div
        class="list"
        v-for="(item, i) in list"
        :key="i"
        v-show="item.status == type"
      >
        <div class="left">
          <input
            type="checkbox"
            :checked="item.status == 1"
            v-if="type != 2"
            @change="changestatus(i, item.status)"
          />
        </div>
        <div class="content">
          <span :class="{ s: item.status == 2 }">{{ item.title }}</span>
        </div>
        <div class="right">
          <button class="cancel" v-if="type == 0" @click="upstatus(i, 1)" v-btnborder="$store.state.color">
            取消
          </button>
          <span v-if="type == 1">{{ item.date }}</span>
          <button class="recover" v-if="type == 2" @click="upstatus(i, 0)">
            恢复
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs ,computed} from 'vue';
import { useStore } from 'vuex';
 import { useRouter, useRoute } from 'vue-router';
 export default {
      directives: {
         btnborder:{
         mounted(el,binding) {
      el.style.borderColor = binding.value 
      el.style.color=binding.value 
    },
    beforeUpdate(el,binding) {
       el.style.color=binding.value 
      el.style.borderColor = binding.value 
    }},},
    props:['title','flag','list'],
setup(props, ctx) {
const store = useStore();
const router = useRouter();
const route = useRoute();
const data = reactive({

});
const flagup= function  () {
    ctx.emit('upflag')
} 
const type = computed(()=>{
    let type = 0
    if(props.title=='已完成'){
        type = 1
    }
    if(props.title=='已取消'){
        type = 2
    }
    return type
})
const upstatus = function(i,val){
    ctx.emit('upstatus',{i,val})
}
const changestatus =function (i,value){
    let flag =0
    if(value == 0){
        flag =1
    }
    ctx.emit('upstatus',{i,val:flag})
}
return { ...toRefs(data),type,flagup ,upstatus,changestatus};
 },
 };
</script>

<style lang='scss' scoped>
.s {
  text-decoration: line-through;
}
.list_box {
  .title {
    width: 100%;
    height: 50px;
    line-height: 50px;

    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 15px;
    color: #fff;
  }
}
.list {
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 10px;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  .left {
    width: 15%;
    text-align: center;
  }
  .content {
    width: 65%;
  }
  .right {
    width: 20%;
    text-align: center;
    .cancel {
      height: 36px;
      line-height: 36px;
      margin: 8px 0;
      width: 80%;
      background-color: #fff;
      color: #00b0f0;
      border: #00b0f0 1px solid;
      border-radius: 5px;
    }
    .recover {
      height: 36px;
      line-height: 36px;
      margin: 8px 0;
      width: 80%;
      background-color: #fff;
      color: #ccc;
      border: #ccc 1px solid;
      border-radius: 5px;
    }
  }
}
</style>
