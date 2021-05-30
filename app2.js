let productModal = null;
let delProductModal = null;
const apiUrl = "https://vue3-course-api.hexschool.io";
const apiPath = "sec-hexschool";

const app = Vue.createApp({
	data() {
		return {
			productForm: {
				imageUrl: "",
				imagesUrl: [],
				content: "",
				title: "",
				origin_price: 0,
				price: 0,
				description: "",
				is_enabled: false,
				unit: "",
				category: "",
			},
			modalStatus: "",
			productData: [],
			pagination: {},
		};
	},
	methods: {
		async getData(page = 1) {
			const url = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`;
			try {
				const resData = await axios.get(url);
				const { products, success, pagination, message } = resData.data;
				if (!success) throw new Error(message);
				this.productData = products;
				this.pagination = pagination;
			} catch (error) {
				alert(error.message);
			}
		},
		openModal(type, product) {
			if (type === "new") {
				this.modalStatus = "new";
				this.productForm = { imagesUrl: [] };
				productModal.show();
			}

			if (type === "edit") {
				this.modalStatus = "edit";
				this.productForm = { ...product };
				productModal.show();
			}

			if (type === "delete") {
				this.modalStatus = "delete";
				this.productForm = { ...product };
				delProductModal.show();
			}
		},
	},
	mounted() {
		const token = document.cookie.replace(
			/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
			"$1"
		);

		if (!token) window.location = "index.html";
		axios.defaults.headers.common["Authorization"] = token;

		this.getData();
	},
});

app.component("modal", {
	props: ["modalStatus", "productForm"],
	template: "#modal",
	data() {
		return {};
	},
	methods: {
		addImg() {
			this.productForm.imagesUrl.push("");
		},
		addCarouselImg() {
			this.productForm.imagesUrl.push("");
		},
		removeCarouselImg() {
			this.productForm.imagesUrl.pop();
		},
		async submitForm() {
			let url, method, productData;

			if (this.modalStatus === "new") {
				method = "post";
				url = `${apiUrl}/api/${apiPath}/admin/product`;
				productData = { ...this.productForm };
			}

			if (this.modalStatus === "edit") {
				method = "put";
				url = `${apiUrl}/api/${apiPath}/admin/product/${this.productForm.id}`;
				productData = { ...this.productForm };
			}

			try {
				const resData = await axios[method](url, {
					data: productData,
				});
				const { success, message } = resData.data;
				if (!success) throw new Error(message);
				productModal.hide();
				this.$emit("fetchData");
			} catch (error) {
				alert(error);
			}
		},
	},
	mounted() {
		productModal = new bootstrap.Modal(
			document.getElementById("productModal")
		);
	},
});

app.component("delModal", {
	template: "#delModal",
	props: ["formData"],
	methods: {
		async delProduct() {
			const url = `${apiUrl}/api/${apiPath}/admin/product/${this.formData.id}`;
			try {
				const resData = await axios.delete(url);
				const { success, message } = resData.data;
				if (!success) throw new Error(message);
				delProductModal.hide();
				this.$emit("fetchData");
				console.log(resData);
			} catch (error) {
				alert(error.message);
			}
		},
	},
	mounted() {
		delProductModal = new bootstrap.Modal(
			document.getElementById("delProductModal")
		);
	},
});

app.component("pagination", {
	props: ["pagination"],
	template: "#pagination",
	methods: {
		getData(page) {
			this.$emit("fetchData", page);
		},
		prev() {
			const page = this.pagination["current_page"] - 1;
			this.$emit("fetchData", page);
		},
		next() {
			const page = this.pagination["current_page"] + 1;
			this.$emit("fetchData", page);
		},
	},
});

app.mount("#app");
