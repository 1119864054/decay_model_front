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
