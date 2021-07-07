<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :xl="24" :lg="24">
          <div class="row m-2">
            <button
              type="button"
              class="btn btn-sm btn-outline-info m-2"
              @click="get_back"
            >
              返回
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-info m-2"
              @click="exportExcel"
            >
              下载核素信息
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-info m-2"
              @click="download_abg"
            >
              下载能谱信息
            </button>
          </div>
        </el-col>
      </el-row>

      <el-divider content-position="left">核素数量表</el-divider>

      <el-row>
        <el-col :xl="24" :lg="24">
          <el-table
            :data="table_data_sl"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            id="table1"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="核素名称"></el-table-column>
            <el-table-column prop="zzs" label="质子数" sortable>
            </el-table-column>
            <el-table-column prop="zls" label="质量数" sortable>
            </el-table-column>
            <el-table-column label="数量  时间(s)">
              <el-table-column
                v-for="(item, index) in times"
                :key="index"
                :prop="item.toString()"
                :label="item.toString()"
                sortable
                :formatter="formatter"
              >
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
        <div id="myChart1" :style="{width: '100%', height: '700px'}"></div>
      </el-row>
      <el-divider content-position="left">核素活度表</el-divider>
      <el-row>
        <el-col :xl="24" :lg="24">
          <el-table
            :data="table_data_hd"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            id="table2"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="核素名称"></el-table-column>
            <el-table-column prop="zzs" label="质子数" sortable>
            </el-table-column>
            <el-table-column prop="zls" label="质量数" sortable>
            </el-table-column>
            <el-table-column label="活度  时间(s)">
              <el-table-column
                v-for="(item, index) in times"
                :key="index"
                :prop="item.toString()"
                :label="item.toString()"
                sortable
                :formatter="formatter"
              >
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-divider content-position="left">核素质量表</el-divider>
      <el-row>
        <el-col :xl="24" :lg="24">
          <el-table
            :data="table_data_zl"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            id="table3"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="核素名称"></el-table-column>
            <el-table-column prop="zzs" label="质子数" sortable>
            </el-table-column>
            <el-table-column prop="zls" label="质量数" sortable>
            </el-table-column>
            <el-table-column label="数量  时间(s)">
              <el-table-column
                v-for="(item, index) in times"
                :key="index"
                :prop="item.toString()"
                :label="item.toString()"
                sortable
                :formatter="formatter"
              >
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-divider content-position="left">食入毒性表</el-divider>
      <el-row>
        <el-col :xl="24" :lg="24">
          <el-table
            :data="table_data_srdx"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            id="table4"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="核素名称"></el-table-column>
            <el-table-column prop="zzs" label="质子数" sortable>
            </el-table-column>
            <el-table-column prop="zls" label="质量数" sortable>
            </el-table-column>
            <el-table-column label="数量  时间(s)">
              <el-table-column
                v-for="(item, index) in times"
                :key="index"
                :prop="item.toString()"
                :label="item.toString()"
                sortable
                :formatter="formatter"
              >
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>

        <!--        <ul class="list-group list-group-flush">-->
        <!--          <li class="list-group-item"><h5 v-text="data_title"></h5></li>-->
        <!--        </ul>-->
        <!--        <table class="table table-hover table-responsive-sm table-sm">-->
        <!--          <thead class="thead-light">-->
        <!--          <tr>-->
        <!--            <th scope="col" v-for="(item,index) in title_list" :key="index" v-text="item.name"-->
        <!--                @click="sort_list(item)"-->
        <!--                :class="{'text-primary':item.isSelected}"></th>-->
        <!--          </tr>-->
        <!--          </thead>-->
        <!--          <tbody>-->
        <!--          </tbody>-->
        <!--        </table>-->
        <!--        <table class="table table-hover table-responsive-sm table-sm">-->
        <!--          <thead class="thead-light">-->
        <!--          <tr>-->
        <!--            <th scope="col">核素活度</th>-->
        <!--            <th scope="col">核素质量</th>-->
        <!--            <th scope="col">食入毒性</th>-->
        <!--            <th scope="col">吸入毒性</th>-->
        <!--            <th scope="col">反应总放能</th>-->
        <!--          </tr>-->
        <!--          </thead>-->
        <!--          <tbody>-->
        <!--          &lt;!&ndash;        <tr v-for="(list,key) in final">&ndash;&gt;-->
        <!--          &lt;!&ndash;          <th v-for="item in list" v-text="item" v-if="key === 'total'"></th>&ndash;&gt;-->
        <!--          &lt;!&ndash;        </tr>&ndash;&gt;-->
        <!--          </tbody>-->
        <!--        </table>-->
      </el-row>
      <el-divider content-position="left">吸入毒性表</el-divider>
      <el-row>
        <el-col :xl="24" :lg="24">
          <el-table
            :data="table_data_xrdx"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            id="table5"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="核素名称"></el-table-column>
            <el-table-column prop="zzs" label="质子数" sortable>
            </el-table-column>
            <el-table-column prop="zls" label="质量数" sortable>
            </el-table-column>
            <el-table-column label="数量  时间(s)">
              <el-table-column
                v-for="(item, index) in times"
                :key="index"
                :prop="item.toString()"
                :label="item.toString()"
                sortable
                :formatter="formatter"
              >
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>

        <!--        <ul class="list-group list-group-flush">-->
        <!--          <li class="list-group-item"><h5 v-text="data_title"></h5></li>-->
        <!--        </ul>-->
        <!--        <table class="table table-hover table-responsive-sm table-sm">-->
        <!--          <thead class="thead-light">-->
        <!--          <tr>-->
        <!--            <th scope="col" v-for="(item,index) in title_list" :key="index" v-text="item.name"-->
        <!--                @click="sort_list(item)"-->
        <!--                :class="{'text-primary':item.isSelected}"></th>-->
        <!--          </tr>-->
        <!--          </thead>-->
        <!--          <tbody>-->
        <!--          </tbody>-->
        <!--        </table>-->
        <!--        <table class="table table-hover table-responsive-sm table-sm">-->
        <!--          <thead class="thead-light">-->
        <!--          <tr>-->
        <!--            <th scope="col">核素活度</th>-->
        <!--            <th scope="col">核素质量</th>-->
        <!--            <th scope="col">食入毒性</th>-->
        <!--            <th scope="col">吸入毒性</th>-->
        <!--            <th scope="col">反应总放能</th>-->
        <!--          </tr>-->
        <!--          </thead>-->
        <!--          <tbody>-->
        <!--          &lt;!&ndash;        <tr v-for="(list,key) in final">&ndash;&gt;-->
        <!--          &lt;!&ndash;          <th v-for="item in list" v-text="item" v-if="key === 'total'"></th>&ndash;&gt;-->
        <!--          &lt;!&ndash;        </tr>&ndash;&gt;-->
        <!--          </tbody>-->
        <!--        </table>-->
      </el-row>
      <el-divider content-position="left">反应放能表</el-divider>
      <el-row>
        <el-col :xl="24" :lg="24">
          <el-table
            :data="table_data_fyfn"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            id="table6"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="核素名称"></el-table-column>
            <el-table-column prop="zzs" label="质子数" sortable>
            </el-table-column>
            <el-table-column prop="zls" label="质量数" sortable>
            </el-table-column>
            <el-table-column label="数量  时间(s)">
              <el-table-column
                v-for="(item, index) in times"
                :key="index"
                :prop="item.toString()"
                :label="item.toString()"
                sortable
                :formatter="formatter"
              >
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>

        <!--        <ul class="list-group list-group-flush">-->
        <!--          <li class="list-group-item"><h5 v-text="data_title"></h5></li>-->
        <!--        </ul>-->
        <!--        <table class="table table-hover table-responsive-sm table-sm">-->
        <!--          <thead class="thead-light">-->
        <!--          <tr>-->
        <!--            <th scope="col" v-for="(item,index) in title_list" :key="index" v-text="item.name"-->
        <!--                @click="sort_list(item)"-->
        <!--                :class="{'text-primary':item.isSelected}"></th>-->
        <!--          </tr>-->
        <!--          </thead>-->
        <!--          <tbody>-->
        <!--          </tbody>-->
        <!--        </table>-->
        <!--        <table class="table table-hover table-responsive-sm table-sm">-->
        <!--          <thead class="thead-light">-->
        <!--          <tr>-->
        <!--            <th scope="col">核素活度</th>-->
        <!--            <th scope="col">核素质量</th>-->
        <!--            <th scope="col">食入毒性</th>-->
        <!--            <th scope="col">吸入毒性</th>-->
        <!--            <th scope="col">反应总放能</th>-->
        <!--          </tr>-->
        <!--          </thead>-->
        <!--          <tbody>-->
        <!--          &lt;!&ndash;        <tr v-for="(list,key) in final">&ndash;&gt;-->
        <!--          &lt;!&ndash;          <th v-for="item in list" v-text="item" v-if="key === 'total'"></th>&ndash;&gt;-->
        <!--          &lt;!&ndash;        </tr>&ndash;&gt;-->
        <!--          </tbody>-->
        <!--        </table>-->
      </el-row>
      <el-divider content-position="left">各种图</el-divider>
      <div v-for="(item, index) in times"
            :key="index"
      >
        <el-divider content-position="left">{{item}}</el-divider>
        <el-row>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><h5>能谱图</h5></li>
            <li class="list-group-item">
              <div class="btn-group" role="group" aria-label="Basic example">
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click="get_chart('alpha', item)"
                >
                  alpha能谱图
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click="get_chart('beta', item)"
                >
                  beta能谱图
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click="get_chart('gamma', item)"
                >
                  gamma能谱图
                </button>
              </div>
            </li>
          </ul>
        </el-row>
        <el-row style="height: 800px; width: 1920px">
          <div v-show="dp_chart" id="myChart" style="height: 800px; width: 1920px"></div>
        </el-row>
        <el-row>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><h5>群能谱图</h5></li>
            <li class="list-group-item">
              <div class="btn-group" role="group" aria-label="Basic example">
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click="get_bar_chart('alpha', item)"
                >
                  alpha群能谱图
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click="get_bar_chart('beta', item)"
                >
                  beta群能谱图
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click="get_bar_chart('gamma', item)"
                >
                  gamma群能谱图
                </button>
              </div>
            </li>
          </ul>

          <el-row style="height: 800px; width: 1920px">
            <div v-show="dp_bar_chart" id="myBarChart" style="height: 800px; width: 1920px"></div>
          </el-row>
        </el-row>
      </div>


    </el-main>
  </el-container>
</template>

<script>
import { request } from "@/network/request";
import store from "@/store";
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import Echarts from 'echarts'

export default {
  components: {
    // "v-chart": ECharts
  },
  data() {
    return {
      table_data_sl: [],
      table_data_hd: [],
      table_data_zl: [],
      table_data_srdx: [],
      table_data_xrdx: [],
      table_data_fyfn: [],
      times: [],
      dp_chart: false,
      dp_bar_chart: false,
      data_title: "Test",
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
      ],
      table_1_legend: [],
      table_1_xAxis: [],
      table_1_series: [],
      pic: {}
    };
  },
  created() {
    let data = store.getters.getResult.data;
    let pic = store.getters.getResult.picture
    this.analyze_data(data);
    this.analyze_pic(pic);
  },
  computed: {
    sortFinal: function() {
      return this.sortByKey(this.list_final, this.sort_key);
    }
  },
  methods: {
    draw_table(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = Echarts.init(document.getElementById('myChart1'))
      // 绘制图表
      myChart.setOption({
        legend: {
          data: this.table_1_legend
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.table_1_xAxis
        },
        yAxis: {
          type:'value',
        },
        series: this.table_1_series,
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {show: true}
          }
        }
    });
    },
    get_chart(name, time) {
      let temp = {}
      for (let i in this.pic){
        if (parseFloat(i) === parseFloat(time)) {
          temp = this.pic[i]
          break
        }
      }
      let coordinate = {};
      let label = "";
      if (name === "alpha") {
        coordinate = temp.spectrum_alpha;
        label = "alpha能谱图";
      }
      if (name === "beta") {
        coordinate = temp.spectrum_beta;
        label = "beta能谱图";
      }
      if (name === "gamma") {
        coordinate = temp.spectrum_gamma;
        label = "gamma能谱图";
      }
      console.log('coordinate:', coordinate)
      this.dp_chart = true;
      // if (this.my_chart !== null) {
      //   this.my_chart.despose();
      // }

      let xy = [];
      for (let key in coordinate) {
        xy.push([key, coordinate[key]]);
      }
      let my_chart = Echarts.init(document.getElementById('myChart'))
      my_chart.setOption({
        name: label,
        xAxis: {},
        yAxis: {},
        series: [{
          symbolSize: 20,
          data: xy,
          type: 'scatter'
        }],
        color: '#768CD0',
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {show: true}
          }
        },
        tooltip: {
          trigger: 'axis'
        },
      });
    },
    get_bar_chart(name, time) {
      let temp = {}
      for (let i in this.pic){
        if (parseFloat(i) === parseFloat(time)) {
          temp = this.pic[i]
          break
        }
      }
      let coordinate = [];
      let x = [];
      let label = "";
      if (name === "alpha") {
        coordinate = temp.alpha;
        label = "alpha群能谱图";
      }
      if (name === "beta") {
        coordinate = temp.beta;
        label = "beta群能谱图";
      }
      if (name === "gamma") {
        coordinate = temp.gamma;
        label = "gamma群能谱图";
      }
      for (let i = 0; i < coordinate.length; i++) {
        let a = i * 1e5;
        let b = (i + 1) * 1e5;
        x.push(a + "-" + b);
      }
      this.dp_bar_chart = true;


      let my_bar_chart = Echarts.init(document.getElementById('myBarChart'));
      my_bar_chart.setOption({
        name: label,
        xAxis: {
          type: 'category',
          data: x
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: coordinate,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }],
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {show: true}
          }
        },
        tooltip: {
          trigger: 'axis'
        },
      })
    },
    exportExcel() {
      /* generate workbook object from table */
      const wb = XLSX.utils.book_new();
      let sheet1 = XLSX.utils.table_to_sheet(document.querySelector("#table1"));
      let sheet2 = XLSX.utils.table_to_sheet(document.querySelector("#table2"));
      let sheet3 = XLSX.utils.table_to_sheet(document.querySelector("#table3"));
      let sheet4 = XLSX.utils.table_to_sheet(document.querySelector("#table4"));
      let sheet5 = XLSX.utils.table_to_sheet(document.querySelector("#table5"));
      let sheet6 = XLSX.utils.table_to_sheet(document.querySelector("#table6"));
      /* get binary string as output */

      XLSX.utils.book_append_sheet(wb, sheet1, "核素数量");
      XLSX.utils.book_append_sheet(wb, sheet2, "核素活度");
      XLSX.utils.book_append_sheet(wb, sheet3, "核素质量");
      XLSX.utils.book_append_sheet(wb, sheet4, "食入毒性");
      XLSX.utils.book_append_sheet(wb, sheet5, "吸入毒性");
      XLSX.utils.book_append_sheet(wb, sheet6, "反应放能");

      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "核素信息.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    sortByKey(a, b) {
      let x = parseFloat(b);
      let y = parseFloat(a);
      return x - y;
    },
    analyze_data(data) {
      // console.log('data:', data)
      let hs = data.hesu;
      let zzs = data.zhizishu;
      let zls = data.zhiliangshu;
      let sl = data.shuliang;
      let hd = data.huodu;
      let zl = data.zhiliang;
      let srdx = data.shiruduxing;
      let xrdx = data.xiruduxing;
      let fyfn = data.fanyingfangneng;
      this.times = data.times;
      // console.log(this.sl)

      for (let i = 0; i < hs.length; i++) {
        let temp_sl = {};
        let temp_hd = {};
        let temp_zl = {};
        let temp_srdx = {};
        let temp_xrdx = {};
        let temp_fyfn = {};
        temp_sl.name = hs[i];
        temp_hd.name = hs[i];
        temp_zl.name = hs[i];
        temp_srdx.name = hs[i];
        temp_xrdx.name = hs[i];
        temp_fyfn.name = hs[i];
        temp_sl.zzs = zzs[0][i];
        temp_hd.zzs = zzs[0][i];
        temp_zl.zzs = zzs[0][i];
        temp_srdx.zzs = zzs[0][i];
        temp_xrdx.zzs = zzs[0][i];
        temp_fyfn.zzs = zzs[0][i];
        temp_sl.zls = zls[0][i];
        temp_hd.zls = zls[0][i];
        temp_zl.zls = zls[0][i];
        temp_srdx.zls = zls[0][i];
        temp_xrdx.zls = zls[0][i];
        temp_fyfn.zls = zls[0][i];
        for (let j = 0; j < this.times.length; j++) {
          temp_sl[this.times[j].toString()] = parseFloat(sl[j][i]);
          temp_hd[this.times[j].toString()] = parseFloat(hd[j][i]);
          temp_zl[this.times[j].toString()] = parseFloat(zl[j][i]);
          temp_srdx[this.times[j].toString()] = parseFloat(srdx[j][i]);
          temp_xrdx[this.times[j].toString()] = parseFloat(xrdx[j][i]);
          temp_fyfn[this.times[j].toString()] = parseFloat(fyfn[j][i]);
        }
        this.table_data_sl.push(temp_sl);
        this.table_data_hd.push(temp_hd);
        this.table_data_zl.push(temp_zl);
        this.table_data_srdx.push(temp_srdx);
        this.table_data_xrdx.push(temp_xrdx);
        this.table_data_fyfn.push(temp_fyfn);
      }

      // this.result = data;
      // this.final = data.final;
      // for (let key in this.final) {
      //   let temp = [];
      //   temp.push(key);
      //   this.list_final.push(temp.concat(this.final[key]));
      // }
      // this.spectrum_alpha = data.spectrum_alpha;
      // this.spectrum_beta = data.spectrum_beta;
      // this.spectrum_gamma = data.spectrum_gamma;
      // this.alpha = data.alpha;
      // this.beta = data.beta;
      // this.gamma = data.gamma;
    },
    analyze_pic(data) {
      console.log('data:', data)
      this.pic = data;

      // this.result = data;
      // this.final = data.final;
      // for (let key in this.final) {
      //   let temp = [];
      //   temp.push(key);
      //   this.list_final.push(temp.concat(this.final[key]));
      // }
      // this.spectrum_alpha = data.spectrum_alpha;
      // this.spectrum_beta = data.spectrum_beta;
      // this.spectrum_gamma = data.spectrum_gamma;
      // this.alpha = data.alpha;
      // this.beta = data.beta;
      // this.gamma = data.gamma;
    },
    formatter(row, column, cellValue) {
      return parseFloat(cellValue).toExponential(6);
    },
    handleSelectionChange(val) {
      let myChart = Echarts.init(document.getElementById('myChart1'))
      myChart.dispose()
      this.table_1_legend = [];
      this.table_1_xAxis = [];
      this.table_1_series = [];
      for (let i in val) {
        for (let j in val[i]) {
          if (j !== 'name' && j !== 'zls' && j !== 'zzs') {
            this.table_1_xAxis.push(j);
          }
        }
        break;
      }
      for (let i in val) {
        this.table_1_legend.push(val[i].name);
        let y_data = [];
        for (let j in val[i]) {
          if (j !== 'name' && j !== 'zls' && j !== 'zzs'){
            y_data.push(val[i][j].toExponential(6));
          }
        }
        this.table_1_series.push({
          name: val[i].name,
          data: y_data,
          type: 'line',
          smooth: true
        })
      }
      this.draw_table();
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
    }
  }
};
</script>
<style>
.my-chart {
  width: 800px;
  height: 500px;
}
</style>