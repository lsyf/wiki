<template>
  <div>
    <el-row>
      <el-col :span.camel="6">
        <div style="margin: 30px auto; width: 200px">
          <el-row v-for="p in pages" :key="p.id">
            <el-link target="_blank" @click="goPage(p)" v-html="p.title"></el-link>
          </el-row>
        </div>
      </el-col>
      <el-col :span.camel="18">
        <div id="content-box" v-html="content">

        </div>
      </el-col>

    </el-row>


  </div>
</template>

<script>
import {getRequest} from "@/util/api";

export default {
  name: "PageList",
  props: [],
  components: {},
  data() {
    return {
      pages: [],
      content: ''
    }
  },
  computed: {},
  watch: {},
  methods: {
    goPage(p) {
      this.content = p.content;
    }
  },
  //生命周期 - 创建之前",数据模型未加载,方法未加载,html模板未加载
  beforeCreate() {
  },
  //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
  created() {
  },
  //生命周期 - 挂载之前",html模板未渲染
  beforeMount() {
  },
  //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
  mounted() {
    getRequest('/pages/4')
        .then(res => {
          this.content = res.content;
        })
        .catch(err => {
          console.log(err)
        });
    getRequest('/pages')
        .then(res => {
          this.pages = res;
        })
        .catch(err => {
          console.log(err)
        });
  },
  //生命周期 - 更新之前",数据模型已更新,html模板未更新
  beforeUpdate() {
  },
  //生命周期 - 更新之后",数据模型已更新,html模板已更新
  updated() {
  },
  //生命周期 - 销毁之前",
  beforeDestroy() {
  },
  destroyed() {
  },
  //生命周期 - 销毁完成",
  //如果页面有keep-alive缓存功能，这个函数会触发",
  activated() {
  }
}
</script>

<style lang='less' scoped>
#content-box {
  height: calc(100vh - 40px);

  width: 850px;
  margin: 30px auto 150px auto;
  background-color: #fff;
  padding: 20px 50px 50px 50px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 10px rgb(0 0 0 / 12%);
}
</style>
