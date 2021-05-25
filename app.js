const app = {
	data() {
		return {
			productData: [],
			url: "https://vue3-course-api.hexschool.io",
			path: "sec-hexschool",
			modalStatus: null,
			deleteText: "",
			newProductForm: {
				imageUrl: "",
				imagesUrl: [],
				title: "",
				category: "",
				unit: "",
				description: "",
				content: "",
				price: 0,
				origin_price: 0,
				is_enabled: false,
			},
		};
	},
	methods: {
		getData() {
			const token = document.cookie.replace(
				/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
				"$1"
			);
			axios.defaults.headers.common["Authorization"] = token;
			axios
				.post(`${this.url}/api/user/check`)
				.then(res => {
					const { message, success } = res.data;
					if (!success) throw new Error(message);
					return axios.get(
						`${this.url}/api/${this.path}/admin/products`
					);
				})
				.then(res => {
					const { success, products } = res.data;
					if (!success) {
						throw new Error("Failed to fetch data!");
					}
					this.productData = products;
				})
				.catch(err => {
					alert(err);
				});
		},
		modal(id, option = "show") {
			const modal = new bootstrap.Modal(document.getElementById(id), {
				keyboard: false,
				backdrop: "static",
			});
			if (option === "hide") return modal.hide();
			return modal.show();
		},
		addImg() {
			this.newProductForm.imagesUrl = [];
			this.newProductForm.imagesUrl.push("");
		},
		addCarouselImg() {
			this.newProductForm.imagesUrl.push("");
		},
		deleteCarouselImg() {
			const imgUrl = this.newProductForm.imagesUrl;
			imgUrl.splice(imgUrl.length - 1, 1);
		},
		sendRequest(method, product) {
			let url;
			const productData = { data: { ...product } };
			if (method === "put") {
				url = `${this.url}/api/${this.path}/admin/product/${product.id}`;
			}

			if (method === "post") {
				url = `${this.url}/api/${this.path}/admin/product`;
			}

			if (method === "delete") {
				url = `${this.url}/api/${this.path}/admin/product/${product.id}`;
			}

			axios[method](url, productData)
				.then(res => {
					const { message, success } = res.data;
					if (!success) throw new Error(message);
					alert(message);
					this.modal("productModal", "hide");
					this.getData();
				})
				.catch(err => {
					alert(err.message);
				});
		},
		openModal(type, product) {
			if (type === "new") {
				this.modalStatus = "new";
				this.modal("productModal");
				this.newProductForm = {};
			}

			if (type === "edit") {
				this.modalStatus = "edit";
				this.modal("productModal");
				this.newProductForm = {
					...product,
				};
			}

			if (type === "delete") {
				this.modalStatus = "delete";
				this.deleteText = product.title;
				this.modal("delProductModal");
				this.newProductForm = {
					...product,
				};
			}
		},
		submitModalData() {
			if (this.modalStatus === "edit") {
				this.sendRequest("put", this.newProductForm);
			}
			if (this.modalStatus === "new") {
				this.sendRequest("post", this.newProductForm);
			}
			if (this.modalStatus === "delete") {
				this.sendRequest("delete", this.newProductForm);
			}
		},
		clearModalData() {
			this.newProductForm = {
				imageUrl: "",
				imagesUrl: [],
				title: "",
				category: "",
				unit: "",
				description: "",
				content: "",
				price: 0,
				origin_price: 0,
				is_enabled: false,
			};
			this.modal("productModal", "hide");
		},
	},
	created() {
		this.getData();
	},
};

Vue.createApp(app).mount("#app");
