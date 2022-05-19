import { createStore } from 'vuex'

export default createStore({
  state: {
    resultlist:[],
    list: [],
    color:'#00b0f0'
  },
  mutations: {
    updatacolor(state,val){
      state.color = val
    },
    setlist(state,val){
      state.list=val
      state.resultlist=val
    },
    del(state,i){
      state.resultlist.splice(i,1)
    },
    seach(state,obj){
      state.resultlist = state.list.filter((item) => {
        return item.title.includes(obj);
      });
    },
    updatelist(state,obj){
      console.log(obj);
      state.resultlist[obj.i].title=obj.val
    },
    select(state,val){
      if (val == "已完成") {
        state.resultlist = state.list.filter((item) => {
          return item.status == 1;
        });
      }
      if (val == "未完成") {
        state.resultlist = state.list.filter((item) => {
          return item.status == 0;
        });
      }
      if (val == "已取消") {
        state.resultlist = state.list.filter((item) => {
          return item.status == 2;
        });
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
