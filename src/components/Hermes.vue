<template>
  <div class="container">
    <div class="coutry-group">
      <el-radio-group v-model="selected_country" size="small">
        <el-radio-button
          v-for="country in countries"
          :key="country.code"
          :label="country.code"
        >{{country.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <div>
      <el-form ref="form" :model="form" class="form">
        <el-form-item label="Cookie (ECOM_SESS)">
          <el-input autosize v-model="form.cookie" placeholder="cookie"></el-input>
        </el-form-item>

        <el-form-item label="Datadome (datadome)">
          <el-input type="textarea" :rows="3" placeholder="datadome" v-model="form.datadome"></el-input>
        </el-form-item>

        <br />

        <el-button
          style="margin-bottom:30px;"
          class="button"
          type="primary"
          icon="el-icon-plus"
          @click="addProduct"
          size="small"
        >添加产品编号</el-button>
        <br />
        <el-form-item
          :label="`产品编号${index + 1}`"
          :key="index"
          v-for="(prod,index) in form.products"
        >
          <div class="product-container">
            <el-input autosize v-model="form.products[index]" :placeholder="`产品编号${index + 1}`"></el-input>
            <el-button 
          size="small" type="danger" @click.prevent="removeProduct(index)">删除</el-button>
          </div>
        </el-form-item>
        <!-- <el-form-item label="产品编号2">
          <el-input autosize v-model="form.product2" placeholder="产品编号2"></el-input>
        </el-form-item>
        <el-form-item label="产品编号3">
          <el-input autosize v-model="form.product3" placeholder="产品编号3"></el-input>
        </el-form-item>
        <el-form-item label="产品编号4">
          <el-input autosize v-model="form.product4" placeholder="产品编号4"></el-input>
        </el-form-item>
        <el-form-item label="产品编号5">
          <el-input autosize v-model="form.product5" placeholder="产品编号5"></el-input>
        </el-form-item>-->

        <br />
        <el-button
          size="small"
          :icon="!loading ? 'el-icon-shopping-cart-2' : 'el-icon-loading'"
          :disabled="disableAdd"
          @click="addCart"
          class="button"
          type="primary"
        >添加到购物车</el-button>
      </el-form>
    </div>

    <ul>
      <li v-for="(item,idx) of results" :key="idx">
        <i :class="item.success ? 'el-icon-success' : 'el-icon-error'"></i>
        <b>{{item.sku}}</b>
        {{item.message}}
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "Hermes",
  data() {
    return {
      selected_country: "nl_en",
      current_cookie: "",
      current_datadome: "",
      countries: [
        {
          name: "荷兰",
          code: "nl_en",
        },
        {
          name: "中国",
          code: "cn_zh",
        },
        {
          name: "英国",
          code: "uk_en",
        },
        {
          name: "意大利",
          code: "it_it",
        },
        {
          name: "德国",
          code: "de_de",
        },
        {
          name: "法国",
          code: "fr_fr",
        },
        {
          name: "美国",
          code: "us_en",
        },
        {
          name: "加拿大",
          code: "ca_en",
        },
        {
          name: "澳大利亚",
          code: "au_en",
        },
      ],
      form: getStoreByCountry("nl_en"),
      results: [],
      loading:false
    };
  },
  methods: {
    addProduct() {
      this.form.products.push("");
    },
    removeProduct(idx) {
      this.form.products = [
        ...this.form.products.slice(0, idx),
        ...this.form.products.slice(idx + 1),
      ];
    },
    addCart() {
      let body = {
        ...getStoreByCountry(this.selected_country),
        countries: [this.selected_country],
      };

this.results = [];
    this.loading = true;
      this.$http
        .post("/add-to-cart", body)
        .then((res) => {
          this.loading = false;
          this.results = res.data.result || [];
        })
        .catch((error) => {
          this.loading = false;
          document.getElementById("result").innerHTML = error;
        });
    },
  },
  computed: {
    disableAdd() {
      return (
        !this.form.products ||
        this.form.products.length <= 0 ||
        this.form.products.map((p) => p).length <= 0 ||
        !this.form.cookie ||
        !this.form.datadome ||
        this.loading
      );
    },
  },
  watch: {
    "form.cookie": function (newcookie) {
      updateStoreByCountry(this.selected_country, "cookie", newcookie);
    },
    "form.datadome": function (newdata) {
      updateStoreByCountry(this.selected_country, "datadome", newdata);
    },
    "form.products": function (products) {
      updateStoreByCountry(this.selected_country, "products", products);
    },
    selected_country: function (value) {
      this.form = getStoreByCountry(this.selected_country);
    },
  },
};

function getStoreByCountry(country) {
  let dataStr = window.sessionStorage.getItem(country),
    data = {
      cookie: "",
      datadome: "",
      products: [],
    };

  if (!dataStr) {
    window.sessionStorage.setItem(country, JSON.stringify(data));
  } else {
    try {
      data = JSON.parse(dataStr);
    } catch (error) {
      console.log(error);
    }
  }

  return data;
}

function updateStoreByCountry(country, key, value) {
  let data = getStoreByCountry(country);

  data[key] = value;

  window.sessionStorage.setItem(country, JSON.stringify(data));
}

/* eslint-enable */
</script>

<style scoped>
.container {
  max-width: 800px;
  display: inline-block;
}

.coutry-group {
  margin-bottom: 30px;
}

.form {
  text-align: left;
}

.product-container {
  display: flex;
}

.product-container button {
  margin-left: 8px;
}

ul {
  text-align: left;
  padding-left: 16px;
  list-style: none;
}

.el-icon-success {
  color: #67c23a;
  font-size: 1.3rem;
}

.el-icon-error {
  color: #f56c6c;
  font-size: 1.3rem;
}

ul li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* font-size: 1.2rem; */
}

ul li i {
  margin-right: 8px;
}

ul li b {
  margin-right: 8px;
}
</style>>
