let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
	data() {
		return {
			propsType: "",
			productData: [],
			url: "https://vue3-course-api.hexschool.io",
			path: "sec-hexschool",
		};
	},
	methods: {
		async getData(page = 1) {
			const url = `${this.url}/api/${this.path}/admin/products?page=${page}`;
			try {
				const resData = await axios.get(url);
				console.log(resData);
				const { products, success } = resData.data;
				this.productData = products;
			} catch (error) {
				// console.log();
			}
		},
		openModal(type) {
			if (type === "new") this.propsType = "new";
		},
	},
	mounted() {
		const token = document.cookie.replace(
			/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
			"$1"
		);

		if (!token) console.log("wrong token");
		axios.defaults.headers.common["Authorization"] = token;

		this.getData();
	},
});

app.component("modal", {
	props: ["type"],
	template: "#modal",
	mounted() {
		productModal = new bootstrap.Modal(
			document.getElementById("productModal"),
			{
				keyboard: false,
			}
		);
		delProductModal = new bootstrap.Modal(
			document.getElementById("productModal"),
			{
				keyboard: false,
			}
		);

		console.log(productModal);
	},
});

app.mount("#app");
