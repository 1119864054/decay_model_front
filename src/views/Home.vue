<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="24">
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

        <el-col :span="24">
          <el-divider></el-divider>
        </el-col>

        <el-col :span="24">
          <div
            class="row m-2"
            v-if="in_calculation"
            style="align-items: center"
          >
            <div class="spinner-border spinner-border-sm mt-1" role="status">
              <span class="sr-only"></span>
            </div>
            计算中，请等待
            <span ref="startTimer">00:00</span>
            <a href="#" class="ml-3" @click="cancel_submit">取消</a>
          </div>
        </el-col>
        <el-col :span="24">
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
              :on-success="post_file"
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

            <el-button type="primary" @click="post_file">
              上传
            </el-button>
          </div>
          <div class="row m-2 pl-2" v-if="!is_handle">
            <div class="custom-file">
              <input type="file" id="inputGroupFile04" accept=".lis" />
            </div>
          </div>
        </el-col>
        <el-col :span="24">
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
import { request } from "@/network/request";
// import {ElMessage} from "element-plus";
// import store from "@/store";
// import home1 from "../assets/img/home1.jpg";
// import home2 from "../assets/img/home2.jpg";
// import home3 from "../assets/img/home3.jpg";
import Chart from "chart.js";
import axios from "axios";

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
      dp_chart: false,
      dp_bar_chart: false,
      my_chart: null,
      my_bar_chart: null,
      data_title: "",
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
      title_list: [
        { name: "核素名称", isSelected: false, key: 0 },
        { name: "质子数", isSelected: false, key: 1 },
        { name: "质量数", isSelected: false, key: 2 },
        { name: "核素数量", isSelected: false, key: 3 },
        { name: "核素活度", isSelected: false, key: 4 },
        { name: "核素质量", isSelected: false, key: 5 },
        { name: "食入毒性", isSelected: false, key: 6 },
        { name: "吸入毒性", isSelected: false, key: 7 },
        { name: "反应放能", isSelected: false, key: 8 }
      ]
    };
  },
  created: function() {
    this.hist_data = localStorage.valueOf();
    console.log(this.hist_data);
  },
  computed: {
    sortFinal: function() {
      return this.sortByKey(this.list_final, this.sort_key);
    }
  },
  methods: {
    filter() {},
    sort_list(item) {
      this.sort_key = item.key;
      for (let i = 0; i < this.title_list.length; i++) {
        this.title_list[i].isSelected = false;
      }
      item.isSelected = true;
    },
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        let x = parseFloat(b[key]);
        let y = parseFloat(a[key]);
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    delete_file() {
      request({
        url: "/delete_file/"
      })
        .then(response => {
          alert(response.data);
        })
        .catch(err => {
          alert(err);
        });
    },
    download_final() {
      let filename = "核素信息.txt";
      let final = this.list_final;
      let text = "";
      for (let i = 0; i < final.length; i++) {
        let item = final[i];
        let temp = "";
        if (item[0] !== "total" && item[0] !== "q") {
          for (let i = 0; i < item.length; i++) {
            temp += item[i] + " ";
          }
          text += temp + "\n";
        }
      }
      for (let i = 0; i < final.length; i++) {
        let item = final[i];
        let temp = "";
        if (item[0] === "total") {
          for (let i = 0; i < item.length; i++) {
            temp += item[i] + " ";
          }
          text += temp + "\n";
          break;
        }
      }

      this.gen_txt(filename, text);
    },
    download_abg() {
      let filename = "能谱信息.txt";
      let a = this.spectrum_alpha;
      let b = this.spectrum_beta;
      let g = this.spectrum_gamma;
      let text = "";
      text += "-----------------\nalpha能谱：\n-----------------\n";
      for (let key in a) {
        let val = a[key];
        text += key + "," + val + "\n";
      }
      text += "-----------------\nbeta能谱：\n-----------------\n";
      for (let key in b) {
        let val = b[key];
        text += key + "," + val + "\n";
      }
      text += "-----------------\ngamma能谱：\n-----------------\n";
      for (let key in g) {
        let val = g[key];
        text += key + "," + val + "\n";
      }
      let coordinate = [];
      text += "-----------------\nalpha频数：\n-----------------\n";
      coordinate = this.alpha;
      for (let i = 0; i < coordinate.length; i++) {
        let a = i * 1e5;
        let b = (i + 1) * 1e5;
        text += a + "-" + b + ":" + coordinate[i] + "\n";
      }
      text += "-----------------\nbeta频数：\n-----------------\n";
      coordinate = this.beta;
      for (let i = 0; i < coordinate.length; i++) {
        let a = i * 1e5;
        let b = (i + 1) * 1e5;
        text += a + "-" + b + ":" + coordinate[i] + "\n";
      }
      text += "-----------------\ngamma频数：\n-----------------\n";
      coordinate = this.gamma;
      for (let i = 0; i < coordinate.length; i++) {
        let a = i * 1e5;
        let b = (i + 1) * 1e5;
        text += a + "-" + b + ":" + coordinate[i] + "\n";
      }

      this.gen_txt(filename, text);
    },
    gen_txt(filename, text) {
      let pom = document.createElement("a");
      pom.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      pom.setAttribute("download", filename);
      if (document.createEvent) {
        let event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }
    },
    download_result() {
      request({
        url: "/download_result/",
        method: "post",
        data: {
          res_data: this.result
        },
        responseType: "blob"
      })
        .then(response => {
          console.log(response);
          console.log(response.filename);
          if ("download" in document.createElement("a")) {
            //支持a标签download的浏览器
            let url = window.URL.createObjectURL(response.data); //为文件流创建构建下载链接
            let link = document.createElement("a"); //创建a标签
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "核素信息.txt"); //设置a标签的下载动作和下载文件名
            document.body.appendChild(link);
            link.click(); //执行下载
            document.body.removeChild(link); //释放标签
          } else {
            //其他浏览器
            navigator.msSaveBlob(response.data, "核素信息.txt");
          }
        })
        .catch(err => {
          alert(err);
        });
    },
    download_spectrum() {
      request({
        url: "/download_spectrum/",
        method: "post",
        data: {
          res_data: this.result
        },
        responseType: "blob"
      })
        .then(response => {
          console.log(response);
          console.log(response.filename);
          if ("download" in document.createElement("a")) {
            //支持a标签download的浏览器
            let url = window.URL.createObjectURL(response.data); //为文件流创建构建下载链接
            let link = document.createElement("a"); //创建a标签
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "能谱信息.txt"); //设置a标签的下载动作和下载文件名
            document.body.appendChild(link);
            link.click(); //执行下载
            document.body.removeChild(link); //释放标签
          } else {
            //其他浏览器
            navigator.msSaveBlob(response.data, "能谱信息.txt");
          }
        })
        .catch(err => {
          alert(err);
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
    post_file(response, file) {
      // let file = document.getElementById("inputGroupFile04").files[0];
      console.log("file:" + file);
      let param = new FormData(); //创建form对象
      param.append("file", file); //通过append向form对象添加数据
      console.log(param.get("file")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去

      let that = this;
      that.start_timing();
      this.source = axios.CancelToken.source();
      request({
        cancelToken: this.source.token,
        method: "post",
        url: "/test/",
        data: param,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(res => {
          that.end_timing();
          console.log("res ==> ", res);
          if (res.data !== "time < 0") {
            console.log("resData" + res.data);
            that.analyze_data(res.data);
            that.data_title = this.get_date();
            localStorage.setItem(this.data_title, JSON.stringify(that.result));
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
    analyze_data(data) {
      this.result = data;
      this.final = data.final;
      for (let key in this.final) {
        let temp = [];
        temp.push(key);
        this.list_final.push(temp.concat(this.final[key]));
      }
      this.spectrum_alpha = data.spectrum_alpha;
      this.spectrum_beta = data.spectrum_beta;
      this.spectrum_gamma = data.spectrum_gamma;
      this.alpha = data.alpha;
      this.beta = data.beta;
      this.gamma = data.gamma;
    },
    clear_data() {
      this.result = [];
      this.final = [];
      this.list_final = [];
      this.spectrum_alpha = {};
      this.spectrum_beta = {};
      this.spectrum_gamma = {};
      this.toggle_download = true;
      this.alpha = [];
      this.beta = [];
      this.gamma = [];
    },
    pageScrollTop() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    get_hist_data(val, key) {
      this.toggle_download = false;
      this.data_title = key;
      this.analyze_data(JSON.parse(val));
    },
    del_hist_data(key) {
      localStorage.removeItem(key);
      location.reload();
    },
    get_date() {
      let date = new Date();
      return date.toLocaleString();
    },
    get_bar_chart(name) {
      let coordinate = [];
      let x = [];
      let label = "";
      if (name === "alpha") {
        coordinate = this.alpha;
        label = "alpha群能谱图";
      }
      if (name === "beta") {
        coordinate = this.beta;
        label = "beta群能谱图";
      }
      if (name === "gamma") {
        coordinate = this.gamma;
        label = "gamma群能谱图";
      }
      for (let i = 0; i < coordinate.length; i++) {
        let a = i * 1e5;
        let b = (i + 1) * 1e5;
        x.push(a + "-" + b);
      }
      this.dp_bar_chart = true;
      if (this.my_bar_chart !== null) {
        this.my_bar_chart.destroy();
      }
      let c = document.getElementById("myBarChart");
      this.my_bar_chart = new Chart(c, {
        type: "bar",
        data: {
          datasets: [
            {
              label: label,
              data: coordinate,
              backgroundColor: "#5c7bd9"
            }
          ],
          labels: x
        }
      });
    },
    get_chart(name) {
      let coordinate = {};
      let label = "";
      if (name === "alpha") {
        coordinate = this.spectrum_alpha;
        label = "alpha能谱图";
      }
      if (name === "beta") {
        coordinate = this.spectrum_beta;
        label = "beta能谱图";
      }
      if (name === "gamma") {
        coordinate = this.spectrum_gamma;
        label = "gamma能谱图";
      }
      this.dp_chart = true;
      if (this.my_chart !== null) {
        this.my_chart.destroy();
      }

      let xy = [];
      for (let key in coordinate) {
        xy.push({ x: key, y: coordinate[key] });
      }

      let c = document.getElementById("myChart");
      this.my_chart = new Chart(c, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: label,
              borderColor: "#26473a",
              pointBackgroundColor: "#26473a",
              data: xy
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                type: "linear",
                position: "bottom",
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    },
    del_item(index, row) {
      console.log(index, row);
      this.nuclides.splice(index, 1);
    },
    is_list: function(object) {
      return typeof object === typeof [];
    },
    get_back: function() {
      this.clear_data();
      this.dp_chart = false;
      this.dp_bar_chart = false;
      if (this.my_chart !== null) {
        this.my_chart.destroy();
      }
      if (this.my_bar_chart !== null) {
        this.my_bar_chart.destroy();
      }
    },
    add: function() {
      let temp = this.nuclides[this.nuclides.length - 1];
      this.nuclides.push({
        nuclide: temp.nuclide,
        num: temp.num,
        time: temp.time
      });
    },
    submit: function() {
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
        url: "/get_tree/",
        data: data
      })
        .then(res => {
          that.end_timing();
          console.log("res ==> ", res);
          console.log(res.data);
          that.analyze_data(res.data);
          that.data_title = this.get_date();
          try {
            localStorage.setItem(this.data_title, JSON.stringify(that.result));
          } catch (e) {
            alert("历史记录存储超出最大限制，请删除部分历史记录");
          }
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
      this.$refs.startTimer.innerHTML =
        (this.minutes < 10 ? "0" + this.minutes : this.minutes) +
        ":" +
        (this.seconds < 10 ? "0" + this.seconds : this.seconds);
    }
  }
};
//防止页面后退
history.pushState(null, null, document.URL);
window.addEventListener("popstate", function() {
  history.pushState(null, null, document.URL);
});
</script>
