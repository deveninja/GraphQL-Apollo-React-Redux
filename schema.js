const axios = require('axios')


const {
   GraphQLObjectType,
   GraphQLInt,
   GraphQLString,
   GraphQLList,
   GraphQLSchema,
   GraphQLNonNull
} = require('graphql')



// Customer Type
const ProductType = new GraphQLObjectType({
   name: 'Product',
   fields: () => ({

      id: { type: GraphQLInt },
      pName: { type: GraphQLString },
      pDesc: { type: GraphQLString },
      pSKU: { type: GraphQLString },
      pPrice: { type: GraphQLString }

   })
})

// Root Query
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {

      product: {
         type: ProductType,
         args: {
            id: { type: GraphQLInt }
         },
         resolve( parentValue, args ){
            // for(let i = 0; i < products.length; i++){
            //    if(products[i].id == args.id){
            //       return products[i]
            //    }
            // }

            return axios.get(`http://localhost:3000/products/${args.id}`)
               .then( res => res.data )
         }
      },

      products: {
         type: new GraphQLList(ProductType),
         resolve( parentValue, args ){
            return axios.get(`http://localhost:3000/products/`)
               .then( res => res.data )
         }
      }

   }
   
})


// Mutations
const mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
      addProduct: {
         type: ProductType,
         args: {
            pName: { type: new GraphQLNonNull(GraphQLString) },
            pDesc: { type: new GraphQLNonNull(GraphQLString) },
            pPrice: { type: new GraphQLNonNull(GraphQLString) },
            pSKU: { type: new GraphQLNonNull(GraphQLString) }
         },
         resolve( parentValue, args ){
            return axios.post(`http://localhost:3000/products/`, {
               pName: args.pName,
               pDesc: args.pDesc,
               pPrice: args.pPrice,
               pSKU: args.pSKU
            })
            .then( res => res.data )
         }
      },
      deleteProduct: {
         type: ProductType,
         args: {
            
            id: { type: new GraphQLNonNull(GraphQLInt)}
         },
         resolve( parentValue, args ){
            return axios.delete(`http://localhost:3000/products/${args.id}`)
            .then( res => res.data )
         }
      },
      editProduct: {
         type: ProductType,
         args: {
            id: { type: new GraphQLNonNull(GraphQLInt) },


            pName: { type: GraphQLString },
            pDesc: { type: GraphQLString },
            pPrice: { type: GraphQLString },
            pSKU: { type: GraphQLString }
         },
         resolve( parentValue, args ){
            return axios.patch(`http://localhost:3000/products/${args.id}`, args)
            .then( res => res.data )
         }
      },
   }
})


module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation: mutation
})