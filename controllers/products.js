const Product=require('../models/product')

const getAllProductsStatic=async (req,res)=>{
    
    const products=await Product.find({price:{$gt:30}})
    .sort('price')
    .select('name price')
    .limit(10)
    res.status(200).json({products,nbHits:products.length})
}

const getAllProducts=async (req,res)=>{
    const {featured,company,name,sort,fields,numericFilters}=req.query
    const queryObject={}
    
    if(featured){
        queryObject.featured=featured=='true'?true:false
    }
    if(company){
        queryObject.company=company
    }
     if(name){
        queryObject.name={$regex:name, $options:'i'}
     }

    
    let result= Product.find(queryObject)
    if(sort){
        const sortList=sort.split(',').join(' ')
        result=result.sort(sortList)
    }
    if(fields){
        const fieldList=fields.split(',').join(' ')
        result=result.select(fieldList)
    }
    if(numericFilters){
        const operatorMap={
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx=/\b(<|>|>=|=|<|<=)\b/g
        let filters=numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)

         const options=['price','rating'];
         filters=filters.split(',').forEach((item)=>{
            const [field,operartor,value]=item.split('-')
            if(options.includes(field)){
                queryObject[field]={[operartor]:Number(value)}

            }
         })
         console.log(queryObject)
    }
    

    const products=await result
    res.status(200).json({products, nbHits :products.length})
}
    module.exports={
      getAllProducts,
      getAllProductsStatic
    }
     
