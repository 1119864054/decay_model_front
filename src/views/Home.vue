<template>
  <el-container>
    <el-main>

      <el-row>
        <el-col :xl="24" :lg="24">
          <div>
            <el-radio
                @change="select_op"
                v-model="operation"
                label="handle"
                border
            >手动输入
            </el-radio>
            <el-radio
                @change="select_op"
                v-model="operation"
                label="file"
                border
            >文件上传
            </el-radio>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xl="24" :lg="24">
          <el-divider></el-divider>
        </el-col>
      </el-row>

      <el-row v-if="in_calculation">
        <el-col :xl="2" :lg="2">
          <el-button type="text" :loading="true">计算中，请等待</el-button>
        </el-col>
        <el-col :xl="1" :lg="1">
          <el-button type="text" ref="startTimer">00:00</el-button>
        </el-col>
        <el-col :xl="2" :lg="2">
          <el-button type="danger" @click="cancel_submit" plain>取消</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xl="6" :lg="6">
          <div v-if="!in_calculation && is_handle">
            <el-button type="primary" @click="add">添加</el-button>
            <el-button type="success" @click="submit">提交</el-button>
          </div>
          <div v-if="!in_calculation && !is_handle">
            <el-upload
                auto-upload
                class="upload-demo"
                drag
                action="http://www.lzuwk.ltd:8000/test/"
                accept=".lis"
                :on-success="uploadSuccess"
                :limit="1"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传 lis 文件，且不超过 500M
                </div>
              </template>
            </el-upload>
            <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="post_file"
            >提交
            </el-button
            >
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xl="24" :lg="24">
          <el-table :data="nuclides" v-if="is_handle">
            <el-table-column label="输入核素名称" width="180">
              <template #default="scope">
                <el-input
                    placeholder="请输入内容"
                    v-model="scope.row.nuclide"
                    clearable
                >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="姓名" width="180">
              <template #default="scope">
                <el-input
                    placeholder="请输入内容"
                    v-model="scope.row.num"
                    clearable
                >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-input
                    placeholder="请输入内容"
                    v-model="scope.row.time"
                    clearable
                >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                    v-if="nuclides.length > 1"
                    size="mini"
                    type="danger"
                    @click="del_item(scope.$index, scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

    </el-main>

    <!--    <ul class="list-group list-group-flush">-->
    <!--      <li class="list-group-item"><h5>历史记录</h5></li>-->
    <!--      <li class="list-group-item" v-for="(val, key) in hist_data">-->
    <!--        <a href="#" class="text-info" v-text="key" @click="get_hist_data(val, key)"></a>-->
    <!--        <a href="#" class="text-muted" v-text="'删除'" @click="del_hist_data(key)"></a>-->
    <!--      </li>-->
    <!--    </ul>-->
  </el-container>
</template>

<script>
import {request} from "@/network/request";
// import {ElMessage} from "element-plus";
import store from "@/store";
// import home1 from "../assets/img/home1.jpg";
// import home2 from "../assets/img/home2.jpg";
// import home3 from "../assets/img/home3.jpg";
// import file_result from "../assets/result_file.txt";
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      nuclides: [
        {
          nuclide: "U235",
          num: "100",
          time: "100"
        }
      ],
      file: null,
      result: [],
      final: {},
      list_final: [],
      spectrum_alpha: {},
      spectrum_beta: {},
      spectrum_gamma: {},
      alpha: [],
      beta: [],
      gamma: [],
      in_calculation: false,
      hist_data: {},
      my_chart: null,
      my_bar_chart: null,
      timer: "",
      hour: 0,
      minutes: 0,
      seconds: 0,
      source: null,
      operation: "handle",
      is_handle: true,
      toggle_download: true,
      sort_key: 1,
      nowSort: true,
    };
  },
  created: function () {
  },
  methods: {
    sortByKey(array, key) {
      return array.sort(function (a, b) {
        let x = parseFloat(b[key]);
        let y = parseFloat(a[key]);
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    select_op() {
      console.log(this.operation);
      if (this.operation === "handle") {
        this.is_handle = true;
      }
      if (this.operation === "file") {
        this.is_handle = false;
      }
    },
    uploadSuccess(response, file) {
      console.log("file:" + file.raw);
      this.file = file;
    },
    post_file() {
      let param = new FormData(); //创建form对象
      param.append("file", this.file.raw); //通过append向form对象添加数据
      console.log(param.get("file")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去

      let that = this;
      that.start_timing();
      this.source = axios.CancelToken.source();
      request({
        cancelToken: this.source.token,
        method: "post",
        url: "/test/",
        data: param,
        headers: {"Content-Type": "multipart/form-data"}
      })
          .then(res => {
            that.end_timing();
            console.log("res ==> ", res);
            if (res.data !== "time < 0") {
              console.log("resData" + res.data);
              store.commit("setResult", res.data);
              that.data_title = this.get_date();
            } else {
              alert(res.data);
            }
          })
          .catch(err => {
            that.end_timing();
            alert(err);
          });
    },
    start_timing() {
      this.in_calculation = true;
      this.timer = setInterval(this.startTimer, 1000);
    },
    end_timing() {
      this.in_calculation = false;
      clearInterval(this.timer);
      this.hour = 0;
      this.minutes = 0;
      this.seconds = 0;
    },
    get_date() {
      let date = new Date();
      return date.toLocaleString();
    },
    del_item(index, row) {
      console.log(index, row);
      this.nuclides.splice(index, 1);
    },

    add: function () {
      let temp = this.nuclides[this.nuclides.length - 1];
      this.nuclides.push({
        nuclide: temp.nuclide,
        num: temp.num,
        time: temp.time
      });
    },
    submit: function () {
      let temp = {};
      let count = 1;
      for (let key in this.nuclides) {
        temp[count] = this.nuclides[parseInt(key)];
        count++;
      }
      let data = JSON.stringify(temp);
      console.log(data);
      let that = this;
      that.start_timing();
      this.source = axios.CancelToken.source();
      request({
        cancelToken: this.source.token,
        method: "post",
        // url: "/get_tree/",
        url: "/file_result/",
        data: data
      })
          .then(res => {
            that.end_timing();
            console.log("res ==> ", res);
            console.log(res.data);
            store.commit("setResult", res.data);
            router.push({name:"Result"})
            that.data_title = this.get_date();
          })
          .catch(err => {
            that.end_timing();
            alert(err);
          });
    },
    cancel_submit() {
      this.source.cancel("提交已取消！");
    },
    startTimer() {
      this.seconds += 1;
      if (this.seconds >= 60) {
        this.seconds = 0;
        this.minutes = this.minutes + 1;
      }
      if (this.minutes >= 60) {
        this.minutes = 0;
        this.hour = this.hour + 1;
      }
      let temp_min = this.minutes < 10 ? "0" + this.minutes : this.minutes;
      let temp_sec = this.seconds < 10 ? "0" + this.seconds : this.seconds;
      this.$refs.startTimer.innerHTML = temp_min + ":" +temp_sec;
    }
  }
};
//防止页面后退
history.pushState(null, null, document.URL);
window.addEventListener("popstate", function () {
  history.pushState(null, null, document.URL);
});
</script>
