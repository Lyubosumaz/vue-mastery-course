Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">

                <div class="product-image">
                    <img v-bind:src="image" alt="">
                    <a v-bind:href="link">Vue Mastery Courses</a>
                </div>

                <div class="product-info">
                    <h1>{{ title }}</h1>

                    <p>{{ description ? description.join(' ') : '' }}</p>
                    <p v-if="inventory > 10">In Stock <span v-show="sale">On Sale!</span></p>
                    <p v-else-if="inventory <= 10 && inventory > 0">Almost out of stock <span v-show="sale">On Sale!</span></p>
                    <p v-else
                        v-bind:style="{ 'text-decoration': 'line-through' }">Out of Stock</p>
                    <p>User is premium: {{ shipping }}</p>    
                    
                    <product-details v-bind:details="details"></product-details>

                    <div>
                        <ul>
                            <li v-for="size in sizes">{{ size }}</li>
                        </ul>

                        <div v-for="(variant, index) in variants"
                            v-bind:key="variant.variantId"
                            class="color-box"
                            v-bind:style="{ 'background-color': variant.variantColor }"
                            v-on:mouseover="updateProduct(index)">
                        </div>
                    </div>

                    <button v-on:click="addToCart"
                            v-bind:disabled="!inventory"
                            v-bind:class="{ 'disabled-button': !inventory }">Add to cart</button>
                    <button v-on:click="removeFromCart">Remove from cart</button>
                </div>

                <div>
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews">
                            <p>{{ review.name }}</p>
                            <p>{{ review.rating }}</p>
                            <p>{{ review.review }}</p>
                        </li>
                    </ul>
                </div>

                <product-review @review-submitted="addReview"></product-review>

            </div>
        `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            description: ['Quod', 'ipsum', 'maxime', 'eos', 'tempore', 'ullam', 'eaquem', 'dolorum', ',', 'accusamus', 'distinctio', 'sunt,', 'dignissimos', 'voluptatem', 'ad!'],
            selectedVariant: 0,
            link: 'https://www.vuemastery.com/courses/intro-to-vue-js ',
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './images/vmSocks-green.png',
                    onSale: true,
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './images/vmSocks-blue.png',
                    onSale: false,
                    variantQuantity: 0
                },
                {
                    variantId: 2236,
                    variantColor: 'red',
                    variantImage: './images/multicolor.jpg',
                    onSale: false,
                    variantQuantity: 100
                }
            ],
            sizes: ['M', 'L', 'XL', 'XXL'],
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart: function () {
            this.$emit('remove-from-cart')
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        },
        addReview: function (productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title: function () {
            return this.brand + ' ' + this.product
        },
        image: function () {
            return this.variants[this.selectedVariant].variantImage
        },
        inventory: function () {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale: function () {
            return this.variants[this.selectedVariant].onSale
        },
        shipping: function () {
            if (this.premium) {
                return 'Free'
            } else {
                return "$3.99"
            }
        }
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" v-on:submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Please correct the following error(s)</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
            
        <p>
        <input type="submit" value="Submit">  
        </p>    

    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit: function () {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push("Name is required")
                if (!this.review) this.errors.push("Review is required")
                if (!this.rating) this.errors.push("Rating is required")
            }
        }
    }
})

Vue.config.devtools = true
var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        addToCart: function (id) {
            this.cart.push(id)
        },
        removeFromCart: function () {
            this.cart.splice(-1, 1)
        }
    }
})
