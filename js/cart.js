// import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.prod.min.js"

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io';
const api_path = 'blacknwhiterabbit';

const productModal = {
  //當id變動後取得遠端資料，並呈現modal
  props:['id','addToCart','openModal'],
  data(){
    return {
      modal:{},
      tempProduct: {},
      qty: 1,
    }
  },
  template: '#userProductModal',
  mounted(){
    this.modal = new bootstrap.Modal(this.$refs.modal);
    this.$refs.modal.addEventListener('hidden.bs.modal',()=>{
      
      this.openModal('');
    })
  },
  watch:{
    id(){
      console.log("productModal",this.id)
      axios.get(`${apiUrl}/v2/api/${api_path}/product/${this.id}`)
        .then(res=>{
          
          this.tempProduct = res.data.product;
          this.modal.show()
        })
        .catch((err) => {
          alert(err.response.data.message);
        });

    }
  },
  methods: {
    hide(){
      this.modal.hide();
    }
  }
}

const app = Vue.createApp({
  data(){
    return {
      products: [],
      productId: "",
      cart: {},
      loadingItem:'',//存id
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    }
  },
  methods:{
    getProducts(){
      axios.get(`${apiUrl}/v2/api/${api_path}/products`)
        .then(res=>{
          
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal(id){
      this.loadingItem = id;
      this.productId = id;
      
    },
    addToCart(product_id,qty = 1){
      this.loadingItem = id;
      const data = {
        product_id,
        qty
      }
      axios.post(`${apiUrl}/v2/api/${api_path}/cart`,{ data })
        .then(res=>{
          
          this.$refs.productModal.hide();
          this.getCarts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getCarts(){
      axios.get(`${apiUrl}/v2/api/${api_path}/cart`)
        .then(res=>{
          
          this.cart = res.data.data;
        })
    },
    updateCartItem(item){
      const data = {
        product_id: item.product.id,
        qty: item.qty
      }
      this.loadingItem = item.id;
      axios.put(`${apiUrl}/v2/api/${api_path}/cart/${item.id}`,{ data })
        .then(res=>{
          
          this.loadingItem = '';
          this.getCarts();
        })
        .catch((err) => {
          alert(err.response.data.message);
          this.loadingItem = '';
        });
    },
    deleteItem(item){
      this.loadingItem = item.id;
      axios.delete(`${apiUrl}/v2/api/${api_path}/cart/${item.id}`)
        .then(res=>{
          
          this.loadingItem = '';  
          this.getCarts();  
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    deleteAllCarts(){
      axios.delete(`${apiUrl}/v2/api/${api_path}/carts`)
        .then(res=>{
          
          this.getCarts();  
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    createOrder() {
      const url = `${apiUrl}/v2/api/${api_path}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        alert(response.data.message);
        this.$refs.form.resetForm();
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
  },
  components:{
    productModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  mounted(){
    this.getProducts();
    this.getCarts();
  }
})

app.mount("#app")