let productModal, delProductModal;

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
		verifyUser() {
			axios
				.post(`${this.url}/api/user/check`)
				.then(res => {
					const { message, success } = res.data;
					if (!success) throw new Error(message);
				})
				.catch(err => {
					alert(err.message);
				});
		},
		getData() {
			axios
				.get(`${this.url}/api/${this.path}/admin/products`)
				.then(res => {
					const { products, success } = res.data;
					if (!success)
						throw new Error(
							"Failed to fetch data, Please try again later!"
						);
					this.productData = products;
				})
				.catch(err => {
					alert(err.message);
				});
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
					productModal.hide();
					this.getData();
				})
				.catch(err => {
					alert(err.message);
				});
		},
		openModal(type, product) {
			if (type === "new") {
				this.modalStatus = "new";
				productModal.show();
				this.newProductForm = {};
			}

			if (type === "edit") {
				this.modalStatus = "edit";
				productModal.show();
				this.newProductForm = {
					...product,
				};
			}

			if (type === "delete") {
				this.modalStatus = "delete";
				this.deleteText = product.title;
				delProductModal.show();
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
			productModal.hide();
		},
	},
	async mounted() {
		const token = document.cookie.replace(
			/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
			"$1"
		);

		if (!token) window.location = "index.html";
		axios.defaults.headers.common["Authorization"] = token;

		productModal = new bootstrap.Modal(
			document.getElementById("productModal")
		);
		delProductModal = new bootstrap.Modal(
			document.getElementById("delProductModal")
		);

		try {
			await this.verifyUser();
			await this.getData();
		} catch (error) {
			alert(error.message);
		}
	},
};

Vue.createApp(app).mount("#app");
