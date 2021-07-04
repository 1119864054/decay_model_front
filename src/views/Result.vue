<template>
  <div class="about">
    <div class="row m-2" v-if="result.length!==0">
      <button type="button" class="btn btn-sm btn-outline-info m-2" @click="get_back">返回</button>
      <button type="button" class="btn btn-sm btn-outline-info m-2" @click="download_final">下载核素信息</button>
      <button type="button" class="btn btn-sm btn-outline-info m-2" @click="download_abg">下载能谱信息</button>
    </div>


    <div v-if="result.length!==0">
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><h5 v-text="data_title"></h5></li>
      </ul>
      <table class="table table-hover table-responsive-sm table-sm">
        <thead class="thead-light">
        <tr>
          <th scope="col" v-for="(item,index) in title_list" :key="index" v-text="item.name" @click="sort_list(item)"
              :class="{'text-primary':item.isSelected}"></th>
        </tr>
        </thead>
        <tbody>
        <!--        <tr v-for="list in sortFinal" v-if="list[0] !== 'q' && list[0] !== 'total'">-->
        <!--          <th v-for="(item, key) in list" v-if="key === 0" v-text="item"></th>-->
        <!--          <td v-for="(item, key) in list" v-if="key !== 0" v-text="item"></td>-->
        <!--        </tr>-->
        </tbody>
      </table>
      <table class="table table-hover table-responsive-sm table-sm">
        <thead class="thead-light">
        <tr>
          <th scope="col">核素活度</th>
          <th scope="col">核素质量</th>
          <th scope="col">食入毒性</th>
          <th scope="col">吸入毒性</th>
          <th scope="col">反应总放能</th>
        </tr>
        </thead>
        <tbody>
        <!--        <tr v-for="(list,key) in final">-->
        <!--          <th v-for="item in list" v-text="item" v-if="key === 'total'"></th>-->
        <!--        </tr>-->
        </tbody>
      </table>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><h5>能谱图</h5></li>
        <li class="list-group-item">
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-sm btn-secondary" @click="get_chart('alpha')">alpha能谱图
            </button>
            <button type="button" class="btn btn-sm btn-secondary" @click="get_chart('beta')">beta能谱图
            </button>
            <button type="button" class="btn btn-sm btn-secondary" @click="get_chart('gamma')">gamma能谱图
            </button>
          </div>
        </li>
      </ul>

      <div v-show="dp_chart" class="img-fluid" style="position: relative">
        <canvas id="myChart"></canvas>
      </div>

      <ul class="list-group list-group-flush">
        <li class="list-group-item"><h5>群能谱图</h5></li>
        <li class="list-group-item">
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-sm btn-secondary" @click="get_bar_chart('alpha')">
              alpha群能谱图
            </button>
            <button type="button" class="btn btn-sm btn-secondary" @click="get_bar_chart('beta')">beta群能谱图
            </button>
            <button type="button" class="btn btn-sm btn-secondary" @click="get_bar_chart('gamma')">
              gamma群能谱图
            </button>
          </div>
        </li>
      </ul>

      <div v-show="dp_bar_chart" class="img-fluid" style="position: relative">
        <canvas id="myBarChart"></canvas>
      </div>
    </div>
    <hr/>
  </div>
</template>

<script>
import {request} from "@/network/request";
import Chart from "chart.js";

export default {
  computed: {
    sortFinal: function () {
      return this.sortByKey(this.list_final, this.sort_key);
    }
  },
  methods: {
    sort_list(item) {
      this.sort_key = item.key;
      for (let i = 0; i < this.title_list.length; i++) {
        this.title_list[i].isSelected = false;
      }
      item.isSelected = true;
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
    }, gen_txt(filename, text) {
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
        xy.push({x: key, y: coordinate[key]});
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
    is_list: function (object) {
      return typeof object === typeof [];
    },
    get_back: function () {
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
    }
  }
}
</script>