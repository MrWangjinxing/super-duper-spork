<template>
  <div class="home_box">
    <div class="header" v-bg="color">
      <div></div>
      <div >记事本</div>
      <div><van-icon name="wap-nav" color="#fff" @click="updateshow" /></div>
    </div>
    <div class="input">
      <home-input v-model="keyword" @add="add" ></home-input>
    </div>
    <div class="conten">
      <home-list
        title="未完成"
        :flag="flag[0]"
        :list="list"
        @upflag="showflag(0)"
        @upstatus="upstatus"
        v-bg="color"
      ></home-list>
      <home-list
        title="已完成"
        :flag="flag[1]"
        :list="list"
        @upflag="showflag(1)"
        @upstatus="upstatus"
        v-bg="color"
      ></home-list>
      <home-list
        title="已取消"
        :flag="flag[2]"
        :list="list"
        @upflag="showflag(2)"
        @upstatus="upstatus"
        v-bg="color"
      ></home-list>
    </div>
    <div class="model" v-show="show">
      <div class="tab" v-if="moduleshow[0]">
        <div class="left" v-if="moduleshow[1]">
          <button @click="moduleshow[1] = false" v-bg="color">切换主题</button>
          <button @click="moduleshow[0] = false" v-bg="color">编辑数据</button>
        </div>
        <div class="right" v-else>
          <h3>点击切换主题色</h3>
          <ul>
            <li v-for="(item, i) in colorlist" :key="i">
              <span class="color" :style="{ background: item }" @click="updatacolor(item)"></span
              ><span class="text">{{ item }}</span>
            </li>
          </ul>
          <button v-bg="color" @click="moduleshow[1] = true"> 返回</button>
        </div>
      </div>
      <div class="eaitdata" v-else>
        <div class="seach">
          <div class="seach_key" v-if="moduleshow[2]">
            <van-popover
              v-model:show="showPopover"
              :actions="actions"
              @select="onSelect"
            >
              <template #reference>
                <van-button>{{ actionstitle }}</van-button>
              </template>
            </van-popover>
            <van-search
              v-model="value"
              placeholder="请输入搜索关键词"
              @update:model-value="seach"
            />
          </div>

          <div class="seach_edit" v-else>
            <transition name="fade">
              <div>
                <input type="text" v-model="edittitle" />
                <van-button type="primary" @click="updatelist">确定</van-button>
              </div>
            </transition>
          </div>
        </div>
        <div class="table">
          <table cellspacing="0">
            <thead>
              <tr>
                <th>#</th>
                <th>所有事项</th>
                <th>类型</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in resultlist" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ item.title }}</td>
                <td>
                  <span v-if="item.status == 0">未完成</span>
                  <span v-if="item.status == 1">已完成</span>
                  <span v-if="item.status == 2">已取消</span>
                </td>
                <td>
                  <van-button
                    type="success"
                    size="mini"
                    @click="seachedit(i, item)"
                    >编辑</van-button
                  >
                  <van-button type="warning" size="mini" @click="del(i)"
                    >删除</van-button
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import HomeInput from "../components/homeInput.vue";
import HomeList from "../components/homeList.vue";
import { Toast } from "vant";
import { Dialog } from 'vant';
export default {
   directives: {
    bg: {
      mounted(el,binding) {
       
      el.style.backgroundColor = binding.value
    },
    beforeUpdate(el,binding) {
        
      el.style.backgroundColor = binding.value
    },

  }
},
  setup(props, ctx) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      list: [
        {
          status: 0,
          date: new Date().toLocaleDateString(),
          title: "哪吒",
        },
        {
          status: 1,
          date: new Date().toLocaleDateString(),
          title: "猪八戒",
        },
        {
          status: 2,
          date: new Date().toLocaleDateString(),
          title: "孙猴子",
        },
      ],
      flag: [false, false, false],
      keyword: "",
      show: false,
      moduleshow: [true, true, true],
      colorlist: ["#00b0f0", "#00d1b2", "#f4b976", "#f39894", "#26b6be"],
      value: "",
      actions: [{ text: "未完成" }, { text: "已完成" }, { text: "已取消" }],
      actionstitle: "筛选类型",
      edittitle: "",
      showPopover: false,
      editindex: 0,
    });
    // 获取本地数据
    if (localStorage.getItem("notepadlist")) {
      data.list=JSON.parse(localStorage.getItem("notepadlist"))
      store.commit("setlist", JSON.parse(localStorage.getItem("notepadlist")));
    }
    // 复选框点击取反
    const showflag = function (i) {
      console.log(data.flag);
      data.flag[i] = !data.flag[i];

    };
    // 数据更新
    const upstatus = function (obj) {
      data.list[obj.i].status = obj.val;
      localStorage.setItem("notepadlist", JSON.stringify(data.list));
      store.commit('setlist',data.list)
    };
    // 添加
    const add = function () {
      let obj = {
        status: 0,
        title: data.keyword,
        date: new Date().toLocaleDateString(),
      };
      data.list.push(obj);
      localStorage.setItem("notepadlist", JSON.stringify(data.list));
      Toast("添加成功");
      data.keyword = "";
      store.commit('setlist',data.list)
    };
    // 开启模态框
    const updateshow = function () {
      data.show = !data.show;
    };
    const resultlist = computed(() => {
      return store.state.resultlist;
    });
    const color =computed(()=>{
      return store.state.color
    })
    // 筛选
    const onSelect = function (action) {
      data.actionstitle = action.text;
      store.commit("select", action);
    };
    // 搜索
    const seach = function (value) {
      store.commit("seach", value);
    };
    // 编辑
    const seachedit = function (i, item) {
      data.moduleshow[2] = false;
      data.editindex = i;
      data.edittitle = item.title;
    };
    // 删除
    const del = function (i) {
      Dialog.confirm({
        title: "警告",
        message:
          "确定删除嘛",
      })
        .then(() => {
          // on confirm
          store.commit('del',i)
           Toast("删除成功");
        })
        .catch(() => {
          // on cancel
        });
    };
    // 编辑详情
    const updatelist = function () {
      data.moduleshow[2] = true;
      store.commit("updatelist", { i: data.editindex, val: data.edittitle });
       Toast("修改成功");
    };
    const updatacolor = function(val){
      store.commit('updatacolor',val)
    }
    return {
      ...toRefs(data),
      showflag,
      upstatus,
      add,
      updateshow,
      onSelect,
      seach,
      seachedit,
      del,
      updatelist,
      resultlist,
      updatacolor,
      color
    };
  },
  components: { HomeInput, HomeList },
   
};
</script>

<style lang='scss' scoped>
/* enter进入动画, leave离开动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
.home_box {
  position: relative;
  height: 100vh;
  .header {
    width: 100%;
    height: 80px;
    line-height: 80px;
    display: flex;
   
    color: #fff;
    justify-content: space-around;
    div {
      flex: 1;
      text-align: center;
      font-size: 30px;
      font-weight: 700;
    }
    :nth-last-child(1) {
      text-align: right;
      box-sizing: border-box;
      padding: 0 15px;
    }
  }
  .model {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 80px;
    left: 0;
    display: flex;
    .tab {
      width: 50%;
      height: 100%;
      .left {
        background: rgba(0, 0, 0, 0.363);
        height: 100%;
        border: 1px solid rgba(0, 0, 0, 0);
        button {
          margin: 20px auto;
         
          text-align: center;
          color: #fff;
          height: 50px;
          line-height: 50px;
          display: block;
          border: none;
          width: 100px;
          border-radius: 5px;
        }
      }
      .right {
        height: 100%;
        background-color: #fff;
        ul {
          border-top: 1px solid rgba(204, 204, 204, 0);
          li {
            list-style: none;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 140px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px;
            .color {
              width: 30px;
              height: 30px;
              display: inline-block;
              margin: 10px;
            }
            .text {
              display: inline-block;
            }
          }
        }
        button{
          width: 90px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin: auto;
          border:none;
          display: block;
          color: white;
        }
      }
    }
    .eaitdata {
      width: 100%;
      height: 100%;
      background-color: #fff;
      .seach {
        width: 100%;
        display: flex;
        .seach_edit {
          width: 100%;

          > div {
            width: 100%;
            display: flex;
            input {
              width: 80%;
            }
          }
        }
        .seach_key {
          display: flex;
        }
      }
      .table {
        width: 100%;
        height: 100%;
        table {
          width: 100%;
          border: 1px solid #ccc;
          td,
          th {
            border: 1px solid rgba(204, 204, 204, 0.738);
            text-align: center;
          }
          tr {
            height: 50px;
          }
        }
      }
    }
  }
}
</style>
